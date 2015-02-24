define(["game/views/StageView", "game/controllers/PlayerController", "game/controllers/AsteroidController", "game/controllers/BadGuyController", "game/controllers/ParticleController", "game/controllers/MissleController", "game/controllers/UtilityController"], function(StageView, PlayerController, AsteroidController, BadGuyController, ParticleController, MissleController, UtilityController) {
  var App;
  return App = function() {
    window.game = {
      stage: new StageView,
      enemies: new BadGuyController,
      player: new PlayerController,
      asteroids: new AsteroidController,
      particles: new ParticleController,
      missles: new MissleController,
      tools: new UtilityController,
      start: function() {
        var i, run, _results;
        i = 0;
        run = ["stage", "player", "enemies", "asteroids", "particles", "missles"];
        _results = [];
        while (i < run.length) {
          game[run[i]].init();
          _results.push(i++);
        }
        return _results;
      }
    };
    return game.start();
  };
});

//# sourceMappingURL=App.js.map
