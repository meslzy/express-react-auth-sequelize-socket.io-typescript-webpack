import React from "react";
import {withRouter} from "react-router-dom";

import "./index.scss";

class User extends React.Component<any, any> {
	render() {
		return (
			<h1>
				user
			</h1>
		);
	}
}

export default withRouter(User);
