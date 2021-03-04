import React from "react";
import {withRouter} from "react-router-dom";

import {connect} from "react-redux";
import axios, {AxiosError} from "axios";
import {stringify} from "qs";

import "./index.scss";

class SignIn extends React.Component<any, any> {
	state = {
		username: "meslzy",
		password: "Momo1212",
		remember: false,
		submitted: false,
		error: "",
	};

	render = () => (
		<form id={"sign-in"} onSubmit={this.FormSubmitted}>
			<div id={"title"}>
				<span>Sign In</span>
			</div>

			<div id={"username-holder"}>
				<input type="text" id={"username"} required onChange={this.InputDidChange} value={this.state.username}/>
				<label htmlFor="username">Username</label>
			</div>
			<div id={"password-holder"}>
				<input type="password" id={"password"} required onChange={this.InputDidChange} value={this.state.password}/>
				<label htmlFor="password">Password</label>
			</div>
			<div id={"remember-holder"}>
				<input type="checkbox" id={"remember"} onChange={this.InputDidChange} checked={this.state.remember}/>
				<label htmlFor="remember">Remember Me</label>
			</div>

			<button disabled={this.state.submitted} type="submit" id={"btn-sign-in"}>Sign In</button>
			<button id={"btn-sign-up"} type={"button"}>
				Dont have an account? <span onClick={() => this.props.history.replace("/user/sign-up/", this.props.history.location.state)}>Sign Up</span>
			</button>

			{
				this.state.error && (
					<div id={"error-holder"}>
						<span>{JSON.stringify(this.state.error)}</span>
					</div>
				)
			}

		</form>
	);

	InputDidChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({[event.target.id]: event.target.value});
	};

	FormSubmitted = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		this.setState({submitted: true, errors: {}});

		try {
			const user = await axios.post("http://localhost:5000/user/sign-in/", stringify({
				username: this.state.username.toLowerCase(),
				password: this.state.password
			}), {
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				}
			}).then((response) => response.data);
			const {token, refreshToken} = await axios.post("http://localhost:5000/user/token/create", stringify({uuid: user.uuid}), {
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				}
			}).then((response) => response.data);

			this.state.remember ? localStorage.setItem("refreshToken", refreshToken) : sessionStorage.setItem("refreshToken", refreshToken);
			sessionStorage.setItem("token", token);
			this.props.setUser(Object.assign({}, user, {isLogged: true}));
		} catch (error) {
			if (error.response) {
				this.setState({submitted: false, error: error.response.data});
				return;
			}

			console.error(error);
			this.setState({submitted: false, error: {server: "error"}});
		}
	};
}

const mapDispatchToProps = (dispatch) => {
	return {
		setUser: (user) => dispatch({type: "setUser", user}),
	};
};

export default withRouter(connect(null, mapDispatchToProps)(SignIn));
