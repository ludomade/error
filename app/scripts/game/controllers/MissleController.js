var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

define(function() {
  var MissleController;
  return MissleController = (function() {
    function MissleController() {
      this.destroy = __bind(this.destroy, this);
      this.move = __bind(this.move, this);
      this.detectCollision = __bind(this.detectCollision, this);
      this.gen = __bind(this.gen, this);
      this.smallMissle = __bind(this.smallMissle, this);
      this.update = __bind(this.update, this);
    }

    MissleController.prototype.missles = [];

    MissleController.prototype.past = new Date();

    MissleController.prototype.present = new Date();

    MissleController.prototype.init = function() {
      return this.loop();
    };

    MissleController.prototype.loop = function() {
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

    MissleController.prototype.update = function(elapsed) {
      var i, _results;
      i = this.missles.length - 1;
      _results = [];
      while (i >= 0) {
        this.move(this.missles[i], elapsed);
        this.detectCollision(this.missles[i]);
        _results.push(i--);
      }
      return _results;
    };

    MissleController.prototype.smallMissle = function(p) {
      if (p.damage === void 0) {
        p.damage = 1;
      }
      if (p.xv === void 0) {
        p.xv = 0;
      }
      if (p.yv === void 0) {
        p.yv = 0;
      }
      return this.gen({
        height: 20,
        width: 20,
        scale: 10,
        x: p.x,
        y: p.y,
        r: p.r,
        xv: p.xv,
        yv: p.yv,
        source: p.source,
        velocity: 4.5,
        damage: p.damage,
        duration: 2500,
        particleRate: 125
      });
    };

    MissleController.prototype.gen = function(p) {
      var dur, last, missle;
      dur = new Date();
      dur = dur.getTime() + p.duration;
      last = new Date();
      last = last.getTime();
      missle = {
        vis: {
          points: [
            {
              x: -0.01 * (p.width / 2),
              y: 0.01 * (p.height / 2)
            }, {
              x: -0.01 * (p.width / 2),
              y: -0.01 * (p.height / 2)
            }, {
              x: 0.01 * (p.width / 2),
              y: -0.01 * (p.height / 2)
            }, {
              x: 0.01 * (p.width / 2),
              y: 0.01 * (p.height / 2)
            }
          ],
          color: "#ffbf00",
          scale: p.scale,
          pos: {
            x: p.x,
            y: p.y,
            r: p.r
          }
        },
        data: {
          source: p.source,
          velocity: p.velocity,
          damage: p.damage,
          duration: dur,
          xv: p.xv,
          yv: p.yv
        },
        particle: {
          rate: p.particleRate,
          last: last
        }
      };
      this.missles.push(missle);
      game.stage.render(missle.vis);
      return console.log(this.missles);
    };

    MissleController.prototype.detectCollision = function(missle) {
      var a, asteroids, b, i;
      i = 0;
      asteroids = game.asteroids.asteroid;
      a = {
        x: missle.vis.pos.x,
        y: missle.vis.pos.y,
        s: 1
      };
      while (i < asteroids.length) {
        b = {
          x: asteroids[i].vis.pos.x,
          y: asteroids[i].vis.pos.y,
          s: asteroids[i].vis.scale * 2.2
        };
        if (game.tools.distance(a, b) < 0) {
          this.destroy(missle);
          asteroids[i].data.health -= missle.data.damage;
          if (asteroids[i].data.health <= 0) {
            game.asteroids.kill(asteroids[i]);
          }
        }
        i++;
      }
      i = 0;
      while (i < game.enemies.ships.length) {
        b = {
          x: game.enemies.ships[i].vis.pos.x,
          y: game.enemies.ships[i].vis.pos.y,
          s: game.enemies.ships[i].vis.scale * 2.2
        };
        if (game.tools.distance(a, b) < 0 && missle.data.source !== game.enemies.ships[i]) {
          this.destroy(missle);
          game.enemies.ships[i].health -= missle.data.damage;
          if (game.enemies.ships[i].health <= 0) {
            game.enemies.kill(game.enemies.ships[i]);
          }
        }
        i++;
      }
      b = {
        x: game.player.ship.vis.pos.x,
        y: game.player.ship.vis.pos.y,
        s: game.player.ship.vis.scale * 2.2
      };
      if (game.tools.distance(a, b) < 0 && missle.data.source !== game.player.ship) {
        this.destroy(missle);
        game.player.ship.health -= missle.data.damage;
        if (game.player.ship.health <= 0) {
          return game.player.kill();
        }
      }
    };

    MissleController.prototype.move = function(missle, elapsed) {
      var present, xOff, xvel, yOff, yvel;
      present = new Date();
      present = present.getTime();
      xvel = Math.sin(missle.vis.pos.r * (Math.PI / 180)) * missle.data.velocity;
      yvel = Math.cos(missle.vis.pos.r * (Math.PI / 180)) * missle.data.velocity;
      missle.vis.pos.x += (xvel + missle.data.xv) * (elapsed / (1000 / 60));
      missle.vis.pos.y += (yvel + missle.data.yv) * (elapsed / (1000 / 60));
      if (present > missle.particle.last) {
        missle.particle.last = present + missle.particle.rate;
        xOff = Math.sin((Math.random() * 360) * (Math.PI / 180)) * (missle.data.velocity * 0.05);
        yOff = Math.cos((Math.random() * 360) * (Math.PI / 180)) * (missle.data.velocity * 0.05);
        game.particles.gen(missle.vis.pos.x, missle.vis.pos.y, -(xvel / 10) + xOff, -(yvel / 10) + yOff, 0 + (Math.random() * 20), 0.5 + (Math.random() * 2));
      }
      if (present > missle.data.duration) {
        return this.destroy(missle);
      }
    };

    MissleController.prototype.wrap = function(missle) {
      var pos;
      pos = game.tools.wrap(missle.vis.pos.x, missle.vis.pos.y, missle.vis.pos.r, missle.vis.scale);
      missle.vis.pos.x = pos.x;
      return missle.vis.pos.y = pos.y;
    };

    MissleController.prototype.destroy = function(missle) {
      var i, pTotal, _results;
      pTotal = Math.min(Math.max(Math.random() * (missle.data.damage * 3), 10), 90);
      game.particles.explosion(missle.vis.pos.x, missle.vis.pos.y, pTotal, missle.data.velocity * 0.25, missle.data.velocity * 0.45 * (missle.vis.scale / 15), 150, 500, 1, missle.vis.scale / 2.5);
      game.stage.destroy(missle.vis);
      i = 0;
      _results = [];
      while (i < this.missles.length) {
        if (this.missles[i] === missle) {
          this.missles.splice(i, 1);
        }
        _results.push(i++);
      }
      return _results;
    };

    return MissleController;

  })();
});

//# sourceMappingURL=MissleController.js.map
