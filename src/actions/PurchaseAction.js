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