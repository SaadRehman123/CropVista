const INITIAL_STATE = {
	saleOrder : [],
	goodIssue : [],
	saleInvoice : [],
    saleOrderAction: { node: null, type: "CREATE" },
    goodIssueAction: { node: null, type: "CREATE" },
    saleInvoiceAction: { node: null, type: "CREATE" }
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
        case "SALE_ORDER_ACTION_TYPE": {
            return {
                ...state,
                saleOrderAction: action.payload
            }
        }
        case "SALE_INVOICE_ACTION_TYPE": {
            return {
                ...state,
                saleInvoiceAction: action.payload
            }
        }
        case "GOOD_ISSUE_ACTION_TYPE": {
            return {
                ...state,
                goodIssueAction: action.payload
            }
        }
		default: return state
	}
}

export default SalesReducer
