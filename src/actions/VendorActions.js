import axios from "axios"
import { Properties } from "../utilities/Properties"

export const getVendorMaster = () => {
    const result = axios({
        method: 'GET',
        url: `/rest/vendorMaster/getVendorMaster`,
        ...Properties,
    })
    return {
        type: 'GET_VENDOR_MASTER',
        payload: result
    }
}

export const addVendorMaster = (obj) => {
    const result = axios({
        method: 'POST',
        url: `/rest/vendorMaster/create`,
        data: obj,
        ...Properties,
    })
    return {
        type: 'ADD_VENDOR',
        payload: result
    }
}

export const updateVendorMaster = (vendorId, obj) => {
    const result = axios({
        method: 'POST',
        url: `/rest/vendorMaster/update/${vendorId}`,
        data: obj,
        ...Properties,
    })
    return {
        type: 'UPDATE_VENDOR',
        payload: result
    }
}

export const deleteVendor = (vendorId, obj) => {
    const result = axios({
        method: 'POST',
        url: `/rest/vendorMaster/delete/${vendorId}`,
        data: obj,
        ...Properties,
    })
    return {
        type: 'UPDATE_VENDOR',
        payload: result
    }
}

export const vendorMasterActionType = (obj) => {
    return {
        type: "VENDOR_MASTER_ACTION_TYPE",
        payload: obj
    }
}