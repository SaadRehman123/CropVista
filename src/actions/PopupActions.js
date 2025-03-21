export const toggleLogoutPopup = (obj) => {
    return {
		type : "TOGGLE_SETTING_POPUP",
		payload : obj
	}
}

export const toggleCreatePlanPopup = (obj) => {
    return {
		type : "TOGGLE_CREATE_PLAN_POPUP",
		payload : obj
	}
}

export const toggleCreateWarehousePopup = (obj) => {
    return {
		type : "TOGGLE_CREATE_WAREHOUSE_POPUP",
		payload : obj
	}
}

export const toggleCreateResourcePopup = (obj) => {
    return {
		type : "TOGGLE_CREATE_RESOURCE_POPUP",
		payload : obj
	}
}

export const toggleCreateJobCardPopup = (obj) => {
    return {
		type : "TOGGLE_CREATE_JOB_CARD_POPUP",
		payload : obj
	}
}

export const toggleCreateItemPopup = (obj) => {
    return {
		type : "TOGGLE_CREATE_ITEM_POPUP",
		payload : obj
	}
}

export const toggleLowSupplyPopup = (obj) => {
    return {
		type : "TOGGLE_LOW_SUPPLY_POPUP",
		payload : obj
	}
}