// requestAnim shim layer by Paul Irish
window.requestAnimFrame = (function(){
  return window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame |
  window.msRequestAnimationFrame ||
  function(callback, element){
    window.setTimeout(callback, 1000 / 60);
  };
})();
// example code from mr doob : http://mrdoob.com/lab/javascript/requestanimationframe/

var bulletGroup = [], canvas, context;

window.onload = function() {
  canvas = document.createElement('canvas');
  canvas.width = 500;
  canvas.height = 500;
  canvas.fitWindow();
  context = canvas.getContext('2d');
  document.body.appendChild(canvas);
  testing.fire("main");
  gameLoop();
  //scene.start();
};

var testing = Shmup("demo");
testing.configs({
  position: function() {
    return [250, 250];
  },
  target: function() {
    return [100, 100];
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
    times: 8,
    actions: [
      {
        func: "fire",
        type: "orb",
        direction: {
          value: 45,
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
        //actionRef: "second",
      },
    ],
  },
]);
testing.actions("second", false, [
  {
    func: "wait",
    times: 50,
  }, {
    func: "change",
    direction: {
      value : 180,
      times: 200,
    },/*
    speed: {
      horizontal: {
        value: -1,
        times: 50,
      },
      vertical: {
        value: -0.5,
        times: 100,
      },
    },*/
  },
]);

function gameLoop() {
  testing.update();
  requestAnimFrame(gameLoop);
}
//gameLoop();
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

/*var Scene = function(width, height) {
  var canvas = document.getElementById("demo");
  document.body.appendChild(canvas);
  canvas.width = width;
  canvas.height = height;
  canvas.fitWindow();
  this.context = canvas.getContext("2d");
  this.context.textAlign = "right";
  this.context.textBaseline = "top";
  this.frame = 0;
};
Scene.prototype.start = function() {
  var renderFrame = function() {
    this.context.fillStyle = "black";
    this.context.globalCompositeOperation = "source-over";
    this.context.fillRect(0, 0, 300, 500);
    this.context.globalCompositeOperation = "lighter";
    for (var bulletCount = 0; bulletCount < bulletGroup.length; bulletCount ++) {
      bulletGroup[bulletCount].sprite.draw(this.context);
    }
    testing.update();
    this.context.fillStyle = "white";
    this.frame += 1;
    requestAnimFrame(renderFrame);
  }.bind(this);
  renderFrame();
};

var Circle = function(xy, radius, color) {
  this.radius = radius;
  this.x = xy[0];
  this.y = xy[1];
  this.color = color || "#ffffff";
  this.canvas = document.createElement("canvas");
  this.canvas.width = radius * 2;
  this.canvas.height = radius * 2;
  var context = this.canvas.getContext("2d");
  context.globalCompositeOperation = "lighter";
  context.fillStyle = this.color;
  context.translate(radius, radius);
  context.globalAlpha = 1.0;
  context.arc(0, 0, radius, 0, Math.PI * 2, true);
  this.parent = null;
};
Circle.prototype.draw = function(context) {
  context.fillStyle = this.color;
  context.save();
  context.translate(this.x, this.y);
  context.drawImage(this.canvas, -this.canvas.width * .5, -this.canvas.height * .5);
  context.restore();
};
Circle.prototype.update = function(xy) {
  this.x = xy[0];
  this.y = xy[1];
};

var scene = new Scene(300, 500);*/
