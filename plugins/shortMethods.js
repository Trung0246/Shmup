/*
  shortMethods.js v0.01
  For Shmup.js 1.0.11 and newer
  https://github.com/Trung0246/Shmup/new/master/plugins
*/

var MD = {};
MD.rp = function(times, actions) {
  return {
    func: "repeat",
    times: times,
    actions: actions,
  };
};
MD.w = function(type, times) {
  return {
    func: "wait",
    type: type,
    times: times,
  };
};
MD.fr = function(type, label, movement, position, direction, speed) {
  if (typeof movement === "function") {
    return {
      func: "fire",
      type: type,
      label: label,
      movement: movement,
    };
  } else {
    return {
      func: "fire",
      type: type,
      label: label,
      position: position,
      direction: direction,
      speed: speed,
    };
  }
};
MD.d = function(type, value, target) {
  return {
    value: value,
    type: type,
    target: target,
  };
};
MD.s = function(HType, HValue, VType, VValue) {
  return {
    horizontal: {
      value: HValue,
      type: HType,
    },
    vertical: {
      value: VValue,
      type: VType,
    },
  };
};
MD.p = function(now, end) {
  return {
    now: now,
    end: end,
  };
};
MD.v = function(type, value) {
  if (type === "current" || type === "all") {
    return {
      func: "vanish",
      type: type,
    };
  } else {
    return {
      func: "vanish",
      type: type,
      value: value,
    };
  }
};
MD.c = function(position, movement, direction, speed) {
  if (typeof movement === "function") {
    return {
      func: "change",
      movement: movement,
    };
  } else {
    return {
      func: "change",
      position: position,
      direction: direction,
      speed: speed,
    };
  }
};
MD.cp = function(now, end, times) {
  return {
    now: now,
    end: end,
    times: times,
  };
};
MD.cd = function(value, times, type) {
  return {
    value: value,
    times: times,
    type: type,
  };
};
MD.cs = function(HValue, HTimes, HType, VValue, VTimes, VType) {
  return {
    horizontal: {
      value: HValue,
      times: HTimes,
      type: HType,
    },
    vertical: {
      value: Vvalue,
      times: VTimes,
      type: VType,
    },
  };
};
MD.fz = function(label, times) {
  return {
    func: "freeze",
    label: label,
    times: times,
  };
};
MD.rs = function(label, type, value) {
  return {
    func: "reset",
    label: label,
    type: type,
    value: value,
  };
};
MD.fc = function(callback) {
  return {
    func: "func",
    callback: callback,
  };
};
