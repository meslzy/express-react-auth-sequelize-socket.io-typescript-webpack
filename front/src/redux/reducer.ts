const initState = {
	user: {
		isLogged: false,
	},
};

const Reducer = (state = initState, action) => {
	switch (action.type) {
	case "setUser":
		return {...state, user: action.user};
	default:
		return state;
	}
};

export default Reducer;
