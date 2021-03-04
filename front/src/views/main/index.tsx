import React from "react";
import socketClient from "socket.io-client";

import "./style.scss";

class Main extends React.Component<any, any> {
	state: {
		socket: null,
	};

	render() {
		return (
			<div id={"main"}>
			</div>
		);
	}

	componentDidMount() {
		const socket = socketClient("http://localhost:5000/", {secure: true});

		socket.on("connect", () => {
			this.setState({socket});
		});

		socket.on("disconnect", () => this.setState({socket}));
	}
}

export default Main;
