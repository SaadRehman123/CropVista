const INITIAL_STATE = {
	wheather : []
}

const testreducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {

		case "WHEATHER": {
            return {
                ...state,
                wheather: action.payload.data
            }
        }
		default: return state;
	}
}

export default testreducer