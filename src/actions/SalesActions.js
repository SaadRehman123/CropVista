import axios from "axios"
import { Properties } from "../utilities/Properties"

export const getSaleOrder = (id) => {
    const result = axios({
        method: 'GET',
        url: `rest/saleOrder/getSaleOrder/${id}`,
        ...Properties,
    })
    return {
        type: 'GET_SALE_ORDER',
        payload: result
    }
}

export const addSaleOrder = (obj) => {
    const result = axios({
        method: 'POST',
        url: `rest/saleOrder/create`,
        data: obj,
        ...Properties,
    })
    return {
        type: 'ADD_SALE_ORDER',
        payload: result
    }
}

export const addSaleOrderItems = (id, obj) => {
    const result = axios({
        method: 'POST',
        url: `rest/saleOrder/create/SO_Items/${id}`,
        data: obj,
        ...Properties,
    })
    return {
        type: 'ADD_SALE_ORDER_ITEMS',
        payload: result
    }
}

export const deleteSaleOrderItems = (obj) => {
    const result = axios({
        method: 'POST',
        url: `rest/saleOrder/delete/SO_Items`,
        data: obj,
        ...Properties,
    })
    return {
        type: 'DELETE_SALE_ORDER_ITEMS',
        payload: result
    }
}

export const updateSaleOrder = (obj, id) => {
    const result = axios({
        method: 'POST',
        url: `rest/saleOrder/update/${id}`,
        data: obj,
        ...Properties,
    })
    return {
        type: 'UPDATE_SALE_ORDER',
        payload: result
    }
}

export const saleOrderActionType = (obj) => {
    return {
        type: "SALE_ORDER_ACTION_TYPE",
        payload: obj
    }
}

export const saleInvoiceActionType = (obj) => {
    return {
        type: "SALE_INVOICE_ACTION_TYPE",
        payload: obj
    }
}

export const goodIssueActionType = (obj) => {
    return {
        type: "GOOD_ISSUE_ACTION_TYPE",
        payload: obj
    }
}