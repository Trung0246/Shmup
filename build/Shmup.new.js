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
      gun = {},                 //Gun holder
      projectile = {},          //Bullet holder
      pool = {                  //Pool holder
        gun: undefined,
        process: undefined,
      },
      process = {               //Process holder, use for bullet left in playground when gun deleted
        active: [],
        wait: [],
      },
      temp = {                //Temp holder
        repeat: {},
      };
  
  //Projectile classes
  projectile.bullet = {
    data: {
      position: {
        x: 0,
        y: 0,
      },
      angle: {
        value: 0,
        temp: 0,
        sin: 0,
        cos: 0,
      },
      speed: 0,
      change: {
        angle: {
          value: 0,
          times: 0,
        },
        speed: {
          value: 0,
          times: 0,
        },
      },
    },
    create: function(gunData, projectile, data) {
      
      return projectile;
    },
    update: function(bullet) {
      
    },
  };
  
  main.configs = function(configsData) {
    main.angleType = configsData.angleType || "degree";
    main.positionType = configsData.positionType || "object";
    main.maxProjectile = configsData.maxProjectile || (function() {
      throw new Error("Unknown maxProjectile");
    })();
    main.maxGun = configsData.maxGun || (function() {
      throw new Error("Unknown maxGun");
    })();
    main.maxProcess = configsData.maxProcess || (function() {
      throw new Error("Unknown maxProcess");
    })();
    pool.gun = new Pool({
      position: {
        x: 0,
        y: 0,
      },
      angle: 0,
      projectile: undefined,
      data: undefined,
    }, configsData.maxGun);
    pool.process = new Pool({
      type: undefined,
      location: undefined,
      condition: undefined,
      actions: undefined,
    }, configsData.maxProcess, true);
    for (var key in projectile) {
      if (!projectile[key].data.process) {
        projectile[key].data.process = [1337]; //1337 act as a flag for run to check when run done
      }
      if (!projectile[key].data.data) {
        projectile[key].data.data = {};
      }
    }
    return;
  };
  main.update = function() {
    
  };
  
  //Gun class
  main.gun = {
    create: function(data) {
      if (!gun[data.name]) {
        gun[data.name] = pool.gun.get();
        //Number
        gun[data.name].position.x = data.position.x || 0;
        gun[data.name].position.y = data.position.y || 0;
        gun[data.name].angle = data.angle || 0;
        //Projectile
        gun[data.name].projectile = {
          update: data.projectile.update,
          type: data.projectile.type,
          active: [],
          wait: [],
        };
        //Data
        gun[data.name].data = data.data;
        //Other
        return gun[data.name];
      } else {
        throw new Error("Gun " + data.name + " was already defined");
      }
    },
    erase: function(name) {
      if (gun[name]) {
        //Number
        gun[name].position.x = 0;
        gun[name].position.y = 0;
        gun[name].angle = 0;
        //Projectile
        if (gun[name].projectile.active.length <= 0) {
          process.wait.push(gun[name].projectile.active);
        } else {
          process.active.push(gun[name].projectile.active);
        }
        process.wait.push(gun[name].projectile.wait);
        gun[name].projectile = undefined;
        //Data
        gun[name].data = {};
        //Other
        pool.gun.set(gun[name]);
        delete gun[name];
        return true;
      } else {
        throw new Error("Gun " + name + " was not defined");
      }
    },
    data: function(name) {
      if (gun[name]) {
        return gun[name];
      } else {
        throw new Error("Gun " + name + " was not defined");
      }
    },
  };
  
  //Utilities class
  main.util = {
    fire: function(gunData, data) {
      if (gunData.projectile.wait.length > 0) {
        gunData.projectile.active.push(gunData.projectile.wait[gunData.projectile.wait.length - 1]);
        gunData.projectile.wait.pop();
      } else {
        gunData.projectile.active.push(projectile[gunData.projectile.type].data);
      }
      var tempProjectile = projectile[gunData.projectile.type].create(gunData, gunData.projectile.active[gunData.projectile.active.length - 1], data);
      //tempProjectile.process.push(pool.process.get());
      return tempProjectile;
    },
    run: function (condition, actions, isMain, repeatData) {
      if (isMain === undefined) {
        /*var tempRepeat = pool.process.get();
        tempRepeat.type = "repeat";
        tempRepeat.location = 0;
        tempRepeat.condition = condition;
        tempRepeat.actions = actions;
        return tempRepeat;*/
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
            /*temp.repeat[repeatData] = [pool.process.get()];
            temp.repeat[repeatData][0].location = 0;
            temp.repeat[repeatData][0].condition = condition;
            temp.repeat[repeatData][0].actions = actions;*/
            temp.repeat[repeatData] = [{
              location: 0,
              condition: condition,
              actions: actions,
            }];
          }
          tempProcess = temp.repeat[repeatData];
        } else if (typeof repeatData === "object") {
          if (typeof repeatData.process[0] === 1337) {
            repeatData.process.pop();
            /*repeatData.process.push(pool.process.get());
            repeatData.process[0].location = 0;
            repeatData.process[0].condition = condition;
            repeatData.process[0].actions = actions;*/
            repeatData.process.puah({
              location: 0,
              condition: condition,
              actions: actions,
            });
          }
          tempProcess = repeatData.process;
        }
        if (tempProcess[tempProcess.length - 1].type === "wait") {
          if (tempProcess[tempProcess.length - 1].condition()) {
            return;
          } else {
            tempProcess.pop();
          }
        }
        tempBool = tempProcess[tempProcess.length - 1].condition() || (tempProcess[tempProcess.length - 1].location < tempProcess[tempProcess.length - 1].actions.length && tempProcess[tempProcess.length - 1].location !== 0);
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
                if (tempProcess[tempProcess.length - 1].actions[tempProcess[tempProcess.length - 1].location].condition()) {
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
                  tempProcess[tempProcess.length - 1].actions[tempProcess[tempProcess.length - 1].location]();
                }
              } else {
                throw new Error("Invalid action at " + tempProcess[tempProcess.length - 1].location);
              }
            } else {
              tempProcess[tempProcess.length - 1].actions[tempProcess[tempProcess.length - 1].location]();
            }
            tempProcess[tempProcess.length - 1].location += 1;
          }
          if (tempData) {
            break;
          }
          tempBool = tempProcess[tempProcess.length - 1].condition();
          tempProcess[tempProcess.length - 1].location = 0;
        }
        if (tempData) {
          if (tempData.type === "repeat") {
            main.util.run(condition, actions, true, repeatData);
          } else if (tempData.type === "wait") {
            return;
          }
        } else {
          tempProcess.pop();
          if (tempProcess.length > 0) {
            main.util.run(condition, actions, true, repeatData);
          } else {
            if (typeof repeatData === "string") {
              delete temp.repeat[repeatData];
            } else {
              repeatData.process.push(1337);
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
      /*var tempData = pool.process.get();
      tempData.type = "wait";
      tempData.condition = condition;
      return tempData;*/
    },
    clear: function(all) {
      
    },
    debug: {
      
    },
  };
  
  //Math class
  main.math = {
    oval: function(horizontal, vertical, fireAngle, spinAngle) {
      
    },
    radToDeg: function(angle) {
      
    },
    degToRad: function(angle) {
      
    },
    normalizeRadian: function(angle) {
      
    },
    normalizeDegree: function(angle) {
      
    },
    pythagorean: function(locationOne, locationTwo) {
      
    },
    aim: function(start, target) {
      
    },
    interpolate: function() {
      
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
