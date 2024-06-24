import axios from "axios"
import { Properties } from "../utilities/Properties"

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