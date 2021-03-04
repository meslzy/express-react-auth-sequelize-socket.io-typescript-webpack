import React from "react";
import {BrowserRouter, Switch, Route} from "react-router-dom";
import {connect} from "react-redux";

import {isAuthenticated, isNotAuthenticated} from "./middleware/authenticated";

import Main from "./views/main";
import User from "./views/user";
import SignIn from "./views/sign-in";
import SignUp from "./views/sign-up";

import "./app.scss";
import axios from "axios";
import {stringify} from "qs";

class App extends React.Component<any, any> {
	state = {
		ready: false,
	};

	render = () => {
		if (this.state.ready) return (
			<BrowserRouter>
				<Switch>
					<Route exact path={"/"} component={isAuthenticated(Main)}/>
					<Route path={"/user"}>
						<Switch>
							<Route path={"/user/sign-in"} component={isNotAuthenticated(SignIn)}/>
							<Route path={"/user/sign-up"} component={isNotAuthenticated(SignUp)}/>
							<Route path={"/user"} component={isAuthenticated(User)}/>
						</Switch>
					</Route>
				</Switch>
			</BrowserRouter>
		);

		return (
			<div>
				<div id={"loader"}/>
			</div>
		);
	};

	componentDidMount = async () => {
		const refreshToken = sessionStorage.getItem("refreshToken") ?? localStorage.getItem("refreshToken");

		if (refreshToken) {

			try {

				const {token} = await axios.post("http://localhost:5000/user/token/refresh", stringify({refreshToken}), {
					headers: {
						"Content-Type": "application/x-www-form-urlencoded"
					}
				}).then((response) => response.data);

				const user = await axios.get("http://localhost:5000/user/", {
					headers: {
						"Authorization": "Bearer " + token
					}
				}).then((response) => response.data);

				sessionStorage.setItem("token", token);
				this.props.setUser(Object.assign({}, user, {isLogged: true}));
			} catch {
			}
		}

		this.setState({ready: true});
	};
}

const mapDispatchToProps = (dispatch) => {
	return {
		setUser: (user) => dispatch({type: "setUser", user}),
	};
};

export default connect(null, mapDispatchToProps)(App);
