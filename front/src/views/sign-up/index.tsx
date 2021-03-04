import React from "react";
import {withRouter} from "react-router-dom";

import {connect} from "react-redux";
import axios from "axios";
import {stringify} from "qs";

import "./index.scss";

class SignUp extends React.Component<any, any> {
	state = {
		username: "meslzy",
		email: "i@ss.com",
		password: "Momo1212",
		remember: false,
		submitted: false,
		error: "",
	};

	render = () => (
		<form id={"sign-up"} onSubmit={this.FormSubmitted}>
			<div id={"title"}>
				<span>Sign Up</span>
			</div>

			<div id={"username-holder"}>
				<input type="text" id={"username"} required onChange={this.InputDidChange} value={this.state.username}/>
				<label htmlFor="username">Username</label>
			</div>
			<div id={"email-holder"}>
				<input type="email" id={"email"} required onChange={this.InputDidChange} value={this.state.email}/>
				<label htmlFor="email">Email</label>
			</div>
			<div id={"password-holder"}>
				<input type="password" id={"password"} required onChange={this.InputDidChange} value={this.state.password}/>
				<label htmlFor="password">Password</label>
			</div>
			<div id={"remember-holder"}>
				<input type="checkbox" id={"remember"} onChange={this.InputDidChange} checked={this.state.remember}/>
				<label htmlFor="remember">Remember Me</label>
			</div>

			<button disabled={this.state.submitted} type="submit" id={"btn-sign-up"}>Sign Up</button>
			<button id={"btn-sign-in"} type={"button"}>
				have an account? <span onClick={() => this.props.history.replace("/user/sign-in/", this.props.history.location.state)}>Sign In</span>
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
			const user = await axios.post("http://localhost:5000/user/sign-up/", stringify({
				username: this.state.username.toLowerCase(),
				email: this.state.email.toLowerCase(),
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

export default withRouter(connect(null, mapDispatchToProps)(SignUp));
