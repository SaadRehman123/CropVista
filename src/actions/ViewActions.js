
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