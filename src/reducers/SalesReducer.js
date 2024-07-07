const INITIAL_STATE = {
	saleOrder : [],
	goodIssue : [],
	saleInvoice : []
}

const SalesReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "GET_SALE_ORDER": {
            return {
                ...state,
                saleOrder: action.payload.data.result
            }
        }
        case "GET_GOOD_ISSUE": {
            return {
                ...state,
                goodIssue: action.payload.data.result
            }
        }
        case "GET_SALE_INVOICE": {
            return {
                ...state,
                saleInvoice: action.payload.data.result
            }
        }
		default: return state
	}
}

export default SalesReducer
