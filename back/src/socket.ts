import {Server, Socket} from "socket.io";

export default (server) => {
	const io = new Server(server, {
		cors: {
			origin: "*"
		}
	});

	io.on("connection", (socket: Socket) => {
		console.log(socket.id);
	});
};
