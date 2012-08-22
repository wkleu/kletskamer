var express = require('express');

var app = express.createServer(express.logger());

var io = require('socket.io').listen(app);

app.get('/',
 function(request, response) {
  response.sendfile(__dirname + '/index.html');
});

app.get('/css/bootstrap.min.css',
 function(request, response) {
  response.sendfile(__dirname + '/bootstrap/css/bootstrap.min.css');
});

app.get('/js/bootstrap.min.js',
 function(request, response) {
  response.sendfile(__dirname + '/bootstrap/js/bootstrap.min.js');
});


var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});

io.sockets.on('connection', function (socket) {
  socket.on('chat', function (msg) {
    console.log('chat received: ' + msg);
	socket.emit('chat', msg);
  });
});