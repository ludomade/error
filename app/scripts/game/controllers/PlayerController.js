var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

define(function() {
  var PlayerController;
  return PlayerController = (function() {
    function PlayerController() {
      this.kill = __bind(this.kill, this);
      this.ctl = __bind(this.ctl, this);
      this.gen = __bind(this.gen, this);
    }

    PlayerController.prototype.past = new Date();

    PlayerController.prototype.present = new Date();

    PlayerController.prototype.init = function() {
      this.gen();
      this.addListeners();
      return this.loop();
    };

    PlayerController.prototype.gen = function() {
      this.ship = {
        vis: {
          color: "#ffbf00",
          scale: 6.66,
          points: [
            {
              x: 0.00,
              y: -1.00
            }, {
              x: -0.74,
              y: 1.00
            }, {
              x: 0.74,
              y: 1.00
            }
          ],
          pos: {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            r: 0
          }
        },
        health: 6,
        thrust: 0.045,
        rot: 4,
        particles: {
          last: 0,
          rate: 70
        },
        munitions: {
          last: 0,
          rate: 175,
          damage: 5
        },
        controls: {
          up: false,
          down: false,
          left: false,
          right: false,
          space: false
        },
        vel: {
          x: 0,
          y: 0,
          r: 0
        }
      };
      return game.stage.render(this.ship.vis);
    };

    PlayerController.prototype.addListeners = function() {
      window.addEventListener("keydown", (function(_this) {
        return function(e) {
          e.preventDefault();
          return _this.ctl(e.keyCode, true);
        };
      })(this));
      return window.addEventListener("keyup", (function(_this) {
        return function(e) {
          e.preventDefault();
          return _this.ctl(e.keyCode, false);
        };
      })(this));
    };

    PlayerController.prototype.ctl = function(code, state) {
      console.log(code);
      switch (code) {
        case 38:
          return this.ship.controls.up = state;
        case 40:
          return this.ship.controls.down = state;
        case 37:
          return this.ship.controls.left = state;
        case 39:
          return this.ship.controls.right = state;
        case 32:
          return this.ship.controls.space = state;
      }
    };

    PlayerController.prototype.loop = function() {
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

    PlayerController.prototype.update = function(elapsed) {
      this.move(elapsed);
      this.wrap();
      this.munitions();
      this.particles();
      return this.collision();
    };

    PlayerController.prototype.move = function(elapsed) {
      var rot, vel;
      vel = 0;
      rot = 0;
      if (this.ship.controls.up === true) {
        vel = this.ship.thrust;
      }
      if (this.ship.controls.down === true) {
        vel = -this.ship.thrust;
      }
      if (this.ship.controls.left === true) {
        rot = -this.ship.rot;
      }
      if (this.ship.controls.right === true) {
        rot = this.ship.rot;
      }
      this.ship.vel.x += Math.cos((this.ship.vis.pos.r - 90) * (Math.PI / 180)) * vel * (elapsed / (1000 / 60));
      this.ship.vel.y += Math.sin((this.ship.vis.pos.r - 90) * (Math.PI / 180)) * vel * (elapsed / (1000 / 60));
      this.ship.vis.pos.x += this.ship.vel.x * (elapsed / (1000 / 60));
      this.ship.vis.pos.y += this.ship.vel.y * (elapsed / (1000 / 60));
      return this.ship.vis.pos.r += rot * (elapsed / (1000 / 60));
    };

    PlayerController.prototype.wrap = function() {
      var pos;
      pos = game.tools.wrap(this.ship.vis.pos.x, this.ship.vis.pos.y, this.ship.vis.pos.r, this.ship.vis.scale);
      this.ship.vis.pos.x = pos.x;
      this.ship.vis.pos.y = pos.y;
      return this.ship.vis.pos.r = pos.r;
    };

    PlayerController.prototype.munitions = function() {
      var present, r, x, xv, y, yv;
      present = new Date();
      present = present.getTime();
      if (this.ship.munitions.last < present && this.ship.controls.space === true) {
        this.ship.munitions.last = present + this.ship.munitions.rate;
        x = this.ship.vis.pos.x;
        y = this.ship.vis.pos.y;
        xv = this.ship.vel.x;
        yv = this.ship.vel.y;
        r = -this.ship.vis.pos.r + 180;
        return game.missles.smallMissle({
          source: this.ship,
          x: x,
          y: y,
          r: r,
          xv: xv,
          yv: yv,
          damage: this.ship.munitions.damage
        });
      }
    };

    PlayerController.prototype.particles = function() {
      var d, present, s, x, xv, y, yv;
      present = new Date();
      present = present.getTime();
      if (this.ship.particles.last < present && this.ship.controls.up === true) {
        this.ship.particles.last = present + this.ship.particles.rate;
        x = this.ship.vis.pos.x;
        y = this.ship.vis.pos.y;
        xv = this.ship.vel.x + (Math.cos((this.ship.vis.pos.r - 90) * (Math.PI / 180)) * (-this.ship.thrust * 30));
        yv = this.ship.vel.y + (Math.sin((this.ship.vis.pos.r - 90) * (Math.PI / 180)) * (-this.ship.thrust * 30));
        d = 20 + Math.random() * (this.ship.particles.rate * (30 * Math.random()));
        s = 1 + Math.random() * 2.5;
        return game.particles.gen(x, y, xv, yv, d, s);
      }
    };

    PlayerController.prototype.collision = function() {
      var a, asteroids, b, i, _results;
      i = 0;
      asteroids = game.asteroids.asteroid;
      a = {
        x: this.ship.vis.pos.x,
        y: this.ship.vis.pos.y,
        s: this.ship.vis.scale * 2
      };
      _results = [];
      while (i < asteroids.length) {
        b = {
          x: asteroids[i].vis.pos.x,
          y: asteroids[i].vis.pos.y,
          s: asteroids[i].vis.scale * 2.2
        };
        if (game.tools.distance(a, b) < 0) {
          this.kill();
        }
        _results.push(i++);
      }
      return _results;
    };

    PlayerController.prototype.kill = function() {
      var r, x, y;
      if (this.invincible !== true) {
        setTimeout((function(_this) {
          return function() {
            return _this.invincible = false;
          };
        })(this), 3000);
        this.invincible = true;
        r = this.ship.vis.scale * 9;
        x = this.ship.vis.pos.x;
        y = this.ship.vis.pos.y;
        game.particles.explosion(x, y, Math.round(this.ship.vis.scale), 0.15, 2, 150, 1250, this.ship.vis.scale / 2, this.ship.vis.scale / 1.5);
        this.ship.vis.pos.x = window.innerWidth / 2;
        this.ship.vis.pos.y = window.innerHeight / 2;
        this.ship.vel.x = 0;
        this.ship.vel.y = 0;
        return this.ship.health = 3;
      }
    };

    return PlayerController;

  })();
});

//# sourceMappingURL=PlayerController.js.map
