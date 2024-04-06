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