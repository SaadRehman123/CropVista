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

export const bomActionType = (obj) => {
    return {
        type: "BOM_ACTION_TYPE",
        payload: obj
    }
}