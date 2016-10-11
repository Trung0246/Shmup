(function(window) {
  "use strict";
  var VERSION = "1.0.0";
  
  /*
  ----------------- TODO LIST -----------------
  
  1) Create checkError(type, checkData) function to check error of type's parameter if "checkData" is defined
  2) Create checkError(type, checkData) function to check error if flag[name]."type" is defined if "checkData" is not defined
  3) Change "testChange" function to compatible with actions
  4) Retest "testChange" after changed function
  5) Make a way to remove bullets
  6) Make fire to work with actionRef and bulletRef
  7) Create new repeat algorithm to work like reference
  
  --------------- END TODO LIST ---------------
  */
  /*
  ----------------- LOGIC LIST ----------------
  
  1) If commands.update() is called, then now frame will be plus to 1, and then when drawing function run,
  it will check if frame is updated by checking now frame is larger than old frame, then plus old frame to
  equal now frame, and use now frame to calculate frame to update bullets. This prevent frame being skipped
  without drawing anything.
  
  2) If temp wait value = 0, keep running commands, if wait value is set to random number is not 0, then
  minus 1 for each wait then skip other commands until commands.update() is called to update frame.
  
  3) If wait is called, then add wait times to temp wait and break the loop of methods, get current location
  of array methods, then when update() is called again, check if wait is 0, then get previous location and
  start from there.
  
  --------------- END LOGIC LIST --------------
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
    checkError("", data);
    
    //Set new configs to "flag[name]"
    flag[name].configs = data;
    
    //Set frame to detect if frame is updated
    /*if (!temp.flag[name].frame) {
      temp.flag[name].frame = {
        now: -1,
        old: -1,
      };
    }*/
    
    return this;
  };
  
  //Commands to set actions data to "flag[name]"
  commands.actions = function(actionLabel, isFire, data) {
    //Check error if "flag[name].configs" is defined
    checkError("configs");
    
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
    
    //Set actions to "temp.flag[name]"
    //Check if temp actions if defined
    if (!temp.flag[name].actions) {
      temp.flag[name].actions = {};
    }
    
    //Set temp data of actions and wait data
    if (isFire) {
       //Check if main action is defined
      if (!temp.flag[name].actions.fire) {
        temp.flag[name].actions.fire = {};
      }
      //Check if label main action is defined
      if (!temp.flag[name].actions.fire[actionLabel]) {
        temp.flag[name].actions.fire[actionLabel] = [];
      }
    } else {
       //Check if secondary action is defined
      if (!temp.flag[name].actions.ref) {
        temp.flag[name].actions.ref = {};
      }
       //Check if label secondary action is defined
      if (!temp.flag[name].actions.ref[actionLabel]) {
        temp.flag[name].actions.ref[actionLabel] = [];
      }
    }
    
    //Set bullets group if not defined
    if (!temp.flag[name].bullets) {
      temp.flag[name].bullets = {};
    }
    //Set bullets label group
    if (!temp.flag[name].bullets[actionLabel]) {
      temp.flag[name].bullets[actionLabel] = {};
    }
    
    //Set fire flag to determite if action is active when frame is updated
    if (isFire) {
      //Check if isFire object is defined
      if (!temp.flag[name].isFire) {
        temp.flag[name].isFire = {};
      }
      //Check if isFire boolean is defined
      if (!temp.flag[name].isFire[actionLabel]) {
        temp.flag[name].isFire[actionLabel] = false;
      }
    }
    
    //Set wait data
    //Set wait object if not defined
    if (!temp.flag[name].wait) {
      temp.flag[name].wait = {};
    }
    //Set temp wait object of action
    if (!temp.flag[name].wait[actionLabel]) {
      temp.flag[name].wait[actionLabel] = {};
    }
    //Set temp wait count
    if (!temp.flag[name].wait[actionLabel]._count) {
      temp.flag[name].wait[actionLabel]._count = 0;
    }
    //Set temp wait location
    if (!temp.flag[name].wait[actionLabel]._location) {
      temp.flag[name].wait[actionLabel]._location = 0;
    }
    //Set repeat group
    if (!temp.flag[name].repeat) {
      temp.flag[name].repeat = {};
    }
    //Set repeat group
    if (!temp.flag[name].repeat[actionLabel]) {
      temp.flag[name].repeat[actionLabel] = {};
    }
    
    //Set fire data
    if (!flag[name].fire) {
      flag[name].fire = {};
    }
    //Set fire of action
    if (!flag[name].fire[actionLabel]) {
      flag[name].fire[actionLabel] = {};
    }
    
    //Set temp fire data
    if (!temp.flag[name].fire) {
      temp.flag[name].fire = {};
    }
    //Set temp fire of action
    if (!temp.flag[name].fire[actionLabel]) {
      temp.flag[name].fire[actionLabel] = {};
    }
    return this;
  };
  
  //Commands to fire main actions
  commands.fire = function(actionLabel) {
    //Check error if "flag[name].actions" is defined
    checkError("actions");
    //Check if actionLabel is defined is isFire is false
    if (actionLabel && !temp.flag[name].isFire[actionLabel]) {
      //Change isFire boolean to true to enable fire,
      temp.flag[name].isFire[actionLabel] = true;
    }
    
    //Fire code
    //Check for every keys in actions.fire group
    for (count3 = 0; count3 < Object.keys(temp.flag[name].actions.fire).length; count3 ++) {
      //Do action methods
      //Set temp action label
      var actionLabel = Object.keys(temp.flag[name].bullets)[count3];
      //Check if isFire set to true and actionLabel exist in actions.fire
      if (flag[name].actions.fire[actionBulletLabel] && temp.flag[name].isFire[actionLabel]) {
        //Set isFire to string to determite that isFire is fired, not disabled
        temp.flag[name].isFire[actionLabel] = "true";
        //Run actions methods with actionLabel
        methods.actions(actionLabel);
      }
    }
  };
  
  //Commands to unfire main actions
  commands.unfire = function(actionLabel) {
    //Check error if "flag[name].actions" is defined
    checkError("actions");
    //Check if actionLabel is defined is isFire is true
    if (actionLabel && temp.flag[name].isFire[actionLabel]) {
      //Change isFire boolean to false to disable fire,
      temp.flag[name].isFire[actionLabel] = false;
    }
  };
  
  //Commands to update frame
  commands.update = function(actionLabel) {
    //Check error if "flag[name].fire" is defined
    checkError("fire");
    
    //Draw, update frame and minus wait time
    if (temp.flag[name].wait[actionLabel]._count) {
      //Check if wait time equal to 0, then restart the actions methods to run from previous location
      if (temp.flag[name].wait[actionLabel]._count <= 0) {
        //Process to recall action methods
        methods.actions(actionLabel);
      //Check if number and larger than 0
      } else if (typeof temp.flag[name].wait[actionLabel]._count === "number" && temp.flag[name].wait[actionLabel]._count > 0) {
        //Minus wait frame to 1
        temp.flag[name].wait[actionLabel]._count --;
      }
    } else {
      //Process infinite loop?
    }
    //Draw bullet inside bullets group and check if isFire is true to fire bullet
    //Loop for every keys in temp.flag[name].bullets
    for (count = 0; count < Object.keys(temp.flag[name].bullets).length; count ++) {
      //Set temp data for current bulllet group
      var tempBulletGroup = temp.flag[name].bullets[Object.keys(temp.flag[name].bullets)[count]];
      //Loop for every bullets in bullet group
      for (count2 = 0; count2 < tempBulletGroup.length; count2 ++) {
        //Set temp bullet data
        var tempBullet = tempBulletGroup[count2];
        //Update x and y value
        if (tempBullet.movement) {
          //Calculate position based on defined formula
          tempBullet.position.now = tempBullet.movement(tempBullet.frame);
        } else {
          //Calculate x value
          tempBullet.position.now[0] = Math.sin(tempBullet.direction.value) * tempBullet.speed.horizontal.value * tempBullet.frame + flag[name].configs.position;
          //Calculate y value
          tempBullet.position.now[1] = Math.cos(tempBullet.direction.value) * tempBullet.speed.horizontal.value * tempBullet.frame + flag[name].configs.position;
          //Update direction angle
          tempBullet.direction.value += getAngle(tempBullet.direction.velocity.value * tempBullet.frame);
          //Update horizontal speed
          tempBullet.speed.horizontal.value += tempBullet.speed.velocity.horizontal.value * tempBullet.frame;
          //Update vertical list
          tempBullet.speed.vertical.value += tempBullet.speed.velocity.vertical.value * tempBullet.frame;
        }
        //Update frame for each bullet
        tempBullet.frame ++;
        //Draw bullet based on position
        flag[name].configs.shot[type].sprite(tempBullet.position.now);
        //Save tempBullet to main bullet holder
        temp.flag[name].bullets[Object.keys(temp.flag[name].bullets)[count]][count2] = tempBullet;
      }
    }
    return this;
  };
  //------------- END COMMANDS ZONE -----------
  //--------------- METHODS ZONE --------------
  methods.actions = function(actionLabel) {
    //Process actions, if wait is called then keep count value like count -- back, if wait is 0, then process next commands
    //Make actions process with repeat
    //Set action data
    var actionDataRaw;
    //Flatten actions
    //Check if exist in fire, else ref, esle throw error for not exist, then flat action
    if (flag[name].actions.fire[actionLabel]) {
      //Flat raw actions
      temp.flag[name].actions.fire[actionLabel] = flattenActions(flag[name].actions.fire[actionLabel]);
    } else if (flag[name].actions.ref[actionLabel]) {
      temp.flag[name].actions.ref[actionLabel] = flattenActions(flag[name].actions.ref[actionLabel]);
    } else {
      throw new Error(actionLabel + " didn't defined");
    }
    //Check if actionDataRaw is exist in fire, yes then set actionDataRaw, else set action.ref data
    if (typeof temp.flag[name].actions.fire[actionLabel]) {
      actionDataRaw = temp.flag[name].actions.fire[actionLabel];
    } else if (typeof temp.flag[name].actions.ref[actionLabel]) {
      actionDataRaw = temp.flag[name].actions.ref[actionLabel];
    }
    //Process each commands
    (function() {
      //Check if isFire is set to true
      if (!temp.flag[name].isFire[actionLabel]) {
        return;
      }
      //Get previous wait location
      var count = temp.flag[name].wait[actionLabel]._location || 0;
      //Loop for each commands in actions, NOT loop for each repeat
      while (count < actionData.length) {
        //Run func for every keys in action data
        //Set actionData
        var actionData;
        //Loop for func function
        actionData = actionDataRaw.slice();
        for (countKeys = 0; countKeys < Object.keys[actionData[count]].length; countKeys ++) {
          //Run and set function or data
          actionData[count][Object.keys[actionData[count]][countKeys]] = runFunc(actionDataRaw[count][Object.keys[actionData[count]][countKeys]]);
        }
        //Compare with func label
        if (actionData[count].func) {
          switch (actionData[count].func) {
            case "fire": {
              //Check if label exist
              if (!actionData[count].label) {
                throw new Error("Fire label didn't defined");
              }
              //Set fire group data to fireRef
              if (flag[name].fire[actionLabel][actionData[count].label]) {
                //debugger;
                flag[name].fire[actionLabel][actionData[count].label] = Object.create(actionData[count]);
                delete flag[name].fire[actionLabel][actionData[count].label].func;
              }
              //Set temp fire group label
              if (!temp.flag[name].fire[actionLabel][actionData[count].label]) {
                temp.flag[name].fire[actionLabel][actionData[count].label] = {};
              }
              //Set temp fire group direction
              if (!temp.flag[name].fire[actionLabel][actionData[count].label].direction) {
                temp.flag[name].fire[actionLabel][actionData[count].label].direction = {};
              }
              //Set temp fire group speed
              if (!temp.flag[name].fire[actionLabel][actionData[count].label].speed) {
                temp.flag[name].fire[actionLabel][actionData[count].label].speed = {};
              }
              //Set temp fire group speed velocity
              if (!temp.flag[name].fire[actionLabel][actionData[count].label].speed.velocity) {
                temp.flag[name].fire[actionLabel][actionData[count].label].speed.velocity = {};
              }
              //Set temp fire group direction value
              temp.flag[name].fire[actionLabel][actionData[count].label].direction.value = orValue("direction.value");
              //Set temp fire group direction velocity
              temp.flag[name].fire[actionLabel][actionData[count].label].direction.velocity = orValue("direction.velocity");
              //Set temp fire speed horizontal
              temp.flag[name].fire[actionLabel][actionData[count].label].speed.horizontal = orValue("speed.horizontal.value");
              //Set temp fire speed vertical
              temp.flag[name].fire[actionLabel][actionData[count].label].speed.vertical = orValue("speed.vertical.value");
              //Set temp fire speed velocity horizontal
              temp.flag[name].fire[actionLabel][actionData[count].label].speed.velocity.horizontal = orValue("speed.velocity.horizontal.value");
              //Set temp fire speed velocity vertical
              temp.flag[name].fire[actionLabel][actionData[count].label].speed.velocity.vertical = orValue("speed.velocity.vertical.value");
              //Detect if inside action ref
              if (typeof flag[name].actions.ref[actionLabel]) {
                if (actionData[count].bulletRef) {
                  throw new Error("bulletRef tag can't be in action ref");
                }
              }
              var bulletData = {
                type: orValue("type"),
                position: {
                  now: runFunc(flag[name].configs.position),//TODO: make compatible with others action to shoot bullets from previous bullets
                  start: orValue("position.start"),
                  stop: orValue("position.stop"),
                },
                movement: runFunc(fire.movement, false),
                direction: {
                  value: runFunc(orValue("direction.value")),
                  velocity: orValue("direction.velocity.value"),
                  range: runFunc(orValue("direction.range")),
                },
                speed: {
                  horizontal: orValue("speed.horizontal"),
                  vertical: orValue("speed.vertical"),
                  velocity: {
                    horizontal: {
                      //type: undefined,
                      value: orValue("speed.velocity.horizontal.value"),
                      range: orValue("speed.velocity.horizontal.range"),
                    },
                    vertical: {
                      value: orValue("speed.velocity.vertical.value"),
                      range: orValue("speed.velocity.vertical.range"),
                    },
                  },
                },
                actionRef: orValue("actionRef"),
                frame: 0,
              };
              //Processing direction
              blockOne: {
                if (bulletData.movement) {
                  if (typeof bulletData.movement === "function") {
                    break blockOne;
                  }
                }
                if (bulletData.position.start) {
                  if (bulletData.position.stop) {
                    bulletData.position.now = bulletData.positions.start;
                    bulletData.direction.value = getAngle(angleAtoB(bulletData.position.start, bulletData.position.stop));
                    break blockOne;
                  } else {
                    bulletData.position.now = bulletData.positions.start;
                  }
                }
                if (bulletData.direction) {
                  switch (orValue("direction.type")) {
                    case "absolute": {
                      bulletData.direction.value = getAngle(orValue("direction.value"));
                    }
                    break;
                    case "sequence": {
                      bulletData.direction.value += getAngle(temp.flag[name].fire[actionLabel][actionData[count].label].direction.value);
                      temp.flag[name].fire[actionLabel][actionData[count].label].direction.value += getAngle(orValue("direction.value"));
                    }
                    break;
                    case "relative": {
                      if (!bulletData.direction.value) {
                        bulletData.direction.value = 0;
                      }
                      bulletData.direction.value += getAngle(orValue("direction.value"));
                    }
                    break;
                    case "aim": {
                      bulletData.direction.value = getAngle(angleAtoB(bulletData.position.now, flag[name].configs.target()));
                    }
                    break;
                    default: {
                      bulletData.direction.value = getAngle(0);
                    }
                  }
                  if (bulletData.direction.velocity.value) {
                    switch (orValue("direction.velocity.type")) {
                      case "absolute": {
                        bulletData.direction.velocity = getAngle(orValue("direction.velocity.value"));
                      }
                    break;
                      case "sequence": {
                        bulletData.direction.velocity += getAngle(temp.flag[name].fire[actionLabel][actionData[count].label].direction.velocity);
                        temp.flag[name].fire[actionLabel][actionData[count].label].direction.velocity += getAngle(orValue("direction.velocity.value"));
                      }
                    break;
                      case "relative": {
                        if (!bulletData.direction.velocity) {
                          bulletData.direction.velocity = 0;
                        }
                        bulletData.direction.velocity += getAngle(orValue("direction.velocity.value"));
                        break;
                      }
                    }
                  }
                }
                break blockOne;
              }
              //Processing speed and function
              blockTwo: {
                if (bulletData.movement) {
                  if (typeof bulletData.movement === "function") {
                    bulletData.position.now = runFunc(flag[name].configs.position, false);
                    break blockTwo;
                  }
                }
                if (bulletData.speed) {
                  if (bulletData.speed.horizontal.value) {
                    switch (orValue("speed.horizontal.type")) {
                      case "absolute": {
                        bulletData.speed.horizontal.value = orValue("speed.horizontal.value");
                      }
                      break;
                      case "sequence": {
                        bulletData.speed.horizontal.value += temp.flag[name].fire[actionLabel][actionData[count].label].speed.horizontal.value;
                        temp.flag[name].fire[actionLabel][actionData[count].label].speed.horizontal.value += orValue("speed.horizontal.value");
                      }
                      break;
                      case "relative": {
                        if (!bulletData.speed.horizontal.value) {
                          bulletData.speed.horizontal.value = 0;
                        }
                        bulletData.speed.horizontal.value += orValue("speed.horizontal.value");
                      }
                      break;
                      default: {
                        bulletData.speed.horizontal.value = 1;
                      }
                    }
                  }
                  if (bulletData.speed.vertical.value) {
                    switch (orValue("speed.vertical.type")) {
                      case "absolute": {
                        bulletData.speed.vertical.value = orValue("speed.vertical.value");
                      }
                      break;
                      case "sequence": {
                        bulletData.speed.vertical.value += temp.flag[name].fire[actionLabel][actionData[count].label].speed.vertical.value;
                        temp.flag[name].fire[actionLabel][actionData[count].label].speed.vertical.value += orValue(".speed.vertical.value");
                      }
                      break;
                      case "relative": {
                        if (!bulletData.speed.vertical.value) {
                          bulletData.speed.vertical.value = 0;
                        }
                        bulletData.speed.vertical.value += orValue("speed.vertical.value");
                      }
                      break;
                      default: {
                        bulletData.speed.vertical.value = 1;
                      }
                    }
                  }
                  if (bulletData.speed.horizontal.velocity) {
                    switch (orValue("speed.velocity.horizontal.type")) {
                      case "absolute": {
                        bulletData.speed.velocity.horizontal.value = orValue("speed.velocity.horizontal.value");
                      }
                      break;
                      case "sequence": {
                        bulletData.speed.velocity.horizontal.value += temp.flag[name].fire[actionLabel][actionData[count].label].speed.velocity.horizontal.value;
                        temp.flag[name].fire[actionLabel][actionData[count].label].speed.velocity.horizontal.value += orValue("speed.velocity.horizontal.value");
                      }
                      break;
                      case "relative": {
                        if (!bulletData.speed.velocity.horizontal.value) {
                          bulletData.speed.velocity.horizontal.value = 0;
                        }
                        bulletData.speed.velocity.horizontal.value += orValue("speed.velocity.horizontal.value");
                      }
                      break;
                      default: {
                        bulletData.speed.velocity.horizontal.value = 0;
                      }
                    }
                  }
                  if (bulletData.speed.velocity.vertical) {
                    switch (orValue("speed.velocity.vertical.type")) {
                      case "absolute": {
                        bulletData.speed.velocity.vertical.value = orValue("speed.velocity.vertical.value");
                      }
                      break;
                      case "sequence": {
                        bulletData.speed.velocity.vertical.value += temp.flag[name].fire[actionLabel][actionData[count].label].speed.velocity.vertical.value;
                        temp.flag[name].fire[actionLabel][actionData[count].label].speed.velocity.vertical.value += orValue("speed.velocity.vertical.value");
                      }
                      break;
                      case "relative": {
                        if (!bulletData.speed.velocity.vertical.value) {
                          bulletData.speed.velocity.vertical.value = 0;
                        }
                        bulletData.speed.velocity.vertical.value += orValue("speed.velocity.vertical.value");
                      }
                      break;
                      default: {
                        bulletData.speed.velocity.vetical = 0;
                      }
                    }
                  }
                }
                break blockTwo;
              }
              //Set new bullet label group
              if (!temp.flag[name].bullets[actionLabel][actionData[count].label]) {
                temp.flag[name].bullets[actionLabel][actionData[count].label] = [];
              }
              //Push new bullet to bullet group
              temp.flag[name].bullets[actionLabel][actionData[count].label].push(bulletData);
              //Other function
              function orValue(value1) {
                if (!actionData[count].fireRef) {
                  return actionData[count].byString(value1);
                }
                return actionData[count].byString(value1) || flag[name].fire[actionLabel][actionData[count].fireRef].byString(value1);
              }
              //Math function for change
              //(new - old) / speed = numberPlus
              //old + numberPlus * speed = new
            }
            break;
            case "wait": {
              //Check if label exist
              if (!actionData[count].label) {
                //Generate random label
                actionData[count].label = randomString();
              }
              //Check if temp label exist
              if (!temp.flag[name].wait[actionLabel][actionData[count].label]) {
                //Set wait group
                temp.flag[name].wait[actionLabel][actionData[count].label] = {};
              }
              //Check if previous temp wait label exist and check if count is must be 0
              if (temp.flag[name].wait[actionLabel][actionData[count].label] && temp.flag[name].wait[actionLabel]._count === 0) {
                //Plus value to velocity
                temp.flag[name].wait[actionLabel][actionData[count].label].value += actionData[count].velocity;
              } else {
                //Set temp wait value
                temp.flag[name].wait[actionLabel][actionData[count].label].value = actionData[count].value;
              }
              //Set temp wait location and plus 1
              temp.flag[name].wait[actionLabel]._location = count + 1;
              //Set value to count
              temp.flag[name].wait[actionLabel]._count = temp.flag[name].wait[actionLabel][actionData[count].label].value;
              //Break loop
              return;
            }
            break;
            case "vanish": {
              
            }
            break;/*
            case "repeat": {
              //Set temp repeat label group (reference, not create new)
              if (temp.flag[name].repeat[actionLabel][actionData[count].label]) {
                temp.flag[name].repeat[actionLabel][actionData[count].label] = actionData[count];
              }
              //Set temp data of repeat
              //Set temp count
              if (!temp.flag[name].repeat[actionLabel][actionData[count].label].count) {
                temp.flag[name].repeat[actionLabel][actionData[count].label].count = {};
              }
              //Set previous count
              if (!temp.flag[name].repeat[actionLabel][actionData[count].label].count.previous) {
                temp.flag[name].repeat[actionLabel][actionData[count].label].count.previous = count;
              }
              //Set repeat now count
              if (!temp.flag[name].repeat[actionLabel][actionData[count].label].count.now) {
                temp.flag[name].repeat[actionLabel][actionData[count].label].count.now = actionData[count].value;
              }
            }
            break;*/
            case "change": {
              if (!typeof flag[name].actions.ref[actionLabel]) {
                throw new Error("\"change\" can be only called in ref actions");
              }
              
            }
            break;
            case "func": {
              actionData[count].callback();
            }
            break;
            case "stop": {
              //Check if stop is called in repeat commands
              if (!repeatLabel) {
                throw new Error("\"stop\" command didn't use in repeat command");
              }
              break;
            }
          }
        }
        //Check if repeat tag is string
        if (typeof actionData[count] === "string") {
          //Check if start loop else check if end loop, else throw error for critical error
          //Set temp tempRepeat
          var tempRepeat = {};
          if (actionData[count].match(/__\S+__\s-_[0-9]+-_\s_-[0-9]+_-\s\[([0-9]|Infinity)+,[0-9]+\]/g)) {
            //Set temp tempRepeat
            tempRepeat = actionData[count];
            //Get label tempRepeat
            tempRepeat.label = findRepeatString(actionData[count], "label");
            //Get times tempRepeat
            tempRepeat.times = findRepeatString(actionData[count], "times");
            //Get velocity tempRepeat
            tempRepeat.velocity = findRepeatString(actionData[count], "velocity");
            //Get range tempRepeat
            tempRepeat.range = findRepeatString(actionData[count], "range");
            //Get raw tempRepeat
            //Set temp raw tempRepeat
            var tempRepeatRaw;
            //Check if fire or ref
            if (findRepeatTag(flag[name].actions.fire[actionLabel], tempRepeat.label)) {
              //Set temp raw
              tempRepeatRaw = findRawRepeatData(findRepeatTag(flag[name].actions.fire[actionLabel], tempRepeat.label));
            } else if (findRepeatTag(flag[name].actions.ref[actionLabel], tempRepeat.label)) {
              tempRepeatRaw = findRawRepeatData(findRepeatTag(flag[name].actions.ref[actionLabel], tempRepeat.label));
            }
            //Calculation
            //Calculate repeat count
            if (tempRepeat.times > 0) {
              //Minus 1
              tempRepeat.times --;
            }
            //Set location
            temp.flag[name].repeat[actionLabel][tempRepeat.label].location = count;
            //Set repeat boolean to false if boolean is already true for velocity check
            if (!temp.flag[name].repeat[actionLabel][tempRepeat.label].isNotEnd && tempRepeat.velocity !== 0) {
              temp.flag[name].repeat[actionLabel][tempRepeat.label].isNotEnd = true;
              //Calculate velocity and check if smaller or larger than range
              tempRepeat.times = (function() {
                if (temp.flag[name].repeat[actionLabel][tempRepeat.label].times > tempRepeatRaw.range[0] && temp.flag[name].repeat[actionLabel][tempRepeat.label].times < tempRepeatRaw.range[1]) {
                  //Plus velocity to times
                  temp.flag[name].repeat[actionLabel][tempRepeat.label].times += tempRepeatRaw.velocity;
                  return temp.flag[name].repeat[actionLabel][tempRepeat.label].times;
                }
              })();
            }
            //Reset repeat tag in actionData[count] to new set
            actionData[count] = "__" + tempRepeat.label + "__" + " " + "-_" + tempRepeat.times + "-_" + " " + "_-" + tempRepeat.velocity + "_-" + " " + JSON.stringify(tempRepeat.range);
            //Continue loop
            count ++;
          } else if (actionData[count].match(/__\S+__\send/g)) {
            //Get tempRepeat label
            tempRepeat.label = findRepeatString(actionData, "label");
            //Get start repeat indexOf
            for (counting = 0; counting < actions.length; counting ++) {
              //Check if string
              if (typeof actionData[counting] === "string") {
                //Set regexp based on label
                if (actionData[counting].match(new RegExp("__" + tempRepeat.label + "__\\s-_[0-9]+-_\\s_-[0-9]+_-\\s\\[([0-9]|Infinity)+,[0-9]+\\]", "g"))) {
                  //Get count data
                  tempRepeat.times = findRepeatString(actionData, "times");
                  break;
                }
              }
            }
            //Check if times is larger than 0, else continue
            if (tempRepeat.times > 0) {
              //Get location then set to count
              count = temp.flag[name].repeat[actionLabel][tempRepeat.label].location;
            } else if (tempRepeat.times <= 0) {
              //Set isNotEnd to false
              temp.flag[name].repeat[actionLabel][tempRepeat.label].isNotEnd = false;
              //Plus count
              count ++;
            }
          } else {
            throw new Error("CRITICAL ERROR !! CODE WRONG AT REPEAT");
          }
          //Check if ended
        } else if (count + 1 === actionData.length) {
          temp.flag[name].isFire[actionLabel] = false;
          //Reset everything, except bullet group, powerful code
          //Break loop and exit
          return;
        } else {
          //Plus 1 to count
          count ++;
        }
      }
    })();
  };
  //------------- END METHODS ZONE ------------
  //------------ OTHER STUFF ZONE -------------
  //Repeat helper function
  function flattenActions(data) {
    function* flatten(array) {
      for (elt of array) {
        if (Array.isArray(elt.actions) && elt.func === "repeat") {
          var temp = elt.actions.slice();
          if (!temp.flag[name].repeat[actionLabel][elt.label]) {
            temp.flag[name].repeat[actionLabel][elt.label] = {};
            temp.flag[name].repeat[actionLabel][elt.label].isNotEnd = true;
            temp.flag[name].repeat[actionLabel][elt.label].location = 0;
            temp.flag[name].repeat[actionLabel][elt.label].times = elt.times;
          }
          elt.lebel = elt.label || randomString();
          temp.unshift("__" + elt.label + "__" + " " + "-_" + elt.times + "-_" + " " + "_-" + elt.velocity + "_-" + " " + JSON.stringify(elt.range));
          temp.push( "__" + elt.label + "__" + " end");
          yield *flatten(temp);
        } else {
          yield elt;
        }
      }
    }
    function testChange(arrayData) {
      function uniq(a) {
        return Array.from(new Set(a));
      }
      return uniq(arrayData.flattenTest());
    }
    return Array.from(flatten(data.slice()));
  }
  function findRepeatString(string, type) {
    if (type === "label") {
      string = string.match(/__\S+__/g).toString().replaceAll("__", "");
    } else if (type === "times") {
      string = string.match(/-_[0-9]+-_/g).toString().replaceAll("-_", "");
    } else if (type === "velocity") {
      string = string.match(/_-[0-9]+_-/g).toString().replaceAll("_-", "");
    } else if (type === "range") {
      string = JSON.parse(string.match(/\[[0-9]+,[0-9]+\]/g).toString());
    }
    return string;
  }
  function findRawRepeatData(actions, tag) {
    var data = eval("actions" + JSON.stringify(findRepeatTag(actions, tag)).replaceAll(",", "].actions["));
    return data;
  }
  function findRepeatTag(actions, tag) {
    var result;
    actions.some(function iter(path) {
      return function (a, i) {
        if (a.label === tag) {
          result = path.concat(i);
          return true;
        }
        return Array.isArray(a.actions) && a.actions.some(iter(path.concat(i)));
      };
    }([]));
    return result;
  }
  //Helper function
  String.prototype.escapeRegExp = function() {
    return this.valueOf().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };
  String.prototype.replaceAll = function(search, replacement) {
      var target = this;
      return target.replace(new RegExp(search.escapeRegExp(), 'g'), replacement);
  };
  function drawBullet(bullets, privateName) {
    //bullets = _private[name]._bullets[type][label];
    for (count = 0; count < bullets.length; count ++) {
      var bulletData = bullets[count];
      if (bulletData.movement) {
        bullet.position.now = bulletData.movement(bulletData._frame);
      } else {
        bullet.position.now[0] = Math.sin(bulletData.direction.value) * bulletData.speed.horizontal.value * bulletData._frame + _private[name].configs.position;
        bullet.position.now[1] = Math.cos(bulletData.direction.value) * bulletData.speed.horizontal.value * bulletData._frame + _private[name].configs.position;
        bulletData._frame ++;
        bulletData.direction.value += getAngle(bulletData.direction.velocity.value * bulletData._frame);
        bulletData.speed.horizontal.value += bulletData.speed.velocity.horizontal.value * bulletData._frame;
        bulletData.speed.vertical.value += bulletData.speed.velocity.vertical.value * bulletData._frame;
        privateName.configs.shot[type].sprite(bulletData.position.now);
      }
    }
    return bullets;
  }
  function runFunc(func, isString) {
    if (typeOf(func) === "function") {
      if (isString === false) {
        return func;
      } else {
        return func();
      }
    } else {
      return toNum(func, isString);
    }
  }
  function toNum(string, isString) {
    if (typeOf(string) === "string") {
      if (isNaN(string) === true) {
        if (isString === true) {
          return string;
        } else {
          throw new Error("Value is NaN");
        }
      } else {
        return Number(string);
      }
    } else if (typeOf(string) === "number" || typeOf(string) === "array" || typeOf(string) === "object" || typeOf(string === "regexp") || typeOf(string === "boolean")) {
      return string;
    } else {
      throw new Error("Invalid value");
    }
  }
  function typeOf(value) {
    Number.prototype.typeOf = function() {
      return "number";
    };
    String.prototype.typeOf = function() {
      return "string";
    };
    Boolean.prototype.typeOf = function() {
      return "boolean";
    };
    Array.prototype.typeOf = function() {
      return "array";
    };
    Object.prototype.typeOf = function() {
      return "object";
    };
    Function.prototype.typeOf = function() {
      return "function";
    };
    RegExp.prototype.typeOf = function() {
      return "regexp";
    };
    if (value === undefined || typeof value === "undefined") {
      return "undefined";
    } else if (value === null) {
      return "null";
    } else {
      try {
        return value.typeOf();
      } catch (error) {
        return typeof value;
      }
    }
  }
  function randomString() {
    return String("_") + (Math.random() * 1e36).toString(36);
  }
  Object.prototype.byString = function(s) {
    try {
      var o = this;
      s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
      s = s.replace(/^\./, ''); // strip a leading dot
      var a = s.split('.');
      for (var i = 0, n = a.length; i < n; ++i) {
        var k = a[i];
        if (k in o) {
          o = o[k];
        } else {
          return;
        }
      }
      return o;
    } catch (error) {
      throw error;
    }
  };
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
    if (!temp.flag) {
      temp.flag = {};
    }
    if (!temp.flag[name]) {
      temp.flag[name] = {};
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
