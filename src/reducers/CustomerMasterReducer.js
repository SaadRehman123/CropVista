const INITIAL_STATE = {
	customerMaster : [],
	customerMasterAction: { node: null, type: "CREATE" }
}

const CustomerMasterReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "GET_CUSTOMER_MASTER": {
            return {
                ...state,
                customerMaster: action.payload.data.result
            }
        }
        case "CUSTOMER_MASTER_ACTION_TYPE": {
            return {
                ...state,
                customerMasterAction: action.payload
            }
        }
		default: return state
	}
}

export default CustomerMasterReducer