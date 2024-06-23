const INITIAL_STATE = {
	purchaseOrderAction: { node: null, type: "CREATE" },
	purchaseRequestAction: { node: null, type: "CREATE" }
}

const PurchaseReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "PURCHASE_REQUEST_ACTION_TYPE": {
            return {
                ...state,
                purchaseRequestAction: action.payload
            }
        }
        case "PURCHASE_ORDER_ACTION_TYPE": {
            return {
                ...state,
                purchaseOrderAction: action.payload
            }
        }
		default: return state
	}
}

export default PurchaseReducer
