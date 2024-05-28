const INITIAL_STATE = {
	inventoryStatus : [],
}

const InventoryReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "GET_INVENTORY": {
            return {
                ...state,
                inventoryStatus: action.payload.data.result
            }
        }
		default: return state
	}
}

export default InventoryReducer