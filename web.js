var express = require('express');

var app = express.createServer(express.logger());

var io = require('socket.io').listen(app);

app.get('/',
 function(request, response) {
  response.sendfile(__dirname + '/index.html');
});

app.get('/loader.gif',
 function(request, response) {
  response.sendfile(__dirname + '/loader.gif');
});


var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});


var users = {};

io.sockets.on('connection', function (socket) {

    socket.on('connect', function(data, callback) {
      console.log('user connected: ' + data.user);
      socket.user = data.user;
      users[socket.user] = socket.user;
      sendToAll(socket, 'message', {user: 'SERVER', text: socket.user + ' connected'});
      sendToAll(socket, 'updateUsers', users);
	  callback();
    });

    // message received from client
    socket.on('message', function (text) {
      console.log(socket.user + ': ' + text);
      sendToAll(socket, 'message', {user: socket.user, text: text});
    });
    
    socket.on('disconnect', function () {
      console.log('user disconnected: ' + socket.user);
      delete users[socket.user];
      console.log(users);
  	  socket.broadcast.emit('message', {user: 'SERVER', text: socket.user + ' disconnected'});
      socket.broadcast.emit('updateUsers', users);
  });
  
});

// to emit and broadcast
function sendToAll(socket, command, obj) {
  socket.emit(command, obj); 
  socket.broadcast.emit(command, obj);
}