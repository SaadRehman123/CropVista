import axios from "axios"
import { Properties } from "../utilities/Properties"

export const addStockEntries = (obj) => {
    const result = axios({
        method: 'POST',
        url: `/rest/stockEntries/create`,
        data: obj,
        ...Properties,
    })
    return {
        type: 'ADD_STOCK_ENTRY',
        payload: result
    }
}

export const getStockEntries = () => {
    const result = axios({
        method: 'GET',
        url: `/rest/stockEntries/getStockEntries`,
        ...Properties,
    })
    return {
        type: 'GET_STOCK_ENTRIES',
        payload: result
    }
}
