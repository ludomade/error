define(function() {
  var SquareController;
  return SquareController = (function() {
    function SquareController() {}

    SquareController.prototype.init = function() {
      this.getElements();
      return this.animate();
    };

    SquareController.prototype.getElements = function() {
      var a, d, i, points, range, scale, total, x, y;
      scale = 100;
      points = [];
      total = 5 + Math.floor(Math.random() * 3);
      range = 0.4;
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
      this.asteroid = {
        scale: scale,
        color: "#000000",
        pos: {
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
          r: 0
        },
        points: points
      };
      return game.stage.render(this.asteroid);
    };

    SquareController.prototype.animate = function() {
      return setInterval((function(_this) {
        return function() {
          return _this.asteroid.pos.r++;
        };
      })(this), 1000 / 60);
    };

    return SquareController;

  })();
});

//# sourceMappingURL=square.js.map
