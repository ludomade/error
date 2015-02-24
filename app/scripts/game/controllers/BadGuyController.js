var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

define(function() {
  var BadGuyController;
  return BadGuyController = (function() {
    function BadGuyController() {
      this.kill = __bind(this.kill, this);
    }

    BadGuyController.prototype.past = new Date();

    BadGuyController.prototype.present = new Date();

    BadGuyController.prototype.ships = [];

    BadGuyController.prototype.init = function() {
      return this.loop();
    };

    BadGuyController.prototype.loop = function() {
      this.gen();
      this.gen();
      setInterval((function(_this) {
        return function() {
          var n, _results;
          n = 0;
          _results = [];
          while (n < 3 + Math.random() * 4) {
            setTimeout(function() {
              if (_this.ships.length < 4) {
                return _this.gen();
              }
            }, 1000 + 3000 * Math.random());
            _results.push(n++);
          }
          return _results;
        };
      })(this), 25000);
      return setInterval((function(_this) {
        return function() {
          var elapsed, i, _results;
          i = _this.ships.length - 1;
          _this.present = new Date();
          elapsed = _this.present.getTime() - _this.past.getTime();
          _this.past = _this.present;
          _results = [];
          while (i >= 0) {
            _this.think(_this.ships[i]);
            _this.thrust(_this.ships[i], elapsed);
            _this.particles(_this.ships[i]);
            _this.move(_this.ships[i], elapsed);
            _this.wrap(_this.ships[i]);
            _this.collision(_this.ships[i]);
            _results.push(i--);
          }
          return _results;
        };
      })(this), 1000 / 60);
    };

    BadGuyController.prototype.gen = function() {
      var ship, x, y;
      if (Math.random() > 0.5) {
        y = Math.random() * window.innerHeight;
        if (Math.random() > 0.5) {
          x = 0 - 6;
        } else {
          x = window.innerWidth + 6;
        }
      } else {
        x = Math.random() * window.innerWidth;
        if (Math.random() > 0.5) {
          y = 0 - 6;
        } else {
          y = window.innerHeight + 6;
        }
      }
      ship = {
        vis: {
          color: "#ffbf00",
          scale: 5,
          pos: {
            x: x,
            y: y,
            r: Math.random() * 360
          },
          points: [
            {
              x: -1,
              y: -1
            }, {
              x: 1,
              y: 1
            }, {
              x: 1,
              y: -1
            }, {
              x: -1,
              y: 1
            }, {
              x: -1,
              y: -1
            }
          ]
        },
        health: 5,
        thrust: 0.0895,
        rot: 0.9,
        particles: {
          last: 0,
          rate: 120
        },
        munitions: {
          last: 0,
          rate: 650,
          damage: 1
        },
        goal: {
          x: game.player.ship.vis.pos.x,
          y: game.player.ship.vis.pos.y,
          r: 0
        },
        vel: {
          x: 0,
          y: 0,
          r: 0
        }
      };
      game.stage.render(ship.vis);
      return this.ships.push(ship);
    };

    BadGuyController.prototype.think = function(ship) {
      var a, asteroid, b, dis, i, min, pmin, smin;
      i = 0;
      asteroid = game.asteroids.asteroid;
      a = {
        x: ship.vis.pos.x,
        y: ship.vis.pos.y,
        s: ship.vis.scale * 2.5
      };
      min = 120;
      smin = 40;
      pmin = 90;
      while (i < this.ships.length) {
        b = {
          x: this.ships[i].vis.pos.x,
          y: this.ships[i].vis.pos.y,
          s: this.ships[i].vis.scale * 2.2
        };
        dis = game.tools.distance(a, b);
        if (dis <= smin && ship !== this.ships[i]) {
          smin = dis;
          a = game.tools.pointTo(this.ships[i].vis.pos.x, this.ships[i].vis.pos.y, ship.vis.pos.x, ship.vis.pos.y) - 180;
          if (ship.vis.pos.r - a > 180) {
            ship.vis.pos.r -= 360;
          }
          if (ship.vis.pos.r - a < -180) {
            ship.vis.pos.r += 360;
          }
          ship.goal.r = a;
        }
        i++;
      }
      b = {
        x: game.player.ship.vis.pos.x,
        y: game.player.ship.vis.pos.y,
        s: game.player.ship.vis.scale * 10
      };
      dis = game.tools.distance(a, b);
      if (dis <= pmin) {
        pmin = dis;
        a = game.tools.pointTo(game.player.ship.vis.pos.x, game.player.ship.vis.pos.y, ship.vis.pos.x, ship.vis.pos.y) - 180;
        if (ship.vis.pos.r - a > 180) {
          ship.vis.pos.r -= 360;
        }
        if (ship.vis.pos.r - a < -180) {
          ship.vis.pos.r += 360;
        }
        ship.goal.r = a;
      }
      i = 0;
      while (i < asteroid.length) {
        b = {
          x: asteroid[i].vis.pos.x,
          y: asteroid[i].vis.pos.y,
          s: asteroid[i].vis.scale * 2
        };
        dis = game.tools.distance(a, b);
        if (dis <= min) {
          min = dis;
          a = game.tools.pointTo(asteroid[i].vis.pos.x, asteroid[i].vis.pos.y, ship.vis.pos.x, ship.vis.pos.y) - 180;
          if (ship.vis.pos.r - a > 180) {
            ship.vis.pos.r -= 360;
          }
          if (ship.vis.pos.r - a < -180) {
            ship.vis.pos.r += 360;
          }
          ship.goal.r = a;
        }
        i++;
      }
      if (min >= 120 && smin >= 40 && pmin >= 90) {
        ship.goal.x = game.player.ship.vis.pos.x;
        ship.goal.y = game.player.ship.vis.pos.y;
        ship.goal.r = game.tools.pointTo(ship.goal.x, ship.goal.y, ship.vis.pos.x, ship.vis.pos.y);
        if (ship.vis.pos.r - ship.goal.r > 180) {
          ship.vis.pos.r -= 360;
        }
        if (ship.vis.pos.r - ship.goal.r < -180) {
          ship.vis.pos.r += 360;
        }
        if (Math.abs(ship.vis.pos.r - ship.goal.r) < 0.3) {
          return this.munitions(ship);
        }
      }
    };

    BadGuyController.prototype.thrust = function(ship, elapsed) {
      if (ship.vis.pos.r < ship.goal.r) {
        ship.vel.r += ship.rot * (elapsed / (1000 / 60));
      }
      if (ship.vis.pos.r > ship.goal.r) {
        ship.vel.r -= ship.rot * (elapsed / (1000 / 60));
      }
      ship.vel.x -= Math.cos((ship.vis.pos.r - 90) * (Math.PI / 180)) * ship.thrust * (elapsed / (1000 / 60));
      ship.vel.y -= Math.sin((ship.vis.pos.r - 90) * (Math.PI / 180)) * ship.thrust * (elapsed / (1000 / 60));
      ship.vel.x = game.tools.bound(ship.vel.x, -2.5, 2.5);
      ship.vel.y = game.tools.bound(ship.vel.y, -2.5, 2.5);
      ship.vel.x = ship.vel.x * 0.965;
      ship.vel.y = ship.vel.y * 0.965;
      return ship.vel.r = ship.vel.r * 0.85;
    };

    BadGuyController.prototype.move = function(ship, elapsed) {
      ship.vis.pos.x += ship.vel.x * (elapsed / (1000 / 60));
      ship.vis.pos.y += ship.vel.y * (elapsed / (1000 / 60));
      return ship.vis.pos.r += ship.vel.r * (elapsed / (1000 / 60));
    };

    BadGuyController.prototype.wrap = function(ship) {
      var pos;
      pos = game.tools.wrap(ship.vis.pos.x, ship.vis.pos.y, ship.vis.pos.r, ship.vis.scale);
      ship.vis.pos.x = pos.x;
      return ship.vis.pos.y = pos.y;
    };

    BadGuyController.prototype.particles = function(ship) {
      var d, present, s, x, xv, y, yv;
      present = new Date();
      present = present.getTime();
      if (ship.particles.last < present) {
        ship.particles.last = present + ship.particles.rate + (Math.random() * ship.particles.rate);
        x = ship.vis.pos.x;
        y = ship.vis.pos.y;
        xv = ship.vel.x + (Math.cos((ship.vis.pos.r - 90) * (Math.PI / 180)) * (ship.thrust * 10));
        yv = ship.vel.y + (Math.sin((ship.vis.pos.r - 90) * (Math.PI / 180)) * (ship.thrust * 10));
        d = Math.random() * ((ship.particles.rate / 2) * Math.random());
        s = 1 + Math.random() * 2.5;
        return game.particles.gen(x, y, xv, yv, d, s);
      }
    };

    BadGuyController.prototype.munitions = function(ship) {
      var present, r, x, xv, y, yv;
      present = new Date();
      present = present.getTime();
      if (ship.munitions.last < present) {
        ship.munitions.last = present + ship.munitions.rate + (ship.munitions.rate * Math.random());
        x = ship.vis.pos.x;
        y = ship.vis.pos.y;
        xv = ship.vel.x;
        yv = ship.vel.y;
        r = -ship.vis.pos.r;
        return game.missles.smallMissle({
          source: ship,
          x: x,
          y: y,
          r: r,
          xv: xv,
          yv: yv,
          damage: ship.munitions.damage
        });
      }
    };

    BadGuyController.prototype.collision = function(ship) {
      var a, asteroids, b, i, _results;
      asteroids = game.asteroids.asteroid;
      i = 0;
      a = {
        x: ship.vis.pos.x,
        y: ship.vis.pos.y,
        s: ship.vis.scale * 2.5
      };
      _results = [];
      while (i < asteroids.length) {
        b = {
          x: asteroids[i].vis.pos.x,
          y: asteroids[i].vis.pos.y,
          s: asteroids[i].vis.scale * 2.2
        };
        if (game.tools.distance(a, b) < 0) {
          game.enemies.kill(ship);
        }
        _results.push(i++);
      }
      return _results;
    };

    BadGuyController.prototype.kill = function(ship) {
      var r, x, y;
      r = ship.vis.scale * 9;
      x = ship.vis.pos.x;
      y = ship.vis.pos.y;
      game.particles.explosion(x, y, Math.round(ship.vis.scale), 0.15, 2, 150, 1250, ship.vis.scale / 2, ship.vis.scale / 1.5);
      return setTimeout((function(_this) {
        return function() {
          return _this.destroy(ship);
        };
      })(this), 100);
    };

    BadGuyController.prototype.destroy = function(ship) {
      var i, _results;
      i = 0;
      _results = [];
      while (i < this.ships.length) {
        if (this.ships[i] === ship) {
          game.stage.destroy(this.ships[i].vis);
          this.ships.splice(i, 1);
        }
        _results.push(i++);
      }
      return _results;
    };

    return BadGuyController;

  })();
});

//# sourceMappingURL=BadGuyController.js.map
