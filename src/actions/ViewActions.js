
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

export const toggleNavbar = (value) => {
	return {
		type: "TOGGLE_NAVBAR",
		payload: value
	}
}