const INITIAL_STATE = {
	Bom : [],
    bomAction: { node: null, type: "CREATE" }
}

const BomReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "GET_BOM": {
            return {
                ...state,
                Bom: action.payload.data.result
            }
        }
        case "BOM_ACTION_TYPE": {
            return {
                ...state,
                bomAction: action.payload
            }
        }
        default: return state
	}
}

export default BomReducer