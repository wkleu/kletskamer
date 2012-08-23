var express = require('express');

var app = express.createServer(express.logger());

var io = require('socket.io').listen(app);

app.get('/',
 function(request, response) {
  response.sendfile(__dirname + '/index.html');
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});

io.sockets.on('connection', function (socket) {
  socket.broadcast.emit('chat', socket.sessionId + ' connected');
  
  socket.on('chat', function (msg) {
    console.log('chat received: ' + msg);
	socket.emit('chat', msg);
	socket.broadcast.emit('chat', msg);
  });
  
  socket.on('disconnect', function () {
	socket.broadcast.emit('chat', socket.sessionId + ' disconnected');
  });
  
});