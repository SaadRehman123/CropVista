import axios from "axios"
import { Properties } from "../utilities/Properties"

export const getBom = (itemBid) => {
    const result = axios({
        method: 'GET',
        url: `/rest/bom/getBom/${itemBid}`,
        ...Properties,
    })
    return {
        type: 'GET_BOM',
        payload: result
    }
}

export const addBom = (obj) => {
    const result = axios({
        method: 'POST',
        url: `rest/bom/create`,
        data: obj,
        ...Properties,
    })
    return {
        type: 'ADD_BOM',
        payload: result
    }
}

export const updateBom = (obj, id) => {
    const result = axios({
        method: 'POST',
        url: `rest/bom/update/${id}`,
        data: obj,
        ...Properties,
    })
    return {
        type: 'ADD_BOM',
        payload: result
    }
}

export const deleteBom = (obj, id) => {
    const result = axios({
        method: 'POST',
        url: `rest/bom/delete/${id}`,
        data: obj,
        ...Properties,
    })
    return {
        type: 'DELETE_BOM',
        payload: result
    }
}

export const addBomItemResource = (obj) => {
    const result = axios({
        method: 'POST',
        url: `rest/bomItemResource/create`,
        data: obj,
        ...Properties,
    })
    return {
        type: 'ADD_BOM_ITEM_RESOURCE',
        payload: result
    }
}

export const updateBomItemResource = (arr, id) => {
    const result = axios({
        method: 'POST',
        url: `rest/bomItemResource/update/${id}`,
        data: arr,
        ...Properties,
    })
    return {
        type: 'UPDATE_BOM_ITEM_RESOURCE',
        payload: result
    }
}

export const deleteBomItemResource = (arr, id) => {
    const result = axios({
        method: 'POST',
        url: `rest/bomItemResource/delete/${id}`,
        data: arr,
        ...Properties,
    })
    return {
        type: 'DELETE_BOM_ITEM_RESOURCE',
        payload: result
    }
}

export const bomActionType = (obj) => {
    return {
        type: "BOM_ACTION_TYPE",
        payload: obj
    }
}