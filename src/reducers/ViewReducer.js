const INITIAL_STATE = {
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
		default: return state
	}
}

export default ViewReducer