var bulletGroup = [], canvas, context, bulletTotal = 50;
var sceneSize = [500, 800];

var player = {
  x: sceneSize[0] / 2,
  y: sceneSize[1] -50,
  speed: 2.5,
  slow: 0.425,
};

var keyboard = {
  up: false,
  down: false,
  left: false,
  right: false,
};
window.addEventListener("keydown", function(e) {
  switch (e.keyCode) {
    case 37:
      keyboard.left = true;
      break;
    case 38:
      keyboard.up = true;
      break;
    case 39:
      keyboard.right = true;
      break;
    case 40:
      keyboard.down = true;
      break;
    case 16:
      keyboard.shift = true;
      break;
  }
}, false);
window.addEventListener("keyup", function(e) {
  switch (e.keyCode) {
    case 37:
      keyboard.left = false;
      break;
    case 38:
      keyboard.up = false;
      break;
    case 39:
      keyboard.right = false;
      break;
    case 40:
      keyboard.down = false;
      break;
    case 16:
      keyboard.shift = false;
      break;
  }
}, false);
window.addEventListener('keydown', function(e) {
  switch (e.keyCode) {
    case 37:
    case 38:
    case 39:
    case 40:
    case 16:
      e.preventDefault();
    break;
  }
}, false);

function isSlow() {
  if (keyboard.shift) {
    return player.slow;
  } else {
    return 1;
  }
}

window.onload = function() {
  canvas = document.createElement('canvas');
  canvas.width = sceneSize[0];
  canvas.height = sceneSize[1];
  canvas.fitWindow();
  context = canvas.getContext('2d');
  document.body.appendChild(canvas);
  testing.fire("main");
  gameLoop();
};

var testing = Shmup("demo");
testing.configs({
  position: function() {
    return [sceneSize[0] / 2, sceneSize[1] / 3.75];
  },
  target: function() {
    return [player.x, player.y];
  },
  angleType: "degree",
  shot: {
    orb: {
      type: "bullet",
      draw: function(tempBullet) {
        context.fillStyle = '#' + Math.floor(Math.random() * 16777215).toString(16);
        context.beginPath();
        context.arc(tempBullet.position.now[0], tempBullet.position.now[1], 10, 0, Math.PI * 2, true );
        context.closePath();
        context.fill();
      },
      callback: function(actionLabel, mainActionLabel, actionData, tempCommands, actionCommands, tempBullet) {
        //Check for out of bound
        if (tempBullet.position.now[0] < 0 || sceneSize[0] < tempBullet.position.now[0] || tempBullet.position.now[1] < 0 || sceneSize[1] < tempBullet.position.now[1]) {
          return "vanish";
        }
      },
      vanish: function() {
        
      },
    },
  },
});
testing.actions("main", true, [
  {
    func: "repeat",
    times: 20,
    actions: [
      {
        func: "fire",
        type: "orb",
        direction: {
          value: 5,
          type: "sequence",
        },
        speed: {
          horizontal: {
            value: 1,
            type: "absolute",
          },
          vertical: {
            value: 1,
            type: "absolute",
          },
        },
        actionRef: "second",
      }, {
        func: "fire",
        type: "orb",
        direction: {
          value: 10,
          type: "sequence",
        },
        speed: {
          horizontal: {
            value: 1,
            type: "absolute",
          },
          vertical: {
            value: 1,
            type: "absolute",
          },
        },
        actionRef: "second",
      }, {
        func: "wait",
        times: 50,
      },
    ],
  },
]);
testing.actions("second", false, [
  {
    func: "wait",
    times: 0,
  }, {
    func: "repeat",
    times: 100,
    actions: [
      {
        func: "fire",
        type: "orb",
        direction: {
          value: 0,
          type: "aim",
        },
        speed: {
          horizontal: {
            value: 0.01,
            type: "sequence",
          },
          vertical: {
            value: 0.01,
            type: "sequence",
          },
        },
        actionRef: "third",
      }, {
        func: "wait",
        times: 50,
      },
    ],
  },
]);
testing.actions("third", false, [
  {
    func: "wait",
    times: 100,
  }, /*{
    func: "vanish",
    type: "current",
  }*/{
    func: "change",
    speed: {
      horizontal: {
        value: 0,
        times: 1,
      },
      vertical: {
        value: 0,
        times: 1,
      },
    },
  }, {
    func: "wait",
    times: 150,
  }, {
    func: "change",
    position: {
      now: [sceneSize[0] / 2, sceneSize[1] / 3.75],
    },
    speed: {
      horizontal: {
        value: 4,
        times: 100,
      },
      vertical: {
        value: 4,
        times: 100,
      },
    },
  },
]);

function gameLoop() {
  if (keyboard.left) {
    player.x -= player.speed * isSlow();
  } else if (keyboard.right) {
    player.x += player.speed * isSlow();
  };
  if (keyboard.up) {
    player.y -= player.speed * isSlow();
  } else if (keyboard.down) {
    player.y += player.speed * isSlow();
  };
  player.x = Math.max(0, Math.min(player.x, sceneSize[0]));
  player.y = Math.max(0, Math.min(player.y, sceneSize[1]));
  context.fillStyle = '#000000';
  context.beginPath();
  context.arc(player.x, player.y, 5, 0, Math.PI * 2, true );
  context.closePath();
  context.fill();
  testing.update();
  requestAnimFrame(gameLoop);
}

HTMLCanvasElement.prototype.fitWindow = function() {
  var resize = function() {
    var rateWidth = this.width / window.innerWidth;
    var rateHeight = this.height / window.innerHeight;
    var rate = this.height / this.width;
    if (rateWidth > rateHeight) {
      this.style.width = innerWidth + "px";
      this.style.height = innerWidth * rate + "px";
    } else {
      this.style.width = innerHeight / rate + "px";
      this.style.height = innerHeight + "px";
    }
  }.bind(this);
  window.addEventListener("resize", resize, false);
  resize();
};

// requestAnim shim layer by Paul Irish
window.requestAnimFrame = (function(){
  return window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function(callback, element){
    window.setTimeout(callback, 1000 / 60);
  };
})();
// example code from mr doob : http://mrdoob.com/lab/javascript/requestanimationframe/
