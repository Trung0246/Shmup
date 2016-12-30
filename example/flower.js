//Use with _core_.js and shortMethods.js

var bulletGroup = [], canvas, context, bulletTotal = 50;
var sceneSize = [500, 800];

var player = {
  x: sceneSize[0] / 2,
  y: sceneSize[1] -50,
  speed: 2.5,
  slow: 0.425,
};

var countBullet = {
  orb: 0,
  invisible: 0,
};
function getTotal() {
  countBullet.total = countBullet.orb + countBullet.invisible;
  return countBullet.total;
}
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
        countBullet.orb = bulletCount;
        document.getElementById("count").innerHTML = "Count: " + getTotal();
      },
    },
    invisible: {
      type: "bullet",
      draw: function(tempBullet) {
        context.fillStyle = 'hsla(0, 0%, 0%, 0)';
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
        countBullet.invisible = bulletCount;
        document.getElementById("count").innerHTML = "Count: " + getTotal();
      },
    },
  },
});
var tempPos = [];
var countWait = 50;
testing.actions("main", true, [
  MD.rp(360, [
    MD.fr("orb", "labelOne", undefined, undefined, MD.d("sequence", -1, 0), MD.s("absolute", 1, "absolute", 1), "second"),
    //MD.w("auto", 1),
  ]),
]);
testing.actions("second", false, [
  MD.w("auto", 150),
  MD.c(undefined, undefined, MD.cd(74, 1, "sequence", "player")),
]);

window.onload = function() {
  canvas = document.createElement('canvas');
  canvas.width = sceneSize[0];
  canvas.height = sceneSize[1];
  canvas.fitWindow();
  context = canvas.getContext('2d');
  document.body.appendChild(canvas);
  testing.fire(["main"]);
  gameLoop();
};
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

setInterval(function() {
  document.getElementById("fps").innerHTML = "FPS: " + fps;
  fps = 0;
}, 1000);
