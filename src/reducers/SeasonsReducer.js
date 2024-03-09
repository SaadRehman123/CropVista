const INITIAL_STATE = {
	getSeasons : []
}

const SeasonsReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "GET_SEASONS": {
            return {
                ...state,
                getSeasons: action.payload.data.result
            }
        }
		default: return state
	}
}

export default SeasonsReducer
