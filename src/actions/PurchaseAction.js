import axios from "axios"
import { Properties } from "../utilities/Properties"

export const getPurchaseRequest = (id) => {
    const result = axios({
        method: 'GET',
        url: `rest/purchaseRequest/getPurchaseRequest/${id}`,
        ...Properties,
    })
    return {
        type: 'GET_PURCHASE_REQUEST',
        payload: result
    }
}

export const addPurchaseRequest = (obj) => {
    const result = axios({
        method: 'POST',
        url: `rest/purchaseRequest/create`,
        data: obj,
        ...Properties,
    })
    return {
        type: 'ADD_PURCHASE_REQUEST',
        payload: result
    }
}

export const addPurchaseRequestItems = (purchaseRequestId, obj) => {
    const result = axios({
        method: 'POST',
        url: `rest/purchaseRequest/create/PR_Items/${purchaseRequestId}`,
        data: obj,
        ...Properties,
    })
    return {
        type: 'ADD_PURCHASE_REQUEST_ITEMS',
        payload: result
    }
}

export const deletePurchaseRequestItems = (obj) => {
    const result = axios({
        method: 'POST',
        url: `rest/purchaseRequest/delete/PR_Items`,
        data: obj,
        ...Properties,
    })
    return {
        type: 'DELETE_PURCHASE_REQUEST_ITEMS',
        payload: result
    }
}

export const updatePurchaseRequest = (obj, id) => {
    const result = axios({
        method: 'POST',
        url: `rest/purchaseRequest/update/${id}`,
        data: obj,
        ...Properties,
    })
    return {
        type: 'UPDATE_PURCHASE_REQUEST',
        payload: result
    }
}

export const purchaseRequestActionType = (obj) => {
    return {
        type: "PURCHASE_REQUEST_ACTION_TYPE",
        payload: obj
    }
}

export const purchaseOrderActionType = (obj) => {
    return {
        type: "PURCHASE_ORDER_ACTION_TYPE",
        payload: obj
    }
}

export const requestForQuotationActionType = (obj) => {
    return {
        type: "REQUEST_FOR_QUOTATION_ACTION_TYPE",
        payload: obj
    }
}

export const vendorQuotationActionType = (obj) => {
    return {
        type: "VENDOR_QUOTATION_ACTION_TYPE",
        payload: obj
    }
}

export const goodReceiptActionType = (obj) => {
    return {
        type: "GOOD_RECEIPT_ACTION_TYPE",
        payload: obj
    }
}