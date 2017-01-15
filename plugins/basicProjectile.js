Shmup.plugin.projectile("bullet", {
  data: {
    position: {
      x: 0,
      y: 0,
    },
    angle: 0,
    speed: 0,
  },
  create: function(data) {
    var projectile = Shmup.advanced.process().wait.bullet.get();
    if (data.data) {
      projectile.data = data.data;
    }
    projectile.position.x = data.position.x || 0;
    projectile.position.y = data.position.y || 0;
    projectile.angle = data.angle || 0;
    projectile.speed = data.speed || 0;
    projectile.update = data.update;
    if (data.process) {
      projectile.process.actions = Shmup.util.loop(data.process.condition, data.process.actions, false, projectile);
    }
    Shmup.advanced.process().active.push(projectile);
    return projectile;
  },
  vanish: function(projectile) {
    projectile.position.x = 0;
    projectile.position.y = 0;
    projectile.angle = 0;
    projectile.speed = 0;
    projectile.data = undefined;
    projectile.update = undefined;
    projectile.process.actions = undefined;
    projectile.process.temp = [1337];
    Shmup.advanced.process().wait.bullet.set(projectile);
  },
  update: function(projectile) {
    projectile.position.x = Math.sin(projectile.angle) * projectile.speed + projectile.position.x;
    projectile.position.y = Math.cos(projectile.angle) * projectile.speed + projectile.position.y;
  },
});

Shmup.plugin.projectile("laser", {
  data: {
    position: {
      start: {
        x: 0,
        y: 0,
      },
      end: {
        x: 0,
        y: 0,
      },
    },
    distance: 0,
    angle: 0,
    anchor: {
      value: 0, //0: start to 1: end
      x: 0,
      y: 0,
    },
    speed: 0,
    instant: false,
    temp: {
      distance: 0,
    },
  },
  create: function(data) {
    var projectile = Shmup.advanced.process().wait.laser.get();
    if (data.data) {
      projectile.data = data.data;
    }
    projectile.angle = data.angle || 0;
    projectile.speed = data.speed || 0;
    projectile.position.start.x = data.position.start.x || 0;
    projectile.position.start.y = data.position.start.y || 0;
    projectile.instant = data.instant || false;
    projectile.temp.distance = data.distance;
    data.position.end = data.position.end || {};
    if (data.instant) {
      projectile.position.end.x = data.position.end.x || data.position.start.x + data.distance * Math.sin(data.angle - Math.PI) ;
      projectile.position.end.y = data.position.end.y || data.position.start.y + data.distance * Math.cos(data.angle - Math.PI) ;
    } else {
      projectile.position.end.x = data.position.end.x || data.position.start.x;
      projectile.position.end.y = data.position.end.y || data.position.start.y;
    }
    projectile.distance = Shmup.math.pythagorean(true, projectile.position.start, projectile.position.end);
    projectile.anchor.value = data.anchor || 0;
    var tempDis = Shmup.math.pointLine(projectile.position.start, projectile.position.end, projectile.anchor.value);
    projectile.anchor.x = tempDis.x;
    projectile.anchor.y = tempDis.y;
    projectile.update = data.update;
    if (data.process) {
      projectile.process.actions = Shmup.util.loop(data.process.condition, data.process.actions, false, projectile);
    }
    Shmup.advanced.process().active.push(projectile);
    return projectile;
  },
  vanish: function(projectile) {
    projectile.position.start.x = 0;
    projectile.position.start.y = 0;
    projectile.position.end.x = 0;
    projectile.position.end.y = 0;
    projectile.distance = 0;
    projectile.angle = 0;
    projectile.anchor.value = 0;
    projectile.anchor.x = 0;
    projectile.anchor.y = 0;
    projectile.speed = 0;
    projectile.instant = false;
    projectile.temp.distance = 0;
    projectile.data = undefined;
    projectile.update = undefined;
    projectile.process.actions = undefined;
    projectile.process.temp = [1337];
    Shmup.advanced.process().wait.laser.set(projectile);
  },
  update: function(projectile) {
    var tempDis = Shmup.math.pointLine(projectile.position.start, projectile.position.end, projectile.anchor.value);
    projectile.anchor.x = tempDis.x;
    projectile.anchor.y = tempDis.y;
    tempDis = Shmup.math.pythagorean(true, projectile.position.start, projectile.anchor);
    projectile.position.start.x = projectile.anchor.x + tempDis * Math.sin(projectile.angle);
    projectile.position.start.y = projectile.anchor.y + tempDis * Math.cos(projectile.angle);
    if (projectile.distance >= projectile.temp.distance) {
      tempDis = Shmup.math.pythagorean(true, projectile.position.end, projectile.anchor);
      projectile.position.end.x = projectile.anchor.x + tempDis * Math.sin(projectile.angle - Math.PI);
      projectile.position.end.y = projectile.anchor.y + tempDis * Math.cos(projectile.angle - Math.PI);
    }
    projectile.position.start.x = projectile.position.start.x + projectile.speed * Math.sin(projectile.angle);
    projectile.position.start.y = projectile.position.start.y + projectile.speed * Math.cos(projectile.angle);
    if (projectile.distance >= projectile.temp.distance) {
      projectile.position.end.x = projectile.position.end.x + projectile.speed * Math.sin(projectile.angle);
      projectile.position.end.y = projectile.position.end.y + projectile.speed * Math.cos(projectile.angle);
    }
    projectile.distance = Shmup.math.pythagorean(true, projectile.position.start, projectile.position.end);
  },
});

Shmup.plugin.projectile("curveLaser", {
  data: {
    
  },
  create: function(data) {
    
  },
  vanish: function(projectile) {
    
  },
  update: function(projectile) {
    
  },
});
