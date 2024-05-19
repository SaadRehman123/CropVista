const INITIAL_STATE = {
	stockEntries : []
}

const StockEntriesReducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
        case "GET_STOCK_ENTRIES": {
            return {
                ...state,
                stockEntries: action.payload.data.result
            }
        }
		default: return state
	}
}

export default StockEntriesReducer