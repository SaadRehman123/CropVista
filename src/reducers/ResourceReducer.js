const INITIAL_STATE = {
	resources : []
}

const ResourceReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "GET_RESOURCES": {
            return {
                ...state,
                resources: action.payload.data.result
            }
        }
		default: return state
	}
}

export default ResourceReducer