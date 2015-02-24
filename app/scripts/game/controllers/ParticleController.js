var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

define(function() {
  var ParticleController;
  return ParticleController = (function() {
    function ParticleController() {
      this.destroy = __bind(this.destroy, this);
      this.explosion = __bind(this.explosion, this);
    }

    ParticleController.prototype.particle = [];

    ParticleController.prototype.init = function() {
      return this.loop();
    };

    ParticleController.prototype.explosion = function(x, y, n, vmax, vmin, dmin, dmax, smin, smax, xinit, yinit) {
      var a, d, i, s, v, xv, yv, _results;
      i = 0;
      _results = [];
      while (i < n) {
        v = vmin + Math.random() * (vmax - vmin);
        d = dmin + Math.random() * (dmax - dmin);
        s = smin + Math.random() * (smax - smin);
        a = Math.random() * 360;
        xv = Math.sin(a * (Math.PI / 180)) * v;
        yv = Math.cos(a * (Math.PI / 180)) * v;
        this.gen(x, y, xv, yv, d, s);
        _results.push(i++);
      }
      return _results;
    };

    ParticleController.prototype.gen = function(x, y, xv, yv, d, s) {
      var particle;
      particle = {
        dur: new Date().getTime() + d,
        vel: {
          x: xv,
          y: yv
        },
        vis: {
          scale: s,
          color: "#ffbf00",
          points: [
            {
              x: -0.5,
              y: -0.5
            }, {
              x: 0.5,
              y: -0.5
            }, {
              x: 0.5,
              y: 0.5
            }, {
              x: -0.5,
              y: 0.5
            }
          ],
          pos: {
            x: x,
            y: y,
            r: 0
          }
        }
      };
      this.particle.push(particle);
      return game.stage.render(particle.vis);
    };

    ParticleController.prototype.loop = function() {
      return setInterval((function(_this) {
        return function() {
          return _this.update();
        };
      })(this), 1000 / 60);
    };

    ParticleController.prototype.update = function() {
      var i, _results;
      i = 0;
      _results = [];
      while (i < this.particle.length) {
        this.step(this.particle[i]);
        this.check(this.particle[i]);
        _results.push(i++);
      }
      return _results;
    };

    ParticleController.prototype.step = function(p) {
      p.vis.pos.x += p.vel.x;
      return p.vis.pos.y += p.vel.y;
    };

    ParticleController.prototype.check = function(p) {
      if (p.dur < new Date().getTime()) {
        p.vis.scale -= 0.1;
        if (p.vis.scale <= 0) {
          game.stage.destroy(p.vis);
          return this.destroy(p);
        }
      }
    };

    ParticleController.prototype.destroy = function(p) {
      var i, _results;
      i = 0;
      _results = [];
      while (i < this.particle.length) {
        if (this.particle[i] === p) {
          this.particle.splice(i, 1);
        }
        _results.push(i++);
      }
      return _results;
    };

    return ParticleController;

  })();
});

//# sourceMappingURL=ParticleController.js.map
