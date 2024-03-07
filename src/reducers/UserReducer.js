const INITIAL_STATE = {
	users : [],
    loginUser: null
}

const UserReducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
        case "GET_LOGGED_IN_USER": {
            return {
                ...state,
                loginUser: action.payload.data.result
            }
        }
		case "GET_ALL_USERS": {
            return {
                ...state,
                users: action.payload.data.result
            }
        }
		default: return state
	}
}

export default UserReducer