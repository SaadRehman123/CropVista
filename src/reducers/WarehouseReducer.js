const INITIAL_STATE = {
	warehouses : []
}

const WarehouseReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "GET_WAREHOUSES": {
            return {
                ...state,
                warehouses: action.payload.data.result
            }
        }
		default: return state
	}
}

export default WarehouseReducer
