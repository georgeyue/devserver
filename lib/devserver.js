var Hapi = require('hapi');
var fs = require('fs');
var path = require("path");
var directory = path.join(path.dirname(fs.realpathSync(__filename)), '../public/');


function startThis() {
  var server = new Hapi.Server(3000);

  server.start(function() {
    console.log('server started at:', server.info.uri);
  });


  function figureType(name) {
    if (/\.js$/.test(name)) {
      return 'text/javascript';
    }
    else {
      return 'text/html';
    }
  }

  function logRequest(request) {
    console.log(request.params.uri);
  }

  server.route({
    method: 'GET',
    path: '/',
    handler: function(request, reply) {
      var a = fs.readFileSync(directory + 'index.html');
      reply(a)
        .type('text/html');
    }
  });

  server.route({
    method: 'GET',
    path: '/{name}/{delay?}',
    handler: function(request, reply) {
      var filepath = directory+request.params.name;

        setTimeout(function() {
          if (fs.existsSync(filepath)) {
            var a = fs.readFileSync(filepath);
            reply(a+'')
              .type(figureType(filepath))
              .code(200);
          } else {
            reply('file does not exist')
              .type('text/plain');
          }
        }, request.params.delay);
    }
  });

  server.route({
    method: 'GET',
    path: '/js/{filename}',
    handler: {
      file: function(request) {
        return directory + 'js/' + request.params.filename;
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: directory
      }
    }
  });
}

exports.start = startThis;
