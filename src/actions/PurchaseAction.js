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

export const getRequestForQuotation = (id) => {
    const result = axios({
        method: 'GET',
        url: `rest/rfq/getRFQ/${id}`,
        ...Properties,
    })
    return {
        type: 'GET_REQUEST_FOR_QUOTATION',
        payload: result
    }
}

export const addRequestForQuotation = (obj) => {
    const result = axios({
        method: 'POST',
        url: `rest/rfq/create`,
        data: obj,
        ...Properties,
    })
    return {
        type: 'ADD_REQUEST_FOR_QUOTATION',
        payload: result
    }
}

export const addRequestForQuotationItems = (rfq_Id, obj) => {
    const result = axios({
        method: 'POST',
        url: `rest/rfq/create/rfq_Items/${rfq_Id}`,
        data: obj,
        ...Properties,
    })
    return {
        type: 'ADD_REQUEST_FOR_QUOTATION_ITEMS',
        payload: result
    }
}

export const addRequestForQuotationVendors = (rfq_Id, obj) => {
    const result = axios({
        method: 'POST',
        url: `rest/rfq/create/rfq_Vendors/${rfq_Id}`,
        data: obj,
        ...Properties,
    })
    return {
        type: 'ADD_REQUEST_FOR_QUOTATION_VENDOR',
        payload: result
    }
}

export const deleteRequestForQuotationItems = (obj) => {
    const result = axios({
        method: 'POST',
        url: `rest/rfq/delete/rfq_Items`,
        data: obj,
        ...Properties,
    })
    return {
        type: 'DELETE_PURCHASE_REQUEST_ITEMS',
        payload: result
    }
}

export const deleteRequestForQuotationVendor = (obj) => {
    const result = axios({
        method: 'POST',
        url: `rest/rfq/delete/rfq_Vendor`,
        data: obj,
        ...Properties,
    })
    return {
        type: 'DELETE_REQUEST_FOR_QUOTATION_VENDOR',
        payload: result
    }
}

export const updateRequestForQuotation = (obj, id) => {
    const result = axios({
        method: 'POST',
        url: `rest/rfq/update/${id}`,
        data: obj,
        ...Properties,
    })
    return {
        type: 'UPDATE_REQUEST_FOR_QUOTATION',
        payload: result
    }
}

export const getVendorQuotation = (id) => {
    const result = axios({
        method: 'GET',
        url: `rest/vendorQuotation/getVQ/${id}`,
        ...Properties,
    })
    return {
        type: 'GET_VENDOR_QUOTATION',
        payload: result
    }
}

export const addVendorQuotation = (obj) => {
    const result = axios({
        method: 'POST',
        url: `rest/vendorQuotation/create`,
        data: obj,
        ...Properties,
    })
    return {
        type: 'ADD_VENDOR_QUOTATION',
        payload: result
    }
}

export const updateVendorQuotation = (obj, id) => {
    const result = axios({
        method: 'POST',
        url: `rest/vendorQuotation/update/${id}`,
        data: obj,
        ...Properties,
    })
    return {
        type: 'UPDATE_VENDOR_QUOTATION',
        payload: result
    }
}

export const getPurchaseOrder = (id) => {
    const result = axios({
        method: 'GET',
        url: `rest/purchaseOrder/getPurchaseOrder/${id}`,
        ...Properties,
    })
    return {
        type: 'GET_PURCHASE_ORDER',
        payload: result
    }
}

export const addPurchaseOrder = (obj) => {
    const result = axios({
        method: 'POST',
        url: `rest/purchaseOrder/create`,
        data: obj,
        ...Properties,
    })
    return {
        type: 'ADD_PURCHASE_ORDER',
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