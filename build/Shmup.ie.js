(function(window) {
  "use strict";
  /*
    This file is only for fucking IE that messing EVERYTHING up
    like this: 
    {
      a: 1,
      b: 2, //fucking comma that wrong here
    }
  */
  /*
  Shmup.js v1.1.1
  
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
  commands.configs = function(configsData) {
    //Check error of "data"
    //checkError("", data);
    
    //check for fire key
    if (!configsData.fire || typeof configsData.fire !== "object") {
      configsData.fire = {};
    }
    
    //Loop for count
    for (var bulletType in configsData.shot) {
      configsData.shot[bulletType].count(0);
    }
    
    //Set new configs to "flag[name]"
    flag[name].configs = configsData;
    
    return this;
  };
  commands.actions = function(actionLabel, isFire, actionData) {
    //Check error if "flag[name].configs" is defined
    //checkError("configs");
    //Create actionLabel list
    
    //Set actions to "flag[name]"
    //Check if actions if defined
    if (!flag[name].actions) {
      flag[name].actions = {};
    }
    
    //Check for frame data
    if (!temp[name].frame) {
      temp[name].frame = 0;
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
    
    //Set bullets group if not defined
    if (!temp[name].bullets) {
      temp[name].bullets = {};
    }
    //Set bullets label group
    if (!temp[name].bullets[actionLabel] && isFire) {
      temp[name].bullets[actionLabel] = {};
    }
    
    //Add bullet count group
    if (!temp[name].count) {
      temp[name].count = {};
    }
    
    //Set fire group
    if (!temp[name].fire) {
      temp[name].fire = {};
    }
    /*if (!temp[name].fire[actionLabel]) {
      temp[name].fire[actionLabel] = {};
    }*/
    if (!temp[name].fire.data) {
      temp[name].fire.data = {};
    }
    if (!temp[name].fire.temp) {
      temp[name].fire.temp = {};
    }
    if (!temp[name].fire.ref) {
      temp[name].fire.ref = {};
    }
    //if (!temp[name].fire.data[actionLabel]) {}
    temp[name].fire.data[actionLabel] = extend(flag[name].configs.fire);
    
    if (!temp[name].fire.temp[actionLabel]) {
      temp[name].fire.temp[actionLabel] = {};
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
    
    if (!temp[name].wait) {
      temp[name].wait = {};
    }
    if (!temp[name].wait[actionLabel]) {
      temp[name].wait[actionLabel] = {};
    }
    
    //Check for freeze
    if (!temp[name].freeze) {
      temp[name].freeze = {};
    }
    if (!temp[name].freeze[actionLabel] && isFire) {
      temp[name].freeze[actionLabel] = {};
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
    
    if (isFire) {
      if (!temp[name].isFreezing) {
        temp[name].isFreezing = {};
      }
      //Check if isFreezing boolean is defined
      if (!temp[name].isFreezing[actionLabel]) {
        temp[name].isFreezing[actionLabel] = false;
      }
    }
    
    return this;
  };
  commands.fire = function(actionLabelData) {
    //Check for loop
    if (typeof actionLabelData !== "undefined") {
      if (typeof actionLabelData === "string") {
        actionLabelDataProcess(actionLabelData);
      } else if (actionLabelData.length > 0) {
        for (var actionLabelIndex = 0; actionLabelIndex < actionLabelData.length; actionLabelIndex ++) {
          actionLabelDataProcess(actionLabelData[actionLabelIndex]);
        }
      } else {
        throw new Error("Undefined label list");
      }
    }
    function actionLabelDataProcess(actionLabel) {
      if (temp[name].isFiring[actionLabel] === false && temp[name].commands[actionLabel].length === 1) {
        temp[name].isFiring[actionLabel] = true;
      }
      if (flag[name].actions.fire[actionLabel] && temp[name].commands[actionLabel].length === 1) {
        methods.actions(actionLabel, actionLabel, temp[name].commands[actionLabel][temp[name].commands[actionLabel].length - 1].actions, temp[name].commands[actionLabel], undefined, undefined);
      } else {
        throw new Error("Undefined actions of " + actionLabel + " or is firing");
      }
    }
  };
  commands.update = function(actionLabelData) {
    //Check for arguments
    if (typeof actionLabelData === "undefined") {
      for (var currentActionLabel in flag[name].actions.fire) {
        updateAction(currentActionLabel);
      }
    } else if (actionLabelData.length > 0) {
      for (var indexActionLabel = 0; indexActionLabel < actionLabelData.length; indexActionLabel ++) {
        updateAction(actionLabelData[indexActionLabel]);
      }
    } else {
      throw new Error("No action to update");
    }
    //Plus a frame then return it
    temp[name].frame ++;
    flag[name].configs.frame(temp[name].frame);
    function updateAction(actionLabel) {
      if (temp[name].isFiring[actionLabel] === true) {
        //Check for manual
        if (temp[name].wait[actionLabel].type !== "manual") {
          if (temp[name].wait[actionLabel].times > 0) {
            temp[name].wait[actionLabel].times --;
          }
          if ((temp[name].wait[actionLabel].times <= 0 || temp[name].wait[actionLabel].times === undefined)) {
            //Process to set wait label done to true
            if (temp[name].wait[actionLabel].times <= 0) {
              temp[name].wait[actionLabel].times = undefined;
              //temp[name].wait.fire[actionLabel][temp[name].wait[actionLabel].label].done = true;
            }
            methods.actions(actionLabel, actionLabel, temp[name].commands[actionLabel][temp[name].commands[actionLabel].length - 1].actions, temp[name].commands[actionLabel], undefined, undefined);
          }
        } else if (temp[name].wait[actionLabel].times() === true) {
          methods.actions(actionLabel, actionLabel, temp[name].commands[actionLabel][temp[name].commands[actionLabel].length - 1].actions, temp[name].commands[actionLabel], undefined, undefined);
        }
      }
      //Freeze processing
      for (var fireLabel in temp[name].bullets[actionLabel]) {
        if (temp[name].freeze[actionLabel][fireLabel].type !== "manual") {
          if (temp[name].freeze[actionLabel][fireLabel].times > 0) {
            temp[name].freeze[actionLabel][fireLabel].times --;
          }
          if (temp[name].freeze[actionLabel][fireLabel].times <= 0/* || temp[name].freeze[actionLabel][fireLabel].times === undefined*/) {
            temp[name].freeze[actionLabel][fireLabel].times = undefined;
            temp[name].freeze[actionLabel][fireLabel].done = true;
          }
        } else {
          temp[name].freeze[actionLabel][fireLabel].done = temp[name].freeze[actionLabel][fireLabel].times();
        }
      }
      //Draw bullet
      for (var fireLabel in temp[name].bullets[actionLabel]) {
        var bulletGroup = temp[name].bullets[actionLabel][fireLabel];
        //Main bullet update group
        for (var bulletCount = 0; bulletCount < bulletGroup.length; bulletCount ++) {
          (function bulletLoop() {
            var tempBullet = temp[name].bullets[actionLabel][fireLabel][bulletCount];
            //process draw bullet data
            if (tempBullet === null) {
              //Skip this bullet and head to next bullet because this bullet is deleted
              return;
            }
            if (checkFreeze(actionLabel, fireLabel)) {
              //Check for done
              tempBullet = shot[flag[name].configs.shot[tempBullet.type].type].draw(tempBullet);
              //Check bullet count
              tempBullet.count = bulletCount;
              //Process actionRef
              if (tempBullet.actionRef) {
                if (tempBullet.wait.type !== "manual") {
                  if (tempBullet.wait.times > 0) {
                    tempBullet.wait.times --;
                  }
                  if (tempBullet.wait.times <= 0 || tempBullet.wait.times === undefined) {
                    //Process to set wait label done to true
                    if (tempBullet.wait.times <= 0) {
                      tempBullet.wait.times = undefined;
                    }
                    if (tempBullet.commands.length > 0) {
                      methods.actions(tempBullet.actionRef, actionLabel, tempBullet.commands[tempBullet.commands.length - 1].actions, tempBullet.commands, undefined, tempBullet);
                    }
                  }
                } else if (tempBullet.wait.times() === true) {
                  tempBullet.wait.times = undefined;
                  methods.actions(tempBullet.actionRef, actionLabel, tempBullet.commands[tempBullet.commands.length - 1].actions, tempBullet.commands, undefined, tempBullet);
                }
              }
            }
            //Draw bullet
            if (checkFreeze(actionLabel, fireLabel)) {
              flag[name].configs.shot[tempBullet.type].draw(tempBullet);
            } else {
              if (typeof flag[name].configs.shot[tempBullet.type].freeze !== "function") {
                flag[name].configs.shot[tempBullet.type].draw(tempBullet);
              } else {
                flag[name].configs.shot[tempBullet.type].freeze(tempBullet);
              }
            }
            //Set bullet temp type for count
            var tempCountType = tempBullet.type;
            //Callback bullet
            if (flag[name].configs.shot[tempBullet.type].callback && checkFreeze(actionLabel, fireLabel)) {
              tempBullet.position.now = positionData(tempBullet.position.now, true);
              tempBullet.position.end = positionData(tempBullet.position.end, true);
              var tempData = flag[name].configs.shot[tempBullet.type].callback(tempBullet.actionRef || actionLabel, actionLabel, (function() {
                try {
                  return tempBullet.commands[tempBullet.commands.length - 1].actions;
                } catch (error) {
                  return undefined;
                }
              })(), tempBullet.commands, undefined, tempBullet);
              tempBullet.position.now = positionData(tempBullet.position.now);
              tempBullet.position.end = positionData(tempBullet.position.end);
              //Prevent object no key bug
              if (!tempData) {
                tempData = {};
              }
              //Process return
              if (tempData.func) {
                methods[tempData.func](tempBullet.actionRef, actionLabel, undefined, undefined, tempData, tempBullet);
              }
            }
            flag[name].configs.shot[tempCountType].count(temp[name].count[tempCountType]);
          })();
        }
        //Remove all bullet that is null
        //Check if null is has
        if (bulletGroup.indexOf(null) > -1) {
          for (var nullBulletCount = bulletGroup.length - 1; nullBulletCount >= 0; --nullBulletCount) {
            if (bulletGroup[nullBulletCount] === null) {
              bulletGroup.splice(nullBulletCount, 1);
            }
          }
        }
      }
    }
    function checkFreeze(actionLabel, fireLabel) {
      if (temp[name].freeze[actionLabel][fireLabel].done) {
        if (temp[name].isFreezing[actionLabel] === true) {
          return false;
        }
        return true;
      } else if (typeof temp[name].freeze[actionLabel][fireLabel].done === "undefined") {
        if (temp[name].isFreezing[actionLabel] === false) {
          return true;
        }
      } else {
        return false;
      }
    }
  };
  commands.freeze = function(actionLabelData) {
    if (typeof actionLabelData === "string") {
      temp[name].isFreezing[actionLabelData] = true;
    } else if (actionLabelData.length > 0) {
      for (var indexActionLabel = 0; indexActionLabel < actionLabelData.length; indexActionLabel ++) {
        temp[name].isFreezing[actionLabelData[indexActionLabel]] = true;
      }
    } else {
      throw new Error("No action to freeze");
    }
  };
  commands.doing = function(actionLabelData) {
    if (typeof actionLabelData === "string") {
      temp[name].isFreezing[actionLabelData] = false;
    } else if (actionLabelData.length > 0) {
      for (var indexActionLabel = 0; indexActionLabel < actionLabelData.length; indexActionLabel ++) {
        temp[name].isFreezing[actionLabelData[indexActionLabel]] = false;
      }
    } else {
      throw new Error("No action to continue");
    }
  };
  commands.clear = function(actionLabelData) {
    if (typeof actionLabelData === "string") {
      for (var tempFireLabel in temp[name].bullets[actionLabelData]) {
        clearBullet(actionLabelData, tempFireLabel);
      }
    } else if (actionLabelData.length > 0) {
      for (var indexActionLabel = 0; indexActionLabel < actionLabelData.length; indexActionLabel ++) {
        for (var tempFireLabel in temp[name].bullets[actionLabelData[indexActionLabel]]) {
          clearBullet(actionLabelData[indexActionLabel], tempFireLabel);
        }
      }
    } else {
      throw new Error("No action to clear");
    }
    function clearBullet(actionLabel, fireLabel) {
      var bulletGroup = temp[name].bullets[actionLabel][fireLabel];
      //Main bullet update group
      for (var bulletCount = 0; bulletCount < bulletGroup.length; bulletCount ++) {
        (function bulletLoop() {
          var tempBullet = temp[name].bullets[actionLabel][fireLabel][bulletCount];
          if (tempBullet === null) {
            return;
          }
          var tempCountType = tempBullet.type;
          methods.vanish(actionLabel, actionLabel, undefined, undefined, {
            type: "all",
            label: tempBullet.label
          }, tempBullet);
          flag[name].configs.shot[tempCountType].count(temp[name].count[tempCountType]);
        })();
      }
      //Remove all bullet that is null
      //Check if null is has
      if (bulletGroup.indexOf(null) > -1) {
        for (var nullBulletCount = bulletGroup.length - 1; nullBulletCount >= 0; --nullBulletCount) {
          if (bulletGroup[nullBulletCount] === null) {
            bulletGroup.splice(nullBulletCount, 1);
          }
        }
      }
    }
  };
  commands.pause = function(actionLabelData) {
    if (typeof actionLabelData === "string") {
      temp[name].isFiring[actionLabelData] = false;
    } else if (actionLabelData.length > 0) {
      for (var indexActionLabel = 0; indexActionLabel < actionLabelData.length; indexActionLabel ++) {
        temp[name].isFiring[actionLabelData[indexActionLabel]] = false;
      }
    } else {
      throw new Error("No action to pause");
    }
  };
  commands.run = function(actionLabelData) {
    if (typeof actionLabelData === "string") {
      temp[name].isFiring[actionLabelData] = true;
    } else if (actionLabelData.length > 0) {
      for (var indexActionLabel = 0; indexActionLabel < actionLabelData.length; indexActionLabel ++) {
        temp[name].isFiring[actionLabelData[indexActionLabel]] = true;
      }
    } else {
      throw new Error("No action to run");
    }
  };
  commands.stop = function(actionLabelData) {
    if (typeof actionLabelData === "string") {
      stopAction(actionLabelData);
    } else if (actionLabelData.length > 0) {
      for (var indexActionLabel = 0; indexActionLabel < actionLabelData.length; indexActionLabel ++) {
        stopAction(actionLabelData[indexActionLabel]);
      }
    } else {
      throw new Error("No action to stop");
    }
    function stopAction(actionLabel) {
      if (temp[name].isFiring[actionLabel] === true) {
        resetAction(actionLabel);
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
        if (tempCommands.length <= 0) {
          if (actionLabel === mainActionLabel) {
            //temp[name].isFiring[actionLabel] = false;
            resetAction(mainActionLabel);
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
    //Check if label is defined
    if (!actionCommands.label) {
      actionCommands.label = randomString();
    }
    //Check for function
    var tempActionCommands = extendRun(actionCommands);
    tempCommands.push({
      actions: actionData[tempCommands[tempCommands.length- 1].location].actions,
      location: 0,
      times: tempActionCommands.times,
      label: tempActionCommands.label || (function() {
        var tempString = randomString();
        tempActionCommands.label = tempString;
        return tempString;
      })()
    });
    tempCommands[tempCommands.length - 2].location ++;
    return "repeat";
  };
  methods.wait = function(actionLabel, mainActionLabel, actionData, tempCommands, actionCommands, tempBullet) {
    //Check if label is defined
    if (!actionCommands.label) {
      actionCommands.label = randomString();
    }
    //Check for function
    var tempActionCommands = extendRun(actionCommands);
    if (tempActionCommands.type === "manual") {
      tempActionCommands = extendWait(actionCommands);
    }
    if (actionLabel === mainActionLabel) {
      temp[name].wait[actionLabel].label = tempActionCommands.label;
      temp[name].wait[actionLabel].times = tempActionCommands.times;
      temp[name].wait[actionLabel].type = tempActionCommands.type;
    } else if (actionLabel !== mainActionLabel) {
      tempBullet.wait.label = tempActionCommands.label;
      tempBullet.wait.times = tempActionCommands.times;
      tempBullet.wait.type = tempActionCommands.type;
    }
    tempCommands[tempCommands.length - 1].location ++;
    return "wait";
  };
  methods.fire = function(actionLabel, mainActionLabel, actionData, tempCommands, actionCommands, tempBullet) {
    //Check for label
    if (!actionCommands.label) {
      actionCommands.label = randomString();
    }
    //Check for function
    var tempActionCommands = extendRun(actionCommands);
    //Check for actionRef
    if (tempActionCommands.fireRef) {
      tempActionCommands.label = tempActionCommands.fireRef;
      if (!tempActionCommands.type) {
        tempActionCommands.type = temp[name].fire.data[actionLabel][tempActionCommands.label].type;
      }
    }
    //Set bullet group
    if (!temp[name].bullets[mainActionLabel][tempActionCommands.label]) {
      temp[name].bullets[mainActionLabel][tempActionCommands.label] = [];
    }
    //Set freeze group
    if (!temp[name].freeze[mainActionLabel][tempActionCommands.label]) {
      temp[name].freeze[mainActionLabel][tempActionCommands.label] = {};
    }
    shot[flag[name].configs.shot[tempActionCommands.type].type].fire(actionLabel, mainActionLabel, actionData, tempCommands, tempActionCommands, tempBullet);
  };
  methods.vanish = function(actionLabel, mainActionLabel, actionData, tempCommands, actionCommands, tempBullet) {
    //Check for function
    var tempActionCommands = extendRun(actionCommands);
    //TODO: make fireRef first to do this one like to get data.
    shot[flag[name].configs.shot[(function() {
      //Check for mainAction
      if (actionLabel === mainActionLabel) {
        if (tempActionCommands.label) {
          return temp[name].fire.data[actionLabel][tempActionCommands.label].type;
        } else {
          throw new Error("Label must be defined in vanish main action");
        }
      } else if (actionLabel !== mainActionLabel && tempBullet) {
        if (tempActionCommands.label) {
          return temp[name].fire.data[actionLabel][tempActionCommands.label].type;
        } else {
          return tempBullet.type;
        }
      } else {
        throw new Error("Label must be defined in vanish commands");
      }
    })()].type].vanish(actionLabel, mainActionLabel, actionData, tempCommands, tempActionCommands, tempBullet);
  };
  methods.change = function(actionLabel, mainActionLabel, actionData, tempCommands, actionCommands, tempBullet) {
    shot[flag[name].configs.shot[tempBullet.type].type].change(actionLabel, mainActionLabel, actionData, tempCommands, extendRun(actionCommands), tempBullet);
  };
  methods.normalize = function(actionLabel, mainActionLabel, actionData, tempCommands, actionCommands, tempBullet) {
    var tempActionCommands = extendRun(actionCommands);
    shot[flag[name].configs.shot[(function() {
      //Check for mainAction
      if (actionLabel === mainActionLabel) {
        if (tempActionCommands.label) {
          return temp[name].fire.data[actionLabel][tempActionCommands.label].type;
        } else {
          throw new Error("Label must be defined in normalize main action");
        }
      } else if (actionLabel !== mainActionLabel && tempBullet) {
        if (tempActionCommands.label) {
          return temp[name].fire.data[actionLabel][tempActionCommands.label].type;
        } else {
          return tempBullet.type;
        }
      } else {
        throw new Error("Label must be defined in normalize commands");
      }
    })()].type].normalize(actionLabel, mainActionLabel, actionData, tempCommands, tempActionCommands, tempBullet);
  };
  methods.freeze = function(actionLabel, mainActionLabel, actionData, tempCommands, actionCommands, tempBullet) {
    var tempActionCommands = extendRun(actionCommands);
    //Check for if main action
    if (actionLabel === mainActionLabel) {
      if (tempActionCommands.type === "manual") {
        tempActionCommands = extendWait(actionCommands);
      }
    } else {
      throw new Error("Freeze command can only use in main action");
    }
    if (!tempActionCommands.label) {
      throw new Error("Label didn't defined");
    }
    temp[name].freeze[actionLabel][tempActionCommands.label].times = tempActionCommands.times;
    temp[name].freeze[actionLabel][tempActionCommands.label].type = tempActionCommands.type;
    temp[name].freeze[actionLabel][tempActionCommands.label].done = false;
    shot[flag[name].configs.shot[temp[name].fire.data[actionLabel][tempActionCommands.label].type].type].freeze(actionLabel, mainActionLabel, actionData, tempCommands, tempActionCommands, tempBullet);
  };
  methods.reset = function(actionLabel, mainActionLabel, actionData, tempCommands, actionCommands, tempBullet) {
    var tempActionCommands = extendRun(actionCommands);
    shot[flag[name].configs.shot[(function() {
      if (actionLabel === mainActionLabel) {
        if (tempActionCommands.label) {
          return temp[name].fire.data[actionLabel][tempActionCommands.label].type;
        } else {
          throw new Error("Label must be defined in reset main action");
        }
      } else if (actionLabel !== mainActionLabel && tempBullet) {
        if (tempActionCommands.label) {
          return temp[name].fire.data[actionLabel][tempActionCommands.label].type;
        } else {
          return tempBullet.type;
        }
      } else {
        throw new Error("Label must be defined in reset commands");
      }
    })()].type].reset(actionLabel, mainActionLabel, actionData, tempCommands, tempActionCommands, tempBullet);
  };
  methods.func = function(actionLabel, mainActionLabel, actionData, tempCommands, actionCommands, tempBullet) {
    if (actionLabel !== mainActionLabel) {
      tempBullet.position.now = positionData(tempBullet.position.now, true);
      tempBullet.position.end = positionData(tempBullet.position.end, true);
    }
    actionCommands.callback(actionLabel, mainActionLabel, actionData, tempCommands, actionCommands, tempBullet);
    if (actionLabel !== mainActionLabel) {
      tempBullet.position.now = positionData(tempBullet.position.now);
      tempBullet.position.end = positionData(tempBullet.position.end);
    }
    return;
  };
  //------------- END METHODS ZONE ------------
  //---------------- SHOT ZONE ----------------
  shot.bullet = {
    fire: function(actionLabel, mainActionLabel, actionData, tempCommands, actionCommands, tempBulletInput) {
      //Check for fireRef
      if (actionCommands.fireRef) {
        var tempData = temp[name].fire.data[actionLabel][actionCommands.label];
        //Check for actionCommands if stuff is undefined
        if (!actionCommands.movement && tempData.movement) {
          actionCommands.movement = tempData.movement;
        }
        if (!actionCommands.position && tempData.position) {
          actionCommands.position = extend(tempData.position);
        } else if (actionCommands.position && tempData.position) {
          if (!actionCommands.position.now && tempData.position.now) {
            actionCommands.position.now = tempData.position.now.slice();
          }
          if (!actionCommands.position.end && tempData.position.end) {
            actionCommands.position.end = tempData.position.now.slice();
          }
        }
        if (!actionCommands.direction && tempData.direction) {
          actionCommands.direction = extend(tempData.direction);
        } else if (actionCommands.direction && tempData.direction) {
          if (typeof actionCommands.direction.value !== "number") {
            actionCommands.direction.value = tempData.direction.value;
          }
          if (typeof actionCommands.direction.base !== "number") {
            actionCommands.direction.base = tempData.direction.base;
          }
          if (!actionCommands.direction.type) {
            actionCommands.direction.type = tempData.direction.type;
          }
          if (!actionCommands.direction.target) {
            actionCommands.direction.target = tempData.direction.target;
          }
        } else if (!actionCommands.movement && !actionCommands.position.end) {
          actionCommands.direction = {
            value: 0,
            type: "absolute"
          };
        }
        if (!actionCommands.speed && tempData.speed) {
          actionCommands.speed = tempData.speed;
        } else if (actionCommands.speed && tempData.speed) {
          if (!actionCommands.speed.horizontal && tempData.speed.horizontal) {
            actionCommands.speed.horizontal = tempData.speed.horizontal;
          } else if (actionCommands.speed.horizontal && tempData.speed.horizontal) {
            if (typeof actionCommands.speed.horizontal.value !== "number") {
              actionCommands.speed.horizontal.value = tempData.speed.horizontal.value;
            }
            if (typeof actionCommands.speed.horizontal.base !== "number") {
              actionCommands.speed.horizontal.base = tempData.speed.horizontal.base;
            }
            if (!actionCommands.speed.horizontal.type) {
              actionCommands.speed.horizontal.type = tempData.speed.horizontal.type;
            }
          } else {
            actionCommands.speed.horizontal = {
              value: 1,
              type: "absolute"
            };
          }
          if (!actionCommands.speed.vertical && tempData.speed.vertical) {
            actionCommands.speed.vertical = tempData.speed.vertical;
          } else if (actionCommands.speed.vertical && tempData.speed.vertical) {
            if (typeof actionCommands.speed.vertical.value !== "number") {
              actionCommands.speed.vertical.value = tempData.speed.vertical.value;
            }
            if (typeof actionCommands.speed.horizontal.base !== "number") {
              actionCommands.speed.horizontal.base = tempData.speed.horizontal.base;
            }
            if (!actionCommands.speed.vertical.type) {
              actionCommands.speed.vertical.type = tempData.speed.vertical.type;
            }
          } else {
            actionCommands.speed.vertical = {
              value: 1,
              type: "absolute"
            };
          }
        } else if (!actionCommands.movement) {
          actionCommands.speed = {
            horizontal: {
              value: 1,
              type: "absolute"
            },
            vertical: {
              value: 1,
              type: "absolute"
            }
          };
        }
        if (!actionCommands.actionRef && tempData.actionRef) {
          actionCommands.actionRef = tempData.actionRef;
        }
      }
      //Check fire label to set to fireRef
      if (!temp[name].fire.data[actionLabel][actionCommands.label]) {
        temp[name].fire.data[actionLabel][actionCommands.label] = extend(actionCommands);
        //Delete unnecessary keys
        delete temp[name].fire.data[actionLabel][actionCommands.label].label;
        delete temp[name].fire.data[actionLabel][actionCommands.label].func;
      }
      //Set fire group
      if (!temp[name].fire.temp[actionLabel][actionCommands.label]) {
        temp[name].fire.temp[actionLabel][actionCommands.label] = {
          direction: {
            value: undefined,
            root: undefined,
            type: undefined,
            base: undefined
          },
          speed: {
            horizontal: {
              value: undefined,
              root: undefined,
              type: undefined,
              base: undefined
            },
            vertical: {
              value: undefined,
              root: undefined,
              type: undefined,
              base: undefined
            }
          }
        };
      }
      //Create new bullet
      var tempBullet = {
        type: actionCommands.type,
        label: actionCommands.label,
        position: {
          now: undefined
          /*old: {
            value: undefined,
            done: false,
          },*/
        },
        wait: {},
        flag: randomString(),
        count: 0
      };
      //Set count group to plus
      if (typeof temp[name].count[tempBullet.type] !== "number") {
        temp[name].count[tempBullet.type] = 1;
      } else {
        temp[name].count[tempBullet.type] ++;
      }
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
      //Check for position now and end
      if (actionCommands.position.now) {
        tempBullet.position.now = positionData(actionCommands.position.now);//actionCommands.position.now.slice();
        tempBullet.position.type = "custom";
      } else if (tempBulletInput && actionCommands.position.type !== "gun") {
        tempBullet.position.now = positionData(tempBulletInput.position.now);//tempBulletInput.position.now.slice
        tempBullet.position.type = "bullet";
      } else {
        tempBullet.position.now = positionData(flag[name].configs.position());//flag[name].configs.position();
        tempBullet.position.type = "gun";
      }
      //Check for movement
      if (actionCommands.movement) {
        tempBullet.movement = actionCommands.movement;
      } else {
        //Check for position
        if (!actionCommands.position) {
          actionCommands.position = {};
        }
        //tempBullet.old = 
        if (actionCommands.position.end) {
          tempBullet.position.end = actionCommands.position.end;
          tempBullet.direction.value = angleAtoB(tempBullet.position.now, tempBullet.position.end);
        } else if (actionCommands.direction) {
          if (!tempBullet.direction) {
            tempBullet.direction = {};
          }
          switch (actionCommands.direction.type) {
            case "aim": {
              tempBullet.direction.value = angleAtoB(tempBullet.position.now, flag[name].configs.target[actionCommands.direction.target]()) + (actionCommands.direction.value || 0);
              temp[name].fire.temp[actionLabel][actionCommands.label].direction.type = "aim";
            }
            break;
            case "absolute": {
              tempBullet.direction.value = actionCommands.direction.value;
            }
            break;
            case "sequence": {
              if (typeof temp[name].fire.temp[actionLabel][actionCommands.label].direction.value !== "number") {
                //Check for base
                if (actionCommands.direction.base) {
                  temp[name].fire.temp[actionLabel][actionCommands.label].direction.base = actionCommands.direction.base;
                } else {
                  temp[name].fire.temp[actionLabel][actionCommands.label].direction.base = 0;
                }
                temp[name].fire.temp[actionLabel][actionCommands.label].direction.value = temp[name].fire.temp[actionLabel][actionCommands.label].direction.base;
              } else if (typeof temp[name].fire.temp[actionLabel][actionCommands.label].direction.value === "number") {
                temp[name].fire.temp[actionLabel][actionCommands.label].direction.value += actionCommands.direction.value;
                temp[name].fire.temp[actionLabel][actionCommands.label].direction.root = actionCommands.direction.value;
              }
              tempBullet.direction.value = temp[name].fire.temp[actionLabel][actionCommands.label].direction.value + (function() {
                //Check for target
                if (actionCommands.direction.target) {
                  return angleAtoB(tempBullet.position.now, flag[name].configs.target[actionCommands.direction.target]());
                } else {
                  return 0;
                }
              })();
              temp[name].fire.temp[actionLabel][actionCommands.label].direction.type = "sequence";
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
              if (typeof temp[name].fire.temp[actionLabel][actionCommands.label].speed.horizontal.value !== "number") {
                //Check for base
                if (actionCommands.speed.horizontal.base) {
                  temp[name].fire.temp[actionLabel][actionCommands.label].speed.horizontal.base = actionCommands.speed.horizontal.base;
                } else {
                  temp[name].fire.temp[actionLabel][actionCommands.label].speed.horizontal.base = 1;
                }
                temp[name].fire.temp[actionLabel][actionCommands.label].speed.horizontal.value = temp[name].fire.temp[actionLabel][actionCommands.label].speed.horizontal.base;
              } else if (typeof temp[name].fire.temp[actionLabel][actionCommands.label].speed.horizontal.value === "number") {
                temp[name].fire.temp[actionLabel][actionCommands.label].speed.horizontal.value += actionCommands.speed.horizontal.value;
                temp[name].fire.temp[actionLabel][actionCommands.label].speed.horizontal.root = actionCommands.speed.horizontal.value;
              }
              tempBullet.speed.horizontal = temp[name].fire.temp[actionLabel][actionCommands.label].speed.horizontal.value;
              temp[name].fire.temp[actionLabel][actionCommands.label].speed.horizontal.type = "sequence";
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
              if (typeof temp[name].fire.temp[actionLabel][actionCommands.label].speed.vertical.value !== "number") {
                //Check for base
                if (actionCommands.speed.horizontal.base) {
                  temp[name].fire.temp[actionLabel][actionCommands.label].speed.vertical.base = actionCommands.speed.vertical.base;
                } else {
                  temp[name].fire.temp[actionLabel][actionCommands.label].speed.vertical.base = 1;
                }
                temp[name].fire.temp[actionLabel][actionCommands.label].speed.vertical.value = temp[name].fire.temp[actionLabel][actionCommands.label].speed.vertical.base;
              } else if (typeof temp[name].fire.temp[actionLabel][actionCommands.label].speed.vertical.value === "number") {
                temp[name].fire.temp[actionLabel][actionCommands.label].speed.vertical.value += actionCommands.speed.vertical.value;
                temp[name].fire.temp[actionLabel][actionCommands.label].speed.vertical.root = actionCommands.speed.vertical.value;
              }
              tempBullet.speed.vertical = temp[name].fire.temp[actionLabel][actionCommands.label].speed.vertical.value;
              temp[name].fire.temp[actionLabel][actionCommands.label].speed.vertical.type = "sequence";
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
          //Process oval
          if (typeof actionCommands.speed.oval === "number") {//actionCommands.speed.balance === true) {
            var tempPos = [];
            //Calculate next possible xy
            tempPos[0] = tempBullet.position.now[0] + tempBullet.speed.horizontal * Math.cos(getAngle(tempBullet.direction.value)) * Math.cos(getAngle(actionCommands.speed.oval)) - tempBullet.speed.vertical * Math.sin(getAngle(tempBullet.direction.value)) * Math.sin(getAngle(actionCommands.speed.oval));
            tempPos[1] = tempBullet.position.now[1] + tempBullet.speed.vertical * Math.sin(getAngle(tempBullet.direction.value)) * Math.cos(getAngle(actionCommands.speed.oval)) + tempBullet.speed.horizontal * Math.cos(getAngle(tempBullet.direction.value)) * Math.sin(getAngle(actionCommands.speed.oval));
            //Check magnitude
            var tempMag = Math.pythagorean(tempBullet.position.now, tempPos);
            //Set angle
            tempBullet.direction.value = angleAtoB(tempBullet.position.now, tempPos);
            //Set speed
            tempBullet.speed.horizontal = tempMag;
            tempBullet.speed.vertical = tempMag;
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
            tempBullet.direction.value += tempBullet.change.direction.change;
            tempBullet.change.direction.times --;
          }
        }
        //Check for speed
        if (tempBullet.change.speed) {
          //Check for times data if larger than 0
          if (tempBullet.change.speed.horizontal) {
            if (tempBullet.change.speed.horizontal.times > 0) {
              //Check for type
              tempBullet.speed.horizontal += tempBullet.change.speed.horizontal.change;
              tempBullet.change.speed.horizontal.times --;
            }
          }
          //Check for times data if larger than 0
          if (tempBullet.change.speed.vertical) {
            if (tempBullet.change.speed.vertical.times > 0) {
              //Check for type
              tempBullet.speed.vertical += tempBullet.change.speed.vertical.change;
              //Minus times to 1
              tempBullet.change.speed.vertical.times --;
            }
          }
        }
      }
      //Check movement data
      if (typeof tempBullet.movement === "function") {
        tempBullet.position.now = tempBullet.movement(positionData(tempBullet.position.now, true));
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
        //Check change label
        if (!actionCommands.label) {
          actionCommands.label = randomString();
        }
        //Current position
        if (actionCommands.position.now) {
          tempBullet.position.now = positionData(actionCommands.position.now);//actionCommands.position.now.slice();
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
          if (!actionCommands.position.now) {
            tempBullet.position.now = positionData(tempBullet.position.now);
          }
          if (!temp[name].fire.ref[actionCommands.label]) {
            temp[name].fire.ref[actionCommands.label] = {
              direction: {
                value: undefined,
                root: undefined,
                type: undefined,
                base: undefined
              },
              speed: {
                horizontal: {
                  value: undefined,
                  root: undefined,
                  type: undefined,
                  base: undefined
                },
                vertical: {
                  value: undefined,
                  root: undefined,
                  type: undefined,
                  base: undefined
                }
              }
            };
          }
          //End position
          if (actionCommands.position.end) {
            //Set change direction object
            if (!tempBullet.change.direction) {
              tempBullet.change.direction = {};
            }
            //Check for change data
            tempBullet.position.end = positionData(actionCommands.position.end);//actionCommands.position.end.slice();
            tempBullet.change.direction.times = actionCommands.position.times || 1;
            tempBullet.change.direction.value = angleAtoB(tempBullet.position.now, tempBullet.position.end);
            tempBullet.change.direction.change = (tempBullet.change.direction.value - tempBullet.direction.value) / tempBullet.change.direction.times;
          } else if (actionCommands.direction) {
            //Check for action commands direction
            if (!actionCommands.direction) {
              actionCommands.direction = {};
            }
            //Set change direction data
            if (!tempBullet.change.direction) {
              tempBullet.change.direction = {};
            }
            //Check for value
            tempBullet.change.direction.value = actionCommands.direction.value || 0;
            //Check for type
            if (actionCommands.direction.type) {
              tempBullet.change.direction.type = actionCommands.direction.type;
            } else {
              tempBullet.change.direction.type = "absolute";
            }
            //Check for times
            tempBullet.change.direction.times = actionCommands.direction.times || 1;
            //Calculate change
            switch (tempBullet.change.direction.type) {
              case "aim": {
                tempBullet.change.direction.change = (angleAtoB(tempBullet.position.now, flag[name].configs.target[actionCommands.direction.target]()) + tempBullet.change.direction.value - tempBullet.direction.value) / tempBullet.change.direction.times;
              }
              break;
              case "relative": {
                tempBullet.change.direction.change = tempBullet.change.direction.value / tempBullet.change.direction.times;
              }
              break;
              case "sequenceAbsolute":
              case "sequenceRelative": {
                var tempAngle = (function() {
                  if (actionCommands.direction.target) {
                    return angleAtoB(tempBullet.position.now, flag[name].configs.target[actionCommands.direction.target]());
                  } else {
                    return 0;
                  }
                })();
                //Check for base
                if (typeof temp[name].fire.ref[actionCommands.label].direction.value !== "number") {
                  //Check for action base
                  if (typeof actionCommands.direction.base === "number") {
                    temp[name].fire.ref[actionCommands.label].direction.base = actionCommands.direction.base;
                  } else {
                    temp[name].fire.ref[actionCommands.label].direction.base = 0;
                  }
                  temp[name].fire.ref[actionCommands.label].direction.value = temp[name].fire.ref[actionCommands.label].direction.base;
                } else if (typeof temp[name].fire.ref[actionCommands.label].direction.value === "number") {
                  temp[name].fire.ref[actionCommands.label].direction.value += tempBullet.change.direction.value;
                  temp[name].fire.ref[actionCommands.label].direction.root = tempBullet.change.direction.value;
                }
                switch (tempBullet.change.direction.type) {
                  case "sequenceAbsolute": {
                    tempBullet.change.direction.change = (temp[name].fire.ref[actionCommands.label].direction.value + tempAngle - tempBullet.direction.value) / tempBullet.change.direction.times;
                  }
                  break;
                  case "sequenceRelative": {
                    tempBullet.change.direction.change = (temp[name].fire.ref[actionCommands.label].direction.value + tempAngle) / tempBullet.change.direction.times;
                  }
                  break;
                }
                temp[name].fire.ref[actionCommands.label].direction.type = "sequence";
              }
              break;
              case "absolute": {
                tempBullet.change.direction.change = (tempBullet.change.direction.value - tempBullet.direction.value) / tempBullet.change.direction.times;
              }
              break;
              case "multiply": {
                tempBullet.change.direction.change = (tempBullet.direction.value * tempBullet.change.direction.value - tempBullet.direction.value) / tempBullet.change.direction.times;
              }
              break;
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
              //Check for value
              tempBullet.change.speed.horizontal.value = actionCommands.speed.horizontal.value || 0;
              //Check for type
              if (actionCommands.speed.horizontal.type) {
                tempBullet.change.speed.horizontal.type = actionCommands.speed.horizontal.type;
              } else {
                tempBullet.change.speed.horizontal.type = "absolute";
              }
              //Check for times
              tempBullet.change.speed.horizontal.times = actionCommands.speed.horizontal.times || 1;
              //Calculate change
              switch (tempBullet.change.speed.horizontal.type) {
                case "relative": {
                  tempBullet.change.speed.horizontal.change = tempBullet.change.speed.horizontal.value / tempBullet.change.speed.horizontal.times;
                }
                break;
                case "sequence":
                case "sequenceAbsolute":
                case "sequenceRelative": {
                  if (typeof temp[name].fire.ref[actionCommands.label].speed.horizontal.value !== "number") {
                    //Check for action base
                    if (typeof actionCommands.direction.base === "number") {
                      temp[name].fire.ref[actionCommands.label].speed.horizontal.base = actionCommands.speed.horizontal.base;
                    } else {
                      temp[name].fire.ref[actionCommands.label].speed.horizontal.base = 0;
                    }
                    temp[name].fire.ref[actionCommands.label].speed.horizontal.value = temp[name].fire.ref[actionCommands.label].speed.horizontal.base;
                  } else if (typeof temp[name].fire.ref[actionCommands.label].speed.horizontal.value === "number") {
                    temp[name].fire.ref[actionCommands.label].speed.horizontal.value += tempBullet.change.speed.horizontal.value;
                    temp[name].fire.ref[actionCommands.label].speed.horizontal.root = tempBullet.change.speed.horizontal.value;
                  }
                  switch (tempBullet.change.speed.horizontal.type) {
                    case "sequence":
                    case "sequenceAbsolute": {
                      tempBullet.change.speed.horizontal.change = (temp[name].fire.ref[actionCommands.label].speed.horizontal.value - tempBullet.speed.horizontal.value) / tempBullet.change.speed.horizontal.times;
                    }
                    break;
                    case "sequenceRelative": {
                      tempBullet.change.speed.horizontal.change = temp[name].fire.ref[actionCommands.label].speed.horizontal.value / tempBullet.change.speed.horizontal.times;
                    }
                    break;
                  }
                  temp[name].fire.ref[actionCommands.label].speed.horizontal.type = "sequence";
                }
                break;
                case "absolute": {
                  tempBullet.change.speed.horizontal.change = (tempBullet.change.speed.horizontal.value - tempBullet.speed.horizontal) / tempBullet.change.speed.horizontal.times;
                }
                break;
                case "multiply": {
                  tempBullet.change.speed.horizontal.change = (tempBullet.speed.horizontal * tempBullet.change.speed.horizontal.value - tempBullet.speed.horizontal) / tempBullet.change.speed.horizontal.times;
                }
                break;
              }
            }
            //Vertical speed
            if (actionCommands.speed.vertical) {
              //Set change vertical speed data
              if (!tempBullet.change.speed.vertical) {
                tempBullet.change.speed.vertical = {};
              }
              //Check for value
              tempBullet.change.speed.vertical.value = actionCommands.speed.vertical.value || 0;
              //Check for type
              if (actionCommands.speed.vertical.type) {
                tempBullet.change.speed.vertical.type = actionCommands.speed.vertical.type;
              } else {
                tempBullet.change.speed.vertical.type = "absolute";
              }
              //Check for times
              tempBullet.change.speed.vertical.times = actionCommands.speed.vertical.times || 1;
              //Calculate change
              switch (tempBullet.change.speed.vertical.type) {
                case "relative": {
                  tempBullet.change.speed.vertical.change = tempBullet.change.speed.vertical.value / tempBullet.change.speed.vertical.times;
                }
                break;
                case "sequence":
                case "sequenceAbsolute":
                case "sequenceRelative": {
                  if (typeof temp[name].fire.ref[actionCommands.label].speed.vertical.value !== "number") {
                    //Check for action base
                    if (typeof actionCommands.direction.base === "number") {
                      temp[name].fire.ref[actionCommands.label].speed.vertical.base = actionCommands.speed.vertical.base;
                    } else {
                      temp[name].fire.ref[actionCommands.label].speed.vertical.base = 0;
                    }
                    temp[name].fire.ref[actionCommands.label].speed.vertical.value = temp[name].fire.ref[actionCommands.label].speed.vertical.base;
                  } else if (typeof temp[name].fire.ref[actionCommands.label].speed.vertical.value === "number") {
                    temp[name].fire.ref[actionCommands.label].speed.vertical.value += tempBullet.change.speed.vertical.value;
                    temp[name].fire.ref[actionCommands.label].speed.vertical.root = tempBullet.change.speed.vertical.value;
                  }
                  switch (tempBullet.change.speed.vertical.type) {
                    case "sequence":
                    case "sequenceAbsolute": {
                      tempBullet.change.speed.vertical.change = (temp[name].fire.ref[actionCommands.label].speed.vertical.value - tempBullet.speed.vertical.value) / tempBullet.change.speed.vertical.times;
                    }
                    break;
                    case "sequenceRelative": {
                      tempBullet.change.speed.vertical.change = temp[name].fire.ref[actionCommands.label].speed.vertical.value / tempBullet.change.speed.vertical.times;
                    }
                    break;
                  }
                  temp[name].fire.ref[actionCommands.label].speed.vertical.type = "sequence";
                }
                break;
                case "absolute": {
                  tempBullet.change.speed.vertical.change = (tempBullet.change.speed.vertical.value - tempBullet.speed.vertical) / tempBullet.change.speed.vertical.times;
                }
                break;
                case "multiply": {
                  tempBullet.change.speed.vertical.change = (tempBullet.speed.vertical * tempBullet.change.speed.vertical.value - tempBullet.speed.vertical) / tempBullet.change.speed.vertical.times;
                }
                break;
              }
            }
          }
        }
      } else {
        throw new Error("Change must be called in not fire actions");
      }
    },
    normalize: function(actionLabel, mainActionLabel, actionData, tempCommands, actionCommands, tempBullet) {
      if (flag[name].actions.ref[actionLabel]) {
        switch (actionCommands.type) {
          case "sequence": {
            temp[name].fire.temp[actionLabel][checkLabel()].direction.value = normalizeAngle(temp[name].fire.temp[actionLabel][checkLabel()].direction.value);
          }
          break;
          case "sequenceChange": {
            if (actionCommands.isChange !== true) {
              throw new Error("Label is not \"change\"");
            }
            temp[name].fire.ref[checkLabel(true)].direction.value = normalizeAngle(temp[name].fire.ref[checkLabel(true)].direction.value);
          }
          break;
          default: {
            //bullet process
            if (mainActionLabel !== actionLabel) {
              tempBullet.direction.value = normalizeAngle(tempBullet.direction.value);
            } else {
              throw new Error("Unknown normalize type");
            }
          }
        }
      } else {
        throw new Error("Normalize must be called in not fire actions");
      }
      function checkLabel(isBullet) {
        if (actionLabel === mainActionLabel) {
          if (actionCommands.label) {
            return actionCommands.label;
          } else {
            throw new Error("Label must be defined in normalize main action");
          }
        } else if (actionLabel !== mainActionLabel && tempBullet) {
          if (actionCommands.label) {
            return actionCommands.label;
          } else if (!isBullet) {
            return tempBullet.label;
          }
        } else {
          throw new Error("Label must be defined in normalize commands");
        }
      }
    },
    freeze: function(actionLabel, mainActionLabel, actionData, tempCommands, actionCommands, tempBullet) {
      
    },
    reset: function(actionLabel, mainActionLabel, actionData, tempCommands, actionCommands, tempBullet) {
      //Set temp data
      var tempData = temp[name].fire.temp[actionLabel][actionCommands.label];
      var tempDataTwo = temp[name].fire.ref[actionCommands.label];
      //Check if sequence
      switch (actionCommands.type) {
        case "direction": {
          if (tempData.direction.type === "sequence") {
            tempData.direction.value = (actionCommands.value || tempData.direction.base) - tempData.direction.root;
          } else {
            throw new Error("sequence type is not sequence");
          }
        }
        break;
        case "directionChange": {
          checkChange();
          if (tempDataTwo.direction.type === "sequence") {
            tempDataTwo.direction.value = (actionCommands.value || tempDataTwo.direction.base) - tempDataTwo.direction.root;
          } else {
            throw new Error("sequenceChange type is not change sequence");
          }
        }
        break;
        case "horizontal": {
          if (tempData.speed.horizontal.type === "sequence") {
            tempData.speed.horizontal.value = (actionCommands.value || tempData.speed.horizontal.base) - tempData.speed.horizontal.root;
          } else {
            throw new Error("speed horizontal type is not sequence");
          }
        }
        break;
        case "vertical": {
          if (tempData.speed.vertical.type === "sequence") {
            tempData.speed.vertical.value = (actionCommands.value || tempData.speed.vertical.base) - tempData.speed.vertical.root;
          } else {
            throw new Error("speed vertical type is not sequence");
          }
        }
        break;
        case "horizontalChange": {
          checkChange();
          if (tempDataTwo.speed.horizontal.type === "sequence") {
            tempDataTwo.speed.horizontal.value = (actionCommands.value || tempDataTwo.speed.horizontal.base) - tempDataTwo.speed.horizontal.root;
          } else {
            throw new Error("speed horizontalChange type is not sequence");
          }
        }
        break;
        case "verticalChange": {
          checkChange();
          if (tempDataTwo.speed.vertical.type === "sequence") {
            tempDataTwo.speed.vertical.value = (actionCommands.value || tempDataTwo.speed.vertical.base) - tempDataTwo.speed.vertical.root;
          } else {
            throw new Error("speed verticalChange type is not sequence");
          }
        }
        break;
        default: {
          throw new Error("Undefined reset type");
        }
      }
      function checkChange() {
        if (actionCommands.isChange !== true) {
          throw new Error("Label is not \"change\"");
        }
      }
    },
    vanish: function(actionLabel, mainActionLabel, actionData, tempCommands, actionCommands, tempBullet) {
      //Remove all bullet is null
      var tempLabel = (function() {
        if (actionCommands.type === "current") {
          if (tempBullet) {
            return tempBullet.label;
          } else {
            throw new Error("Current must use in actionRef");
          }
        } else if (!actionCommands.label) {
          if (tempBullet) {
            return tempBullet.label;
          } else {
            throw new Error("Label didn't defined");
          }
        } else {
          return actionCommands.label;
        }
      })();
      var bulletGroup = temp[name].bullets[mainActionLabel][tempLabel], bulletCount = 0, tempIndex = bulletGroup.length - 1;
      var tempType = (function() {
        if (actionLabel !== mainActionLabel) {
          return tempBullet.type;
        } else if (actionLabel === mainActionLabel) {
          //Check for label
          if (actionCommands.label) {
            return temp[name].fire.data[actionLabel][tempLabel].type;
          } else {
            throw new Error("Label must be defined in vanish main action");
          }
        }
      })();
      (function mainVanish() {
        switch (actionCommands.type) {
          case "current": {
            temp[name].count[tempBullet.type] --;
            flag[name].configs.shot[tempType].vanish(bulletGroup[tempBullet.count]);
            bulletGroup[tempBullet.count] = null;
          }
          break;
          case "first": {
            for (bulletCount = 0; bulletCount < actionCommands.value; bulletCount ++) {
              if (bulletGroup.length < actionCommands.value) {
                actionCommands = {
                  type: "all"
                };
                mainVanish();
                break;
              }
              temp[name].count[bulletGroup[bulletCount].type] --;
              flag[name].configs.shot[tempType].vanish(bulletGroup[bulletCount]);
              bulletGroup[bulletCount] = null;
            }
          }
          break;
          case "last": {
            for (bulletCount = 0; bulletCount < actionCommands.value; bulletCount ++) {
              if (bulletGroup.length < actionCommands.value) {
                actionCommands = {
                  type: "all"
                };
                mainVanish();
                break;
              }
              temp[name].count[bulletGroup[tempIndex].type] --;
              flag[name].configs.shot[tempType].vanish(bulletGroup[tempIndex]);
              bulletGroup[tempIndex] = null;
              tempIndex --;
            }
          }
          break;
          case "random": {
            for (bulletCount = 0; bulletCount < actionCommands.value; bulletCount ++) {
              do {
                tempIndex = Math.floor(Math.random() * bulletGroup.length);
                if (bulletGroup.every(function(bulletData) {
                  return bulletData === null;
                })) {
                  break;
                }
              } while (bulletGroup[tempIndex] === null);
              temp[name].count[bulletGroup[tempIndex].type] --;
              flag[name].configs.shot[tempType].vanish(bulletGroup[tempIndex]);
              bulletGroup[tempIndex] = null;
            }
          }
          break;
          default: {
            for (bulletCount = 0; bulletCount < bulletGroup.length; bulletCount ++) {
              temp[name].count[bulletGroup[bulletCount].type] --;
              flag[name].configs.shot[tempType].vanish(bulletGroup[bulletCount]);
              bulletGroup[bulletCount] = null;
            }
          }
        }
      })();
    }
  };
  //-------------- END SHOT ZONE --------------
  //------------ OTHER STUFF ZONE -------------
  //Helper function
  function positionData(position, isSet) {
    if (!flag[name].configs.positionType) {
      flag[name].configs.positionType = "array";
    }
    if (isSet) {
      if (run(flag[name].configs.positionType, true) === "object") {
        return {
          x: position[0],
          y: position[1]
        };
      } else {
        return position;
      }
    } else {
      if (run(flag[name].configs.positionType, true) === "object") {
        return [position.x, position.y];
      } else {
        return position;
      }
    }
  }
  function resetAction(actionLabel) {
    temp[name].isFiring[actionLabel] = false;
    temp[name].fire.temp[actionLabel] = {};
    temp[name].commands[actionLabel] = [{
      location: 0,
      times: 1,
      actions: flag[name].actions.fire[actionLabel],
      label: actionLabel
    }];
    temp[name].wait[actionLabel] = {};
  }
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
  function extend(from, to) {
    if (from == null || typeof from != "object") {
      return from;
    }
    if (from.constructor != Object && from.constructor != Array) {
      return from;
    }
    if (from.constructor == Date || from.constructor == RegExp || from.constructor == Function || from.constructor == String || from.constructor == Number || from.constructor == Boolean) {
      return new from.constructor(from);
    }
    to = to || new from.constructor();
    for (var name in from) {
      to[name] = typeof to[name] == "undefined" ? extend(from[name], null) : to[name];
    }
    return to;
  }
  function extendRun(from, to) {
    if (from == null || typeof from != "object") {
      return from;
    }
    if (from.constructor != Object && from.constructor != Array) {
      return from;
    }
    if (from.constructor == Date || from.constructor == RegExp || from.constructor == Function || from.constructor == String || from.constructor == Number || from.constructor == Boolean) {
      return new from.constructor(from);
    }
    to = to || new from.constructor();
    for (var name in from) {
      to[name] = typeof to[name] == "undefined" ? typeof from[name] === "function" ? name === "movement" ? from[name] : from[name]() : extendRun(from[name], null) : to[name];
    }
    return to;
  }
  function extendWait(fromwhat) {
    var key;
    function betaRun(from, to) {
      if (from == null || typeof from != "object") {
        return from;
      }
      if (from.constructor != Object && from.constructor != Array) {
        return from;
      }
      if (from.constructor == Date || from.constructor == RegExp || from.constructor == Function || from.constructor == String || from.constructor == Number || from.constructor == Boolean) {
        return new from.constructor(from);
      }
      to = to || new from.constructor();
      for (var name in from) {
        to[name] = typeof to[name] == "undefined" ? typeof from[name] === "function" ? (function() {
          if (key === "direction" && name === "movement") {
            return from[name];
          }
          if (key === "wait" && name === "times") {
            return from[name];
          }
          if (key === "freeze" && name === "times") {
            return from[name];
          }
          return from[name]();
        })() : betaRun(from[name], null, (function() {
          if (name === "func" && from[name] === "wait" && key === undefined) {
            key = "wait";
          }
          if (name === "func" && from[name] === "freeze" && key === undefined) {
            key = "freeze";
          }
          if (name === "func" && from[name] === "direction" && key === undefined) {
            key = "direction";
          }
          return undefined;
        })()) : to[name];
      }
      return to;
    }
    return betaRun(fromwhat);
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
    }
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
  }
  Math.pythagorean = function(a, b) {
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
