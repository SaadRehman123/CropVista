const INITIAL_STATE = {
	toggleSettingPopup : false,
	toggleCreateJobCardPopup  : false,
	toggleCreatePlanPopup : { open: false, type: ""},
	toggleCreateItemPopup : { open: false, type: ""},
	toggleCreateResourcePopup : { open: false, type: ""},
	toggleCreateWarehousePopup : { open: false, type: ""},
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
        case "TOGGLE_CREATE_WAREHOUSE_POPUP": {
            return {
                ...state,
                toggleCreateWarehousePopup: action.payload
            }
        }
        case "TOGGLE_CREATE_RESOURCE_POPUP": {
            return {
                ...state,
                toggleCreateResourcePopup: action.payload
            }
        }
        case "TOGGLE_CREATE_JOB_CARD_POPUP": {
            return {
                ...state,
                toggleCreateJobCardPopup : action.payload
            }
        }
        case "TOGGLE_CREATE_ITEM_POPUP": {
            return {
                ...state,
                toggleCreateItemPopup : action.payload
            }
        }
		default: return state
	}
}

export default PopupReducer