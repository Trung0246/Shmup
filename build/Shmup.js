(function(window) {
  "use strict";
  var VERSION = "1.0.6";
  
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
      temp = {}, //temp data holder
      shot = {}; //shot data holder
  
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
      methods.actions(actionLabel, actionLabel, temp[name].commands[actionLabel][temp[name].commands[actionLabel].length - 1].actions, temp[name].commands[actionLabel], undefined, undefined);
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
          //Process to set wait label done to true
          if (temp[name].timeOut[actionLabel].times <= 0) {
            temp[name].timeOut[actionLabel].times = undefined;
            temp[name].wait.fire[actionLabel][temp[name].timeOut[actionLabel].label].done = true;
          }
          methods.actions(actionLabel, actionLabel, temp[name].commands[actionLabel][temp[name].commands[actionLabel].length - 1].actions, temp[name].commands[actionLabel], undefined, undefined);
        }
      }
      //Draw bullet
      for (var fireLabel in temp[name].bullets[actionLabel]) {
        var bulletGroup = temp[name].bullets[actionLabel][fireLabel];
        //Main bullet update group
        for (var bulletCount = 0; bulletCount < bulletGroup.length; bulletCount ++) {
          var tempBullet = temp[name].bullets[actionLabel][fireLabel][bulletCount];
          //process draw bullet data
          tempBullet = shot[flag[name].configs.shot[tempBullet.type].type].draw(tempBullet);
          //Process actionRef
          if (tempBullet.actionRef) {
            if (tempBullet.wait.times > 0) {
              tempBullet.wait.times --;
            }
            if ((tempBullet.wait.times <= 0 || tempBullet.wait.times === undefined)) {
              //Process to set wait label done to true
              if (tempBullet.wait.times <= 0) {
                tempBullet.wait.times = undefined;
                temp[name].wait.ref[tempBullet.actionRef][tempBullet.wait.label][tempBullet.flag].done = true;
              }
              if (tempBullet.commands.length > 0) {
                methods.actions(tempBullet.actionRef, actionLabel, tempBullet.commands[tempBullet.commands.length - 1].actions, tempBullet.commands, undefined, tempBullet);
              }
            }
          }
          //Draw bullet
          flag[name].configs.shot[tempBullet.type].draw(tempBullet);
          //Callback bullet
          if (flag[name].configs.shot[tempBullet.type].callback) {
            var tempData = flag[name].configs.shot[tempBullet.type].callback(tempBullet.actionRef || actionLabel, actionLabel, (function() {
              try {
                return tempBullet.commands[tempBullet.commands.length - 1].actions;
              } catch (error) {
                return undefined;
              }
            })(), tempBullet.commands, undefined, tempBullet);
            //Process return
            switch (tempData) {
              case "vanish": {
                flag[name].configs.shot[tempBullet.type].vanish(bulletGroup[bulletCount]);
                shot[flag[name].configs.shot[tempBullet.type].type].vanish(tempBullet, bulletCount, bulletGroup);
              }
              break;
              //May add aptional feature here
            }
          }
        }
        //Remove all bullet that is null
        //Check if null is has
        if (bulletGroup.indexOf(null) !== -1) {
          for (var nullBulletCount = bulletGroup.length - 1; nullBulletCount >= 0; --nullBulletCount) {
            if (bulletGroup[nullBulletCount] === null) {
              bulletGroup.splice(nullBulletCount, 1);
            }
          }
        }
      }
    }
  };
  
  //------------- END COMMANDS ZONE -----------
  //--------------- METHODS ZONE --------------
  methods.actions = function(actionLabel, mainActionLabel, actionData, tempCommands, actionCommands, tempBullet) {
    var defaultCommands = [{
      location: 0,
      times: 1,
      actions: actionData,
      label: actionLabel
    }];
    if (actionLabel === mainActionLabel) {
      if (!tempCommands) {
        tempCommands = defaultCommands;
      }
    } else if (actionLabel !== mainActionLabel) {
      if (!tempBullet.commands) {
        tempBullet.commands = defaultCommands;
        tempCommands = tempBullet.commands;
      }
    }
    var tempData;
    (function mainLoop() {
      while (tempCommands[tempCommands.length - 1].times > 0) {
        while (tempCommands[tempCommands.length - 1].location < actionData.length) {
          tempData = methods[actionData[tempCommands[tempCommands.length- 1].location].func](actionLabel, mainActionLabel, actionData, tempCommands, actionData[tempCommands[tempCommands.length- 1].location], tempBullet);
          if (typeof tempData === "string") {
            return;
          } else if (typeof tempData === "object") {
            if (tempData.actionRef) {
              firstActionProcess(tempData, mainActionLabel);
            }
          }
          tempCommands[tempCommands.length- 1].location ++;
        }
        tempCommands[tempCommands.length- 1].location = 0;
        tempCommands[tempCommands.length- 1].times --;
      }
      try {
        tempCommands.pop();
        if (tempCommands.length <= 1) {
          if (actionLabel === mainActionLabel) {
            temp[name].isFiring[actionLabel] = false;
          }
          return;
        }
        actionData = tempCommands[tempCommands.length- 1].actions;
        mainLoop();
      } catch (error) {
        
      }
    })();
    if (tempData === "repeat") {
      //methods.actions(actionLabel, actionCommands, tempCommands[tempCommands.length - 1].actions, tempCommands, tempBullet, mainActionLabel);
      methods.actions(actionLabel, mainActionLabel, tempCommands[tempCommands.length - 1].actions, tempCommands, actionCommands, tempBullet);
    }
  };
  methods.repeat = function(actionLabel, mainActionLabel, actionData, tempCommands, actionCommands, tempBullet) {
    var actionType;
    if (actionLabel === mainActionLabel) {
      actionType = temp[name].repeat.fire[actionLabel][actionCommands.label];
    } else if (actionLabel !== mainActionLabel) {
      if (!temp[name].repeat.ref[actionLabel][actionCommands.label][tempBullet.flag]) {
        temp[name].repeat.ref[actionLabel][actionCommands.label][tempBullet.flag] = {};
      }
      actionType = temp[name].repeat.ref[actionLabel][actionCommands.label][tempBullet.flag];
    }
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
      times: actionCommands.times,
      label: actionCommands.label || (function() {
        var tempString = randomString();
        actionCommands.label = tempString;
        return tempString;
      })(),
    });
    tempCommands[tempCommands.length - 2].location ++;
    return "repeat";
  };
  methods.wait = function(actionLabel, mainActionLabel, actionData, tempCommands, actionCommands, tempBullet) {
    var actionType;
    //Check if label is defined
    if (!actionCommands.label) {
      actionCommands.label = randomString();
    }
    if (actionLabel === mainActionLabel) {
      //Set wait label group
      if (!temp[name].wait.fire[actionLabel][actionCommands.label]) {
        temp[name].wait.fire[actionLabel][actionCommands.label] = {};
      }
      actionType = temp[name].wait.fire[actionLabel][actionCommands.label];
    } else if (actionLabel !== mainActionLabel) {
      if (!temp[name].wait.ref[actionLabel][actionCommands.label]) {
        temp[name].wait.ref[actionLabel][actionCommands.label] = {};
      }
      if (!temp[name].wait.ref[actionLabel][actionCommands.label][tempBullet.flag]) {
        temp[name].wait.ref[actionLabel][actionCommands.label][tempBullet.flag] = {};
      }
      actionType = temp[name].wait.ref[actionLabel][actionCommands.label][tempBullet.flag];
    }
    actionType.times = actionCommands.times;
    if (actionLabel === mainActionLabel) {
      temp[name].timeOut[actionLabel].label = actionCommands.label;
      temp[name].timeOut[actionLabel].times = actionCommands.times;
    } else if (actionLabel !== mainActionLabel) {
      tempBullet.wait.label = actionCommands.label;
      tempBullet.wait.times = actionType.times;
    }
    tempCommands[tempCommands.length - 1].location ++;
    return "wait";
  };
  methods.fire = function(actionLabel, mainActionLabel, actionData, tempCommands, actionCommands, tempBullet) {
    shot[flag[name].configs.shot[actionCommands.type].type].fire(actionLabel, mainActionLabel, actionData, tempCommands, actionCommands, tempBullet);
  };
  methods.vanish = function(actionLabel, mainActionLabel, actionData, tempCommands, actionCommands, tempBullet) {
    
  };
  methods.change = function(actionLabel, mainActionLabel, actionData, tempCommands, actionCommands, tempBullet) {
    shot[flag[name].configs.shot[actionCommands.type].type].change(actionLabel, actionCommands, actionData, tempCommands, tempBulletInput, mainActionLabel);
  };
  methods.func = function(actionLabel, mainActionLabel, actionData, tempCommands, actionCommands, tempBullet) {
    actionCommands.callback(actionLabel, mainActionLabel, actionData, tempCommands, actionCommands, tempBullet);
    return;
  };
  //------------- END METHODS ZONE ------------
  //------------ --- SHOT ZONE ----------------
  shot.bullet = {
    fire: function(actionLabel, mainActionLabel, actionData, tempCommands, actionCommands, tempBulletInput) {
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
          label: actionLabel,
        }];
      }
      //Check for movement
      if (actionCommands.movement) {
        tempBullet.movement = actionCommands.movement;
      } else {
        //Check for position
        if (!actionCommands.position) {
          actionCommands.position = {};
        }
        //Check for position now and end
        if (actionCommands.position.now) {
          tempBullet.position.now = actionCommands.position.now.slice();
        } else if (tempBulletInput) {
          tempBullet.position.now = tempBulletInput.position.now.slice();
        } else {
          tempBullet.position.now = flag[name].configs.position();
        }
        if (actionCommands.position.end) {
          tempBullet.position.end = actionCommands.position.end;
          tempBullet.direction.value = angleAtoB(tempBullet.position.now, tempBullet.position.end);
        } else if (actionCommands.direction) {
          if (!tempBullet.direction) {
            tempBullet.direction = {};
          }
          switch (actionCommands.direction.type) {
            case "aim": {
              tempBullet.direction.value = angleAtoB(tempBullet.position.now, flag[name].configs.target());// + (actionCommands.direction.value || 0);
            }
            break;
            case "absolute": {
              tempBullet.direction.value = actionCommands.direction.value;
            }
            break;
            case "sequence": {
              if (!temp[name].fire[actionLabel][actionCommands.label].direction || typeof temp[name].fire[actionLabel][actionCommands.label].direction !== "number") {
                temp[name].fire[actionLabel][actionCommands.label].direction = actionCommands.direction.value;
              } else if (typeof temp[name].fire[actionLabel][actionCommands.label].direction === "number") {
                temp[name].fire[actionLabel][actionCommands.label].direction += actionCommands.direction.value;
              }
              tempBullet.direction.value = temp[name].fire[actionLabel][actionCommands.label].direction;
            }
            break;
            case "relative": {
              //Check if is ref
              if (flag[name].actions.ref[actionLabel]) {
                tempBullet.direction.value = actionCommands.direction.value;
                tempBullet.direction.value += tempBulletInput.direction.value;
              } else {
                throw new Error("Relative must be use in actionRef");
              }
            }
            break;
            default: {
              tempBullet.direction.value = 0;
            }
          }
        } else {
          throw new Error("Invalid fire direction");
        }
        if (actionCommands.speed) {
          //Set tempBulllet speed group
          if (!tempBullet.speed) {
            tempBullet.speed = {};
          }
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
        } else {
          throw new Error("Invalid fire speed");
        }
      }
      temp[name].bullets[mainActionLabel][actionCommands.label].push(tempBullet);
      tempBullet = temp[name].bullets[mainActionLabel][actionCommands.label][temp[name].bullets[mainActionLabel][actionCommands.label].length - 1];
      return tempBullet;
    },
    draw: function(tempBullet) {
      //Check for change data
      if (tempBullet.change) {
        //Check for direction
        if (tempBullet.change.direction) {
          //Check for times data if larger than 0
          if (tempBullet.change.direction.times > 0) {
            //Check for type
            if (tempBullet.change.direction.type === "plus") {
              tempBullet.direction.value += tempBullet.change.direction.change;
            } else if (tempBullet.change.direction.type === "multiply") {
              tempBullet.direction.value *= tempBullet.change.direction.change;
            }
            //Minus times to 1
            tempBullet.change.direction.times --;
          }
        }
        //Check for speed
        if (tempBullet.change.speed) {
          //Check for times data if larger than 0
          if (tempBullet.change.speed.horizontal) {
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
          }
          //Check for times data if larger than 0
          if (tempBullet.change.speed.vertical) {
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
      }
      return tempBullet;
    },
    change: function(actionLabel, mainActionLabel, actionData, tempCommands, actionCommands, tempBullet) {
      if (flag[name].actions.ref[actionLabel]) {
        //Set tempBullet change
        if (!tempBullet.change) {
          tempBullet.change = {};
        }
        //Check for object data
        if (actionCommands.movement) {
          tempBullet.movement = actionCommands.movement;
        } else {
          //Check for actionCommands position
          if (!actionCommands.position) {
            actionCommands.position = {};
          }
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
            tempBullet.change.direction.times = actionCommands.position.times || 1;
            tempBullet.change.direction.value = angleAtoB(tempBullet.position.now, actionCommands.position.end);
            tempBullet.change.direction.type = "plus";
            tempBullet.change.direction.change = (tempBullet.change.direction.value - tempBullet.direction.value) / tempBullet.change.direction.times;
            tempBullet.change.position.end = actionCommands.position.end;
          } else if (actionCommands.direction) {
            //Check for action commands direction
            if (!actionCommands.direction) {
              actionCommands.direction = {};
            }
            //Set change direction data
            if (!tempBullet.change.direction) {
              tempBullet.change.direction = {};
            }
            //Check for value and velocity error
            if (actionCommands.direction.type === "plus" && tempBullet.direction.velocity) {
              throw new Error("Plus type can't use when velocity is defined");
            }
            //Check for value
            tempBullet.change.direction.value = actionCommands.direction.value || 0;
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
              tempBullet.change.direction.change = tempBullet.change.direction.value / tempBullet.change.direction.times;//(tempBullet.change.direction.value - tempBullet.direction.value) / tempBullet.change.direction.times;
            } else if (tempBullet.change.direction.type === "multiply") {
              tempBullet.change.direction.change = tempBullet.change.direction.value;
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
                tempBullet.change.speed.horizontal.change = (tempBullet.change.speed.horizontal.value - tempBullet.speed.horizontal) / tempBullet.change.speed.horizontal.times;
              } else if (tempBullet.change.speed.horizontal.type === "multiply") {
                tempBullet.change.speed.horizontal.change = tempBullet.change.speed.horizontal.value;
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
                tempBullet.change.speed.vertical.change = (tempBullet.change.speed.vertical.value - tempBullet.speed.vertical) / tempBullet.change.speed.vertical.times;
              } else if (tempBullet.change.speed.vertical.type === "multiply") {
                tempBullet.change.speed.vertical.change = tempBullet.change.speed.vertical.value;
              }
            }
          }
        }
      } else {
        throw new Error("Change must be called in not fire actions");
      }
    },
    vanish: function(tempBullet, bulletCount, bulletGroup) {
      //Remove all bullet is null
      bulletGroup[bulletCount] = null;
    },
  };
  //-------------- END SHOT ZONE --------------
  //------------ OTHER STUFF ZONE -------------
  //Helper function
  function firstActionProcess(tempBullet, mainActionLabel) {
    tempBullet = shot[tempBullet.type].draw(tempBullet);
    methods.actions(tempBullet.actionRef, mainActionLabel, tempBullet.commands[tempBullet.commands.length - 1].actions, tempBullet.commands, undefined, tempBullet);
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
    if (!flag[name].configs.angleType) {
      flag[name].configs.angleType = "degree";
    }
    if (run(flag[name].configs.angleType, true) === "degree") {
      return Math.degToRad((Math.normalizeDegree(angle)));
    } else if (run(flag[name].configs.angleType, true) === "radian") {
      return Math.normalizeRadian(angle);
    }
  }
  function angleAtoB(a, b) {
    if (flag[name].configs.angleType === "degree" || !flag[name].configs.angleType) {
      return Math.radToDeg(-Math.atan2(a[0] - b[0], -(a[1] - b[1])));
    } else if (flag[name].configs.angleType === "radian") {
      return -Math.atan2(a[0] - b[0], -(a[1] - b[1]));
    };
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
  function normalizeAngle(angle) {
    if (flag[name].configs.angleType === "degree") {
      return Math.normalizeDegree(angle);
    } else if (flag[name].configs.angleType === "radian") {
      return Math.normalizeRadian(angle);
    }
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
