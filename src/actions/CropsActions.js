import axios from "axios"
import { Properties } from "../utilities/Properties"

export const getCropsBySeason = (season) => {
    const result = axios({
        method: 'GET',
        url: `/rest/crops/getCropsBySeason/${season}`,
        ...Properties,
    })
    return {
        type: 'GET_CROPS_BY_SEASON',
        payload: result
    }
}

export const getPlannedCrops = () => {
    const result = axios({
        method: 'GET',
        url: `rest/cropsplan/getCropsPlan`,
        ...Properties,
    })
    return {
        type: 'GET_PLANNED_CROPS',
        payload: result
    }
}

export const addCropsPlan = (obj) => {
    const result = axios({
        method: 'POST',
        url: `rest/cropsplan/create`,
        data: obj,
        ...Properties,
    })
    return {
        type: 'ADD_CROPS_PLAN',
        payload: result
    }
}

export const updateCropsPlan = (id, obj) => {
    const result = axios({
        method: 'POST',
        url: `rest/cropsplan/update/${id}`,
        data: obj,
        ...Properties,
    })
    return {
        type: 'UPDATE_CROPS_PLAN',
        payload: result
    }
}

export const deleteCropsPlan = (id, obj) => {
    const result = axios({
        method: 'POST',
        url: `rest/cropsplan/delete/${id}`,
        data: obj,
        ...Properties,
    })
    return {
        type: 'UPDATE_CROPS_PLAN',
        payload: result
    }
}