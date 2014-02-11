var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

server.listen(80);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.get('/board/', function (req, res) {
  res.sendfile(__dirname + '/board.html');
});

/*
io.sockets.on('connection', function (socket) {
  
  socket.emit('news', { hello: 'world' });
 
  socket.emit('users', 'Allan Kimmer Jensen, Other Guy, James Bond');

  socket.on('my other event', function (data) {
    console.log(data);
  });

  socket.on('disconnect', function () {
    io.sockets.emit('user disconnected');
  });

});*/



/* Socket.io Events */
var board = io
  .of('/ws/board')
  .on('connection', function (socket) {
    socket.emit('status', { status: 'Board connected' });
  });

var controller = io
  .of('/ws/controller')
  .on('connection', function (socket) {

    socket.emit('status', { status: 'connected' });
    board.emit('playerConnected', { id: socket.id });

    // send the clients id to the client itself.
    socket.send(socket.id);

    socket.on('move', function (data) {
      board.emit('move', { id: socket.id, movement: data });
      console.log('Player '+socket.id+', move: ' + data);
    });

    socket.on('disconnect', function (socket) {
    	board.emit('playerDisconnected', { id: socket.id });
        console.log('Controller Disconnected:', socket);
    });
  });