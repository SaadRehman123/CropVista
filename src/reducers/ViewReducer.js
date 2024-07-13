const INITIAL_STATE = {
    login: false,
    navbar: false,
    loading: false,
	bomRef: null,
	cropPlanRef: null,
	resourceRef: null,
	saleOrderRef: null,
	warehouseRef: null,
	goodIssueRef: null,
	itemMasterRef: null,
	goodReceiptRef: null,
	saleInvoiceRef: null,
	itemResourceRef: null,
	vendorMasterRef: null,
	purchaseOrderRef: null,
	customerMasterRef: null,
	vendorQuotationRef: null,
	productionOrderRef: null,
	purchaseRequestRef: null,
	purchaseInvoiceRef: null,
	requestForQuotationRef: null,
	setProductionOrderItemResourceRef: null,
	setNavToolbarTitle: 'Weather',
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
		case "SET_PRODUCTION_ORDER_ITEM_RESOURCE": {
			return {
				...state,
				setProductionOrderItemResourceRef: action.payload
			}
		}
		case "SET_PRODUCTION_ORDER_REF": {
			return {
				...state,
				productionOrderRef: action.payload
			}
		}
		case "SET_VENDOR_MASTER_REF": {
			return {
				...state,
				vendorMasterRef: action.payload
			}
		}
		case "SET_PURCHASE_REQUEST_REF": {
			return {
				...state,
				purchaseRequestRef: action.payload
			}
		}
		case "SET_REQUEST_FOR_QUOTATION_REF": {
			return {
				...state,
				requestForQuotationRef: action.payload
			}
		}
		case "SET_VENDOR_QUOTATION_REF": {
			return {
				...state,
				vendorQuotationRef: action.payload
			}
		}
		case "SET_PURCHASE_ORDER_REF": {
			return {
				...state,
				purchaseOrderRef: action.payload
			}
		}
		case "SET_GOOD_RECEIPT_REF": {
			return {
				...state,
				goodReceiptRef: action.payload
			}
		}
		case "SET_PURCHASE_INVOICE_REF": {
			return {
				...state,
				purchaseInvoiceRef: action.payload
			}
		}
		case "SET_CUSTOMER_MASTER_REF": {
			return {
				...state,
				customerMasterRef: action.payload
			}
		}
		case "SET_SALE_ORDER_REF": {
			return {
				...state,
				saleOrderRef: action.payload
			}
		}
		case "SET_GOOD_ISSUE_REF": {
			return {
				...state,
				goodIssueRef: action.payload
			}
		}
		case "SET_SALE_INVOICE_REF": {
			return {
				...state,
				saleInvoiceRef: action.payload
			}
		}
		default: return state
	}
}

export default ViewReducer