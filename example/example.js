var testing = Shmup("demo");
testing.configs({
  position: function() {
    return [100, 100];
  },
  target: function() {
    return [100, 200];
  },
  angleType: "degree",
  shot: {
    orb: {
      type: "bullet",
      draw: function(tempBullet) {
        
      },
    },
  },
});
testing.actions("main", true, [
  {
    func: "func",
    callback: function() {
      console.log("START");
    },
  }, {
    func: "wait",
    times: 1,
  }, {
    func: "repeat",
    times: 4,
    actions: [
      {
        func: "wait",
        times: 10,
      }, {
        func: "func",
        callback: function() {
          console.log("FIRE");
        },
      }, {
        func: "fire",
        type: "orb",
        /*direction: {
          value: 0,
          type: "absolute",
        },
        speed: {
          horizontal: {
            value: 1,
            type: "sequence",
          },
          vertical: {
            value: 1,
            type: "absolute",
          },
        },*/
        movement: function() {},
        actionRef: "second",
      },
    ],
  },
  /*{
    func: "func",
    callback: function() {
      console.log("TESTING");
    },
  }*/
]);
testing.actions("second", false, [
  {
    func: "wait",
    times: 50,
  }, /*{
    func: "change",
    direction: {
      value : 90,
      times: 10,
    },
    speed: {
      horizontal: {
        value: 2,
        times: 50,
      },
      vertical: {
        value: 0.5,
        times: 40,
      },
    },
  },*/{
    func: "func",
    callback: function() {
      console.log("FIREREF");
    },
  },
]);
