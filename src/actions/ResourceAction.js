import axios from "axios"
import { Properties } from "../utilities/Properties"

export const getResource = () => {
    const result = axios({
        method: 'GET',
        url: `/rest/resource/getResources`,
        ...Properties,
    })
    return {
        type: 'GET_RESOURCES',
        payload: result
    }
}

export const addResource = (obj) => {
    const result = axios({
        method: 'POST',
        url: `rest/resource/create`,
        data: obj,
        ...Properties,
    })
    return {
        type: 'ADD_RESOURCE',
        payload: result
    }
}

export const updateResource = (id, obj) => {
    const result = axios({
        method: 'POST',
        url: `rest/resource/update/${id}`,
        data: obj,
        ...Properties,
    })
    return {
        type: 'UPDATE_RESOURCE',
        payload: result
    }
}

export const deleteResource = (id, obj) => {
    const result = axios({
        method: 'POST',
        url: `rest/resource/delete/${id}`,
        data: obj,
        ...Properties,
    })
    return {
        type: 'UPDATE_RESOURCE',
        payload: result
    }
}