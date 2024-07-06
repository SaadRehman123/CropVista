
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

export const setProductionOrderItemResource = (value) => {
	return {
		type: "SET_PRODUCTION_ORDER_ITEM_RESOURCE",
		payload: value
	}
}

export const setProductionOrderRef = (value) => {
	return {
		type: "SET_PRODUCTION_ORDER_REF",
		payload: value
	}
}

export const setVendorMasterRef = (value) => {
	return {
		type: "SET_VENDOR_MASTER_REF",
		payload: value
	}
}

export const setPurchaseRequestRef = (value) => {
	return {
		type: "SET_PURCHASE_REQUEST_REF",
		payload: value
	}
}

export const setRequestForQuotationRef = (value) => {
	return {
		type: "SET_REQUEST_FOR_QUOTATION_REF",
		payload: value
	}
}

export const setVendorQuotationRef = (value) => {
	return {
		type: "SET_VENDOR_QUOTATION_REF",
		payload: value
	}
}

export const setPurchaseOrderRef = (value) => {
	return {
		type: "SET_PURCHASE_ORDER_REF",
		payload: value
	}
}

export const setGoodReceiptRef = (value) => {
	return {
		type: "SET_GOOD_RECEIPT_REF",
		payload: value
	}
}

export const setPurchaseInvoiceRef = (value) => {
	return {
		type: "SET_PURCHASE_INVOICE_REF",
		payload: value
	}
}