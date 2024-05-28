import axios from "axios"
import { Properties } from "../utilities/Properties"

export const getInventory = () => {
    const result = axios({
        method: 'GET',
        url: `/rest/inventory/getInventory`,
        ...Properties,
    })
    return {
        type: 'GET_INVENTORY',
        payload: result
    }
}

export const addInventory = (obj) => {
    const result = axios({
        method: 'POST',
        url: `/rest/inventory/create`,
        data: obj,
        ...Properties,
    })
    return {
        type: 'ADD_INVENTORY',
        payload: result
    }
}

export const updateInventory = (id, obj) => {
    const result = axios({
        method: 'POST',
        url: `/rest/inventory/update/${id}`,
        data: obj,
        ...Properties,
    })
    return {
        type: 'UPDATE_INVENTORY',
        payload: result
    }
}