const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const rtsp = require("rtsp-ffmpeg");

server.listen(6147);

const uri = "rtsp://24.126.103.213:559/snl/live/1/1";
const stream = new rtsp.FFMpeg({ input: uri });

io.on("connection", function (socket) {
	const pipeStream = function (data) {
		socket.emit("data", data.toString("base64"));
	};
	stream.on("data", pipeStream);
	socket.on("disconnect", function () {
		stream.removeListener("data", pipeStream);
	});
});

app.get("/", function (req, res) {
	res.sendFile(__dirname + "/index.html");
});
