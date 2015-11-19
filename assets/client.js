var socket = io();

var master = location.search.indexOf('master') !== -1;
var audioCtx = new window.AudioContext();
var $crosshair = $('#crosshair');

if (master) {
	$(document).on('mousemove', function(e) {
		socket.emit('pos', {x: e.pageX, y: e.pageY});
	});
	getAudio();
} else {
	
}

socket.on('pos', function(pos) {
	$crosshair.css({left: pos.x, top: pos.y});
});
socket.on('audio', function(audio) {
	var source = audioCtx.createBufferSource();
	var buffer = audioCtx.createBuffer(1, 8192, audioCtx.sampleRate);
	buffer.copyToChannel(new Float32Array(audio), 0);
	//console.log(audio);
	// audioCtx.decodeAudioData(audio, function(buffer) {
		source.buffer = buffer;
		source.connect(audioCtx.destination);
		source.start();
	// });
});

function getAudio() {
	navigator.getUserMedia = (
		navigator.getUserMedia ||
		navigator.webkitGetUserMedia ||
		navigator.mozGetUserMedia ||
		navigator.msGetUserMedia);


	navigator.getUserMedia({audio: true}, function(stream) {

		var source = audioCtx.createMediaStreamSource(stream);

		var scriptNode = audioCtx.createScriptProcessor(8192, 1, 1);

		scriptNode.onaudioprocess = function(audioProcessingEvent) {
			socket.emit('audio', audioProcessingEvent.inputBuffer.getChannelData(0).buffer);
			// console.log(audioProcessingEvent.inputBuffer.getChannelData(0));
		};

		source.connect(scriptNode);
		scriptNode.connect(audioCtx.destination);

	}, function(err) {
		console.log('gUM error: ', error);
	});
}