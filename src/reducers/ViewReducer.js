const INITIAL_STATE = {
    login: false,
    navbar: false,
    loading: false,
	bomRef: null,
	cropPlanRef: null,
	resourceRef: null,
	warehouseRef: null,
	itemMasterRef: null,
	itemResourceRef: null,
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
		case "SET_WAREHOUSE_REF": {
            return {
                ...state,
                warehouseRef: action.payload
            }
        }
		case "SET_RESOURCE_REF": {
            return {
                ...state,
                resourceRef: action.payload
            }
        }
		case "SET_BOM_REF": {
            return {
                ...state,
                bomRef: action.payload
            }
        }
		case "SET_ITEM_RESOURCE_REF": {
            return {
                ...state,
                itemResourceRef: action.payload
            }
        }
		case "SET_ITEM_MASTER_REF": {
            return {
                ...state,
                itemMasterRef: action.payload
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