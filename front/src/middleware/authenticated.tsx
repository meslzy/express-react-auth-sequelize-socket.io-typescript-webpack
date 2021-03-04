import React from "react";
import {withRouter, Redirect} from "react-router-dom";
import {connect} from "react-redux";

export const isAuthenticated = (Component) => withRouter(connect(mapStatesToProps)((props: any) => {
	if (props.user.isLogged) return <Component/>;

	return <Redirect to={{pathname: "/user/sign-in/", state: {next: props.history.location}, search: null,}}/>;
}));
export const isNotAuthenticated = (Component) => withRouter(connect(mapStatesToProps)((props: any) => {
	if (props.user.isLogged === false) return <Component/>;

	if (props.history.location.state) return <Redirect to={{pathname: props.history.location.state.next.pathname, state: null, search: null}}/>;
	return <Redirect to={{pathname: "/user/", state: null, search: null}}/>;
}));

const mapStatesToProps = (state) => {
	return {
		user: state.user,
	};
};
