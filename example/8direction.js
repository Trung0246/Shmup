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
        context.fillStyle = '#d22f33';
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
      },
    ],
  },
]);

function gameLoop() {
  context.fillStyle = '#000000';
  context.beginPath();
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.closePath();
  context.fill();
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
