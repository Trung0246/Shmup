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

var testing = Shmup("demo"), fps = 0, isKeepRunning = false;
testing.configs({
  frame: function(frameCount) {
    fps ++;
    document.getElementById("frame").innerHTML = "Frame: " + String(frameCount);
  },
  position: function() {
    return [sceneSize[0] / 2, sceneSize[1] / 3.75];
  },
  target:  {
    player: function() {
      return [player.x, player.y];
    },
  },
  angleType: "degree",
  shot: {
    orb: {
      type: "bullet",
      draw: function(tempBullet) {
        context.fillStyle = '#d22f33';
        context.beginPath();
        context.arc(tempBullet.position.now[0], tempBullet.position.now[1], 10, 0, Math.PI * 2, true );
        context.closePath();
        context.fill();
      },
      callback: function(actionLabel, mainActionLabel, actionData, tempCommands, actionCommands, tempBullet) {
        //Check for out of bound
        if (tempBullet.position.now[0] < -10 || sceneSize[0] + 10 < tempBullet.position.now[0] || tempBullet.position.now[1] < -10 || sceneSize[1] + 10 < tempBullet.position.now[1]) {
          return {
            func: "vanish",
            type: "current",
          };
        }
      },
      vanish: function() {
        
      },
      count: function(bulletCount) {
        document.getElementById("count").innerHTML = "Count: " + bulletCount;
      },
    },
  },
});
var countAngle = {
  one: 180 + 45,
  two: 180,
};
var countWait = 50;
testing.actions("main", true, [
  {
    func: "wait",
    times: 100,
  }, {
    func: "repeat",
    times: 6,
    actions: [
      {
        func: "repeat",
        times: 100,
        actions: [
          {
            func: "fire",
            type: "orb",
            label: "labelOne",
            direction: {
              value: function() {
                countAngle.one += 7.25;
                return countAngle.one;
              },
              target: "player",
              type: "aim",
            },
            speed: {
              horizontal: {
                value: 1.1 + 0.5,
                type: "absolute",
              },
              vertical: {
                value: 0.6 + 0.5,
                type: "absolute",
              },
            },
          },
        ],
      }, {
        func: "func",
        callback: function() {
          countAngle.one = 180 + 45;
        },
      }, {
        func: "wait",
        times: function() {
          countWait -= 5;
          return countWait;
        },
      }
    ],
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
  context.clearRect(0, 0, canvas.width, canvas.height);
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

setInterval(function() {
  document.getElementById("fps").innerHTML = "FPS: " + fps;
  fps = 0;
}, 1000);
// example code from mr doob : http://mrdoob.com/lab/javascript/requestanimationframe/
