
export const renderLoadingView = (obj) => {
    return {
		type : "RENDER_LOADING",
		payload : obj
	}
}

export const setLogin = (obj) => {
    return {
		type : "SET_LOGIN",
		payload : obj
	}
}

export const toggleDeletePopup = (obj) => {
    return {
        type: "TOGGLE_DELETE_POPUP",
        payload: obj
    }
}

export const setCropPlanRef = (obj) => {
    return {
        type: "SET_CROP_PLAN_REF",
        payload: obj
    }
}

export const setWarehouseRef = (obj) => {
    return {
        type: "SET_WAREHOUSE_REF",
        payload: obj
    }
}

export const setResourceRef = (obj) => {
    return {
        type: "SET_RESOURCE_REF",
        payload: obj
    }
}

export const setBomRef = (obj) => {
    return {
        type: "SET_BOM_REF",
        payload: obj
    }
}

export const setItemResourceTreeRef = (obj) => {
    return {
        type: "SET_ITEM_RESOURCE_REF",
        payload: obj
    }
}

export const setItemMasterTreeRef = (obj) => {
    return {
        type: "SET_ITEM_MASTER_REF",
        payload: obj
    }
}

export const toggleNavbar = (value) => {
	return {
		type: "TOGGLE_NAVBAR",
		payload: value
	}
}

export const setNavToolbarTitle = (value) => {
	return {
		type: "SET_NAV_TOOLBAR_TITLE",
		payload: value
	}
}