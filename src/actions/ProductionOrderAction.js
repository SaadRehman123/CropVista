import axios from "axios"
import { Properties } from "../utilities/Properties"

export const getProductionOrder = (productionId) => {
    const result = axios({
        method: 'GET',
        url: `/rest/productionOrder/getProductionOrder/${productionId}`,
        ...Properties,
    })
    return {
        type: 'GET_PRODUCTION_ORDER',
        payload: result
    }
}

export const addProductionOrder = (obj) => {
    const result = axios({
        method: 'POST',
        url: `rest/productionOrder/create`,
        data: obj,
        ...Properties,
    })
    return {
        type: 'ADD_PRODUCTION_ORDER',
        payload: result
    }
}

export const updateProductionOrder = (obj, id) => {
    const result = axios({
        method: 'POST',
        url: `rest/productionOrder/update/${id}`,
        data: obj,
        ...Properties,
    })
    return {
        type: 'UPDATE_PRODUCTION_ORDER',
        payload: result
    }
}

export const deleteProductionOrder = (obj, id) => {
    const result = axios({
        method: 'POST',
        url: `rest/productionOrder/delete/${id}`,
        data: obj,
        ...Properties,
    })
    return {
        type: 'DELETE_PRODUCTION_ORDER',
        payload: result
    }
}

export const addPoRouteStages = (arr) => {
    const result = axios({
        method: 'POST',
        url: `rest/routeStages/create`,
        data: arr,
        ...Properties,
    })
    return {
        type: 'ADD_PO_ROUTE_STAGES',
        payload: result
    }
}

export const updatePoRouteStages = (obj, id) => {
    const result = axios({
        method: 'POST',
        url: `rest/routeStages/update/${id}`,
        data: obj,
        ...Properties,
    })
    return {
        type: 'UPDATE_PO_ROUTE_STAGES',
        payload: result
    }
}

export const deletePoRouteStages = (obj, id) => {
    const result = axios({
        method: 'POST',
        url: `rest/routeStages/delete/${id}`,
        data: obj,
        ...Properties,
    })
    return {
        type: 'DELETE_PO_ROUTE_STAGES',
        payload: result
    }
}

export const productionOrderActionType = (obj) => {
    return {
        type: "PRODUCTION_ORDER_ACTION_TYPE",
        payload: obj
    }
}