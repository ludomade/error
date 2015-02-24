var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

define(function() {
  var StageView;
  return StageView = (function() {
    function StageView() {
      this.draw = __bind(this.draw, this);
      this.loop = __bind(this.loop, this);
      this.destroy = __bind(this.destroy, this);
      this.render = __bind(this.render, this);
    }

    StageView.prototype.shapes = [];

    StageView.prototype.init = function() {
      this.getElements();
      return this.loop();
    };

    StageView.prototype.getElements = function() {
      this.canvas = document.getElementsByTagName("canvas")[0];
      return this.stage = this.canvas.getContext("2d");
    };

    StageView.prototype.render = function(el) {
      return this.shapes.push(el);
    };

    StageView.prototype.destroy = function(el) {
      var i, _results;
      i = 0;
      _results = [];
      while (i < this.shapes.length) {
        if (this.shapes[i] === el) {
          this.shapes.splice(i, 1);
        }
        _results.push(i++);
      }
      return _results;
    };

    StageView.prototype.loop = function() {
      this.update();
      this.clear();
      this.draw();
      return requestAnimationFrame(this.loop);
    };

    StageView.prototype.update = function() {
      if (this.width !== window.innerWidth || this.height !== window.innerHeight) {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.height = this.height;
        return this.canvas.width = this.width;
      }
    };

    StageView.prototype.clear = function() {
      return this.stage.clearRect(0, 0, this.width, this.height);
    };

    StageView.prototype.draw = function() {
      var c, i, m, n, p, s, x, y, _results;
      c = this.stage;
      i = 0;
      _results = [];
      while (i < this.shapes.length) {
        s = this.shapes[i];
        p = s.points;
        m = s.scale;
        c.save();
        c.fillStyle = s.color;
        c.translate(s.pos.x, s.pos.y);
        c.rotate(s.pos.r * (Math.PI / 180));
        c.beginPath();
        n = 0;
        while (n < p.length) {
          x = p[n].x * m;
          y = p[n].y * m;
          if (n === 0) {
            c.moveTo(x, y);
          } else {
            c.lineTo(x, y);
          }
          n++;
        }
        c.fill();
        c.restore();
        _results.push(i++);
      }
      return _results;
    };

    return StageView;

  })();
});

//# sourceMappingURL=stage.js.map
