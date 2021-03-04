import config from "./src/config";
import app from "./src/app";
import db from "./src/sequelize";
import socket from "./src/socket";

const server = require("http").createServer(app);

config(process.env.NODE_ENV === "development").then(() => {
	db.authenticate().then(() => {
		server.listen(process.env.PORT ?? 5000, () => {
			socket(server);
			console.log("done");
		});
	});
});
