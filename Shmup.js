(function(window) {
  "use strict";
  var VERSION = "1.0.1";
  
  /*
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
  var flag = {}, //private holder
      commands = {}, //commands holder
      methods = {}, //methods holder
      temp = {}; //temp data holder
  
  //Junk variable, do not touch
  var name, //Class name
      init; //Constructor
  
  //-------------- COMMANDS ZONE --------------
  //Command to set configs data to "flag[name]"
  commands.configs = function(data) {
    //Check error of "data"
    //checkError("", data);
    
    //Set new configs to "flag[name]"
    flag[name].configs = data;
    
    return this;
  };
  
  //Commands to set actions data to "flag[name]"
  commands.actions = function(actionLabel, isFire, data) {
    //Check error if "flag[name].configs" is defined
    //checkError("configs");
    //Create actionlabel list
    
    //Set actions to "flag[name]"
    //Check if actions if defined
    if (!flag[name].actions) {
      flag[name].actions = {};
    }
    
    //Set data to label main action, else set to secondary action
    if (isFire) {
      //Check if main action is defined
      if (!flag[name].actions.fire) {
        flag[name].actions.fire = {};
      }
      //Check if label main action is defined
      if (!flag[name].actions.fire[actionLabel]) {
        flag[name].actions.fire[actionLabel] = data;
      }
    } else {
      //Check if secondary action is defined
      if (!flag[name].actions.ref) {
        flag[name].actions.ref = {};
      }
      //Check if label secondary action is defined
      if (!flag[name].actions.ref[actionLabel]) {
        flag[name].actions.ref[actionLabel] = data;
      }
    }
    
    //Set actions to "temp[name]"
    //Check if temp actions if defined
    if (!temp[name].actions) {
      temp[name].actions = {};
    }
    
    //Set temp data of actions and wait data
    if (isFire) {
       //Check if main action is defined
      if (!temp[name].actions.fire) {
        temp[name].actions.fire = {};
      }
      //Check if label main action is defined
      if (!temp[name].actions.fire[actionLabel]) {
        temp[name].actions.fire[actionLabel] = [];
      }
    } else {
       //Check if secondary action is defined
      if (!temp[name].actions.ref) {
        temp[name].actions.ref = {};
      }
       //Check if label secondary action is defined
      if (!temp[name].actions.ref[actionLabel]) {
        temp[name].actions.ref[actionLabel] = [];
      }
    }
    
    //Set bullets group if not defined
    if (!temp[name].bullets) {
      temp[name].bullets = {};
    }
    //Set bullets label group
    if (!temp[name].bullets[actionLabel]) {
      temp[name].bullets[actionLabel] = {};
    }
    
    //Set fire flag to determite if action is active when frame is updated
    if (isFire) {
      //Check if isFiring object is defined
      if (!temp[name].isFiring) {
        temp[name].isFiring = {};
      }
      //Check if isFiring boolean is defined
      if (!temp[name].isFiring[actionLabel]) {
        temp[name].isFiring[actionLabel] = false;
      }
    }
    
    //Set temp commands
    if (!temp[name].commands) {
      temp[name].commands = {};
    }/*
    if (!temp[name].commands[actionLabel]) {
      temp[name].commands[actionLabel] = undefined;
    }*/
    if (!temp[name].commands[actionLabel]) {
      temp[name].commands[actionLabel] = [{
        location: 0,
        times: 1,
        actions: data,
        label: actionLabel
      }];
    }
    
    //Set wait data
    if (!temp[name].wait) {
      temp[name].wait = {}
    }
    if (!temp[name].wait[actionLabel]) {
      temp[name].wait[actionLabel] = {};
    }
    if (!temp[name].timeOut) {
      temp[name].timeOut = {};
    }
    if (!temp[name].timeOut[actionLabel]) {
      temp[name].timeOut[actionLabel] = {};
    }
    
    //Set repeat data
    if (!temp[name].repeat) {
      temp[name].repeat = {}
    }
    if (!temp[name].repeat[actionLabel]) {
      temp[name].repeat[actionLabel] = {};
    }
    return this;
  };
  
  commands.fire = function(actionLabel) {
    if (!temp[name].isFiring[actionLabel]) {
      temp[name].isFiring[actionLabel] = true;
    }
    if (flag[name].actions.fire[actionLabel]) {
      methods.actions(actionLabel, temp[name].commands[actionLabel][temp[name].commands[actionLabel].length - 1].actions);
    } else {
      
    }
  };
  
  commands.update = function() {
    //Process fire action label data
    for (var actionLabel in temp[name].actions.fire) {
      if (temp[name].timeOut[actionLabel].times > 0) {
        temp[name].timeOut[actionLabel].times --;
      }
      if (temp[name].timeOut[actionLabel].times <= 0 || temp[name].timeOut[actionLabel].times === undefined) {
        debugger;
        //Process to set wait label done to true
        if (temp[name].timeOut[actionLabel].times <= 0) {
          temp[name].timeOut[actionLabel].times = undefined;
          temp[name].wait[actionLabel][temp[name].timeOut[actionLabel].label].done = true;
        }
        methods.actions(actionLabel, temp[name].commands[actionLabel][temp[name].commands[actionLabel].length - 1].actions);
      }
    }
  };
  
  
  //------------- END COMMANDS ZONE -----------
  //--------------- METHODS ZONE --------------
  methods.actions = function(actionLabel, actionData) {
    if (!temp[name].commands[actionLabel]) {
      temp[name].commands[actionLabel] = [{
        location: 0,
        times: 1,
        actions: actionData,
        label: actionLabel
      }];
    }
    var tempData;
    (function mainLoop() {
      while (temp[name].commands[actionLabel][temp[name].commands[actionLabel].length - 1].times > 0) {
        while (temp[name].commands[actionLabel][temp[name].commands[actionLabel].length - 1].location < actionData.length) {
          tempData = methods[actionData[temp[name].commands[actionLabel][temp[name].commands[actionLabel].length- 1].location].func](actionLabel, actionData[temp[name].commands[actionLabel][temp[name].commands[actionLabel].length- 1].location], actionData);
          if (typeof tempData === "string") {
            return;
          }
          temp[name].commands[actionLabel][temp[name].commands[actionLabel].length- 1].location ++;
        }
        temp[name].commands[actionLabel][temp[name].commands[actionLabel].length- 1].location = 0;
        temp[name].commands[actionLabel][temp[name].commands[actionLabel].length- 1].times --;
      }
      try {
        temp[name].repeat[actionLabel][temp[name].commands[actionLabel][temp[name].commands[actionLabel].length - 1].label].done = true;
        temp[name].commands[actionLabel].pop();
        actionData = temp[name].commands[actionLabel][temp[name].commands[actionLabel].length- 1].actions;
        mainLoop();
      } catch (error) {
        
      }
    })();
    if (tempData === "repeat") {
      methods.actions(actionLabel, temp[name].commands[actionLabel][temp[name].commands[actionLabel].length - 1].actions);
    }
  };
  methods.repeat = function(actionLabel, actionCommands, actionData) {
    if (!temp[name].repeat[actionLabel][actionCommands.label]) {
      temp[name].repeat[actionLabel][actionCommands.label] = {};
    }
    temp[name].commands[actionLabel].push({
      actions: actionData[temp[name].commands[actionLabel][temp[name].commands[actionLabel].length- 1].location].actions,
      location: 0,
      times: (function() {
        if (temp[name].repeat[actionLabel][actionCommands.label].done) {
          //Check if in range
          //Check if velocity exist
          if (!actionCommands.velocity) {
            actionCommands.velocity = 0;
          } else {
            //Check if range exist
            if (!actionCommands.range) {
              actionCommands.range = [actionCommands.times, actionCommands.times];
            } else if (actionCommands.range) {
              //Check if range is lower than times
              if (actionCommands.range[0] > actionCommands.times) {
                actionCommands.range[0] = actionCommands.times;
              }
              if (actionCommands.range[1] < actionCommands.times) {
                actionCommands.range[1] = actionCommands.times;
              }
              //Process range
              if (temp[name].repeat[actionLabel][actionCommands.label].times >= actionCommands.range[0] && temp[name].repeat[actionLabel][actionCommands.label].times <= actionCommands.range[1]) {
                temp[name].repeat[actionLabel][actionCommands.label].times += actionCommands.velocity;
              }
              if (temp[name].repeat[actionLabel][actionCommands.label].times < actionCommands.range[0]) {
                temp[name].repeat[actionLabel][actionCommands.label].times = actionCommands.range[0];
              } else if (temp[name].repeat[actionLabel][actionCommands.label].times > actionCommands.range[1]) {
                temp[name].repeat[actionLabel][actionCommands.label].times = actionCommands.range[1];
              }
            }
          }
        } else {
          temp[name].repeat[actionLabel][actionCommands.label].times = actionCommands.times;
        }
        return temp[name].repeat[actionLabel][actionCommands.label].times;
      })(),//,
      label: actionCommands.label || (function() {
        var tempString = randomString();
        actionCommands.label = tempString;
        return tempString;
      })(),
    });
    temp[name].commands[actionLabel][temp[name].commands[actionLabel].length - 2].location ++;
    return "repeat";
  };
  methods.wait = function(actionLabel, actionCommands) {
    //Check if label is defined
    if (!actionCommands.label) {
      actionCommands.label = randomString();
    }
    //Set wait label group
    if (!temp[name].wait[actionLabel][actionCommands.label]) {
      temp[name].wait[actionLabel][actionCommands.label] = {};
    }
    //Check if previous wait is called
    if (temp[name].wait[actionLabel][actionCommands.label].done) {
      //Check if in range
      //Check if velocity exist
      if (!actionCommands.velocity) {
        actionCommands.velocity = 0;
      } else {
        //Check if range exist
        if (!actionCommands.range) {
          actionCommands.range = [actionCommands.times, actionCommands.times];
        } else if (actionCommands.range) {
          //Check if range is lower than times
          if (actionCommands.range[0] > actionCommands.times) {
            actionCommands.range[0] = actionCommands.times;
          }
          if (actionCommands.range[1] < actionCommands.times) {
            actionCommands.range[1] = actionCommands.times;
          }
          //Process range
          if (temp[name].wait[actionLabel][actionCommands.label].times >= actionCommands.range[0] && temp[name].wait[actionLabel][actionCommands.label].times <= actionCommands.range[1]) {
            temp[name].wait[actionLabel][actionCommands.label].times += actionCommands.velocity;
          }
          if (temp[name].wait[actionLabel][actionCommands.label].times < actionCommands.range[0]) {
            temp[name].wait[actionLabel][actionCommands.label].times = actionCommands.range[0];
          } else if (temp[name].wait[actionLabel][actionCommands.label].times > actionCommands.range[1]) {
            temp[name].wait[actionLabel][actionCommands.label].times = actionCommands.range[1];
          }
        }
      }
    } else {
      temp[name].wait[actionLabel][actionCommands.label].times = actionCommands.times;
    }
    temp[name].timeOut[actionLabel].label = actionCommands.label;
    temp[name].timeOut[actionLabel].times = temp[name].wait[actionLabel][actionCommands.label].times;
    temp[name].commands[actionLabel][temp[name].commands[actionLabel].length - 1].location ++;
    return "wait";
  };
  methods.fire = function(actionLabel, actionCommands) {
    
  };
  methods.vanish = function(actionLabel, actionCommands) {
    
  };
  methods.change = function(actionLabel, actionCommands) {
    
  };
  methods.func = function(actionLabel, actionCommands) {
    actionCommands.callback();
    return;
  };
  //------------- END METHODS ZONE ------------
  //------------ OTHER STUFF ZONE -------------
  //Helper function
  function randomString() {
    return (Math.random() * 1e36).toString(36);
  }
  //Math function
  function getAngle(angle) {
    if (flag[name].configs.angleType) {
      flag[name].configs.angleType = "degree";
    }
    if (runFunc(flag[name].configs.angleType, true) === "degree") {
      return Math.degToRad((Math.normalizeDegree(angle)));
    } else if (runFunc(flag[name].configs.angleType, true) === "radian") {
      return Math.normalizeRadian(angle);
    }
  }
  function angleAtoB(a, b) {
    return Math.atan2(b[1] - a[1], b[0] - a[0]);
  }
  Math.normalizeRadian = function(radian) {
    radian = radian % (Math.PI * 2);
    while (radian <= -Math.PI) {
      radian += Math.PI * 2;
    }
    while (Math.PI < radian) {
      radian -= Math.PI * 2;
    }
    return radian;
  };
  Math.normalizeDegree = function(degree) {
    degree = degree % 360;
    while (degree <= 0) {
      degree += 360;
    }
    while (180 < degree) {
      degree -= 360;
    }
    return degree;
  };
  Math.pythagoreanPos = function(a, b) {
    return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
  };
  Math.radToDeg = function(radian) {
    radian = radian % (Math.PI * 2);
    return radian * (180 / Math.PI);
  };
  Math.degToRad = function(degree) {
    degree = degree % 360;
    return degree * (Math.PI / 180);
  };
  //Do not touch these code
  init = function(_name) {
    name = _name;
    if (!flag[name]) {
      flag[name] = {};
    }
    if (!temp[name]) {
      temp[name] = {};
    }
    return commands;
  };
  if (typeof define === 'function' && define.amd) {
    define(function() {
      return init;
    });
    return;
  }
  if ('undefined' !== typeof module && module.exports) {
    module.exports = init;
    return;
  }
  window.Shmup = init;
}(('undefined' !== typeof window) ? window : {}));
