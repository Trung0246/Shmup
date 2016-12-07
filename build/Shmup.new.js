(function(window) {
  'use strict';
  /*
  Shmup.js v1.1.5
  
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
  
  //Important variable
  var main = {                  //Main holder
        angleType: "degree",
        positionType: "object",
        maxProjectile: 0,
        maxGun: 0,
        maxProcess: 0,
      },
      pool = {                  //Pool holder
        gun: undefined,
        process: undefined,
      },
      process = {               //Process holder, use for bullet left in playground when gun deleted
        active: [],
        wait: {},
      },
      temp = {                //Temp holder
        repeat: {},
      };
  
  //Projectile classes
  main.projectile = {};
  
  main.projectile.bullet = {
    data: {
      position: {
        x: 0,
        y: 0,
      },
      angle: 0,
      speed: 0,
    },
    create: function(data) {
      //debugger;
      var projectile = process.wait.bullet.get();
      if (data.data) {
        projectile.data = JSON.parse(JSON.stringify(data.data));
      }
      projectile.position.x = data.position.x || 0;
      projectile.position.y = data.position.y || 0;
      projectile.angle = data.angle || 0;
      projectile.speed = data.speed || 0;
      projectile.update = data.update;
      if (data.process) {
        projectile.process.actions = Shmup.util.loop(data.process.condition, data.process.actions, false, projectile);
      }
      process.active.push(projectile);
      return projectile;
    },
    vanish: function(projectile) {
      projectile.position.x = 0;
      projectile.position.y = 0;
      projectile.angle = 0;
      projectile.speed = 0;
      projectile.data = undefined;
      projectile.update = undefined;
      projectile.process.actions = undefined;
      projectile.process.temp = [1337];
      process.wait.bullet.set(projectile);
    },
    update: function(projectile) {
      projectile.position.x = Math.sin(projectile.angle) * projectile.speed + projectile.position.x;
      projectile.position.y = Math.cos(projectile.angle) * projectile.speed + projectile.position.y;
    },
  };
  
  main.configs = function(configsData) {
    main.angleType = configsData.angleType || "degree";
    main.positionType = configsData.positionType || "object";
    main.maxProjectile = configsData.maxProjectile || (function() {
      throw new Error("Unknown maxProjectile");
    })();
    for (var key in main.projectile) {
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
      //debugger;
      if (!process.wait[key]) {
        process.wait[key] = new Pool(main.projectile[key].data, main.maxProjectile, true);
      }
    }
    return;
  };
  main.update = function() {
    for (var projectileCount = process.active.length - 1; projectileCount >= 0; --projectileCount) {
      if (process.active[projectileCount].update === undefined) {
        process.active.splice(projectileCount, 1);
      } else {
        if (process.active[projectileCount].process.actions) {
          process.active[projectileCount].process.actions();
        }
        main.projectile[process.active[projectileCount].type].update(process.active[projectileCount]);
        process.active[projectileCount].update(process.active[projectileCount]);
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
        //debugger;
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
    wait: function(condition) {
      return {
        type: "wait",
        condition: condition,
      };
    },
    clear: function(all) {
      
    },
    debug: {
      debugMode: function() {
        debugger;
      },
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
        speed: main.math.pythagorean(position, tempPos),
      };
    },
    pythagorean: function(locationOne, locationTwo) {
      return Math.sqrt(Math.pow(locationOne.x - locationTwo.x, 2) + Math.pow(locationOne.y - locationTwo.y, 2));
    },
    aim: function(start, target) {
      return -Math.atan2(start.x - target.x, -(start.y - target.y));
    },
    interpolation: {
      //what the fuck is frame / time ?
      //start and end use x with x and y with y
      linear: function(start, end, time) {
        return start + time * (end-start);
      },
      smoothStep: function(start, end, time) {
        return start + Math.pow(time, 2) * (3 - 2 * time) * (end - start);
      },
      smootherStep: function(start, end, time) {
        return start + Math.pow(time, 3) * (time * (time * 6 - 15) + 10) * (end - start);
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
