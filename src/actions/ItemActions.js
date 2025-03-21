import axios from "axios"
import { Properties } from "../utilities/Properties"

export const getItemMaster = () => {
    const result = axios({
        method: 'GET',
        url: `/rest/itemMaster/getItemMaster`,
        ...Properties,
    })
    return {
        type: 'GET_ITEM_MASTER',
        payload: result
    }
}

export const addItemMaster = (obj) => {
    const result = axios({
        method: 'POST',
        url: `/rest/itemMaster/create`,
        data: obj,
        ...Properties,
    })
    return {
        type: 'ADD_ITEM',
        payload: result
    }
}

export const updateItemMaster = (itemId, obj) => {
    const result = axios({
        method: 'POST',
        url: `/rest/itemMaster/update/${itemId}`,
        data: obj,
        ...Properties,
    })
    return {
        type: 'UPDATE_ITEM',
        payload: result
    }
}