(function (window) {
  'use strict';
  /*
  Shmup.js v1.2.4

  MIT License

  Copyright (c) 2016-2017 Trung0246

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
  
  /*var oldSin = Math.sin;
  Math.sin = function(val) {
    return -oldSin(val);
  };*/
  
  //Important variable
  var main = {},       //Main holder
      data = {
        //angleType: "degree",
        //positionType: "object",
        maxProjectile: 0,
        frame: 0,
        scene: {
          x: 0,
          y: 0,
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
        routine: [],
      };

  //Define current Shmup.js version string
  Object.defineProperty(main, "VERSION", {
    value: "1.2.4",
    writable: false,
    enumerable: true,
    configurable: true,
  });
  
  //Private class
  function Runner(configs, condition, param, actions, workData) {
    this.configs = configs;
    this.condition = condition;
    this.param = param;
    this.actions = actions;
    this.workData = workData || {};
    this.workData.process = this.workData.process || [];
    this.done = false;
    this.value = undefined;
    return this;
  }
  Runner.prototype = {
    next: function() {
      var tempData;
      if (this.workData.process.length <= 0 && this.configs.reset !== true && this.workData.jump) {
        return this.stop();
      } else if ((this.configs.reset === true && this.workData.process.length <= 0) || !this.workData.jump) {
        this.workData.process.push({
          location: 0,
          condition: this.condition,
          actions: this.actions,
        });
        this.workData.jump = {};
        this.done = false;
      }
      if (this.workData.process[this.workData.process.length - 1].func === "wait") {
        if (this.workData.process[this.workData.process.length - 1].condition(this.param, this.workData)) {
          return this.stop();
        } else {
          this.workData.process.pop();
        }
      }
      tempData = runHelper(this.param,
        this.workData.process[this.workData.process.length - 1].condition(this.param, this.workData) ||
        (this.workData.process[this.workData.process.length - 1].location < this.workData.process[this.workData.process.length - 1].actions.length &&
        this.workData.process[this.workData.process.length - 1].location !== 0),
      this.workData);
      if (tempData) {
        switch(tempData.func) {
          case "repeat": {
            return this.next();
          }
          break;
          case "wait": {
            return this.stop();
          }
          break;
        }
      } else {
        this.workData.process.pop();
        if (this.workData.process.length > 0) {
          return this.next();
        } else {
          this.done = true;
          return this.stop();
        }
      }
    },
    reset: function() {
      this.workData = {};
      this.workData.process = [];
      return this.next();
    },
    stop: function() {
      return this;
    },
  };
  
  //Runner helper
  function runHelper(param, tempBool, workData) {
    var tempData, value;
    while (tempBool) {
      while (workData.process[workData.process.length - 1].location < workData.process[workData.process.length - 1].actions.length) {
        if (typeof workData.process[workData.process.length - 1].actions[workData.process[workData.process.length - 1].location] === "object") {
          switch (workData.process[workData.process.length - 1].actions[workData.process[workData.process.length - 1].location].func) {
            case "repeat": {
              tempData = workData.process[workData.process.length - 1].actions[workData.process[workData.process.length - 1].location];
              workData.process[workData.process.length - 1].location += 1;
              tempData.location = 0;
              workData.process.push(tempData);
              return tempData;
            }
            break;
            case "wait": {
              if (workData.process[workData.process.length - 1].actions[workData.process[workData.process.length - 1].location].condition(param, workData)) {
                tempData = workData.process[workData.process.length - 1].actions[workData.process[workData.process.length - 1].location];
                workData.process[workData.process.length - 1].location += 1;
                workData.process.push(tempData);
                return tempData;
              } else {
                workData.process[workData.process.length - 1].location += 1;
                if (workData.process[workData.process.length - 1].location >= workData.process[workData.process.length - 1].actions.length) {
                  tempData = {
                    func: "repeat",
                  };
                  return tempData;
                }
                workData.process[workData.process.length - 1].actions[workData.process[workData.process.length - 1].location](param, workData);
              }
            }
            break;
            case "jump": {
              switch(workData.process[workData.process.length - 1].actions[workData.process[workData.process.length - 1].location].type) {
                case 0: {
                  if (!workData.jump[workData.process.length - 1]) {
                    workData.jump[workData.process.length - 1] = {};
                  }
                  workData.jump[workData.process.length - 1][workData.process[workData.process.length - 1].actions[workData.process[workData.process.length - 1].location].value] = workData.process[workData.process.length - 1].location;
                }
                break;
                case 1: {
                  if (workData.process[workData.process.length - 1].actions[workData.process[workData.process.length - 1].location].condition(param, workData)) {
                    if (typeof workData.process[workData.process.length - 1].actions[workData.process[workData.process.length - 1].location].value === "string") {
                      workData.process[workData.process.length - 1].location = workData.jump[workData.process.length - 1][workData.process[workData.process.length - 1].actions[workData.process[workData.process.length - 1].location].value];
                    } else {
                      workData.process[workData.process.length - 1].location = workData.process[workData.process.length - 1].actions[workData.process[workData.process.length - 1].location].value;
                    }
                  }
                }
                break;
              }
            }
            break;
            case "stop": {
              if (workData.process[workData.process.length - 1].actions[workData.process[workData.process.length - 1].location].condition(param, workData)) {
                switch (workData.process[workData.process.length - 1].actions[workData.process[workData.process.length - 1].location].type) {
                  case 0: {
                    if (workData.process.length > 1) {
                      workData.process.pop();
                      workData.process[workData.process.length - 1].location -= 1;
                    } else {
                      workData.process[0].location = workData.process[workData.process.length - 1].actions.length - 1;
                      workData.process[0].condition = function () {
                        return false;
                      };
                    }
                  }
                  break;
                  case 1: {
                    workData.process[workData.process.length - 1].location = workData.process[workData.process.length - 1].actions.length - 1;
                  }
                  break;
                  case 2: {
                    for (var deleteCount = workData.process.length - 1; deleteCount >= 1; --deleteCount) {
                      workData.process.splice(deleteCount, 1);
                    }
                    workData.process[0].location = workData.process[workData.process.length - 1].actions.length - 1;
                    workData.process[0].condition = function () {
                      return false;
                    };
                  }
                  break;
                }
              }
            }
            break;
            default: {
              throw new Error("Invalid action at " + workData.process[workData.process.length - 1].location);
            }
          }
        } else {
          workData.process[workData.process.length - 1].actions[workData.process[workData.process.length - 1].location](param, workData);
        }
        workData.process[workData.process.length - 1].location += 1;
      }
      tempBool = workData.process[workData.process.length - 1].condition(param, workData);
      workData.process[workData.process.length - 1].location = 0;
    }
    return;
  }
  
  function Tasker(configs, param, task) {
    this.task = task;
    this.param = param || [];
    this.configs = configs || {};
    this.configs.update = configs.update || false;
    this.configs.reset = configs.reset || false;
    this.configs.call = configs.call || function () {};
    if (!param) {
      this.tempTask = this.task();
    } else {
      this.tempTask = this.task.apply(this, param);
    }
    return this;
  }
  Tasker.prototype = {
    next: function () {
      this.returnData = this.tempTask.next();
      this.returnData.task = this.task;
      this.returnData.iterate = this.tempTask;
      this.configs.call(this.returnData);
      return this.returnData;
    },
    reset: function () {
      this.tempTask = this.task();
      this.returnData = this.returnData || {};
      this.returnData.task = this.task;
      this.returnData.iterate = this.tempTask;
      this.returnData.value = undefined;
      this.returnData.done = false;
      this.configs.call(this.returnData);
      return this.returnData;
    },
  };
  
  //Public class
  //Projectile classes
  main.projectile = {};

  main.configs = function (configsData) {
    data.scene = configsData.scene || (function () {
      throw new Error("Unknown scene");
    })();
    data.maxProjectile = configsData.maxProjectile || (function () {
      throw new Error("Unknown maxProjectile");
    })();
    for (var key in main.projectile) {
      if (main.projectile.hasOwnProperty(key)) {
        if (!main.projectile[key].data) {
          throw new Error("Unknown data holder of projectile " + key);
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
        /*if (!main.projectile[key].data.temp) {
          main.projectile[key].data.temp = {};
        }*/
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
  
  main.update = function () {
    data.frame += 1;
    for (var subCount = temp.routine.length - 1; subCount >= 0; --subCount) {
      var result = temp.routine[subCount].next();
      if (result.done === true || temp.routine[subCount].configs.update === false) {
        if (temp.routine[subCount].configs.reset === true) {
          temp.routine[subCount].reset();
          subCount ++;
        } else {
          temp.routine.splice(subCount, 1);
        }
      }
    }
    for (var projectileCount = process.active.length - 1; projectileCount >= 0; --projectileCount) {
      main.projectile[process.active[projectileCount].type].update(process.active[projectileCount]);
      process.active[projectileCount].update(process.active[projectileCount]);
      if (process.active[projectileCount].update === undefined) {
        process.active.splice(projectileCount, 1);
      }
    }
  };

  //DSL class
  main.dsl = {
    run: function (configs, condition, param, actions, workData) {
      var tempRun = new Runner(configs, condition, param, actions, workData);
      if (configs.update === true) {
        temp.routine.push(tempRun);
      }
      if (configs.auto === true && configs.update !== true) {
        tempRun = tempRun.next();
      }
      return tempRun;
    },
    repeat: function (condition, actions) {
      return {
        func: "repeat",
        location: 0,
        condition: condition,
        actions: actions,
      };
    },
    wait: function (condition) {
      return {
        func: "wait",
        condition: condition,
      };
    },
    stop: function (type, condition) {
      return {
        func: "stop",
        type: type,
        condition: condition,
      };
    },
    jump: function (type, value, condition) {
      return {
        func: "jump",
        type: type,
        condition: condition,
        value: value,
      };
    },
  };
  
  //Utilities class
  main.utils = {
    loop: {
      count: function (count, func) {
        var type = "";
        for (let loopCount = 0; loopCount < count; loopCount ++) {
          if (type === "continue") {
            type = "";
            continue;
          }
          type = func(loopCount);
          if (type === "break") {
            break;
          } else if (typeof type === "number") {
            count = type;
            type = "";
          }
        }
      },
      ascent: function (count1, count2, func) {
        var type;
        func = func || function() {};
        for (let loopCount = count1; loopCount < count2; loopCount ++) {
          if (type === "continue") {
            type = "";
            continue;
          }
          type = func(loopCount);
          if (type === "break") {
            break;
          } else if (typeof type === "number") {
            count = type;
            type = "";
          }
        }
      },
      descent: function (count1, count2, func) {
        var type;
        func = func || function() {};
        for (let loopCount = count2 - 1; loopCount >= count1; -- loopCount) {
          if (type === "continue") {
            type = "";
            continue;
          }
          type = func(loopCount);
          if (type === "break") {
            break;
          } else if (typeof type === "number") {
            count = type;
            type = "";
          }
        }
      },
    },
    task: function (configs, param, task) {
      if (!task) {
        throw new Error("No task to run");
      }
      var pushTask = new Tasker(configs, param, task);
      if (configs.update === true) {
        temp.routine.push(pushTask);
      }
      return pushTask;
    },
    count: function (data) {
      data = data || {};
      data.change = data.change || 1;
      if (typeof data.max !== "number" || typeof data.min !== "number") {
        throw new Error("Min or max is not number");
      }
      if (((data.change > data.max && data.max > 0) || (data.change < data.max && data.max < 0)) ||
      ((data.change < data.min && data.min > 0) || (data.change > data.min && data.min < 0))) {
        throw new Error("Change value is larger or smaller than maximum");
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
      return function (value, change) {
        current = value || current;
        data.change = change || data.change;
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
        return current;
      };
    },
    out: function (type, position, margin) {
      margin = margin || 0;
      switch (type) {
        case 0: {
          if (position.y < -margin) {
            return 1;
          } else if (data.scene.x + margin < position.x) {
            return 2;
          } else if (data.scene.y + margin < position.y) {
            return 3;
          } else if (position.x < -margin) {
            return 4;
          } else {
            return 0;
          }
        }
        break;
        case 1: {
          return position.y < -margin;
        }
        break;
        case 2: {
          return data.scene.x + margin < position.x;
        }
        break;
        case 3: {
          return data.scene.y + margin < position.y;
        }
        break;
        case 4: {
          return position.x < -margin;
        }
        break;
        default: {
          return position.x < -margin || data.scene.x + margin < position.x || position.y < margin || data.scene.y + margin < position.y;
        }
      }
    },
    teleport: function (type, position, margin) {
      var tempPos = {
        x: position.x,
        y: position.y,
      };
      if (tempPos.x < -margin) {
        tempPos.x += data.scene.x;
      } else if (data.scene.x + margin < tempPos.x) {
        tempPos.x -= data.scene.x;
      } else if (tempPos.y < -margin) {
        tempPos.y += data.scene.y;
      } else if (data.scene.y + margin < tempPos.y) {
        tempPos.y -= data.scene.y;
      }
      return tempPos;
    },
    wait: function* (data, func) {
      var type;
      func = func || function() {};
      if (typeof data === "number") {
        for (let waitCount = 1; waitCount <= data; waitCount ++) {
          type = func(waitCount);
          yield;
          if (type === "continue") {
            type = "";
            continue;
          } else if (type === "break") {
            break;
          } else if (typeof type === "number") {
            count = type;
            type = "";
          }
        }
      } else {
        while (data) {
          type = func(data);
          yield;
          if (type === "continue") {
            type = "";
            continue;
          } else if (type === "break") {
            break;
          }
        }
      }
    },
    removed: function(projectile) {
      return process.active.indexOf(projectile) === -1;
    },
  };
  
  //Boolean class
  main.bool = {
    nand: function (valueOne, valueTwo) {
      return !(valueOne && valueTwo);
    },
    nor: function (valueOne, valueTwo) {
      return !(valueOne || valueTwo);
    },
    xor: function (valueOne, valueTwo) {
      return valueOne ? !valueTwo : !!valueTwo;
    },
    xnor: function (valueOne, valueTwo) {
      return !main.utils.bool.xor(valueOne, valueTwo);
    },
    xand: function (valueOne, valueTwo) {
      return (!!valueOne && !valueTwo);
    },
    xnand: function (valueOne, valueTwo) {
      return (!!valueOne || !valueTwo);
    },
    all: function (arrayValue) {
      for (let loopCount = 0; loopCount < arrayValue.length; loopCount ++) {
        if (arrayValue[loopCount] != true) {
          return false;
        } else if (loopCount >= arrayValue.length - 1) {
          return true;
        }
      }
    },
    nall: function(arrayValue) {
      for (let loopCount = 0; loopCount < arrayValue.length; loopCount ++) {
        if (arrayValue[loopCount] == true) {
          return true;
        }
      }
      return false;
    },
  };
  
  //Math class
  main.constant = {
    //https://en.wikipedia.org/wiki/Golden_angle
    //https://en.wikipedia.org/wiki/Universal_parabolic_constant
    halfPI: Math.PI / 2,
    TAU: Math.PI * 2,
    PHI: (1 + Math.sqrt(5)) / 2,
    SILVER: 1 + Math.sqrt(2),
    UPC: Math.log(1 + Math.sqrt(2)) + Math.sqrt(2),
  };
  main.math = {
    gcd: function(valueOne, valueTwo) {
      return !valueTwo ? valueOne : main.math.gcd(valueTwo, valueOne % valueTwo);
    },
    lcm: function(valueOne, valueTwo) {
      return (valueOne * valueTwo) / main.math.gcd(valueOne, valueTwo);
    },
    round: function (value, epsilon) {
      epsilon = epsilon || 12;
      return Math.round((value) * Math.pow(10, epsilon)) / Math.pow(10, epsilon);
    },
    range: function (value, min, max, minEq, maxEq, accuracy) {
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
    compare: function (valueOne, valueTwo, accuracy, equal, reverse) {
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
    clamp: function (value, min, max) {
      return Math.max(min, Math.min(max, value));
    },
    lerp: function(start, stop, amt) {
      return amt * (stop - start) + start;
    },
    map: function (value, low, high, low2, high2) {
      var percent = (value - low) / (high - low);
      return low2 + percent * (high2 - low2);
    },
    remainder: function (valueOne, valueTwo) {
      //http://stackoverflow.com/questions/34291760/
       var res = valueOne % valueTwo;
       if (res < 0)
          res += valueTwo;
       return res;
    },
    factorial: function (value) {
      var result = 1;
      if (value > 0) {
        for (let count = 1; count <= value; count ++) {
          result *= count;
        }
      } else if (value < 0) {
        for (let count = -1; count >= value; count --) {
          result *= count;
        }
      } else {
        result = 1;
      }
      return result;
    },
    normalize: function (value, min, max) {
      return main.math.map(value, min, max, 0, 1);
    },
    pascalTriangle: function (a, b) {
      var result = 1;
      for (var i = 1; i <= b; i++) {
        result *= ((a - (i - 1)) / i);
      }
      return result;
    },
    random: (function () {
      var y2 = 0, previous = false, perlin;
      var PERLIN_YWRAPB = 4;
      var PERLIN_YWRAP = 1<<PERLIN_YWRAPB;
      var PERLIN_ZWRAPB = 8;
      var PERLIN_ZWRAP = 1<<PERLIN_ZWRAPB;
      var PERLIN_SIZE = 4095;
      var scaled_cosine = function(i) {
        return 0.5*(1.0-Math.cos(i*Math.PI));
      };
      function random (min, max, seed, larger, equal, generate, exception) {
        var returnValue;
        /*if (options.round == true) {
          returnValue = Number(Math.floor(options.generate(options.seed) * (options.max - options.min + 1)) + options.min);
        } else {
          returnValue = Number(options.generate(options.seed) * (options.max - options.min) + options.min);
        }*/
        returnValue = generate(seed);
        if (min > max) {
          if (larger == null) {
            returnValue = 0;
          } else {
            returnValue = larger;
          }
        } else if (min == max) {
          if (equal == null) {
            returnValue = min;
          } else {
            returnValue = equal;
          }
        }
        if (min == undefined) {
          returnValue = returnValue;
        } else if (max == undefined) {
          returnValue = returnValue * min;
        } else {
          returnValue = returnValue * (max - min) + min;
        }
        if (exception.length > 0 && exception.indexOf(returnValue) < 0) {
          if (seed) {
            throw new Error("Seed random return " + returnValue + ", but this number inside exception array.");
          } else {
            returnValue = random(min, max, seed, larger, equal, generate, exception);
          }
        }
        return returnValue;
      }
      function gaussian (mean, sd, randomValue) {
        var y1,x1,x2,w;
        if (previous) {
          y1 = y2;
          previous = false;
        } else {
          do {
            x1 = randomValue - 1;
            x2 = randomValue - 1;
            w = x1 * x1 + x2 * x2;
          } while (w >= 1);
          w = Math.sqrt((-2 * Math.log(w))/w);
          y1 = x1 * w;
          y2 = x2 * w;
          previous = true;
        }
        return y1 * sd + mean;
      }
      function noise (x, y, z, lod, falloff, seed) {

        perlin = new Array(PERLIN_SIZE + 1);
        perlin[0] = random(undefined, undefined, seed);
        for (var i = 1; i < PERLIN_SIZE + 1; i++) {
          perlin[i] = random();
        }

        if (x<0) { x=-x; }
        if (y<0) { y=-y; }
        if (z<0) { z=-z; }

        var xi=Math.floor(x), yi=Math.floor(y), zi=Math.floor(z);
        var xf = x - xi;
        var yf = y - yi;
        var zf = z - zi;
        var rxf, ryf;

        var r=0;
        var ampl=0.5;

        var n1,n2,n3;

        for (var o=0; o<lod; o++) {
          var of=xi+(yi<<PERLIN_YWRAPB)+(zi<<PERLIN_ZWRAPB);

          rxf = scaled_cosine(xf);
          ryf = scaled_cosine(yf);

          n1  = perlin[of&PERLIN_SIZE];
          n1 += rxf*(perlin[(of+1)&PERLIN_SIZE]-n1);
          n2  = perlin[(of+PERLIN_YWRAP)&PERLIN_SIZE];
          n2 += rxf*(perlin[(of+PERLIN_YWRAP+1)&PERLIN_SIZE]-n2);
          n1 += ryf*(n2-n1);

          of += PERLIN_ZWRAP;
          n2  = perlin[of&PERLIN_SIZE];
          n2 += rxf*(perlin[(of+1)&PERLIN_SIZE]-n2);
          n3  = perlin[(of+PERLIN_YWRAP)&PERLIN_SIZE];
          n3 += rxf*(perlin[(of+PERLIN_YWRAP+1)&PERLIN_SIZE]-n3);
          n2 += ryf*(n3-n2);

          n1 += scaled_cosine(zf)*(n2-n1);

          r += n1*ampl;
          ampl *= falloff;
          xi<<=1;
          xf*=2;
          yi<<=1;
          yf*=2;
          zi<<=1;
          zf*=2;

          if (xf>=1.0) { xi++; xf--; }
          if (yf>=1.0) { yi++; yf--; }
          if (zf>=1.0) { zi++; zf--; }
        }
        return r;
      }
      return function (options) {
        options = options || {};
        options.generate = options.generate || function (seed) {
          Math.seedrandom(seed);
          return Math.random();
        };
        options.min = options.min || 0;
        if (options.max == undefined) {
          options.max = 1;
        }
        options.seed = options.seed || undefined;
        options.exception = options.exception || [];
        options.larger = options.larger || 0;
        options.equal = options.equal || options.min;
        if (options.gaussian) {
          options.gaussian.mean = options.gaussian.mean || 0;
          options.gaussian.sd = options.gaussian.sd || 1;
        }
        if (options.noise) {
          options.noise.x = options.noise.x || 0;
          options.noise.y = options.noise.y || 0;
          options.noise.z = options.noise.z || 0;
          options.noise.octaves = options.noise.octaves > 0 ? options.noise.octaves : 4;
          options.noise.falloff = options.noise.falloff > 0 ? options.noise.falloff : 0.5;
        }
        options.weight = options.weight || [];
        var total = 0, randomValue;
        if (options.gaussian) {
          return gaussian(options.gaussian.mean, options.gaussian.sd, random(2));
        } else if (options.noise) {
          return noise(options.noise.x, options.noise.y, options.noise.z, options.noise.octaves, options.noise.falloff, options.seed);
        } else {
          if (options.weight.length > 0) {
            for (let i = 0; i < options.weight.length; i ++) {
              total += options.weight[i].chance;
            }
            randomValue = random(0, total, options.seed, options.larger, options.equal, options.generate, options.exception);
            for (let i = 0; i < options.weight.length; i ++) {
              if (randomValue < total) {
                return options.weight[i].value;
              }
              randomValue -= options.weight[i].chance;
            }
          } else {
            return random(options.min, options.max, options.seed, options.larger, options.equal, options.generate, options.exception);
          }
        }
      }
    })(),
  };
  main.angle = {
    radian: {
      normalize: function (angle) {
        angle = angle % main.constant.TAU;
        while (angle <= -Math.PI) {
          angle += main.constant.TAU;
        }
        while (Math.PI < angle) {
          angle -= main.constant.TAU;
        }
        return angle;
      },
      degree: function (angle) {
        return (angle % main.constant.TAU) * (180 / Math.PI);
      },
      full: function (angle) {
        return (main.constant.TAU + (angle % main.constant.TAU)) % main.constant.TAU;
      },
    },
    degree: {
      normalize: function (angle) {
        angle = angle % 360;
        while (angle <= 0) {
          angle += 360;
        }
        while (180 < angle) {
          angle -= 360;
        }
        return angle;
      },
      radian: function (angle) {
        return (angle % 360) * (Math.PI / 180);
      },
      full: function (angle) {
        return (360 + (angle % 360)) % 360;
      },
    },
    point: function (start, target) {
      return Math.atan2(target.y - start.y, target.x - start.x);
      //When reverse sin: return Math.atan2(start.y - target.y, target.x - start.x);
    },
    bounce: function (angle, mirror) {
      return 2 * mirror - angle;
    },
    different: function (angleOne, angleTwo) {
      //http://stackoverflow.com/questions/12234574/
      return (angleOne - angleTwo + Math.PI * 3) % main.constant.TAU - Math.PI;
    },
    between: function (angleOne, angleTwo, angle) {
      //www.xarg.org/2010/06/is-an-angle-between-two-other-angles/
      angle = main.angle.radian.full(angle);
      angleOne = main.angle.radian.full(angleOne);
      angleTwo = main.angle.radian.full(angleTwo);
      if (angleOne < angleTwo) {
        return angleOne <= angle && angle <= angleTwo;
      } else {
        return angleOne <= angle || angle <= angleTwo;
      }
    },
    scale: function (angleOne, angleTwo, scale, over, base) {
      //Act like main.line.on, but with angle
      //TODO: when range (ex: -45 to 45), the 0 one make it go counter-clock instead backward, add new variable "over" to fix this, may add base to fix direction of 0 degree
      base = base || 0;
      return main.angle.radian.normalize((main.angle.radian.full(angleTwo) - main.angle.radian.full(angleOne)) * scale + main.angle.radian.full(angleOne));
    },
  };
  main.point = {
    distance: function (type, posOne, posTwo, square) {
      var result;
      type = type || false;
      if (type === true) {
        result = Math.pow(posOne.x - posTwo.x, 2) + Math.pow(posOne.y - posTwo.y, 2);
      } else {
        result = Math.pow(posOne, 2) + Math.pow(posTwo, 2);
      }
      if (square === true) {
        return Math.sqrt(result);
      } else {
        return result;
      }
    },
    rotate: function (center, point, angle, dist) {
      var rotX, rotY, rotZ;
      if (typeof angle === "number") {
        rotX = Math.cos(angle),
        rotY = Math.sin(angle);
        return {
          x: (rotX * (point.x - center.x)) - (rotY * (point.y - center.y)) + center.x,
          y: (rotX * (point.y - center.y)) + (rotY * (point.x - center.x)) + center.y,
        };
      } else {
        dist = dist || main.point.distance(true, center, point, true);
        rotX = Math.cos(angle.x);
        rotY = Math.cos(angle.y);
        rotZ = Math.cos(angle.z);
        var //rotX2 = Math.sin(angle.x),
        //rotY2 = Math.sin(angle.y),
        rotZ2 = Math.sin(angle.z),
        rotP = Math.cos(angle.point),
        rotP2 = Math.sin(angle.point);
        return {
          x: (rotY * rotZ * rotP - rotX * rotZ2 * rotP2) * dist + center.x,
          y: (rotY * rotZ2 * rotP + rotX * rotZ * rotP2) * dist + center.y,
        };
      }
    },
    dilate: function (posOne, posTwo, location) {
      //like laser when instant set to false
      var tempLength = main.point.distance(true, posOne, posTwo, true) * location, angle = main.angle.point(posOne, posTwo);
      return {
        x: Math.cos(angle) * tempLength + posOne.x,
        y: Math.sin(angle) * tempLength + posOne.y,
        radial: tempLength,
        angle: angle,
      };
    },
    angle: function (posOne, posTwo, head) {
      return Math.acos((main.point.distance(true, head, posOne, false) + main.point.distance(true, head, posTwo, false) - main.point.distance(true, posOne, posTwo, false)) / (2 * main.point.distance(true, head, posOne, true) * main.point.distance(true, head, posTwo, true)));
    },
    center: function (posOne, posTwo, posThree) {
      var q, dataOne, dataTwo, dataThree;
      if (typeof posThree === "number") {
        //stackoverflow.com/questions/4914098
        q = main.point.distance(true, posTwo, posOne, true);
        dataThree = posThree;
        posThree = {};
        posThree.x = (posOne.x + posTwo.x) / 2;
        posThree.y = (posOne.y + posTwo.y) / 2;
        dataOne = Math.sqrt(Math.pow(dataThree, 2) - Math.pow(q / 2, 2)) * (posOne.y - posTwo.y) / q;
        dataTwo = Math.sqrt(Math.pow(dataThree, 2) - Math.pow(q / 2, 2)) * (posTwo.x - posOne.x) / q;
        return {
          x1: posThree.x + dataOne,
          y1: posThree.y + dataTwo,
          x2: posThree.x - dataOne,
          y2: posThree.y - dataTwo,
        };
      } else {
        //http://stackoverflow.com/questions/4958161
        q = posTwo.x * posTwo.x + posTwo.y * posTwo.y;
        dataOne  = (posOne.x * posOne.x + posOne.y * posOne.y - q) / 2;
        dataTwo  = (q - posThree.x * posThree.x - posThree.y * posThree.y) / 2;
        dataThree = (posOne.x - posTwo.x) * (posTwo.y - posThree.y) - (posTwo.x - posThree.x) * (posOne.y - posTwo.y);
        if (Math.abs(dataThree) > 1e-10) {
          return {
            x: (dataOne * (posTwo.y - posThree.y) - dataTwo * (posOne.y - posTwo.y)) / dataThree,
            y: ((posOne.x - posTwo.x) * dataTwo - (posTwo.x - posThree.x) * dataOne) / dataThree,
          };
        }
      }
    },
  };
  main.line = {
    slope: function (start, end) {
      return (end.y - start.y) / (end.x - start.x);
    },
    intersect: function (pos1Start, pos1End, pos2Start, pos2End) {
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
        if ((pos1Start.x - pos2Start.x) * (pos1Start.y - pos2End.y) - (pos1Start.x - pos2End.x) * (pos1Start.y - pos2Start.y) === 0 ||
        (pos1End.x - pos2Start.x) * (pos1End.y - pos2End.y) - (pos1End.x - pos2End.x) * (pos1End.y - pos2Start.y) === 0) {
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
    distance: function (type, start, end, position, square) {
      //http://stackoverflow.com/questions/31346862/
      //http://stackoverflow.com/questions/849211/
      if (type === true) {
        //perpendicular distance
        return Math.abs((end.y - start.y) * position.x - (end.x - start.x) * position.y + end.x * start.y - end.y * start.x) / main.point.distance(true, start, end, true);
      } else {
        var l2 = main.point.distance(true, start, end, false);
        if (l2 === 0) {
          return main.point.distance(true, position, start, false);
        }
        var t = ((position.x - start.x) * (end.x - start.x) + (position.y - start.y) * (end.y - start.y)) / l2;
        t = Math.max(0, Math.min(1, t));
        return main.point.distance(true, position, {
          x: start.x + t * (end.x - start.x),
          y: start.y + t * (end.y - start.y)
        }, square);
      }
    },
    on: function (start, end, location) {
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
    between: function(start, end, position) {
      //http://stackoverflow.com/questions/14371841
      var dist1 = main.point.distance(true, start, position, true),
          dist2 = main.point.distance(true, end, position, true),
          dist5 = main.point.distance(true, start, end, false);
      var delta = dist1 + (dist2 - dist1) / 2;
      var dist3 = dist1 * dist1 - delta * delta,
          dist4 = dist2 * dist2 - delta * delta;
      return !(dist3 > dist5 || dist4 > dist5);
    },
    getX: function (posOne, posTwo, yValue) {
      var a_numberator = posTwo.y - posOne.y;
      var a_denominator = posTwo.x - posOne.x;
      if (a_numberator === 0) {
        return null;//posTwo.x; //parallel
      } else {
        var a = a_numberator / a_denominator;
        var yDist = yValue - posTwo.y;
        var xDist = yDist / a;
        var x3 = posTwo.x + xDist;
        return x3;
      }
    },
    getY: function (posOne, posTwo, xValue) {
      var a_numberator = posTwo.y - posOne.y;
      var a_denominator = posTwo.x - posOne.x;
      if (a_denominator === 0) {
        return null;//posTwo.y;
      } else {
        var a = a_numberator / a_denominator;
        var xDist = xValue - posTwo.x;
        var yDist = xDist * a;
        var y3 = posTwo.y + yDist;
        return y3;
      }
    },
  };
  main.vector = {
    //http://www.metanetsoftware.com/technique/tutorialA.html (also tutorialB)
    pol: function (data) {
      return {
        angle: main.angle.point({x: 0, y: 0}, data),
        radial: main.point.distance(true, {x: 0, y: 0}, data, true),
      };
    },
    rec: function (data, position) {
      position = position || {};
      position.x = position.x || 0;
      position.y = position.y || 0;
      return {
        x: Math.cos(data.angle) * data.radial + position.x,
        y: Math.sin(data.angle) * data.radial + position.y,
      };
    },
    normalize: function (vector) {
      var length = main.vector.magnitude(vector, true);
      return {
        x: vector.x / length,
        y: vector.y / length,
      };
    },
    scale: function (vector, scale) {
      return {
        x: vector.x * scale,
        y: vector.y * scale,
      };
    },
    truncate: function (vector, max) {
      var scale = max / main.vector.magnitude(vector);
      scale = scale < 1.0 ? scale : 1.0;
      return main.vector.scale(vector, scale);
    },
    magnitude: function (vector, square) {
      var tempUnSq = main.vector.dot(vector, vector);
      if (square) {
        return Math.sqrt(tempUnSq);
      } else {
        return tempUnSq;
      }
    },
    on: function (dataOne, dataTwo, location) {
      if ((dataOne.angle || dataOne.radial) && !(dataOne.x || dataOne.y)) {
        dataOne.x = Math.cos(dataOne.angle) * dataOne.radial;
        dataOne.y = Math.sin(dataOne.angle) * dataOne.radial;
      }
      if ((dataTwo.angle || dataTwo.radial) && !(dataTwo.x || dataTwo.x)) {
        dataTwo.x = Math.cos(dataTwo.angle) * dataTwo.radial;
        dataTwo.y = Math.sin(dataTwo.angle) * dataTwo.radial;
      }
      return main.line.on(dataOne, dataTwo, location || 0.5);
    },
    dot: function (vecOne, vecTwo) {
      //Heavily related to cosine
      return vecOne.x * vecTwo.x + vecOne.y * vecTwo.y;
    },
    cross: function (vecOne, vecTwo) {
      //Heavily related to sine
      return vecOne.x * vecTwo.y - vecOne.y * vecTwo.x;
    },
    projection: function (vecOne, vecTwo) {
      return main.vector.scale(vecTwo, main.vector.dot(vecOne, vecTwo) / main.vector.magnitude(vecTwo, false)); //length vecTwo squared?
      //If b is the unit vector, distance = 1, and thus a projected onto b reduces to: proj.x = dotproduct*b.x; proj.y = dotproduct*b.y;
    },
    per: function (vector) {
      return {
        x1: -vector.y, //right
        y1: vector.x,
        x2: vector.y, //left
        y2: -vector.x,
      };
    },
    lerp: function (vecOne, vecTwo, fraction) {
      return {
        x: (vecTwo.x - vecOne.x) * fraction + vecOne.x,
        y: (vecTwo.y - vecOne.y) * fraction + vecOne.y,
      };
    },
    heading: function (vector) {
      return -Math.atan2(-vector.y, vector.x);
    },
    reverse: function (vector) {
      return {
        x: -vector.x,
        y: -vector.y,
      };
    },
  };
  main.trig = {
    crd: function (value) {
      return 2 * Math.sin(value / 2);
    },
    exsec: function (value) {
      return main.trig.sec(value) - 1;
    },
    excsc: function (value) {
      return main.trig.csc(value) - 1;
    },
    aexsec: function (value) {
      return main.trig.asec(value + 1);
    },
    aexcsc: function (value) {
      return main.trig.acsc(value + 1);
    },
    vsin: function (value) {
      return 1 - Math.cos(value);
    },
    vcos: function (value) {
      return 1 + Math.cos(value);
    },
    cvsin: function (value) {
      return 1 - Math.sin(value);
    },
    cvcos: function (value) {
      return 1 + Math.sin(value);
    },
    hvsin: function (value) {
      return main.trig.vsin(value) / 2;
    },
    hvcos: function (value) {
      return main.trig.vcos(value) / 2;
    },
    hcvsin: function (value) {
      return main.trig.cvsin(value) / 2;
    },
    hcvcos: function (value) {
      return main.trig.cvcos(value) / 2;
    },
    avsin: function (value) {
      return Math.acos(1 - value);
    },
    avcos: function (value) {
      return Math.acos(1 + value);
    },
    acvsin: function (value) {
      return Math.asin(1 - value);
    },
    acvcos: function (value) {
      return Math.asin(1 + value);
    },
    ahvsin: function (value) {
      return 2 * Math.asin(Math.sqrt(value));
    },
    ahvcos: function (value) {
      return 2 * Math.acos(Math.sqrt(value));
    },
    csc: function (value) {
      return 1 / Math.sin(value);
    },
    csch: function (value) {
      return 1 / Math.sinh(value);
    },
    sec: function (value) {
      return 1 / Math.cos(value);
    },
    sech: function (value) {
      return 1 / Math.cosh(value);
    },
    cot: function (value) {
      return 1 / Math.tan(value);
    },
    coth: function (value) {
      return 1 / Math.tanh(value);
    },
    acsc: function (value) {
      return 1 / Math.asin(value);
    },
    acsch: function (value) {
      return 1 / Math.asinh(value);
    },
    asec: function (value) {
      return 1 / Math.acos(value);
    },
    asech: function (value) {
      return 1 / Math.acosh(value);
    },
    acot: function (value) {
      return 1 / Math.atan(value);
    },
    acoth: function (value) {
      return 1 / Math.atanh(value);
    },
  };
  main.interpolate = {
    linear: function (start, end, time) {
      return start + time * (end - start);
    },
    smoothStep: function (order, start, end, time) {
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
            result += (main.math.pascalTriangle(-order, n) * main.math.pascalTriangle(2 * order - 1, order - n - 1) * Math.pow(time, order + n));
          }
          return main.interpolate.linear(start, end, result);
        }
      }
    },
    acceleration: function (start, end, time) {
      var temp = Math.pow(time, 2);
      return (end * temp) + (start * (1 - temp));
    },
    deceleration: function (start, end, time) {
      //var temp = 1 - (1 - time) * (1 - time);
      var temp = 1 - Math.pow(1 - time, 2);
      return (end * temp) + (start * (1 - temp));
    },
    overShoot: function (start, end, time, magnitude) {
      time = main.interpolate.deceleration(0, 1, time);
      return start + time * (end-start) * (1 + Math.sin(time * Math.PI) * magnitude); //180 in sin?
    },
  };
  
  //Advanced stuff
  main.advanced = {
    debugMode: function () {
      debugger;
    },
    process:  process,
    data: data,
    temp: temp,
  };

  //Plugin class
  main.plugins = {
    projectile: function (type, data) {
      main.projectile[type] = data;
    },
    utils: function (type, data) {
      main.utils[type] = data;
    },
    math: function (type, data) {
      main.math[type] = data;
    },
    main: function (type, data) {
      main[type] = data;
    },
  };

  //Do not touch these code
  if (typeof define === 'function' && define.amd) {
    define(function () {
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

(function () {
  var getTime;
  (function () {
    if (window.performance && (window.performance.now || window.performance.webkitNow)) {
      var perfNow = window.performance.now ? 'now' : 'webkitNow';
      getTime = window.performance[perfNow].bind(window.performance);
    } else {
      getTime = function () {
        return +new Date();
      };
    }
  }());
  var configs = {
    smoothing: 10,
    maxMs: 0,
  };
  var time,
      thisFrameTime = 0,
      lastLoop = getTime() - configs.maxMs,
      frameTime = configs.maxMs, //maximum ms
      frameStart = 0; //smooth value
  Shmup.advanced.performance = {
    ms: 0,
    fps: 60,
  };
  Shmup.advanced.performance.configs = function (data) {
    configs.smoothing = data.smoothing || 1;
    configs.maxMs = data.maxMs;
    lastLoop = getTime() - configs.maxMs;
    frameTime = configs.maxMs;
  };
  Shmup.advanced.performance.start = function () {
    frameStart = getTime();
  };
  Shmup.advanced.performance.end = function () {
    time = getTime();
    thisFrameTime = time - lastLoop;
    frameTime += (thisFrameTime - frameTime) / configs.smoothing;
    Shmup.advanced.performance.fps = 1000 / frameTime;
    Shmup.advanced.performance.ms = frameStart < lastLoop ? frameTime : time - frameStart;
    lastLoop = time;
  };
})();

(function (){
  function Pool(object, size, isChange) {
    var data = [], i;
    this.size = size || (function () {
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
  Pool.prototype.get = function (i) {
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
  Pool.prototype.set = function (object) {
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
    var prng = function () {
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

    prng.int32 = function () { return arc4.g(4) | 0; };
    prng.quick = function () { return arc4.g(4) / 0x100000000; };
    prng.double = prng;

    // Mix the randomness into accumulated entropy.
    mixkey(tostring(arc4.S), pool);

    // Calling convention: what to return as a function of prng, seed, is_math.
    return (options.pass || callback ||
        function (prng, seed, is_math_call, state) {
          if (state) {
            // Load the arc4 state from the given state if it has an S array.
            if (state.S) { copy(state, arc4); }
            // Only provide the .state method if requested via options.state.
            prng.state = function () { return copy(arc4, {}); };
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
    (me.g = function (count) {
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
    define(function () { return seedrandom; });
  }

  // End anonymous scope, and pass initial values.
})(
  [],     // pool: entropy pool starts empty
  Math    // math: package containing random, pow, and seedrandom
);
