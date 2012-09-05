var code = [];

code[0] = '(' + function() {
  new Rect(100, 0, 100, 100).addTo(stage).attr({
    fillColor: 'blue'
  });

  redBoxFromPlugin().addTo(stage);

  new Movie('green.js', function(err, subMovie) {
    if (err) {
      console.log('Error: ' + err);
      return;
    }
    subMovie.attr({
      x: 100,
      y: 100,
      origin: new Point(50, 50)
    }).addTo(stage);
    tools.forEach(stage.children(), function(child) {
      child.animate('4s', {
        rotation: Math.PI * 2
      }, {
        repeat: Infinity
      });
    });
    new Bitmap('redpanda.jpg', function(err) {
      if (err) {
        console.log('Error: ' + err);
        return;
      }
      this.addTo(stage).attr({
        x: 50,
        y: 50,
        width: 100,
        height: 100,
        opacity: 0
      }).animate('.5s', {
        opacity: 1
      });
    });
  });
  }.toString() + '())';

code[1] = '(function() { new Rect(100, 0, 100, 100).fill("orange").addTo(stage); })();';

// For the integration test we load four different squares (red, blue, yellow, green)
// We load/run them in four different ways:
//  Code        = Blue, animation code & subMovie loading [green]
//  urls[0]     = Yellow
//  plugins[0]  = Red
//  subMovie    = Green

function playerInit(id, player, config) {

  var startTime = +new Date();

  var defaultConfig = {
    width: 250,
    height: 250,

    baseUrl: '../../src/',

    code: code[id],
    plugins: ['../test/integration/assets/plugins/red_box_plugin.js?' + 1*new Date()],
    urls: ['../../test/integration/assets/yellow.js?' + 1*new Date()],
    noCache: true,
    assets: []
  };

  for (var i in defaultConfig) {
    config[i] = config[i] || defaultConfig[i];
  }

  player
    .run(document.getElementById('stage' + id), config)
    .on('start', function() {
      var time = +new Date() - startTime;
      document.getElementById('heading' + id).innerHTML += ' (bootstrap:' + time + 'ms)';
      if (window.parent !== window) {
        window.parent.iframeDone();
      }
    });

}
