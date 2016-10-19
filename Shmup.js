(function(window) {
  "use strict";
  var VERSION = "1.0.3";
  
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
  
  //TODO: fix getAngle to process raw direction data
  
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
  commands.configs = function(configsData) {
    //Check error of "data"
    //checkError("", data);
    
    //Set new configs to "flag[name]"
    flag[name].configs = configsData;
    
    return this;
  };
  
  //Commands to set actions data to "flag[name]"
  commands.actions = function(actionLabel, isFire, actionData) {
    //Check error if "flag[name].configs" is defined
    //checkError("configs");
    //Create actionlabel list
    
    //Set actions to "flag[name]"
    //Check if actions if defined
    if (!flag[name].actions) {
      flag[name].actions = {};
    }
    
    //Set actionData to label main action, else set to secondary action
    if (isFire) {
      //Check if main action is defined
      if (!flag[name].actions.fire) {
        flag[name].actions.fire = {};
      }
      //Check if label main action is defined
      if (!flag[name].actions.fire[actionLabel]) {
        flag[name].actions.fire[actionLabel] = actionData;
      }
    } else {
      //Check if secondary action is defined
      if (!flag[name].actions.ref) {
        flag[name].actions.ref = {};
      }
      //Check if label secondary action is defined
      if (!flag[name].actions.ref[actionLabel]) {
        flag[name].actions.ref[actionLabel] = actionData;
      }
    }
    
    //Set actions to "temp[name]"
    //Check if temp actions if defined
    if (!temp[name].actions) {
      temp[name].actions = {};
    }
    
    //Set temp actionData of actions and wait actionData
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
    
    //Set fire group
    if (!temp[name].fire) {
      temp[name].fire = {};
    }
    if (!temp[name].fire[actionLabel]) {
      temp[name].fire[actionLabel] = {};
    }
    
    //Set isFiring flag to determite if action is active when frame is updated
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
        actions: actionData,
        label: actionLabel
      }];
    }
    
    //Set wait actionData
    if (!temp[name].wait) {
      temp[name].wait = {};
    }
    if (!temp[name].wait.fire) {
      temp[name].wait.fire = {};
    }
    if (!temp[name].wait.ref) {
      temp[name].wait.ref = {};
    }
    if (!temp[name].wait.fire[actionLabel] && isFire) {
      temp[name].wait.fire[actionLabel] = {};
    } else if (!temp[name].wait.ref[actionLabel]) {
      temp[name].wait.ref[actionLabel] = {};
    }
    if (!temp[name].timeOut) {
      temp[name].timeOut = {};
    }
    if (!temp[name].timeOut[actionLabel]) {
      temp[name].timeOut[actionLabel] = {};
    }
    
    //Set repeat actionData
    if (!temp[name].repeat) {
      temp[name].repeat = {};
    }
    if (!temp[name].repeat.fire) {
      temp[name].repeat.fire = {};
    }
    if (!temp[name].repeat.ref) {
      temp[name].repeat.ref = {};
    }
    if (!temp[name].repeat.fire[actionLabel] && isFire) {
      temp[name].repeat.fire[actionLabel] = {};
    } else if (!temp[name].repeat.ref[actionLabel]) {
      temp[name].repeat.ref[actionLabel] = {};
    }
    
    //Set isFire actionData
    if (!temp[name].isFiring) {
      temp[name].isFiring = {};
    }
    if (!temp[name].isFiring[actionLabel] && isFire === true) {
      temp[name].isFiring[actionLabel] = false;
    }
    return this;
  };
  
  commands.fire = function(actionLabel) {
    if (temp[name].isFiring[actionLabel] === false) {
      temp[name].isFiring[actionLabel] = true;
    }
    if (flag[name].actions.fire[actionLabel]) {
      methods.actions(actionLabel, undefined, temp[name].commands[actionLabel][temp[name].commands[actionLabel].length - 1].actions, temp[name].commands[actionLabel]);
    } else {
      throw new Error("Undefined actions of " + actionLabel);
    }
  };
  
  commands.update = function() {
    //Process fire action label data
    for (var actionLabel in temp[name].actions.fire) {
      if (temp[name].isFiring[actionLabel] === true) {
        if (temp[name].timeOut[actionLabel].times > 0) {
          temp[name].timeOut[actionLabel].times --;
        }
        if ((temp[name].timeOut[actionLabel].times <= 0 || temp[name].timeOut[actionLabel].times === undefined)) {
          debugger;
          //Process to set wait label done to true
          if (temp[name].timeOut[actionLabel].times <= 0) {
            temp[name].timeOut[actionLabel].times = undefined;
            temp[name].wait.fire[actionLabel][temp[name].timeOut[actionLabel].label].done = true;
          }
          methods.actions(actionLabel, undefined, temp[name].commands[actionLabel][temp[name].commands[actionLabel].length - 1].actions, temp[name].commands[actionLabel]);
        }
      }
      //Draw bullet
      for (var bulletLabel in temp[name].bullets[actionLabel]) {
        for (var bulletCount = 0; bulletCount < temp[name].bullets[actionLabel][bulletLabel].length; bulletCount ++) {
          var tempBullet = temp[name].bullets[actionLabel][bulletLabel][bulletCount];
          //process draw bullet data
          tempBullet = drawBullet(tempBullet);
          //Process actionRef
          if (tempBullet.actionRef) {
            if (tempBullet.wait.times > 0) {
              tempBullet.wait.times --;
            }
            if ((tempBullet.wait.times <= 0 || tempBullet.wait.times === undefined)) {
              debugger;
              //Process to set wait label done to true
              if (tempBullet.wait.times <= 0) {
                tempBullet.wait.times = undefined;
                temp[name].wait.ref[tempBullet.actionRef][tempBullet.wait.label][tempBullet.flag].done = true;
              }
              methods.actionRef(tempBullet.actionRef, undefined, tempBullet.commands[tempBullet.commands.length - 1].actions, tempBullet.commands, tempBullet, actionLabel);
            }
          }
          //Draw bullet
          flag[name].configs.shot[tempBullet.type].draw(tempBullet);
        }
      }
    }
  };
  
  //------------- END COMMANDS ZONE -----------
  //--------------- METHODS ZONE --------------
  methods.actions = function(actionLabel, actionCommands, actionData, tempCommands) {
    if (!tempCommands) {
      tempCommands = [{
        location: 0,
        times: 1,
        actions: actionData,
        label: actionLabel
      }];
    }
    var tempData;
    (function mainLoop() {
      while (tempCommands[tempCommands.length - 1].times > 0) {
        while (tempCommands[tempCommands.length - 1].location < actionData.length) {
          tempData = methods[actionData[tempCommands[tempCommands.length- 1].location].func](actionLabel, actionData[tempCommands[tempCommands.length- 1].location], actionData, tempCommands, undefined, actionLabel);
          if (typeof tempData === "string") {
            return;
          }
          tempCommands[tempCommands.length- 1].location ++;
        }
        tempCommands[tempCommands.length- 1].location = 0;
        tempCommands[tempCommands.length- 1].times --;
      }
      try {
        temp[name].repeat.fire[actionLabel][tempCommands[tempCommands.length - 1].label].done = true;
        tempCommands.pop();
        if (tempCommands.length <= 1) {
          temp[name].isFiring[actionLabel] = false;
          return;
        }
        actionData = tempCommands[tempCommands.length- 1].actions;
        mainLoop();
      } catch (error) {
        
      }
    })();
    if (tempData === "repeat") {
      methods.actions(actionLabel, actionCommands, tempCommands[tempCommands.length - 1].actions, tempCommands);
    }
  };
  methods.repeat = function(actionLabel, actionCommands, actionData, tempCommands) {
    //Check if label is defined
    if (!actionCommands.label) {
      actionCommands.label = randomString();
    }
    if (!temp[name].repeat.fire[actionLabel][actionCommands.label]) {
      temp[name].repeat.fire[actionLabel][actionCommands.label] = {};
    }
    tempCommands.push({
      actions: actionData[tempCommands[tempCommands.length- 1].location].actions,
      location: 0,
      times: (function() {
        if (temp[name].repeat.fire[actionLabel][actionCommands.label].done) {
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
              if (temp[name].repeat.fire[actionLabel][actionCommands.label].times >= actionCommands.range[0] && temp[name].repeat.fire[actionLabel][actionCommands.label].times <= actionCommands.range[1]) {
                temp[name].repeat.fire[actionLabel][actionCommands.label].times += actionCommands.velocity;
              }
              if (temp[name].repeat.fire[actionLabel][actionCommands.label].times < actionCommands.range[0]) {
                temp[name].repeat.fire[actionLabel][actionCommands.label].times = actionCommands.range[0];
              } else if (temp[name].repeat.fire[actionLabel][actionCommands.label].times > actionCommands.range[1]) {
                temp[name].repeat.fire[actionLabel][actionCommands.label].times = actionCommands.range[1];
              }
            }
          }
        } else {
          temp[name].repeat.fire[actionLabel][actionCommands.label].times = actionCommands.times;
        }
        return temp[name].repeat.fire[actionLabel][actionCommands.label].times;
      })(),//,
      label: actionCommands.label || (function() {
        var tempString = randomString();
        actionCommands.label = tempString;
        return tempString;
      })(),
    });
    tempCommands[tempCommands.length - 2].location ++;
    return "repeat";
  };
  methods.wait = function(actionLabel, actionCommands, actionData, tempCommands) {
    //Check if label is defined
    if (!actionCommands.label) {
      actionCommands.label = randomString();
    }
    //Set wait label group
    if (!temp[name].wait.fire[actionLabel][actionCommands.label]) {
      temp[name].wait.fire[actionLabel][actionCommands.label] = {};
    }
    //Check if previous wait is called
    if (temp[name].wait.fire[actionLabel][actionCommands.label].done) {
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
          if (temp[name].wait.fire[actionLabel][actionCommands.label].times >= actionCommands.range[0] && temp[name].wait.fire[actionLabel][actionCommands.label].times <= actionCommands.range[1]) {
            temp[name].wait.fire[actionLabel][actionCommands.label].times += actionCommands.velocity;
          }
          if (temp[name].wait.fire[actionLabel][actionCommands.label].times < actionCommands.range[0]) {
            temp[name].wait.fire[actionLabel][actionCommands.label].times = actionCommands.range[0];
          } else if (temp[name].wait.fire[actionLabel][actionCommands.label].times > actionCommands.range[1]) {
            temp[name].wait.fire[actionLabel][actionCommands.label].times = actionCommands.range[1];
          }
        }
      }
    } else {
      temp[name].wait.fire[actionLabel][actionCommands.label].times = actionCommands.times;
    }
    temp[name].timeOut[actionLabel].label = actionCommands.label;
    temp[name].timeOut[actionLabel].times = temp[name].wait.fire[actionLabel][actionCommands.label].times;
    tempCommands[tempCommands.length - 1].location ++;
    return "wait";
  };
  methods.fire = function(actionLabel, actionCommands, actionData, tempCommands, tempBulletInput, mainActionLabel) {
    //Set label
    if (!actionCommands.label) {
      actionCommands.label = randomString();
    }
    //Set bullet group
    if (!temp[name].bullets[mainActionLabel][actionCommands.label]) {
      temp[name].bullets[mainActionLabel][actionCommands.label] = [];
    }
    //Set fire group
    if (!temp[name].fire[actionLabel][actionCommands.label]) {
      temp[name].fire[actionLabel][actionCommands.label] = {
        direction: undefined,
        speed: {
          horizontal: 0,
          vertical: 0
        }
      };
    }
    //Create new bullet
    var tempBullet = {
      type: actionCommands.type,
      label: actionCommands.label,
      position: {
        now: undefined,
      },
      wait: {},
      flag: randomString(),
    };
    //Check for actionRef
    if (actionCommands.actionRef) {
      tempBullet.actionRef = actionCommands.actionRef;
      tempBullet.commands = [{
        location: 0,
        times: 1,
        actions: flag[name].actions.ref[actionCommands.actionRef],
        label: actionLabel
      }];
    }
    //Check for movement
    if (actionCommands.movement) {
      tempBullet.movement = actionCommands.movement;
    } else {
      //Check for position now and end
      if (actionCommands.position.now) {
        tempBullet.position.now = actionCommands.position.now;
      } else {
        tempBullet.position.now = flag[name].configs.position();
      }
      if (actionCommands.position.end) {
        tempBullet.position.end = actionCommands.position.end;
        tempBullet.direction.value = getAngle(angleAtoB(tempBullet.position.now, tempBullet.position.end));
      } else if (actionCommands.direction) {
        if (!tempBullet.direction) {
          tempBullet.direction = {};
        }
        switch (actionCommands.direction.type) {
          case "aim": {
            tempBullet.direction.value = getAngle(angleAtoB(tempBullet.position.now, flag[name].configs.target()));
          }
          break;
          case "absolute": {
            tempBullet.direction.value = getAngle(actionCommands.direction.value);
          }
          break;
          case "sequence": {
            if (!temp[name].fire[actionLabel][actionCommands.label].direction || typeof temp[name].fire[actionLabel][actionCommands.label].direction !== "number") {
              temp[name].fire[actionLabel][actionCommands.label].direction = getAngle(actionCommands.direction.value);
            } else if (typeof temp[name].fire[actionLabel][actionCommands.label].direction === "number") {
              temp[name].fire[actionLabel][actionCommands.label].direction += getAngle(actionCommands.direction.value);
            }
            tempBullet.direction.value = getAngle(temp[name].fire[actionLabel][actionCommands.label].direction);
          }
          break;
          case "relative": {
            //Check if is ref
            if (flag[name].actions.ref[actionLabel]) {
              tempBullet.direction.value = getAngle(actionCommands.direction.value);
              tempBullet.direction.value += getAngle(tempBulletInput.direction.value);
            } else {
              throw new Error("Relative must be use in actionRef");
            }
          }
          break;
          default: {
            tempBullet.direction.value = 0;
          }
        }
        //Calculate velocity and put velocity tag
        if (actionCommands.direction.velocity) {
          if (!tempBullet.direction.velocity) {
            tempBullet.direction.velocity = {};
          }
          if (!tempBullet.direction.velocity.range) {
            tempBullet.direction.velocity.range = [];
          }
          if (typeof actionCommands.direction.velocity.value === "number") {
            tempBullet.direction.velocity.value = getAngle(actionCommands.direction.velocity.value);
          } else {
            tempBullet.direction.velocity.value = 0;
          }
          if (Array.isArray(actionCommands.direction.velocity.range)) {
            //Check if range is out of bound
            if (actionCommands.direction.velocity.range[0] > tempBullet.direction.value || actionCommands.direction.velocity.range[1] < tempBullet.direction.value) {
              if (actionCommands.direction.velocity.range[0] > tempBullet.direction.value) {
                tempBullet.direction.velocity.range[0] = getAngle(tempBullet.direction.value);
              } else {
                tempBullet.direction.velocity.range[0] = actionCommands.direction.velocity.range[0];
              }
              if (actionCommands.direction.velocity.range[1] < getAngle(tempBullet.direction.value)) {
                tempBullet.direction.velocity.range[1] = getAngle(tempBullet.direction.value);
              } else {
                tempBullet.direction.velocity.range[1] = actionCommands.direction.velocity.range[1];
              }
            } else {
              tempBullet.direction.velocity.range = actionCommands.direction.velocity.range;
            }
          } else {
            tempBullet.direction.velocity.range = [tempBullet.direction.velocity.value, tempBullet.direction.velocity.value];
          }
        }
      } else {
        throw new Error("Invalid fire direction");
      }
      if (actionCommands.speed) {
        switch (actionCommands.speed.horizontal.type) {
          case "absolute": {
            tempBullet.speed.horizontal = actionCommands.speed.horizontal.value;
          }
          break;
          case "sequence": {
            if (!temp[name].fire[actionLabel][actionCommands.label].speed.horizontal || typeof temp[name].fire[actionLabel][actionCommands.label].speed.horizontal !== "number") {
              temp[name].fire[actionLabel][actionCommands.label].speed.horizontal = actionCommands.speed.horizontal.value;
            } else if (typeof temp[name].fire[actionLabel][actionCommands.label].speed.horizontal === "number") {
              temp[name].fire[actionLabel][actionCommands.label].speed.horizontal += actionCommands.speed.horizontal.value;
            }
            tempBullet.speed.horizontal = temp[name].fire[actionLabel][actionCommands.label].speed.horizontal;
          }
          break;
          case "relative": {
            //Check if is ref
            if (flag[name].actions.ref[actionLabel]) {
              tempBullet.speed.horizontal = actionCommands.speed.horizontal.value;
              tempBullet.speed.horizontal += tempBulletInput.speed.horizontal.value;
            } else {
              throw new Error("Relative must be use in actionRef");
            }
          }
          break;
          default: {
            tempBullet.speed.horizontal = 1;
          }
        }
        switch (actionCommands.speed.vertical.type) {
          case "absolute": {
            tempBullet.speed.vertical = actionCommands.speed.vertical.value;
          }
          break;
          case "sequence": {
            if (!temp[name].fire[actionLabel][actionCommands.label].speed.vertical || typeof temp[name].fire[actionLabel][actionCommands.label].speed.vertical !== "number") {
              temp[name].fire[actionLabel][actionCommands.label].speed.vertical = actionCommands.speed.vertical.value;
            } else if (typeof temp[name].fire[actionLabel][actionCommands.label].speed.vertical === "number") {
              temp[name].fire[actionLabel][actionCommands.label].speed.vertical += actionCommands.speed.vertical.value;
            }
            tempBullet.speed.vertical = temp[name].fire[actionLabel][actionCommands.label].speed.vertical;
          }
          break;
          case "relative": {
            //Check if is ref
            if (flag[name].actions.ref[actionLabel]) {
              tempBullet.speed.vertical = actionCommands.speed.vertical.value;
              tempBullet.speed.vertical += tempBulletInput.speed.vertical.value;
            } else {
              throw new Error("Relative must be use in actionRef");
            }
          }
          break;
          default: {
            tempBullet.speed.vertical = 1;
          }
        }
        if (actionCommands.speed.velocity) {
          if (!tempBullet.speed.velocity) {
            tempBullet.direction.velocity = {};
          }
          if (!tempBullet.speed.velocity.horizontal) {
            tempBullet.speed.velocity.horizontal = {};
          }
          if (!tempBullet.speed.velocity.horizontal.range) {
            tempBullet.speed.velocity.horizontal.range = [];
          }
          if (typeof actionCommands.speed.velocity.horizontal.value === "number") {
            tempBullet.speed.velocity.horizontal.value = actionCommands.speed.velocity.horizontal.value;
          } else {
            tempBullet.speed.velocity.horizontal.value = 0;
          }
          if (Array.isArray(actionCommands.speed.velocity.horizontal.range)) {
            //Check if range is out of bound
            if (actionCommands.speed.velocity.horizontal.range[0] > tempBullet.speed.horizontal || actionCommands.speed.velocity.horizontal.range[1] < tempBullet.speed.horizontal) {
              if (actionCommands.speed.velocity.horizontal.range[0] > tempBullet.speed.horizontal) {
                tempBullet.speed.velocity.horizontal.range[0] = tempBullet.speed.horizontal;
              } else {
                tempBullet.speed.velocity.horizontal.range[0] = actionCommands.speed.velocity.horizontal.range[0];
              }
              if (actionCommands.speed.velocity.horizontal.range[1] < tempBullet.speed.horizontal) {
                tempBullet.speed.velocity.horizontal.range[1] = tempBullet.speed.horizontal;
              } else {
                tempBullet.speed.velocity.horizontal.range[1] = actionCommands.speed.velocity.horizontal.range[1];
              }
            } else {
              tempBullet.speed.velocity.horizontal.range = actionCommands.speed.velocity.horizontal.range;
            }
          } else {
            tempBullet.speed.velocity.horizontal.range = [tempBullet.speed.velocity.horizontal, tempBullet.speed.velocity.horizontal];
          }
          if (!tempBullet.speed.velocity.vertical) {
            tempBullet.speed.velocity.vertical = {};
          }
          if (!tempBullet.speed.velocity.vertical.range) {
            tempBullet.speed.velocity.vertical.range = [];
          }
          if (typeof actionCommands.speed.velocity.vertical.value === "number") {
            tempBullet.speed.velocity.vertical.value = actionCommands.speed.velocity.vertical.value;
          } else {
            tempBullet.speed.velocity.vertical.value = 0;
          }
          if (Array.isArray(actionCommands.speed.velocity.vertical.range)) {
            //Check if range is out of bound
            if (actionCommands.speed.velocity.vertical.range[0] > tempBullet.speed.vertical || actionCommands.speed.velocity.vertical.range[1] < tempBullet.speed.vertical) {
              if (actionCommands.speed.velocity.vertical.range[0] > tempBullet.speed.vertical) {
                tempBullet.speed.velocity.vertical.range[0] = tempBullet.speed.vertical;
              } else {
                tempBullet.speed.velocity.vertical.range[0] = actionCommands.speed.velocity.vertical.range[0];
              }
              if (actionCommands.speed.velocity.vertical.range[1] < tempBullet.speed.vertical) {
                tempBullet.speed.velocity.vertical.range[1] = tempBullet.speed.vertical;
              } else {
                tempBullet.speed.velocity.vertical.range[1] = actionCommands.speed.velocity.vertical.range[1];
              }
            } else {
              tempBullet.speed.velocity.vertical.range = actionCommands.speed.velocity.vertical.range;
            }
          } else {
            tempBullet.speed.velocity.vertical.range = [tempBullet.speed.velocity.vertical, tempBullet.speed.velocity.vertical];
          }
        }
      } else {
        throw new Error("Invalid fire speed");
      }
    }
    temp[name].bullets[mainActionLabel][actionCommands.label].push(tempBullet);
    tempBullet = temp[name].bullets[mainActionLabel][actionCommands.label][temp[name].bullets[mainActionLabel][actionCommands.label].length - 1];
    if (tempBullet.actionRef) {
      tempBullet = drawBullet(tempBullet);
      methods.actionRef(tempBullet.actionRef, undefined, tempBullet.commands[tempBullet.commands.length - 1].actions, tempBullet.commands, tempBullet, mainActionLabel);
    }
  };
  methods.vanish = function(actionLabel, actionCommands) {
    
  };
  methods.change = function(actionLabel, actionCommands, actionData, tempCommands, tempBullet, mainActionLabel) {
    if (flag[name].actions.ref[actionLabel]) {
      //Set tempBullet change
      if (!tempBullet.change) {
        tempBullet.change = {};
      }
      //Check for object data
      if (actionCommands.movement) {
        tempBullet.movement = actionCommands.movement;
      } else {
        //Current position
        if (actionCommands.position.now) {
          tempBullet.position.now = actionCommands.position.now;
        }
        //End position
        if (actionCommands.position.end) {
          //Check for value and velocity error
          if (actionCommands.position.end && tempBullet.direction.velocity) {
            throw new Error("End position value can't use when velocity is defined");
          }
          //Set change direction object
          if (!tempBullet.change.direction) {
            tempBullet.change.direction = {};
          }
          //Check for change data
          tempBullet.change.direction.times = actionCommands.direction.times || 1;
          tempBullet.change.direction.value = getAngle(angleAtoB(tempBullet.position.now, actionCommands.position.end));
          tempBullet.change.direction.type = "plus";
          tempBullet.change.direction.change = getAngle((tempBullet.change.direction.value - tempBullet.direction.value) / tempBullet.change.direction.times);
          tempBullet.change.position.end = actionCommands.position.end;
        } else if (actionCommands.direction) {
          //Set change direction data
          if (!tempBullet.change.direction) {
            tempBullet.change.direction = {};
          }
          //Check for value and velocity error
          if (actionCommands.direction.type === "plus" && tempBullet.direction.velocity) {
            throw new Error("Plus type can't use when velocity is defined");
          }
          //Check for value
          tempBullet.change.direction.value = getAngle(actionCommands.direction.value) || 0;
          //Check for type
          if (actionCommands.direction.type) {
            tempBullet.change.direction.type = actionCommands.direction.type;
          } else if (!actionCommands.direction.velocity) {
            tempBullet.change.direction.type = "plus";
          } else {
            tempBullet.change.direction.type = "multiply";
          }
          //Check for times
          tempBullet.change.direction.times = actionCommands.direction.times || 1;
          //Calculate change
          if (tempBullet.change.direction.type === "plus") {
            tempBullet.change.direction.change = getAngle((tempBullet.change.direction.value - tempBullet.direction.value) / tempBullet.change.direction.times);
          } else if (tempBullet.change.direction.type === "multiply") {
            tempBullet.change.direction.change = getAngle(tempBullet.change.direction.value);
          }
          //Check for value velocity
          tempBullet.change.direction.velocity.value = getAngle(actionCommands.direction.velocity.value) || 1;
          //Check for type velocity
          if (actionCommands.direction.velocity.type && getAngle(actionCommands.direction.velocity.value)) {
            tempBullet.change.direction.velocity.type = getAngle(actionCommands.direction.velocity.value);
          } else if (actionCommands.direction.velocity.value) {
            tempBullet.change.direction.velocity.type = "plus";
          } else {
            tempBullet.change.direction.velocity.type = "multiply";
          }
          //Check for times velocity
          tempBullet.change.direction.velocity.times = actionCommands.direction.velocity.times || 1;
          //Check for velocity range
          tempBullet.direction.velocity.range = actionCommands.direction.velocity.range || tempBullet.direction.velocity.range;
          //Calculate change
          if (tempBullet.change.direction.velocity.type === "plus") {
            tempBullet.change.direction.velocity.change = getAngle((tempBullet.change.direction.velocity.value - tempBullet.direction.velocity.value) / tempBullet.change.direction.velocity.times);
          } else if (tempBullet.change.direction.velocity.type === "multiply") {
            tempBullet.change.direction.velocity.change = getAngle(tempBullet.change.direction.velocity.value);
          }
        }
        //Speed
        if (actionCommands.speed) {
          //Set change speed data
          if (!tempBullet.change.speed) {
            tempBullet.change.speed = {};
          }
          //Horizontal speed
          if (actionCommands.speed.horizontal) {
            //Set change horizontal speed data
            if (!tempBullet.change.speed.horizontal) {
              tempBullet.change.speed.horizontal = {};
            }
            //Check for value and velocity error
            if (actionCommands.speed.horizontal.type === "plus" && tempBullet.speed.velocity.horizontal) {
              throw new Error("Plus type can't use when velocity is defined");
            }
            //Check for value
            tempBullet.change.speed.horizontal.value = actionCommands.speed.horizontal.value || 1;
            //Check for type
            if (actionCommands.speed.horizontal.type) {
              tempBullet.change.speed.horizontal.type = actionCommands.speed.horizontal.type;
            } else if (!actionCommands.speed.horizontal.velocity) {
              tempBullet.change.speed.horizontal.type = "plus";
            } else {
              tempBullet.change.speed.horizontal.type = "multiply";
            }
            //Check for times
            tempBullet.change.speed.horizontal.times = actionCommands.speed.horizontal.times || 1;
            //Calculate change
            if (tempBullet.change.speed.horizontal.type === "plus") {
              tempBullet.change.speed.horizontal.change = (tempBullet.change.speed.horizontal.value - tempBullet.speed.horizontal.value) / tempBullet.change.speed.horizontal.times;
            } else if (tempBullet.change.speed.horizontal.type === "multiply") {
              tempBullet.change.speed.horizontal.change = tempBullet.change.speed.horizontal.value;
            }
            //Check for value velocity
            tempBullet.change.speed.velocity.horizontal.value = actionCommands.speed.velocity.horizontal.value || 1;
            //Check for type velocity
            if (actionCommands.speed.velocity.horizontal.type && actionCommands.speed.velocity.horizontal.value) {
              tempBullet.change.speed.velocity.horizontal.type = actionCommands.speed.velocity.horizontal.value;
            } else if (actionCommands.speed.velocity.horizontal.value) {
              tempBullet.change.speed.velocity.horizontal.type = "plus";
            } else {
              tempBullet.change.speed.velocity.horizontal.type = "multiply";
            }
            //Check for times velocity
            tempBullet.change.speed.velocity.horizontal.times = actionCommands.speed.velocity.horizontal.times || 1;
            //Check for velocity range
            tempBullet.speed.velocity.horizontal.range = actionCommands.speed.velocity.horizontal.range || tempBullet.speed.velocity.horizontal.range;
            //Calculate change
            if (tempBullet.change.speed.velocity.horizontal.type === "plus") {
              tempBullet.change.speed.velocity.horizontal.change = (tempBullet.change.speed.velocity.horizontal.value - tempBullet.speed.velocity.horizontal.value) / tempBullet.change.speed.velocity.horizontal.times;
            } else if (tempBullet.change.speed.velocity.horizontal.type === "multiply") {
              tempBullet.change.speed.velocity.horizontal.change = tempBullet.change.speed.velocity.horizontal.value;
            }
          }
          //Vertical speed
          if (actionCommands.speed.vertical) {
            //Set change vertical speed data
            if (!tempBullet.change.speed.vertical) {
              tempBullet.change.speed.vertical = {};
            }
            //Check for value and velocity error
            if (actionCommands.speed.vertical.type === "plus" && tempBullet.speed.velocity.vertical) {
              throw new Error("Plus type can't use when velocity is defined");
            }
            //Check for value
            tempBullet.change.speed.vertical.value = actionCommands.speed.vertical.value || 1;
            //Check for type
            if (actionCommands.speed.vertical.type) {
              tempBullet.change.speed.vertical.type = actionCommands.speed.vertical.type;
            } else if (!actionCommands.speed.vertical.velocity) {
              tempBullet.change.speed.vertical.type = "plus";
            } else {
              tempBullet.change.speed.vertical.type = "multiply";
            }
            //Check for times
            tempBullet.change.speed.vertical.times = actionCommands.speed.vertical.times || 1;
            //Calculate change
            if (tempBullet.change.speed.vertical.type === "plus") {
              tempBullet.change.speed.vertical.change = (tempBullet.change.speed.vertical.value - tempBullet.speed.vertical.value) / tempBullet.change.speed.vertical.times;
            } else if (tempBullet.change.speed.vertical.type === "multiply") {
              tempBullet.change.speed.vertical.change = tempBullet.change.speed.vertical.value;
            }
            //Check for value velocity
            tempBullet.change.speed.velocity.vertical.value = actionCommands.speed.velocity.vertical.value || 1;
            //Check for type velocity
            if (actionCommands.speed.velocity.vertical.type && actionCommands.speed.velocity.vertical.value) {
              tempBullet.change.speed.velocity.vertical.type = actionCommands.speed.velocity.vertical.value;
            } else if (actionCommands.speed.velocity.vertical.value) {
              tempBullet.change.speed.velocity.vertical.type = "plus";
            } else {
              tempBullet.change.speed.velocity.vertical.type = "multiply";
            }
            //Check for times velocity
            tempBullet.change.speed.velocity.vertical.times = actionCommands.speed.velocity.vertical.times || 1;
            //Check for velocity range
            tempBullet.speed.velocity.vertical.range = actionCommands.speed.velocity.vertical.range || tempBullet.speed.velocity.vertical.range;
            //Calculate change
            if (tempBullet.change.speed.velocity.vertical.type === "plus") {
              tempBullet.change.speed.velocity.vertical.change = (tempBullet.change.speed.velocity.vertical.value - tempBullet.speed.velocity.vertical.value) / tempBullet.change.speed.velocity.vertical.times;
            } else if (tempBullet.change.speed.velocity.vertical.type === "multiply") {
              tempBullet.change.speed.velocity.vertical.change = tempBullet.change.speed.velocity.vertical.value;
            }
          }
        }
      }
    } else {
      throw new Error("Change must be called in not fire actions");
    }
  };
  methods.func = function(actionLabel, actionCommands) {
    actionCommands.callback();
    return;
  };
  methods.actionRef = function(actionLabel, actionCommands, actionData, tempCommands, tempBullet, mainActionLabel) {
    if (!tempBullet.commands) {
      tempBullet.commands = [{
        location: 0,
        times: 1,
        actions: actionData,
        label: actionLabel
      }];
      tempCommands = tempBullet.commands;
    }
    var tempData;
    (function mainLoop() {
      while (tempCommands[tempCommands.length - 1].times > 0) {
        while (tempCommands[tempCommands.length - 1].location < actionData.length) {
          tempData = methods[(function() {
            switch (actionData[tempCommands[tempCommands.length- 1].location].func) {
              case "repeat": {
                return "repeatRef";
              }
              break;
              case "wait": {
                return "waitRef";
              }
              break;
              default: {
                return actionData[tempCommands[tempCommands.length- 1].location].func;
              }
            }
          })()](actionLabel, actionData[tempCommands[tempCommands.length- 1].location], actionData, tempCommands, tempBullet, mainActionLabel);
          if (typeof tempData === "string") {
            return;
          }
          tempCommands[tempCommands.length- 1].location ++;
        }
        tempCommands[tempCommands.length- 1].location = 0;
        tempCommands[tempCommands.length- 1].times --;
      }
      try {
        temp[name].repeat.ref[actionLabel][tempCommands[tempCommands.length - 1].label][tempBullet.flag].done = true;
        tempCommands.pop();
        if (tempCommands.length <= 1) {
          return;
        }
        actionData = tempCommands[tempCommands.length- 1].actions;
        mainLoop();
      } catch (error) {
        
      }
    })();
    if (tempData === "repeat") {
      methods.actionRef(actionLabel, actionCommands, tempCommands[tempCommands.length - 1].actions, tempCommands, tempBullet, mainActionLabel);
    }
  };
  methods.repeatRef = function(actionLabel, actionCommands, actionData, tempCommands, tempBullet, mainActionLabel) {
    //Check if label is defined
    if (!actionCommands.label) {
      actionCommands.label = randomString();
    }
    if (!temp[name].repeat.ref[actionLabel][actionCommands.label]) {
      temp[name].repeat.ref[actionLabel][actionCommands.label] = {};
    }
    if (!temp[name].repeat.ref[actionLabel][actionCommands.label][tempBullet.flag]) {
      temp[name].repeat.ref[actionLabel][actionCommands.label][tempBullet.flag] = {};
    }
    tempCommands.push({
      actions: actionData[tempCommands[tempCommands.length- 1].location].actions,
      location: 0,
      times: (function() {
        if (temp[name].repeat.ref[actionLabel][actionCommands.label][tempBullet.flag].done) {
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
              if (temp[name].repeat.ref[actionLabel][actionCommands.label][tempBullet.flag].times >= actionCommands.range[0] && temp[name].repeat.ref[actionLabel][actionCommands.label][tempBullet.flag].times <= actionCommands.range[1]) {
                temp[name].repeat.ref[actionLabel][actionCommands.label][tempBullet.flag].times += actionCommands.velocity;
              }
              if (temp[name].repeat.ref[actionLabel][actionCommands.label][tempBullet.flag].times < actionCommands.range[0]) {
                temp[name].repeat.ref[actionLabel][actionCommands.label][tempBullet.flag].times = actionCommands.range[0];
              } else if (temp[name].repeat.ref[actionLabel][actionCommands.label][tempBullet.flag].times > actionCommands.range[1]) {
                temp[name].repeat.ref[actionLabel][actionCommands.label][tempBullet.flag].times = actionCommands.range[1];
              }
            }
          }
        } else {
          temp[name].repeat.ref[actionLabel][actionCommands.label][tempBullet.flag].times = actionCommands.times;
        }
        return temp[name].repeat.ref[actionLabel][actionCommands.label][tempBullet.flag].times;
      })(),//,
      label: actionCommands.label || (function() {
        var tempString = randomString();
        actionCommands.label = tempString;
        return tempString;
      })(),
    });
    tempCommands[tempCommands.length - 2].location ++;
    return "repeat";
  };
  methods.waitRef = function(actionLabel, actionCommands, actionData, tempCommands, tempBullet, mainActionLabel) {
    //Check if label is defined
    if (!actionCommands.label) {
      actionCommands.label = randomString();
    }
    if (!temp[name].wait.ref[actionLabel][actionCommands.label]) {
      temp[name].wait.ref[actionLabel][actionCommands.label] = {};
    }
    //Set wait label group
    if (!temp[name].wait.ref[actionLabel][actionCommands.label][tempBullet.flag]) {
      temp[name].wait.ref[actionLabel][actionCommands.label][tempBullet.flag] = {};
    }
    //Check if previous wait is called
    if (temp[name].wait.ref[actionLabel][actionCommands.label][tempBullet.flag].done) {
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
          if (temp[name].wait.ref[actionLabel][actionCommands.label][tempBullet.flag].times >= actionCommands.range[0] && temp[name].wait.ref[actionLabel][actionCommands.label][tempBullet.flag].times <= actionCommands.range[1]) {
            temp[name].wait.ref[actionLabel][actionCommands.label][tempBullet.flag].times += actionCommands.velocity;
          }
          if (temp[name].wait.ref[actionLabel][actionCommands.label][tempBullet.flag].times < actionCommands.range[0]) {
            temp[name].wait.ref[actionLabel][actionCommands.label][tempBullet.flag].times = actionCommands.range[0];
          } else if (temp[name].wait.ref[actionLabel][actionCommands.label][tempBullet.flag].times > actionCommands.range[1]) {
            temp[name].wait.ref[actionLabel][actionCommands.label][tempBullet.flag].times = actionCommands.range[1];
          }
        }
      }
    } else {
      temp[name].wait.ref[actionLabel][actionCommands.label][tempBullet.flag].times = actionCommands.times;
    }
    tempBullet.wait.label = actionCommands.label;
    tempBullet.wait.times = temp[name].wait.ref[actionLabel][actionCommands.label][tempBullet.flag].times;
    tempCommands[tempCommands.length - 1].location ++;
    return "wait";
  };
  //------------- END METHODS ZONE ------------
  //------------ OTHER STUFF ZONE -------------
  //Helper function
  function drawBullet(tempBullet) {
    //Check for change data
    if (tempBullet.change) {
      //Check for direction
      if (tempBullet.change.direction) {
        //Check for times data if larger than 0
        if (tempBullet.change.direction.times > 0) {
          //Check for type
          if (tempBullet.change.direction.type === "plus") {
            tempBullet.direction.value += tempBullet.change.direction.change;
            tempBullet.direction.value = getAngle(tempBullet.direction.value);
          } else if (tempBullet.change.direction.type === "multiply") {
            tempBullet.direction.value *= tempBullet.change.direction.change;
            tempBullet.direction.value = getAngle(tempBullet.direction.value);
          }
          //Minus times to 1
          tempBullet.change.direction.times --;
        }
        //Check for direction velocity
        if (tempBullet.change.direction.velocity.times > 0) {
          //Check for type
          if (tempBullet.change.direction.velocity.type === "plus") {
            tempBullet.direction.velocity.value += getAngle(tempBullet.change.direction.velocity.change);
          } else if (tempBullet.change.direction.velocity.type === "multiply") {
            tempBullet.direction.velocity.value *= getAngle(tempBullet.change.direction.velocity.change);
          }
          //Minus times to 1
          tempBullet.change.direction.velocity.times --;
        }
      }
      //Check for speed
      if (tempBullet.change.speed) {
        //Check for times data if larger than 0
        if (tempBullet.change.speed.horizontal.times > 0) {
          //Check for type
          if (tempBullet.change.speed.horizontal.type === "plus") {
            tempBullet.speed.horizontal += tempBullet.change.speed.horizontal.change;
          } else if (tempBullet.change.speed.horizontal.type === "multiply") {
            tempBullet.speed.horizontal *= tempBullet.change.speed.horizontal.change;
          }
          //Minus times to 1
          tempBullet.change.speed.horizontal.times --;
        }
        //Check for times data if larger than 0
        if (tempBullet.change.speed.vertical.times > 0) {
          //Check for type
          if (tempBullet.change.speed.vertical.type === "plus") {
            tempBullet.speed.vertical += tempBullet.change.speed.vertical.change;
          } else if (tempBullet.change.speed.vertical.type === "multiply") {
            tempBullet.speed.vertical *= tempBullet.change.speed.vertical.change;
          }
          //Minus times to 1
          tempBullet.change.speed.vertical.times --;
        }
        //Check for times data if larger than 0
        if (tempBullet.change.speed.velocity.horizontal.times > 0) {
          //Check for type
          if (tempBullet.change.speed.velocity.horizontal.type === "plus") {
            tempBullet.speed.velocity.horizontal.value += tempBullet.change.speed.velocity.horizontal.change;
          } else if (tempBullet.change.speed.velocity.horizontal.type === "multiply") {
            tempBullet.speed.velocity.horizontal.value *= tempBullet.change.speed.velocity.horizontal.change;
          }
          //Minus times to 1
          tempBullet.change.speed.velocity.horizontal.times --;
        }
        //Check for times data if larger than 0
        if (tempBullet.change.speed.velocity.vertical.times > 0) {
          //Check for type
          if (tempBullet.change.speed.velocity.vertical.type === "plus") {
            tempBullet.speed.velocity.vertical.value += tempBullet.change.speed.velocity.vertical.change;
          } else if (tempBullet.change.speed.velocity.vertical.type === "multiply") {
            tempBullet.speed.velocity.vertical.value *= tempBullet.change.speed.velocity.vertical.change;
          }
          //Minus times to 1
          tempBullet.change.speed.velocity.vertical.times --;
        }
      }
    }
    //Check movement data
    if (typeof tempBullet.movement === "function") {
      tempBullet.position.now = tempBullet.movement();
    } else {
      //Main x movement
      tempBullet.position.now[0] = Math.sin(getAngle(tempBullet.direction.value)) * tempBullet.speed.horizontal + tempBullet.position.now[0];
      //Main y movement
      tempBullet.position.now[1] = Math.cos(getAngle(tempBullet.direction.value)) * tempBullet.speed.vertical + tempBullet.position.now[1];
      //Check for direction velocity
      if (tempBullet.direction.velocity) {
        //Check for range
        if (tempBullet.direction.velocity.range[0] <= getAngle(tempBullet.direction.value) && tempBullet.direction.velocity.range[1] >= getAngle(tempBullet.direction.value)) {
          tempBullet.direction.value += getAngle(tempBullet.direction.velocity.value);
        } else if (tempBullet.direction.velocity.range[0] > getAngle(tempBullet.direction.value) || tempBullet.direction.velocity.range[1] < getAngle(tempBullet.direction.value)) {
          tempBullet.direction.value = getAngle(tempBullet.direction.velocity.value);
        }
      }
      //Check for speed velocity
      if (tempBullet.speed.velocity) {
        //Check for range
        if (tempBullet.speed.velocity.horizontal) {
          if (tempBullet.speed.velocity.horizontal.range[0] <= tempBullet.speed.horizontal && tempBullet.speed.velocity.horizontal.range[1] >= tempBullet.speed.horizontal) {
            tempBullet.speed.horizontal += tempBullet.speed.velocity.horizontal.value;
          } else if (tempBullet.speed.velocity.horizontal.range[0] > tempBullet.speed.horizontal || tempBullet.speed.velocity.horizontal.range[1] < tempBullet.speed.horizontal) {
            tempBullet.speed.horizontal = tempBullet.speed.velocity.horizontal.value;
          }
        }
        if (tempBullet.speed.velocity.vertical) {
          if (tempBullet.speed.velocity.vertical.range[0] <= tempBullet.speed.vertical && tempBullet.speed.velocity.vertical.range[1] >= tempBullet.speed.vertical) {
            tempBullet.speed.vertical += tempBullet.speed.velocity.vertical.value;
          } else if (tempBullet.speed.velocity.vertical.range[0] > tempBullet.speed.vertical || tempBullet.speed.velocity.vertical.range[1] < tempBullet.speed.vertical) {
            tempBullet.speed.vertical = tempBullet.speed.velocity.vertical.value;
          }
        }
      }
    }
    return tempBullet;
  }
  function randomString() {
    return (Math.random() * 1e36).toString(36);
  }
  function run(data, isRun) {
    if (typeof data === "function") {
      if (!isRun) {
        return run(data());
      } else {
        return data;
      }
    } else if (typeof data === "number" || typeof data === "boolean" || typeof data === "object") {
      if (!Number.isNaN(data) || Array.isArray(data) || data instanceof Object) {
        return data;
      } else {
        throw new Error("Invalid data");
      }
    } else if (typeof data === "string") {
      if (!Number.isNaN(data) && !isRun) {
        return Number(data);
      } else {
        return data;
      }
    } else {
      throw new Error("Invalid data");
    }
  }
  //Math function
  function getAngle(angle) {
    if (flag[name].configs.angleType) {
      flag[name].configs.angleType = "degree";
    }
    if (run(flag[name].configs.angleType, true) === "degree") {
      return Math.degToRad((Math.normalizeDegree(angle)));
    } else if (run(flag[name].configs.angleType, true) === "radian") {
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
