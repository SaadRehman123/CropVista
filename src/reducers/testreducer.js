const INITIAL_STATE = {
	employee : []
}

const testreducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {

		case "GET_EMPLOYEE": {
            return {
                ...state,
                employee: action.payload.data.result
            }
        }
		default: return state;
	}
}

export default testreducer