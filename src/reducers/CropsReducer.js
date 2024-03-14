const INITIAL_STATE = {
	plannedCrops : [],
	cropsBySeason : []
}

const CropsReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "GET_CROPS_BY_SEASON": {
            return {
                ...state,
                cropsBySeason: action.payload.data.result
            }
        }
        case "GET_PLANNED_CROPS": {
            return {
                ...state,
                plannedCrops: action.payload.data.result
            }
        }
		default: return state
	}
}

export default CropsReducer
