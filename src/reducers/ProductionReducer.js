const INITIAL_STATE = {
	productionOrder : [],
	productionOrderAction: { node: null, type: "CREATE" }
}

const ProductionReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "GET_PRODUCTION_ORDER": {
            return {
                ...state,
                productionOrder: action.payload.data.result
            }
        }
        case "PRODUCTION_ORDER_ACTION_TYPE": {
            return {
                ...state,
                productionOrderAction: action.payload
            }
        }
		default: return state
	}
}

export default ProductionReducer