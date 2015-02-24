define(function() {
  var UtilityController;
  return UtilityController = (function() {
    function UtilityController() {}

    UtilityController.prototype.distance = function(a, b) {
      var d, x, y;
      x = Math.pow(Math.abs(a.x - b.x), 2);
      y = Math.pow(Math.abs(a.y - b.y), 2);
      d = Math.sqrt(x + y) - ((a.s / 2) + (b.s / 2));
      return d;
    };

    UtilityController.prototype.wrap = function(x, y, r, s) {
      if ((x + s) > (window.innerWidth + (s * 2))) {
        x = -s;
      }
      if ((x + s) < -(s * 2)) {
        x = window.innerWidth + s;
      }
      if ((y + s) > (window.innerHeight + (s * 2))) {
        y = -s;
      }
      if ((y + s) < -(s * 2)) {
        y = window.innerHeight + s;
      }
      if (r > 360) {
        r -= 360;
      }
      if (r < 0) {
        r += 360;
      }
      return {
        x: x,
        y: y,
        r: r
      };
    };

    UtilityController.prototype.pointTo = function(x1, y1, x2, y2) {
      var deltaX, deltaY;
      deltaY = y1 - y2;
      deltaX = x2 - x1;
      return Math.atan2(deltaX, deltaY) * 180 / Math.PI;
    };

    UtilityController.prototype.bound = function(n, min, max) {
      return Math.min(Math.max(n, min), max);
    };

    return UtilityController;

  })();
});

//# sourceMappingURL=UtilityController.js.map
