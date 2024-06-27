const INITIAL_STATE = {
    purchaseRequest: [],
    requestForQuotation: [],
	goodReceiptAction: { node: null, type: "CREATE" },
	purchaseOrderAction: { node: null, type: "CREATE" },
	purchaseRequestAction: { node: null, type: "CREATE" },
	vendorQuotationAction: { node: null, type: "CREATE" },
	requestForQuotationAction: { node: null, type: "CREATE" }
}

const PurchaseReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "GET_PURCHASE_REQUEST": {
            return {
                ...state,
                purchaseRequest: action.payload.data.result
            }
        }
        case "GET_REQUEST_FOR_QUOTATION": {
            return {
                ...state,
                requestForQuotation: action.payload.data.result
            }
        }
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
        case "REQUEST_FOR_QUOTATION_ACTION_TYPE": {
            return {
                ...state,
                requestForQuotationAction: action.payload
            }
        }
        case "VENDOR_QUOTATION_ACTION_TYPE": {
            return {
                ...state,
                vendorQuotationAction: action.payload
            }
        }
        case "GOOD_RECEIPT_ACTION_TYPE": {
            return {
                ...state,
                goodReceiptAction: action.payload
            }
        }
		default: return state
	}
}

export default PurchaseReducer
