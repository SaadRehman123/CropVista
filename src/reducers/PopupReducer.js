const INITIAL_STATE = {
	toggleSettingPopup : false
}

const PopupReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "TOGGLE_SETTING_POPUP": {
            return {
                ...state,
                toggleSettingPopup: action.payload
            }
        }
		default: return state
	}
}

export default PopupReducer