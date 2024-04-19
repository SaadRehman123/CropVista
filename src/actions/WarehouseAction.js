import axios from "axios"
import { Properties } from "../utilities/Properties"

export const getWarehouse = () => {
    const result = axios({
        method: 'GET',
        url: `/rest/warehouse/getWarehouses`,
        ...Properties,
    })
    return {
        type: 'GET_WAREHOUSES',
        payload: result
    }
}

export const addWarehouse = (obj) => {
    const result = axios({
        method: 'POST',
        url: `rest/warehouse/create`,
        data: obj,
        ...Properties,
    })
    return {
        type: 'ADD_WAREHOUSE',
        payload: result
    }
}

export const updateWarehouse = (id, obj) => {
    const result = axios({
        method: 'POST',
        url: `rest/warehouse/update/${id}`,
        data: obj,
        ...Properties,
    })
    return {
        type: 'UPDATE_WAREHOUSE',
        payload: result
    }
}

export const deleteWarehouse = (id, obj) => {
    const result = axios({
        method: 'POST',
        url: `rest/warehouse/delete/${id}`,
        data: obj,
        ...Properties,
    })
    return {
        type: 'UPDATE_WAREHOUSE',
        payload: result
    }
}