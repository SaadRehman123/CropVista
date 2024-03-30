const INITIAL_STATE = {
	toggleSettingPopup : false,
	toggleCreatePlanPopup : { open: false, type: ""},
}

const PopupReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "TOGGLE_SETTING_POPUP": {
            return {
                ...state,
                toggleSettingPopup: action.payload
            }
        }
        case "TOGGLE_CREATE_PLAN_POPUP": {
            return {
                ...state,
                toggleCreatePlanPopup: action.payload
            }
        }
		default: return state
	}
}

export default PopupReducer