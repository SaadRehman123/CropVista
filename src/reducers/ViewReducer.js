const INITIAL_STATE = {
    login: false,
    navbar: false,
    loading: false,
	cropPlanRef: null,
	setNavToolbarTitle: 'Dashboard',
    deletePopup: { active: false, type: "" },
}

const ViewReducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case "RENDER_LOADING": {
			return {
				...state,
				loading: action.payload
			}
		}
		case "SET_LOGIN": {
			return {
				...state,
				login: action.payload
			}
		}
		case "TOGGLE_DELETE_POPUP": {
            return {
                ...state,
                deletePopup: action.payload
            }
        }
		case "SET_CROP_PLAN_REF": {
            return {
                ...state,
                cropPlanRef: action.payload
            }
        }
		case "TOGGLE_NAVBAR": {
			return {
				...state,
				navbar: action.payload
			}
		}
		case "SET_NAV_TOOLBAR_TITLE": {
			return {
				...state,
				setNavToolbarTitle: action.payload
			}
		}
		default: return state
	}
}

export default ViewReducer