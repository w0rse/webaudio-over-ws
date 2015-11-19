var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3000, function() {
	console.log('listening on 3000');
});

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

app.get('/assets/:file', function (req, res) {
	res.sendFile(__dirname + '/assets/' + req.params.file);
});

io.on('connection', function(socket){
	socket.on('pos', function(pos) {
		io.emit('pos', pos);
	});
	socket.on('audio', function(pos) {
		socket.broadcast.emit('audio', pos);
	});
});