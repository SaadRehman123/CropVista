const INITIAL_STATE = {
    login: false,
    loading: false
}

const ViewReducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case "RENDER_LOADING": {
			return {
				...state,
				loading: action.payload
			}
		}
		case "SET_LOGIN": {
			return {
				...state,
				login: action.payload
			}
		}
		default: return state
	}
}

export default ViewReducer