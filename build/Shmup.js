(function(window) {
  'use strict';
  /*
  Shmup.js v1.2.3

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
  var main = {},       //Main holder
      data = {
        //angleType: "degree",
        //positionType: "object",
        maxProjectile: 0,
        frame: 0,
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
        task: [],
      };

  //Define current Shmup.js version string
  Object.defineProperty(main, "VERSION", {
    value: "1.2.3",
    writable: false,
    enumerable: true,
    configurable: true,
  });
  
  //Private class
  function Tasker(task, param, configs) {
    this.task = task;
    this.param = param;
    this.configs = configs;
    if (!param) {
      this.tempTask = this.task();
    } else {
      this.tempTask = this.task.apply(this, param);
    }
    return this;
  }
  Tasker.prototype = {
    reset: function() {
      this.tempTask = this.task();
      this.returnData = this.returnData || {};
      this.returnData.task = this.task;
      this.returnData.iterate = this.tempTask;
      this.returnData.value = undefined;
      this.returnData.done = false;
      return this.returnData;
    },
    next: function() {
      this.returnData = this.tempTask.next();
      this.returnData.task = this.task;
      this.returnData.iterate = this.tempTask;
      return this.returnData;
    },
  };
  
  function Gunner(data) {
    this.angle = data.angle || 0;
    this.speed = data.speed || 0;
    this.position = data.position || {x: 0, y: 0};
    this.projectile = data.projectile || undefined;
    this.group = [];
    this._isFiring = false;
  }
  Gunner.prototype = {
    fire: function() {
      var tempProj = Shmup.projectile[this.projectile.type].add(this.projectile);
      tempProj.position.x = this.position.x;
      tempProj.position.y = this.position.y;
      tempProj.angle = this.angle;
      tempProj.speed = this.speed;
      this.group.push(tempProj);
      return this;
    },
    vanish: function(index) {
      Shmup.projectile[this.projectile.type].remove(this.group[index]);
      this.group.splice(index, 1);
      return this;
    },
    clear: function() {
      for (var counting = this.group.length - 1; counting >= 0; --counting) {
        this.vanish(counting);
      }
      return this;
    },
  };
  
  //Public class
  //Projectile classes
  main.projectile = {};

  main.configs = function(configsData) {
    //data.angleType = configsData.angleType || "degree";
    //data.positionType = configsData.positionType || "object";
    data.scene = configsData.scene || (function() {
      throw new Error("Unknown scene size");
    })();
    data.maxProjectile = configsData.maxProjectile || (function() {
      throw new Error("Unknown maxProjectile");
    })();
    for (var key in main.projectile) {
      if (main.projectile.hasOwnProperty(key)) {
        if (!main.projectile[key].data) {
          throw new Error("Unknown data holder of projectile " + key);
        }
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
        if (!main.projectile[key].data.temp) {
          main.projectile[key].data.temp = {};
        }
        if (!process.wait[key]) {
          if (typeof data.maxProjectile === "number") {
            process.wait[key] = new Pool(main.projectile[key].data, data.maxProjectile, true);
          } else if (data.maxProjectile[key]) {
            process.wait[key] = new Pool(main.projectile[key].data, data.maxProjectile[key], true);
          } else {
            throw new Error("Unknown pool size of " + key);
          }
        }
      }
    }
    return;
  };
  
  main.update = function() {
    data.frame += 1;
    for (var taskCount = temp.task.length - 1; taskCount >= 0; --taskCount) {
      var result = temp.task[taskCount].next();
      if (result.done === true || temp.task[taskCount].configs.update === false) {
        if (temp.task[taskCount].configs.reset === true) {
          temp.task[taskCount].reset();
          taskCount ++;
        } else {
          temp.task.splice(taskCount, 1);
        }
      }
    }
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
    work: function (condition, actions, isMain, repeatData) {
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
            return tempProcess;
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
    wait: function(type, condition) {
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
          return (function* () {
            while (condition() === true) {
              yield;
            }
          })();
        }
        break;
        default: {
          throw new Error("Unknown wait type");
        }
      }
    },
    task: function (task, param, configs) {
      param = param || [];
      configs = configs || {};
      configs.update = configs.update || false;
      configs.reset = configs.reset || false;
      if (!task) {
        throw new Error("No task to run");
      }
      var pushTask = new Tasker(task, param, configs);
      if (configs.update === true) {
        temp.task.push(pushTask);
      }
      return pushTask;
    },
    gun: function(data) {
      return new Gunner(data);
    },
    count: function(data) {
      data = data || {};
      data.change = data.change || 1;
      if (typeof data.max !== "number" || typeof data.min !== "number") {
        throw new Error("Min or max is not number");
      }
      if ((data.change > data.max && data.max > 0) || (data.change < data.max && data.max < 0)) {
        throw new Error("Change value is larger or smaller than maximum");
      }
      if ((data.change < data.min && data.min > 0) || (data.change > data.min && data.min < 0)) {
        throw new Error("Change value is larger or smaller than minimum");
      }
      if (data.change === 0) {
        throw new Error("Change value must not be 0");
      }
      var current = data.min - data.change || 0;
      function checkDone() {
        if (data.keep === true) {
          current = data.min + (current - data.max);
        } else {
          current = data.min;
        }
      }
      return function(value) {
        if (value) {
          current = value;
        } else {
          if (data.change < 0) {
            if (current <= data.max && data.reset === true) {
              checkDone();
            } else if (current > data.max) {
              current += data.change;
            }
          } else {
            if (current >= data.max && data.reset === true) {
              checkDone();
            } else if (current < data.max) {
              current += data.change;
            }
          }
        }
        return current;
      };
    },
    out: function(type, position) {
      switch (type) {
        case 0: {
          if (position.y < -data.scene.boundary) {
            return 1;
          } else if (data.scene.size.x + data.scene.boundary < position.x) {
            return 2;
          } else if (data.scene.size.y + data.scene.boundary < position.y) {
            return 3;
          } else if (position.x < -data.scene.boundary) {
            return 4;
          }
        }
        break;
        case 1: {
          return position.y < -data.scene.boundary;
        }
        break;
        case 2: {
          return data.scene.size.x + data.scene.boundary < position.x;
        }
        break;
        case 3: {
          return data.scene.size.y + data.scene.boundary < position.y;
        }
        break;
        case 4: {
          return position.x < -data.scene.boundary;
        }
        break;
        default: {
          return position.x < -data.scene.boundary || data.scene.size.x + data.scene.boundary < position.x || position.y < -data.scene.boundary || data.scene.size.y + data.scene.boundary < position.y;
        }
      }
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
  };
  
  main.advanced = {
    debugMode: function() {
      debugger;
    },
    process: function() {
      return process;
    },
    data: function() {
      return data;
    },
    temp: function() {
      return temp;
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
    constant: {
      safePI: 3.14159265358,
      tau: Math.PI * 2,
      phi: (1 + Math.sqrt(5)) / 2,
      silver: 1 + Math.sqrt(2),
    },
    angle: {
      radian: {
        normalize: function(angle) {
          angle = angle % main.math.constant.tau;
          while (angle <= -Math.PI) {
            angle += main.math.constant.tau;
          }
          while (Math.PI < angle) {
            angle -= main.math.constant.tau;
          }
          return angle;
        },
        degree: function(angle) {
          angle = angle % (Math.PI * 2);
          return angle * (180 / Math.PI);
        },
        full: function(angle) {
          return (main.math.constant.tau + (angle % main.math.constant.tau)) % main.math.constant.tau;
        },
      },
      degree: {
        normalize: function(angle) {
          angle = angle % 360;
          while (angle <= 0) {
            angle += 360;
          }
          while (180 < angle) {
            angle -= 360;
          }
          return angle;
        },
        radian: function(angle) {
          angle = angle % 360;
          return angle * (Math.PI / 180);
        },
        full: function(angle) {
          return (360 + (angle % 360)) % 360;
        },
      },
      aim: function(start, target) {
        return -Math.atan2(start.x - target.x, -(start.y - target.y));
      },
      bounce: function(angle, mirror) {
        return 2 * mirror - angle;
      },
      different: function (angleOne, angleTwo) {
        //http://stackoverflow.com/questions/12234574/
        return (angleOne - angleTwo + Math.PI + main.math.constant.tau) % main.math.constant.tau - Math.PI;
      },
      between: function(angleOne, angleTwo, angle) {
        //www.xarg.org/2010/06/is-an-angle-between-two-other-angles/
        angle = main.math.angle.radian.full(angle);
        angleOne = main.math.angle.radian.full(angleOne);
        angleTwo = main.math.angle.radian.full(angleTwo);
        if (angleOne < angleTwo) {
          return angleOne <= angle && angle <= angleTwo;
        } else {
          return angleOne <= angle || angle <= angleTwo;
        }
      },
      on: function(angleOne, angleTwo, location) {
        return main.math.angle.radian.normalize((main.math.angle.radian.full(angleTwo) - main.math.angle.radian.full(angleOne)) * location + main.math.angle.radian.full(angleOne));
      },
    },
    point: {
      distance: function(type, locationOne, locationTwo, square) {
        var result;
        type = type || false;
        if (type === true) {
          result = Math.pow(locationOne.x - locationTwo.x, 2) + Math.pow(locationOne.y - locationTwo.y, 2);
        } else {
          result = Math.pow(locationOne, 2) + Math.pow(locationTwo, 2);
        }
        if (square === true) {
          return Math.sqrt(result);
        } else {
          return result;
        }
      },
      rotate: function(center, point, angle) {
        var cos = Math.cos(angle),
        sin = Math.sin(angle);
        return {
          x: (cos * (point.x - center.x)) - (sin * (point.y - center.y)) + center.x,
          y: (cos * (point.y - center.y)) + (sin * (point.x - center.x)) + center.y,
        };
      },
      dilate: function(posOne, posTwo, location) {
        //like laser when instant set to false
        var tempLength = main.math.point.distance(true, posOne, posTwo, true) * location, angle = main.math.angle.aim(posOne, posTwo);
        return {
          x: Math.sin(angle) * tempLength + posOne.x,
          y: Math.cos(angle) * tempLength + posOne.y,
          distance: tempLength,
          angle: angle,
        };
      },
      angle: function(head, posOne, posTwo) {
        return Math.acos((main.math.point.distance(true, head, posOne, false) + main.math.point.distance(true, head, posTwo, false) - main.math.point.distance(true, posOne, posTwo, false)) / (2 * main.math.point.distance(true, head, posOne, true) * main.math.point.distance(true, head, posTwo, true)));
      },
      center: function(posOne, posTwo, posThree) {
        //http://stackoverflow.com/questions/4958161
        var d2  = posTwo.x * posTwo.x + posTwo.y * posTwo.y;
        var bc  = (posOne.x * posOne.x + posOne.y * posOne.y - d2) / 2;
        var cd  = (d2 - posThree.x * posThree.x - posThree.y * posThree.y) / 2;
        var det = (posOne.x - posTwo.x) * (posTwo.y - posThree.y) - (posTwo.x - posThree.x) * (posOne.y - posTwo.y);
        if (Math.abs(det) > 1e-10) {
          return {
            x: (bc * (posTwo.y - posThree.y) - cd * (posOne.y - posTwo.y)) / det,
            y: ((posOne.x - posTwo.x) * cd - (posTwo.x - posThree.x) * bc) / det,
          };
        }
      },
    },
    line: {
      slope: function(start, end) {
        return (end.y - start.y) / (end.x - start.x);
      },
      intersect: function(pos1Start, pos1End, pos2Start, pos2End) {
        //http://jsfiddle.net/justin_c_rounds/Gd2S2/light/
        //http://stackoverflow.com/questions/39819001/
        var denominator, a, b, numerator1, numerator2, result = {
            x: null,
            y: null,
            onLine1: false,
            onLine2: false,
        };
        denominator = ((pos2End.y - pos2Start.y) * (pos1End.x - pos1Start.x)) - ((pos2End.x - pos2Start.x) * (pos1End.y - pos1Start.y));
        if (denominator === 0) {
          if ((pos1Start.x - pos2Start.x) * (pos1Start.y - pos2End.y) - (pos1Start.x - pos2End.x) * (pos1Start.y - pos2Start.y) === 0 || (pos1End.x - pos2Start.x) * (pos1End.y - pos2End.y) - (pos1End.x - pos2End.x) * (pos1End.y - pos2Start.y) === 0) {
            result.onLine2 = result.onLine1 = (pos1Start.x <= pos2End.x && pos1End.x >= pos2Start.x && pos1Start.y <= pos2End.y && pos1End.y >= pos2Start.y);
          }
          return result;
        }
        a = pos1Start.y - pos2Start.y;
        b = pos1Start.x - pos2Start.x;
        numerator1 = ((pos2End.x - pos2Start.x) * a) - ((pos2End.y - pos2Start.y) * b);
        numerator2 = ((pos1End.x - pos1Start.x) * a) - ((pos1End.y - pos1Start.y) * b);
        a = numerator1 / denominator;
        b = numerator2 / denominator;
        result.x = pos1Start.x + (a * (pos1End.x - pos1Start.x));
        result.y = pos1Start.y + (a * (pos1End.y - pos1Start.y));
        if (a >= 0 && a <= 1) {
            result.onLine1 = true;
        }
        if (b >= 0 && b <= 1) {
            result.onLine2 = true;
        }
        return result;
      },
      distance: function(type, start, end, position, square) {
        //http://stackoverflow.com/questions/31346862/
        //http://stackoverflow.com/questions/849211/
        if (type === true) {
          var l2 = main.math.point.distance(true, start, end, false);
          if (l2 === 0) {
            return main.math.point.distance(true, position, start, false);
          }
          var t = ((position.x - start.x) * (end.x - start.x) + (position.y - start.y) * (end.y - start.y)) / l2;
          t = Math.max(0, Math.min(1, t));
          return main.math.point.distance(true, position, {
            x: start.x + t * (end.x - start.x),
            y: start.y + t * (end.y - start.y)
          }, square);
        } else {
          return Math.abs((end.y - start.y) * position.x - (end.x - start.x) * position.y + end.x * start.y - end.y * start.x) / main.math.point.distance(true, start, end, true);
        }
      },
      on: function(start, end, location) {
        //http://jsfiddle.net/3SY8v/
        var xlen = end.x - start.x;
        var ylen = end.y - start.y;
        var smallerXLen = xlen * location;
        var smallerYLen = ylen * location;
        return {
          x: start.x + smallerXLen,
          y: start.y + smallerYLen,
        };
      },
      getX: function(posOne, posTwo, yValue) {
        var a_numberator = posTwo.y - posOne.y;
        var a_denominator = posTwo.x - posOne.x;
        if (a_numberator === 0){
          return posTwo.x;
        } else {
          var a = a_numberator / a_denominator;
          var yDist = yValue - posTwo.y;
          var xDist = yDist / a;
          var x3 = posTwo.x + xDist;
          return x3;
        }
      },
      getY: function(posOne, posTwo, xValue) {
        var a_numberator = posTwo.y - posOne.y;
        var a_denominator = posTwo.x - posOne.x;
        if (a_denominator === 0){
          return posTwo.y;
        } else {
          var a = a_numberator / a_denominator;
          var xDist = xValue - posTwo.x;
          var yDist = xDist * a;
          var y3 = posTwo.y + yDist;
          return y3;
        }
      },
    },
    vector: {
      normalize: function(position) {
        var length = Math.sqrt(position.x * position.x + position.y * position.y);
        return {
          x: position.x / length,
          y: position.y / length,
        };
      },
      dot: function(posOne, posTwo) {
        //Heavily related to cosine
        return posOne.x * posTwo.x + posOne.y * posTwo.y;
      },
      cross: function(posOne, posTwo) {
        //Heavily related to sine
        return posOne.x * posTwo.y - posOne.y * posTwo.x;
      },
      on: function(dataOne, dataTwo, location) {
        var tempPos;
        if ((dataOne.angle || dataOne.speed) && !(dataOne.x || dataOne.y)) {
          dataOne.x = Math.sin(dataOne.angle) * dataOne.speed;
          dataOne.y = Math.cos(dataOne.angle) * dataOne.speed;
        }
        if ((dataTwo.angle || dataTwo.speed) && !(dataTwo.x || dataTwo.x)) {
          dataTwo.x = Math.sin(dataTwo.angle) * dataTwo.speed;
          dataTwo.y = Math.cos(dataTwo.angle) * dataTwo.speed;
        }
        tempPos = main.math.line.on(dataOne, dataTwo, location || 0.5);
        return {
          x: tempPos.x,
          y: tempPos.y,
          angle: main.math.angle.aim({x:0,y:0}, tempPos),
          speed: main.math.point.distance(true, {x:0,y:0}, tempPos, true),
        };
      },
    },
    trig: {
      csc: function(value) {
        return 1 / Math.sin(value);
      },
      sec: function(value) {
        return 1 / Math.cos(value);
      },
      cot: function(value) {
        return 1 / Math.tan(value);
      },
    },
    number: {
      roundoff: function(number, epsilon) {
        epsilon = epsilon || 12;
        return Math.round((number) * Math.pow(10, epsilon)) / Math.pow(10, epsilon);
      },
      range: function(value, min, max, minEq, maxEq, accuracy) {
        if (minEq === true && maxEq === true) {
          return value >= (min * accuracy) && value <= (max * accuracy);
        } else if (minEq === true) {
          return value >= (min * accuracy) && value < (max * accuracy);
        } else if (maxEq === true) {
          return value > (min * accuracy) && value <= (max * accuracy);
        } else {
          return value > (min * accuracy) && value < (max * accuracy);
        }
      },
      compare: function(valueOne, valueTwo, accuracy, equal, reverse) {
        if (reverse === true) {
          if (equal === true) {
            return valueOne <= (valueTwo * accuracy);
          } else {
            return valueOne < (valueTwo * accuracy);
          }
        } else {
          if (equal === true) {
            return valueOne >= (valueTwo * accuracy);
          } else {
            return valueOne > (valueTwo * accuracy);
          }
        }
      },
      rmod: function(reverse, value, mod) {
        //http://mathworld.wolfram.com/ModularInverse.html
        //stackoverflow.com/questions/12218534
        //(53 + x) % 62 = 44 => (44,53,62)
        if(value < reverse) {
          return reverse - value;
        } else {
          return mod + reverse - value;
        }
      },
      remainder: function(a, b) {
        //http://stackoverflow.com/questions/34291760/
         var res = a % b;
         if (res < 0)
            res += b;
         return res;
      },
      factorial: function(value) {
        var result = 1;
        if (value > 0) {
          for (var count = 1; count <= value; count ++) {
            result *= count;
          }
        } else if (value < 0) {
          for (var count = -1; count >= value; count --) {
            result *= count;
          }
        } else {
          result = 1;
        }
        return result;
      },
      gamma: function(z, g, C) {
        g = g || 7;
        C = C || [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716 * Math.pow(10, -6), 1.5056327351493116 * Math.pow(10, -7)];
        if (z < 0.5) {
          return Math.PI / (Math.sin(Math.PI * z) * main.math.number.gamma(1 - z));
        } else {
          z -= 1;
          var x = C[0];
          for (var i = 1; i < g + 2; i++)
          x += C[i] / (z + i);
          var t = z + g + 0.5;
          return Math.sqrt(2 * Math.PI) * Math.pow(t, (z + 0.5)) * Math.exp(-t) * x;
        }
      },
      pascalTriangle: function(a, b) {
        var result = 1;
        for (var i = 1; i <= b; i++) {
          result *= ((a - (i - 1)) / i);
        }
        return result;
      },
      random: function(options) {
        options = options || {};
        options.generate = options.generate || function(seed) {
          Math.seedrandom(seed);
          return Math.random();
        };
        options.seed = options.seed || null;
        options.range = options.range || {min:0, max: 1};
        options.round = options.round || false;
        options.exception = options.exception || null;
        options.error = options.error || {};
        options.error.larger = options.error.larger || 0;
        options.error.equal = options.error.equal || options.range.min;
        options.gaussian = options.gaussian || 1;
        options.weight = options.weight || null;
        if (typeof options.generate != "function" && options.generate != null) {
          return console.error("options.generate is not function");
        }
        if (typeof options.seed != "string" && options.seed != null) {
          return console.error("options.seed is not string");
        }
        if (Object.prototype.toString.call(options.range) !== '[object Object]' && options.range != null) {
          return console.error("options.range is not object");
        }
        if (typeof options.round != "boolean" && options.round != null) {
          return console.error("options.round is not boolean");
        }
        if (Object.prototype.toString.call(options.exception) !== '[object Array]' && options.exception != null) {
          return console.error("options.exception is not array");
        }
        if (Object.prototype.toString.call(options.error) === '[object Object]' && options.error != null) {
          if (typeof options.error.larger != "number" && options.error.larger != null) {
            return console.error("options.error.larger is not number");
          }
          if (typeof options.error.equal != "number" && options.error.equal != null) {
            return console.error("options.error.equal is not number");
          }
        } else if (Object.prototype.toString.call(options.error) !== '[object Object]' && options.error != null) {
          return console.error("options.error is not object");
        }
        if (typeof options.gaussian != "number" && options.gaussian != null) {
          return console.error("options.gaussian is not number");
        }
        if (Object.prototype.toString.call(options.weight) !== '[object Array]' && options.weight != null) {
          return console.error("options.weight is not array");
        }
        function PRNG() {
          var Value;
          if (options.round === true) {
            Value = Number(Math.floor(options.generate(options.seed) * (options.range.max - options.range.min + 1)) + options.range.min);
          } else if (options.round === false || options.round == null) {
            Value = Number(options.generate(options.seed) * (options.range.max - options.range.min) + options.range.min);
          } else {
            console.error("What happened with options.round in Math.random.advanced ?");
          }
          if (options.range.min > options.range.max) {
            if (options.larger == null) {
              Value = 0;
            } else {
              Value = options.larger;
            }
            return Value;
          } else if (options.range.min == options.range.max) {
            if (options.equal == null) {
              Value = options.range.min;
            } else {
              Value = options.equal;
            }
            return Value;
          } else if (options.range.min < options.range.max) {
            return options.seed != null ? Value : ((options.exception == [] || options.exception == null) ? Value : (options.exception.indexOf(Value) == -1) ? Value : (options.gaussian != null && (options.Other === false && options.Other != null) ? Value : PRNG()));
          }
        }
        function GauRan() {
          if (options.gaussian == null || (typeof options.gaussian == "number" && options.gaussian <= 1)) {
            return PRNG();
          } else if (options.gaussian > 1 && options.gaussian != null) {
            var Total = 0,
              Times = 0;
            while (Times < options.gaussian) {
              Times++;
              Total += PRNG();
            }
            Total /= options.gaussian;
            if (options.round == true) {
              Total = Math.round(Total, 0);
            }
            return options.seed != null ? console.error("Please remove parameter options.gaussian because options.seed is defined.") : ((options.exception == [] || options.exception == null) ? Total : (options.exception.indexOf(Total) == -1) ? Total : GauRan());
          }
        }
        var TempResult = GauRan(),
          count = 0,
          TempStore = "",
          TempHighest = options.range.max,
          Temperror = false;
        if (options.weight == null) {
          return TempResult;
        } else if (options.weight != null) {
          while (count < options.weight.length) {
            if (count == options.weight.length - 1) {
              TempStore += "options.weight[" + String(count) + "].value";
            } else {
              if (options.weight[count].chance > TempHighest) {
                Temperror = true;
                break;
              }
              TempStore += "TempResult" + options.round === true ? ">=" : ">" + "options.weight[" + String(count) + "].chance?options.weight[" + String(count) + "].value:";
              TempHighest = options.weight[count].chance;
            }
            count++;
          }
          if (Temperror === true) {
            return console.error("options.weight[" + String(count) + "].chance is larger than options.weight[" + String(Number(count - 1)) + "].chance");
          }
          return eval(TempStore);
        }
      },
    },
    shape: {
      ellipse: function(position, data, angle) {
        position = position || {};
        position.x = position.x || 0;
        position.y = position.y || 0;
        data = data || {};
        data.width = data.width || 0;
        data.height = data.height || 0;
        angle = angle || {};
        angle.value = angle.value || 0;
        angle.rotate = angle.rotate || 0;
        var tempPos = {};
        tempPos.x = position.x + data.width * Math.cos(angle.value) * Math.cos(angle.rotate) - data.height * Math.sin(angle.value) * Math.sin(angle.rotate);
        tempPos.y = position.y + data.height * Math.sin(angle.value) * Math.cos(angle.rotate) + data.width * Math.cos(angle.value) * Math.sin(angle.rotate);
        //Or just from 2 point in ellipse then,... idk, watch that gif below
        //http://giphy.com/gifs/educational-ellipse-Qk5fIr8LRYACI
        /*
        From danmakufu:
        let angleT = 0;
        loop(30){
            CreateShotA1(ObjMove_GetX(objBoss) + 75*cos(angleT), ObjMove_GetY(objBoss) + 30*sin(angleT), 2, angleT, 1, 0);
            angleT += 360/30;
        }
        But can't rotate ;)
        */
        return {
          x: tempPos.x,
          y: tempPos.y,
          angle: main.math.angle.aim(position, tempPos),
          speed: main.math.point.distance(true, position, tempPos, true),
        };
      },
      rectangle: function(position, data, angle) {
        position = position || {};
        position.x = position.x || 0;
        position.y = position.y || 0;
        data = data || {};
        data.width = data.width || 0;
        data.height = data.height || 0;
        angle = angle || {};
        angle.value = angle.value || 0;
        angle.rotate = angle.rotate || 0;
        var corner = {};
        var tempTest = main.math.point.distance(false, data.width, data.height, true) / 2;
        angle.rotate = main.math.angle.radian.normalize(main.math.angle.radian.full(angle.rotate));
        corner.topRight = {
          x: position.x + Math.cos(Math.atan2(-data.width, data.height) + angle.rotate) * tempTest,
          y: position.y + Math.sin(Math.atan2(-data.width, data.height) + angle.rotate) * tempTest,
        };
        corner.bottomRight = {
          x: position.x + Math.cos(Math.atan2(data.width, data.height) + angle.rotate) * tempTest,
          y: position.y + Math.sin(Math.atan2(data.width, data.height) + angle.rotate) * tempTest,
        };
        corner.bottomLeft = {
          x: position.x + Math.cos(Math.atan2(data.width, -data.height) + angle.rotate) * tempTest,
          y: position.y + Math.sin(Math.atan2(data.width, -data.height) + angle.rotate) * tempTest,
        };
        corner.topLeft = {
          x: position.x + Math.cos(Math.atan2(-data.width, -data.height) + angle.rotate) * tempTest,
          y: position.y + Math.sin(Math.atan2(-data.width, -data.height) + angle.rotate) * tempTest,
        };
        var normalized = main.math.angle.radian.normalize(angle.value);
        var tempPos = {
          x: position.x + Math.sin(normalized),
          y: position.y + Math.cos(normalized),
        };
        normalized = main.math.angle.radian.full(normalized);
        var result;
        var tempResult = {
          bottom: main.math.line.intersect(corner.bottomLeft, corner.bottomRight, position, tempPos),
          right: main.math.line.intersect(corner.bottomRight, corner.topRight, position, tempPos),
          top: main.math.line.intersect(corner.topRight, corner.topLeft, position, tempPos),
          left: main.math.line.intersect(corner.topLeft, corner.bottomLeft, position, tempPos),
        };
        var checkSide = {
          right: false,
          top: false,
          left: false,
        };
        angle.rotate = main.math.number.roundoff(angle.rotate);
        //"Magic" number: 3.141592653589792, 6.283185307179582, f*ck them all >:(
        if (angle.rotate >= main.math.constant.safePI || angle.rotate <= -main.math.constant.safePI) {
          checkSide.right = (tempResult.right.y - corner.bottomRight.y) * (tempResult.right.y - corner.topRight.y) <= 0;
          checkSide.left = (tempResult.left.y - corner.bottomLeft.y) * (tempResult.left.y - corner.topLeft.y) <= 0;
          checkSide.top = (tempResult.top.y - corner.topRight.y) * (tempResult.top.y - corner.topLeft.y) <= 0;
        } else {
          if (angle.rotate === 0) {
            checkSide.right = (tempResult.right.y - corner.bottomRight.y) * (tempResult.right.y - corner.topRight.y) <= 0;
            checkSide.left = (tempResult.left.y - corner.bottomLeft.y) * (tempResult.left.y - corner.topLeft.y) <= 0;
            checkSide.top = (tempResult.top.y - corner.topRight.y) * (tempResult.top.y - corner.topLeft.y) <= 0;
          } else {
            checkSide.right = (tempResult.right.x - corner.bottomRight.x) * (tempResult.right.x - corner.topRight.x) <= 0;
            checkSide.left = (tempResult.left.x - corner.bottomLeft.x) * (tempResult.left.x - corner.topLeft.x) <= 0;
            checkSide.top = (tempResult.top.x - corner.topRight.x) * (tempResult.top.x - corner.topLeft.x) <= 0;
          }
        }
        if (checkSide.right) {
          result = tempResult.right;
        } else if (checkSide.top) {
          result = tempResult.top;
        } else if (checkSide.left) {
          result = tempResult.left;
        } else {
          result = tempResult.bottom;
        }
        return {
          angle: main.math.angle.aim(position, result),
          speed: main.math.point.distance(true, position, result, true),
          data: result,
          other: tempResult,
        };
      },
      polygon: function(position, vertex, angle, keep) {
        position = position || {};
        position.x = position.x || 0;
        position.y = position.y || 0;
        if (vertex.length < 3) {
          throw new Error("Vertex must not smaller than 3");
        }
        angle = angle || 0;
        vertex.sort(function (a, b) {
          var tempA = main.math.angle.radian.full(a.angle),
          tempB = main.math.angle.radian.full(b.angle);
          if (tempA < tempB) {
            return -1;
          }
          if (tempA > tempB) {
            return 1;
          }
          if (tempA === tempB) {
            throw new Error("Vertex " + vertex.indexOf(a) + " and vertex " + vertex.indexOf(b) + " have same angle");
          }
          return 0;
        });
        vertex[0].position = {
          x: position.x + vertex[0].radius * Math.sin(vertex[0].angle),
          y: position.y + vertex[0].radius * Math.cos(vertex[0].angle),
        };
        var result;
        for (var vertexCount = 1; vertexCount < vertex.length; vertexCount ++) {
          vertex[vertexCount].position = {
            x: position.x + vertex[vertexCount].radius * Math.sin(vertex[vertexCount].angle),
            y: position.y + vertex[vertexCount].radius * Math.cos(vertex[vertexCount].angle),
          };
          if (!result && main.math.angle.between(main.math.angle.aim(position, vertex[vertexCount - 1]), main.math.angle.aim(position, vertex[vertexCount]), angle)) {
            result = main.math.line.intersect(position, {
              x: position.x + 2 * Math.sin(angle),
              y: position.y + 2 * Math.cos(angle),
            }, vertex[vertexCount - 1], vertex[vertexCount]);
          } else if (vertexCount + 1 >= vertex.length) {
            result = main.math.line.intersect(position, {
              x: position.x + 2 * Math.sin(angle),
              y: position.y + 2 * Math.cos(angle),
            }, vertex[vertexCount], vertex[0]);
          }
          if (result && !keep) {
            break;
          }
        }
        result.vertex = vertex;
        result.angle = main.math.angle.aim(position, result);
        result.speed = main.math.point.distance(true, position, result, true);
        return result;
      },
      convex: function(position, data, angle, keep) {
        position = position || {};
        position.x = position.x || 0;
        position.y = position.y || 0;
        data = data || {};
        data.vertex = data.vertex || 3;
        if (data.vertex < 3) {
          throw new Error("Vertex must not smaller than 3");
        }
        data.radius = data.radius || 1;
        angle = angle || {};
        angle.value = angle.value || 0;
        angle.rotate = angle.rotate || 0;
        var vertex = [], tempRotate = main.math.constant.tau / data.vertex, normalized = main.math.number.roundoff(main.math.angle.radian.full(main.math.angle.radian.normalize(angle.value))), result;
        vertex.push({
          x: position.x + data.radius * Math.sin(tempRotate + angle.rotate),
          y: position.y + data.radius * Math.cos(tempRotate + angle.rotate),
        });
        for (var vertexCount = 1; vertexCount < data.vertex; vertexCount ++) {
          vertex.push({
            x: position.x + data.radius * Math.sin(tempRotate * (vertexCount + 1) + angle.rotate),
            y: position.y + data.radius * Math.cos(tempRotate * (vertexCount + 1) + angle.rotate),
          });
          if (!result && main.math.angle.between(main.math.angle.aim(position, vertex[vertexCount - 1]), main.math.angle.aim(position, vertex[vertexCount]), normalized)) {
            result = main.math.line.intersect(position, {
              x: position.x + data.radius * Math.sin(angle.value),
              y: position.y + data.radius * Math.cos(angle.value),
            }, vertex[vertexCount - 1], vertex[vertexCount]);
          } else if (vertexCount + 1 >= data.vertex) {
            result = main.math.line.intersect(position, {
              x: position.x + data.radius * Math.sin(angle.value),
              y: position.y + data.radius * Math.cos(angle.value),
            }, vertex[vertexCount], vertex[0]);
          }
          if (result && !keep) {
            break;
          }
        }
        result.vertex = vertex;
        result.angle = main.math.angle.aim(position, result);
        result.speed = main.math.point.distance(true, position, result, true);
        return result;
      },
      star: function(position, data, angle, keep) {
        position = position || {};
        position.x = position.x || 0;
        position.y = position.y || 0;
        data = data || [];
        data.count = data.count || 1;
        data.vertex = data.vertex || [];
        angle = angle || {};
        angle.value = angle.value || 0;
        angle.rotate = angle.rotate || 0;
        var totalVertex = 0;
        for (var vertexCount = 0; vertexCount < data.vertex.length; vertexCount ++) {
          totalVertex += data.vertex[vertexCount].count;
        }
        totalVertex *= data.count;
        if (totalVertex < 3) {
          throw new Error("Vertex must not smaller than 3");
        }
        var vertex = [], tempRotate = main.math.constant.tau / totalVertex, result;
        vertex.push({
          x: position.x + data.vertex[0].radius * Math.sin(tempRotate + angle.rotate),
          y: position.y + data.vertex[0].radius * Math.cos(tempRotate + angle.rotate),
        });
        var vertexCountSame = 1, vertexCountTotal = 2;
        (function() {
          for (var countCount = 0; countCount < data.count; countCount ++) {
            for (var vertexCount = 0; vertexCount < data.vertex.length; vertexCount ++) {
              for (; vertexCountSame < data.vertex[vertexCount].count; vertexCountSame ++) {
                vertex.push({
                  x: position.x + data.vertex[vertexCount].radius * Math.sin(tempRotate * vertexCountTotal + angle.rotate),
                  y: position.y + data.vertex[vertexCount].radius * Math.cos(tempRotate * vertexCountTotal + angle.rotate),
                });
                if (!result && main.math.angle.between(main.math.angle.aim(position, vertex[vertex.length - 2]), main.math.angle.aim(position, vertex[vertex.length - 1]), angle.value)) {
                  result = main.math.line.intersect(position, {
                    x: position.x + 2 * Math.sin(angle.value),
                    y: position.y + 2 * Math.cos(angle.value),
                  }, vertex[vertex.length - 2], vertex[vertex.length - 1]);
                } else if (vertex.length >= totalVertex) {
                  result = main.math.line.intersect(position, {
                    x: position.x + 2 * Math.sin(angle.value),
                    y: position.y + 2 * Math.cos(angle.value),
                  }, vertex[vertex.length - 1], vertex[0]);
                }
                if (result && !keep) {
                  return;
                }
                vertexCountTotal ++;
              }
              vertexCountSame = 0;
            }
          }
        })();
        result.vertex = vertex;
        result.angle = main.math.angle.aim(position, result);
        result.speed = main.math.point.distance(true, position, result, true);
        return result;
      },
    },
    interpolation: {
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
            var result = 0;
            for (var n = 0; n <= order - 1; n++) {
              result += (main.math.number.pascalTriangle(-order, n) * main.math.number.pascalTriangle(2 * order - 1, order - n - 1) * Math.pow(time, order + n));
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
    curve: {
      //https://www.math10.com/en/geometry/analytic-geometry/geometry5/special-plane-curves.html
      lissajous: function(dataX, dataY, theta, time) {
        //maurer, astroid
        dataX = dataX || {};
        dataX.position = dataX.position || 0;
        dataX.length = dataX.length || 1;
        dataX.type = dataX.type || "sin";
        if (dataX.type !== "sin" && dataX.type !== "cos") {
          throw new Error("dataX.type is not sin or cos");
        }
        dataX.value = dataX.value || 1;
        dataX.line = dataX.line = 0;
        dataY = dataY || {};
        dataY.position = dataY.position || 0;
        dataY.length = dataY.length || 1;
        dataY.type = dataY.type || "sin";
        if (dataY.type !== "sin" && dataY.type !== "cos") {
          throw new Error("dataY.type is not sin or cos");
        }
        dataY.value = dataY.value || 1;
        dataY.line = dataY.line = 0;
        time = time || 0;
        theta = theta || Math.PI / 180;
        return {
          x: dataX.position + dataX.length * Math[dataX.type](dataX.value * time * theta + dataX.line),
          y: dataY.position + dataY.length * Math[dataY.type](dataY.value * time * theta + dataY.line),
        };
      },
      rose: function(position, value, type, theta, size, offset, time, swap) {
        //Value may division for interesting result: 11/2, and theta may unnecessary
        position = position || {};
        position.x = position.x || 0;
        position.y = position.y || 0;
        value = value || 1;
        type = type || {};
        type.x = type.x || "cos";
        type.y = type.y || "cos";
        theta = theta || 10;
        size = size || 100;
        time = time || 0;
        if (swap === true) {
          return {
            x: position.x + (Math[type.x](value * theta * time) + offset) * Math.sin(theta * time) * size,
            y: position.y + (Math[type.y](value * theta * time) + offset) * Math.cos(theta * time) * size,
          };
        } else {
          return {
            x: position.x + (Math[type.x](value * theta * time) + offset) * Math.cos(theta * time) * size,
            y: position.y + (Math[type.y](value * theta * time) + offset) * Math.sin(theta * time) * size,
          };
        }
      },
      parabola: function(position, value, multiply, power, time, swap) {
        position = position || {};
        position.x = position.x || 0;
        position.y = position.y || 0;
        value = value || 1;
        multiply = multiply || 1;
        power = power || 2;
        time = time || 0;
        if (swap === true) {
          return {
            x: multiply * value * time + position.x,
            y: value * Math.pow(time, power) + position.y,
          };
        } else {
          return {
            x: value * Math.pow(time, power) + position.x,
            y: multiply * value * time + position.y,
          };
        }
      },
      gravity: function(position, speed, angle, accel, power, division, time, swap) {
        //http://colalg.math.csusb.edu/~devel/precalcdemo/param/src/param.html
        position = position || {};
        position.x = position.x || 0;
        position.y = position.y || 0;
        power = power || 2;
        time = time || 0;
        power = power || 2;
        division = division || 2;
        if (swap === true) {
          return {
            x: position.x + (speed * Math.sin(angle) * time - accel * Math.pow(time, power) / division),
            y: position.y + (speed * Math.cos(angle) * time),
          };
        } else {
          return {
            x: position.x + (speed * Math.cos(angle) * time),
            y: position.y + (speed * Math.sin(angle) * time - accel * Math.pow(time, power) / division),
          };
        }
      },
      spirograph: function(type, position, data, time, swap) {
        //http://www.mathematische-basteleien.de/spirographs.htm
        type = type || 0;
        position = position || {};
        position.x = position.x || 0;
        position.y = position.y || 0;
        data = data || {};
        time = time || 0;
        if (type === 0 || type === 2) {
          data.value = data.value || 1;
        }
        if (type === 0 || type === 1) {
          data.bigR = data.bigR || 1;
        }
        if (type === 0 || type === 1 || type === 2) {
          data.smallR = data.smallR || 1;
          data.theta = data.theta || 1;
        }
        switch (type) {
          case 0: {
            if (swap === true) {
              return {
                x: position.x + ((data.bigR - data.smallR) * Math.sin(data.theta * time) - data.value * Math.sin(((data.bigR - data.smallR) / data.smallR) * data.theta * time)),
                y: position.y + ((data.bigR - data.smallR) * Math.cos(data.theta * time) + data.value * Math.cos(((data.bigR - data.smallR) / data.smallR) * data.theta * time)),
              };
            } else {
              return {
                x: position.x + ((data.bigR - data.smallR) * Math.cos(data.theta * time) + data.value * Math.cos(((data.bigR - data.smallR) / data.smallR) * data.theta * time)),
                y: position.y + ((data.bigR - data.smallR) * Math.sin(data.theta * time) - data.value * Math.sin(((data.bigR - data.smallR) / data.smallR) * data.theta * time)),
              };
            }
          }
          break;
          case 1: {
            if (swap === true) {
              return {
                x: position.x + ((data.bigR + data.smallR) * Math.sin(data.theta * time) - data.smallR * Math.sin(((data.bigR + data.smallR) / data.smallR) * data.theta * time)),
                y: position.y + ((data.bigR + data.smallR) * Math.cos(data.theta * time) - data.smallR * Math.cos(((data.bigR + data.smallR) / data.smallR) * data.theta * time)),
              };
            } else {
              return {
                x: position.x + ((data.bigR + data.smallR) * Math.cos(data.theta * time) - data.smallR * Math.cos(((data.bigR + data.smallR) / data.smallR) * data.theta * time)),
                y: position.y + ((data.bigR + data.smallR) * Math.sin(data.theta * time) - data.smallR * Math.sin(((data.bigR + data.smallR) / data.smallR) * data.theta * time)),
              };
            }
          }
          break;
          case 2: {
            if (swap === true) {
              return {
                x: position.x + (data.smallR * data.value * Math.sin(data.theta * time) - data.smallR * Math.sin(data.value * data.theta * time)),
                y: position.y + (data.smallR * data.value * Math.cos(data.theta * time) - data.smallR * Math.cos(data.value * data.theta * time)),
              };
            } else {
              return {
                x: position.x + (data.smallR * data.value * Math.cos(data.theta * time) - data.smallR * Math.cos(data.value * data.theta * time)),
                y: position.y + (data.smallR * data.value * Math.sin(data.theta * time) - data.smallR * Math.sin(data.value * data.theta * time)),
              };
            }
          }
          break;
          case 3: {
            //May cycloids go here
          }
          break;
        }
      },
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
  console.log("Shmup.js loaded successfully, version " + Shmup.VERSION);
}(('undefined' !== typeof window) ? window : {}));

//Necessary library

(function() {
  var getTime;
  (function() {
    if (window.performance && (window.performance.now || window.performance.webkitNow)) {
      var perfNow = window.performance.now ? 'now' : 'webkitNow';
      getTime = window.performance[perfNow].bind(window.performance);
    } else {
      getTime = function() {
        return +new Date();
      };
    }
  }());
  var fps = 0, ms = 0, configs = {
    smoothing: 10,
    maxMs: 0,
  };
  var time,
      thisFrameTime = 0,
      lastLoop = getTime() - configs.maxMs,
      frameTime = configs.maxMs, //maximum ms
      frameStart = 0; //smooth value
  Shmup.advanced.performance = {};
  Shmup.advanced.performance.configs = function(data) {
    configs.smoothing = data.smoothing || 1;
    configs.maxMs = data.maxMs;
    lastLoop = getTime() - configs.maxMs;
  };
  Shmup.advanced.performance.start = function() {
    frameStart = getTime();
  };
  Shmup.advanced.performance.end = function() {
    time = getTime();
    thisFrameTime = time - lastLoop;
    frameTime += (thisFrameTime - frameTime) / configs.smoothing;
    fps = 1000 / frameTime;
    ms = frameStart < lastLoop ? frameTime : time - frameStart;
    lastLoop = time;
  };
  Shmup.advanced.performance.fps = function() {
    return fps;
  };
  Shmup.advanced.performance.ms = function() {
    return ms;
  };
})();

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
  }
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

(function (pool, math) {
  // https://github.com/davidbau/seedrandom
  
  // The following constants are related to IEEE 754 limits.
  var global = this,
      width = 256,        // each RC4 output is 0 <= x < 256
      chunks = 6,         // at least six RC4 outputs for each double
      digits = 52,        // there are 52 significant digits in a double
      rngname = 'random', // rngname: name for Math.random and Math.seedrandom
      startdenom = math.pow(width, chunks),
      significance = math.pow(2, digits),
      overflow = significance * 2,
      mask = width - 1,
      nodecrypto;         // node.js crypto module, initialized at the bottom.

  /*
   * seedrandom()
   * This is the seedrandom function described above.
  */
  function seedrandom(seed, options, callback) {
    var key = [];
    options = (options == true) ? { entropy: true } : (options || {});

    // Flatten the seed string or build one from local entropy if needed.
    var shortseed = mixkey(flatten(
      options.entropy ? [seed, tostring(pool)] :
      (seed == null) ? autoseed() : seed, 3), key);

    // Use the seed to initialize an ARC4 generator.
    var arc4 = new ARC4(key);

    // This function returns a random double in [0, 1) that contains
    // randomness in every bit of the mantissa of the IEEE 754 value.
    var prng = function() {
      var n = arc4.g(chunks),             // Start with a numerator n < 2 ^ 48
          d = startdenom,                 //   and denominator d = 2 ^ 48.
          x = 0;                          //   and no 'extra last byte'.
      while (n < significance) {          // Fill up all significant digits by
        n = (n + x) * width;              //   shifting numerator and
        d *= width;                       //   denominator and generating a
        x = arc4.g(1);                    //   new least-significant-byte.
      }
      while (n >= overflow) {             // To avoid rounding up, before adding
        n /= 2;                           //   last byte, shift everything
        d /= 2;                           //   right using integer math until
        x >>>= 1;                         //   we have exactly the desired bits.
      }
      return (n + x) / d;                 // Form the number within [0, 1).
    };

    prng.int32 = function() { return arc4.g(4) | 0; };
    prng.quick = function() { return arc4.g(4) / 0x100000000; };
    prng.double = prng;

    // Mix the randomness into accumulated entropy.
    mixkey(tostring(arc4.S), pool);

    // Calling convention: what to return as a function of prng, seed, is_math.
    return (options.pass || callback ||
        function(prng, seed, is_math_call, state) {
          if (state) {
            // Load the arc4 state from the given state if it has an S array.
            if (state.S) { copy(state, arc4); }
            // Only provide the .state method if requested via options.state.
            prng.state = function() { return copy(arc4, {}); };
          }

          // If called as a method of Math (Math.seedrandom()), mutate
          // Math.random because that is how seedrandom.js has worked since v1.0.
          if (is_math_call) { math[rngname] = prng; return seed; }

          // Otherwise, it is a newer calling convention, so return the
          // prng directly.
          else return prng;
        })(
    prng,
    shortseed,
    'global' in options ? options.global : (this == math),
    options.state);
  }
  math['seed' + rngname] = seedrandom;

  /*
   * ARC4
   *
   * An ARC4 implementation.  The constructor takes a key in the form of
   * an array of at most (width) integers that should be 0 <= x < (width).
   *
   * The g(count) method returns a pseudorandom integer that concatenates
   * the next (count) outputs from ARC4.  Its return value is a number x
   * that is in the range 0 <= x < (width ^ count).
  */
  function ARC4(key) {
    var t, keylen = key.length,
        me = this, i = 0, j = me.i = me.j = 0, s = me.S = [];

    // The empty key [] is treated as [0].
    if (!keylen) { key = [keylen++]; }

    // Set up S using the standard key scheduling algorithm.
    while (i < width) {
      s[i] = i++;
    }
    for (i = 0; i < width; i++) {
      s[i] = s[j = mask & (j + key[i % keylen] + (t = s[i]))];
      s[j] = t;
    }

    // The "g" method returns the next (count) outputs as one number.
    (me.g = function(count) {
      // Using instance members instead of closure state nearly doubles speed.
      var t, r = 0,
          i = me.i, j = me.j, s = me.S;
      while (count--) {
        t = s[i = mask & (i + 1)];
        r = r * width + s[mask & ((s[i] = s[j = mask & (j + t)]) + (s[j] = t))];
      }
      me.i = i; me.j = j;
      return r;
      /* For robust unpredictability, the function call below automatically
       * discards an initial batch of values.  This is called RC4-drop[256].
       * See http://google.com/search?q=rsa+fluhrer+response&btnI
      */
    })(width);
  }

  /*
   * copy()
   * Copies internal state of ARC4 to or from a plain object.
  */
  function copy(f, t) {
    t.i = f.i;
    t.j = f.j;
    t.S = f.S.slice();
    return t;
  }

  /*
   * flatten()
   * Converts an object tree to nested arrays of strings.
  */
  function flatten(obj, depth) {
    var result = [], typ = (typeof obj), prop;
    if (depth && typ == 'object') {
      for (prop in obj) {
        try { result.push(flatten(obj[prop], depth - 1)); } catch (e) {}
      }
    }
    return (result.length ? result : typ == 'string' ? obj : obj + '\0');
  }

  /*
   * mixkey()
   * Mixes a string seed into a key that is an array of integers, and
   * returns a shortened string seed that is equivalent to the result key.
  */
  function mixkey(seed, key) {
    var stringseed = seed + '', smear, j = 0;
    while (j < stringseed.length) {
      key[mask & j] =
        mask & ((smear ^= key[mask & j] * 19) + stringseed.charCodeAt(j++));
    }
    return tostring(key);
  }

  /*
   * autoseed()
   * Returns an object for autoseeding, using window.crypto and Node crypto
   * module if available.
  */
  function autoseed() {
    try {
      if (nodecrypto) { return tostring(nodecrypto.randomBytes(width)); }
      var out = new Uint8Array(width);
      (global.crypto || global.msCrypto).getRandomValues(out);
      return tostring(out);
    } catch (e) {
      var browser = global.navigator,
          plugins = browser && browser.plugins;
      return [+new Date, global, plugins, global.screen, tostring(pool)];
    }
  }

  /*
   * tostring()
   * Converts an array of charcodes to a string
  */
  function tostring(a) {
    return String.fromCharCode.apply(0, a);
  }

  /*
   * When seedrandom.js is loaded, we immediately mix a few bits
   * from the built-in RNG into the entropy pool.  Because we do
   * not want to interfere with deterministic PRNG state later,
   * seedrandom will not call math.random on its own again after
   * initialization.
  */
  mixkey(math.random(), pool);

  /*
   * Nodejs and AMD support: export the implementation as a module using
   * either convention.
  */
  if ((typeof module) == 'object' && module.exports) {
    module.exports = seedrandom;
    // When in node.js, try using crypto package for autoseeding.
    try {
      nodecrypto = require('crypto');
    } catch (ex) {}
  } else if ((typeof define) == 'function' && define.amd) {
    define(function() { return seedrandom; });
  }

  // End anonymous scope, and pass initial values.
})(
  [],     // pool: entropy pool starts empty
  Math    // math: package containing random, pow, and seedrandom
);
