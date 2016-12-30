(function(window) {
  'use strict';
  /*
  Shmup.js v1.2

  MIT License

  Copyright (c) 2016 Trung0246

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
  */

  /*
  TODO:
  -make bullet class as another library
  */

  //Important variable
  var main = {},       //Main holder
      data = {
        angleType: "degree",
        positionType: "object",
        maxProjectile: 0,
        scene: {
          size: {
            x: 0,
            y: 0,
          },
          boundary: 0,
        },
        //maxGun: 0,
        //maxProcess: 0,
      },
      process = {    //Process holder, use for bullet left in playground when gun deleted
        active: [],
        wait: {},
      },
      temp = {       //Temp holder
        repeat: {},
      };

  //Projectile classes
  main.projectile = {};

  main.configs = function(configsData) {
    data.angleType = configsData.angleType || "degree";
    data.positionType = configsData.positionType || "object";
    data.scene = configsData.scene || (function() {
      throw new Error("Unknown scene size");
    })();
    data.maxProjectile = configsData.maxProjectile || (function() {
      throw new Error("Unknown maxProjectile");
    })();
    for (var key in main.projectile) {
      if (main.projectile.hasOwnProperty(key)) {
        if (!main.projectile[key].data.process) {
          main.projectile[key].data.process = {
            temp: [1337], //1337 act as a flag for run to check when run done
            actions: undefined, //Actions function holder use with main.util.loop
          };
        }
        if (!main.projectile[key].data.data) {
          main.projectile[key].data.data = undefined;
        }
        if (!main.projectile[key].data.type) {
          main.projectile[key].data.type = key;
        }
        if (!main.projectile[key].data.update) {
          main.projectile[key].data.update = undefined;
        }
        if (!main.projectile[key].temp) {
          main.projectile[key].temp = {};
        }
        if (!process.wait[key]) {
          process.wait[key] = new Pool(main.projectile[key].data, data.maxProjectile, true);
        }
      }
    }
    return;
  };
  
  main.update = function() {
    for (var projectileCount = process.active.length - 1; projectileCount >= 0; --projectileCount) {
      if (process.active[projectileCount].process.actions) {
        process.active[projectileCount].process.actions();
      }
      main.projectile[process.active[projectileCount].type].update(process.active[projectileCount]);
      process.active[projectileCount].update(process.active[projectileCount]);
      if (process.active[projectileCount].update === undefined) {
        process.active.splice(projectileCount, 1);
      }
    }
  };

  //Utilities class
  main.util = {
    loop: function (condition, actions, isMain, repeatData) {
      if (isMain === undefined) {
        return {
          type: "repeat",
          location: 0,
          condition: condition,
          actions: actions,
        };
      } else if (isMain === false) {
        return mainProcess;
      } else if (isMain === true) {
        mainProcess();
      }
      function mainProcess() {
        var tempData, tempBool, tempProcess;
        if (typeof repeatData === "string") {
          if (!temp.repeat[repeatData]) {
            temp.repeat[repeatData] = [{
              location: 0,
              condition: condition,
              actions: actions,
            }];
          }
          tempProcess = temp.repeat[repeatData];
        } else if (typeof repeatData === "object") {
          if (repeatData.process.temp[0] === 1337) {
            repeatData.process.temp.pop();
            repeatData.process.temp.push({
              location: 0,
              condition: condition,
              actions: actions,
            });
          }
          tempProcess = repeatData.process.temp;
        }
        if (tempProcess[tempProcess.length - 1].type === "wait") {
          if (tempProcess[tempProcess.length - 1].condition(repeatData, tempProcess[tempProcess.length - 1])) {
            return;
          } else {
            tempProcess.pop();
          }
        }
        tempBool = tempProcess[tempProcess.length - 1].condition(repeatData, tempProcess[tempProcess.length - 1]) || (tempProcess[tempProcess.length - 1].location < tempProcess[tempProcess.length - 1].actions.length && tempProcess[tempProcess.length - 1].location !== 0);
        while (tempBool) {
          while (tempProcess[tempProcess.length - 1].location < tempProcess[tempProcess.length - 1].actions.length) {
            if (typeof tempProcess[tempProcess.length - 1].actions[tempProcess[tempProcess.length - 1].location] === "object") {
              if (tempProcess[tempProcess.length - 1].actions[tempProcess[tempProcess.length - 1].location].type === "repeat") {
                tempData = tempProcess[tempProcess.length - 1].actions[tempProcess[tempProcess.length - 1].location];
                tempProcess[tempProcess.length - 1].location += 1;
                tempData.location = 0;
                tempProcess.push(tempData);
                break;
              } else if (tempProcess[tempProcess.length - 1].actions[tempProcess[tempProcess.length - 1].location].type === "wait") {
                if (tempProcess[tempProcess.length - 1].actions[tempProcess[tempProcess.length - 1].location].condition(repeatData, tempProcess[tempProcess.length - 1])) {
                  tempData = tempProcess[tempProcess.length - 1].actions[tempProcess[tempProcess.length - 1].location];
                  tempProcess[tempProcess.length - 1].location += 1;
                  tempProcess.push(tempData);
                  break;
                } else {
                  tempProcess[tempProcess.length - 1].location += 1;
                  if (tempProcess[tempProcess.length - 1].location >= tempProcess[tempProcess.length - 1].actions.length) {
                    tempData = {
                      type: "repeat",
                    };
                    break;
                  }
                  tempProcess[tempProcess.length - 1].actions[tempProcess[tempProcess.length - 1].location](repeatData);
                }
              } else {
                throw new Error("Invalid action at " + tempProcess[tempProcess.length - 1].location);
              }
            } else {
              tempProcess[tempProcess.length - 1].actions[tempProcess[tempProcess.length - 1].location](repeatData);
            }
            tempProcess[tempProcess.length - 1].location += 1;
          }
          if (tempData) {
            break;
          }
          tempBool = tempProcess[tempProcess.length - 1].condition(repeatData, tempProcess[tempProcess.length - 1]);
          tempProcess[tempProcess.length - 1].location = 0;
        }
        if (tempData) {
          if (tempData.type === "repeat") {
            main.util.loop(condition, actions, true, repeatData);
          } else if (tempData.type === "wait") {
            return;
          }
        } else {
          tempProcess.pop();
          if (tempProcess.length > 0) {
            main.util.loop(condition, actions, true, repeatData);
          } else {
            if (typeof repeatData === "string") {
              delete temp.repeat[repeatData];
            } else {
              repeatData.process.temp.push(1337);
            }
          }
        }
      }
    },
    wait: function(type, condition, returnFunc, waitData) {
      switch (type) {
        case 0: {
          return condition();
        }
        break;
        case 1: {
          return {
            type: "wait",
            condition: condition,
          };
        }
        break;
        case 2: {
          waitData = condition;
          return waitTime;
        }
        break;
        case 3: {
          waitData = condition;
          return {
            type: "wait",
            condition: waitTime,
          };
        }
        break;
        default: {
          throw new Error("Unknown wait type");
        }
      }
      function waitTime(returnData) {
        if (waitData <= 0) {
          waitData = condition;
          returnFunc(returnData);
          return false;
        } else {
          waitData -= 1;
          returnFunc(returnData);
          return true;
        }
      }
    },
  };
  
  main.advanced = {
    debugMode: function() {
      debugger;
    },
    process: function() {
      return process;
    },
  };

  //Plugin class
  main.plugin = {
    projectile: function(type, data) {
      main.projectile[type] = data;
    },
    util: function(type, data) {
      main.util[type] = data;
    },
    math: function(type, data) {
      main.math[type] = data;
    },
  };

  //Math class
  main.math = {
    oval: function(position, horizontal, vertical, fireAngle, spinAngle) {
      var tempPos = {};
      tempPos.x = position.x + horizontal * Math.cos(fireAngle) * Math.cos(spinAngle) - vertical * Math.sin(fireAngle) * Math.sin(spinAngle);
      tempPos.y = position.y + vertical * Math.sin(fireAngle) * Math.cos(spinAngle) + horizontal * Math.cos(fireAngle) * Math.sin(spinAngle);
      return {
        angle: main.math.aim(position, tempPos),
        speed: main.math.pythagorean(true, position, tempPos),
      };
    },
    pythagorean: function(type, locationOne, locationTwo) {
      if (type) {
        return Math.sqrt(Math.pow(locationOne.x - locationTwo.x, 2) + Math.pow(locationOne.y - locationTwo.y, 2));
      } else {
        return Math.sqrt(Math.pow(locationOne, 2) + Math.pow(locationTwo, 2));
      }
    },
    aim: function(start, target) {
      return -Math.atan2(start.x - target.x, -(start.y - target.y));
    },
    pointBetween: function(start, end, location) {
      //http://jsfiddle.net/3SY8v/
      var xlen = end.x - start.x;
      var ylen = end.y - start.y;
      var hlen = main.math.pythagorean(false, xlen, ylen);
      var smallerXLen = xlen * location;
      var smallerYLen = ylen * location;
      return {
        x: start.x + smallerXLen,
        y: start.y + smallerYLen,
      };
    },
    interpolation: {
      //what the hell is frame / time ?
      //start and end use x with x and y with y
      linear: function(start, end, time) {
        return start + time * (end - start);
      },
      smoothStep: function(order, start, end, time) {
        if (order <= 0 || time < 0 || time > 1) {
          throw new Error("smoothStep out of range");
        }
        switch (order) {
          case 2: {
            return start + Math.pow(time, 2) * (3 - 2 * time) * (end - start);
          }
          break;
          case 3: {
            return start + Math.pow(time, 3) * (time * (time * 6 - 15) + 10) * (end - start);
          }
          break;
          case 4: {
            return start + Math.pow(time, 4) * (35 + time * (-84 + (70 - 20 * time) * time)) * (end - start);
          }
          break;
          case 5: {
            return start + Math.pow(time, 5) * (126 + 5 * time * (-84 + time * (108 + 7 * time * (-9 + 2 * time)))) * (end - start);
          }
          break;
          case 6: {
            return start + Math.pow(time, 6) * (462 + time * (-1980 - 7 * time * (-495 + 2 * time * (220 + 9 * time * (-11 + 2 * time))))) * (end - start);
          }
          break;
          case 7: {
            return start + Math.pow(time, 7) * (1716 + 7 * time * (-1287 + 2 * time * (1430 + 3 * time * (-572 + time * (390 + 11 * time * (-13 + 2 * time)))))) * (end - start);
          }
          break;
          default: {
            var pascalTriangle = function(a, b) {
              var result = 1; 
              for(var i = 1; i <= b; i++){
                result *= ((a - (i - 1)) / i);
              }
              return result;
            }
            var result = 0;
            for (var n = 0; n <= order - 1; n++) {
              result += (pascalTriangle(-order, n) * pascalTriangle(2 * order - 1, order - n - 1) * Math.pow(time, order + n));
            }
            return main.math.interpolation.linear(start, end, result);
          }
        }
      },
      acceleration: function(start, end, time) {
        var temp = Math.pow(time, 2);
        return (end * temp) + (start * (1 - temp));
      },
      deceleration: function(start, end, time) {
        var temp = 1 - (1 - time) * (1 - time);
        return (end * temp) + (start * (1 - temp));
      },
      overShoot: function(start, end, time, magnitude) {
        time = main.math.interpolation.deceleration(0, 1, time);
        return start + time * (end-start) * (1 + Math.sin(time * 180) * magnitude);
      },
    },
    bounce: function(angle, angleBounce) {
      angle += angleBounce;
      angle = Shmup.math.normalizeRadian(angle);
      angle *= -1;
      return angle;
    },
    teleport: function(type, position) {
      var tempPos = {
        x: position.x,
        y: position.y,
      };
      if (tempPos.x < -data.scene.boundary) {
        tempPos.x += data.scene.size.x;
      } else if (data.scene.size.x + data.scene.boundary < tempPos.x) {
        tempPos.x -= data.scene.size.x;
      } else if (tempPos.y < -data.scene.boundary) {
        tempPos.y += data.scene.size.y;
      } else if (data.scene.size.y + data.scene.boundary < tempPos.y) {
        tempPos.y -= data.scene.size.y;
      }
      return tempPos;
    },
    product: {
      normalize: function(position) {
        var length = Math.sqrt(position.x * position.x + position.y * position.y);
        position.x = position.x / length;
        position.y = position.y / length;
        return v;
      },
      dot: function(posOne, posTwo) {
        //Heavily related to cosine
        return posOne.x * posTwo.x + posOne.y * posTwo.y;
      },
      cross: function(posOne, posTwo) {
        //Heavily related to sine
        return posOne.x * posTwo.y - posOne.y * posTwo.x;
      },
    },
    radToDeg: function(radian) {
      radian = radian % (Math.PI * 2);
      return radian * (180 / Math.PI);
    },
    degToRad: function(degree) {
      degree = degree % 360;
      return degree * (Math.PI / 180);
    },
    normalizeRadian: function(radian) {
        radian = radian % (Math.PI * 2);
      while (radian <= -Math.PI) {
        radian += Math.PI * 2;
      }
      while (Math.PI < radian) {
        radian -= Math.PI * 2;
      }
      return radian;
    },
    normalizeDegree: function(degree) {
      degree = degree % 360;
      while (degree <= 0) {
        degree += 360;
      }
      while (180 < degree) {
        degree -= 360;
      }
      return degree;
    },
  };

  //Do not touch these code
  if (typeof define === 'function' && define.amd) {
    define(function() {
      return main;
    });
    return;
  }
  if ('undefined' !== typeof module && module.exports) {
    module.exports = main;
    return;
  }
  window.Shmup = main;
}(('undefined' !== typeof window) ? window : {}));

(function(){
  function Pool(object, size, isChange) {
    var data = [], i;
    this.size = size || (function() {
      throw new Error("Unknown pool size");
    })();
    for (i = 0; i < this.size; i += 1) {
      data.push(extend(true, {}, object));
    }
    this.pool = data;
    this.last = this.size;
    this.isChange = isChange;
    return this;
  };
  Pool.prototype.get = function(i) {
    i = i || 0;
    if (this.last <= 0) {
      throw new Error("Minimum pool size exceeded");
    }
    var object = this.pool[i];
    this.last -= 1;
    this.pool[i] = this.pool[this.last];
    if (this.isChange === true) {
      this.pool.pop();
    } else {
      this.pool[this.last] = undefined;
    }
    return object;
  };
  Pool.prototype.set = function(object) {
    this.pool[this.last] = object;
    this.last += 1;
    if (this.last > this.size) {
      throw new Error("Maximum pool size exceeded");
    }
  };
  this.Pool = Pool;
  function extend() {
    // Variables
    var extended = {};
    var deep = false;
    var i = 0;
    var length = arguments.length;
    // Check if a deep merge
    if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
      deep = arguments[0];
      i++;
    }
    // Merge the object into the extended object
    var merge = function (obj) {
      for ( var prop in obj ) {
        if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
          // If deep merge and property is an object, merge properties
          if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
            extended[prop] = extend( true, extended[prop], obj[prop] );
          } else {
            extended[prop] = obj[prop];
          }
        }
      }
    };
    // Loop through each object and conduct a merge
    for ( ; i < length; i++) {
      var obj = arguments[i];
      merge(obj);
    }
    return extended;
  }
}());
