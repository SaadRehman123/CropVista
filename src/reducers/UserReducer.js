const INITIAL_STATE = {
	users : []
}

const UserReducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
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