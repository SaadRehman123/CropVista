const INITIAL_STATE = {
	itemMaster : []
}

const ItemReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "GET_ITEM_MASTER": {
            return {
                ...state,
                itemMaster: action.payload.data.result
            }
        }
		default: return state
	}
}

export default ItemReducer
