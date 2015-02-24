var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

define(function() {
  var AsteroidController;
  return AsteroidController = (function() {
    function AsteroidController() {
      this.kill = __bind(this.kill, this);
    }

    AsteroidController.prototype.asteroid = [];

    AsteroidController.prototype.past = new Date();

    AsteroidController.prototype.present = new Date();

    AsteroidController.prototype.init = function() {
      return this.loop();
    };

    AsteroidController.prototype.generate = function(xPos, yPos, scale) {
      var a, asteroid, d, health, i, points, range, s, total, x, y;
      console.log(x);
      if (xPos == null) {
        xPos = Math.random() * window.innerWidth;
      }
      if (yPos == null) {
        yPos = Math.random() * window.innerHeight;
      }
      if (scale == null) {
        s = 1 + Math.floor(Math.random() * 4);
        scale = 10 + (s * 15) + (Math.random() * 5);
      }
      health = 3 + (scale / 4);
      points = [];
      total = 12 + Math.floor(Math.random() * 3);
      range = 0.35;
      i = total;
      while (i >= 0) {
        a = (i / total) * 360;
        d = (1 - (range / 2)) + (Math.random() * range);
        if (i !== 0) {
          x = Math.sin(a * (Math.PI / 180)) * d;
          y = Math.cos(a * (Math.PI / 180)) * d;
        } else {
          x = points[0].x;
          y = points[0].y;
        }
        points.push({
          x: x,
          y: y
        });
        i--;
      }
      asteroid = {
        vis: {
          points: points,
          scale: scale,
          color: "#ffbf00",
          pos: {
            x: xPos,
            y: yPos,
            r: Math.random() * 360
          }
        },
        data: {
          health: health,
          vel: {
            x: (Math.random() * 2) - 1.0,
            y: (Math.random() * 2) - 1.0,
            r: (Math.random() * 1) - 0.5
          }
        }
      };
      this.asteroid.push(asteroid);
      return game.stage.render(asteroid.vis);
    };

    AsteroidController.prototype.loop = function() {
      setInterval((function(_this) {
        return function() {
          var x, y;
          if (_this.asteroid.length < 7) {
            if (Math.random() > 0.5) {
              y = Math.random() * window.innerHeight;
              if (Math.random() > 0.5) {
                x = 0 - 120;
              } else {
                x = window.innerWidth + 120;
              }
            } else {
              x = Math.random() * window.innerWidth;
              if (Math.random() > 0.5) {
                y = 0 - 120;
              } else {
                y = window.innerHeight + 120;
              }
            }
            return _this.generate(x, y);
          }
        };
      })(this), 5000);
      return setInterval((function(_this) {
        return function() {
          var elapsed;
          _this.present = new Date();
          elapsed = _this.present.getTime() - _this.past.getTime();
          _this.past = _this.present;
          return _this.update(elapsed);
        };
      })(this), 1000 / 60);
    };

    AsteroidController.prototype.update = function(e) {
      var i, _results;
      i = 0;
      _results = [];
      while (i < this.asteroid.length) {
        this.step(this.asteroid[i], e);
        this.wrap(this.asteroid[i]);
        _results.push(i++);
      }
      return _results;
    };

    AsteroidController.prototype.step = function(a, e) {
      a.vis.pos.x += a.data.vel.x * (e / (1000 / 60));
      a.vis.pos.y += a.data.vel.y * (e / (1000 / 60));
      return a.vis.pos.r += a.data.vel.r * (e / (1000 / 60));
    };

    AsteroidController.prototype.wrap = function(a) {
      var pos;
      pos = game.tools.wrap(a.vis.pos.x, a.vis.pos.y, a.vis.pos.r, a.vis.scale);
      a.vis.pos.x = pos.x;
      a.vis.pos.y = pos.y;
      return a.vis.pos.r = pos.r;
    };

    AsteroidController.prototype.kill = function(a) {
      var r, s1, s2, x, y;
      r = a.vis.scale * 1.2;
      x = a.vis.pos.x;
      y = a.vis.pos.y;
      if (a.vis.scale > 30) {
        s1 = r * (0.4 + (Math.random() * 0.2));
        s2 = r - s1;
        this.generate(x, y, s1);
        this.generate(x, y, s2);
      }
      game.particles.explosion(x, y, Math.round(a.vis.scale * 1.25), 0.15, 2, 150, 1250, a.vis.scale / 10, a.vis.scale / 3.5, a.data.vel.x, a.data.vel.y);
      return setTimeout((function(_this) {
        return function() {
          return _this.destroy(a);
        };
      })(this), 100);
    };

    AsteroidController.prototype.destroy = function(a) {
      var i, _results;
      i = 0;
      _results = [];
      while (i < this.asteroid.length) {
        if (this.asteroid[i] === a) {
          game.stage.destroy(this.asteroid[i].vis);
          this.asteroid.splice(i, 1);
        }
        _results.push(i++);
      }
      return _results;
    };

    return AsteroidController;

  })();
});

//# sourceMappingURL=AsteroidController.js.map
