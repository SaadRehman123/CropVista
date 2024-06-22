const INITIAL_STATE = {
	vendorMaster : [],
	vendorMasterAction: { node: null, type: "CREATE" }
}

const VendorMasterReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "GET_VENDOR_MASTER": {
            return {
                ...state,
                vendorMaster: action.payload.data.result
            }
        }
        case "VENDOR_MASTER_ACTION_TYPE": {
            return {
                ...state,
                vendorMasterAction: action.payload
            }
        }
		default: return state
	}
}

export default VendorMasterReducer