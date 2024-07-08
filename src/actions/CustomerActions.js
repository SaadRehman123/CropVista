import axios from "axios"
import { Properties } from "../utilities/Properties"

export const getCustomerMaster = () => {
    const result = axios({
        method: 'GET',
        url: `/rest/customer/master`,
        ...Properties,
    })
    return {
        type: 'GET_CUSTOMER_MASTER',
        payload: result
    }
}

export const addCustomerMaster = (obj) => {
    const result = axios({
        method: 'POST',
        url: `/rest/customer/create`,
        data: obj,
        ...Properties,
    })
    return {
        type: 'ADD_CUSTOMER',
        payload: result
    }
}

export const updateCustomerMaster = (id, obj) => {
    const result = axios({
        method: 'POST',
        url: `/rest/customer/update/${id}`,
        data: obj,
        ...Properties,
    })
    return {
        type: 'UPDATE_CUSTOMER',
        payload: result
    }
}

export const deleteCustomer = (id, obj) => {
    const result = axios({
        method: 'POST',
        url: `/rest/customer/delete/${id}`,
        data: obj,
        ...Properties,
    })
    return {
        type: 'UPDATE_CUSTOMER',
        payload: result
    }
}

export const customerMasterActionType = (obj) => {
    return {
        type: "CUSTOMER_MASTER_ACTION_TYPE",
        payload: obj
    }
}