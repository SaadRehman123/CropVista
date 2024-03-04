import axios from "axios"

import { Properties } from "../utilities/Properties"

export const getAllEmployee = () => {
    const result = axios({
        method: 'GET',
        url: `rest/employee/getEmployees`,
        ...Properties,
    })
    return {
        type: 'GET_EMPLOYEE',
        payload: result
    }
}

export const getEmployeeById = (id) => {
    const result = axios({
        method: 'GET',
        url: `rest/employee/getEmployeesById/${id}`,
        ...Properties,
    })
    return {
        type: 'GET_EMPLOYEE_BY_ID',
        payload: result
    }
}

export const addEmployee = (obj) => {
    const result = axios({
        method: 'POST',
        url: `rest/employee/create`,
        data: obj,
        ...Properties,
    })
    return {
        type: 'ADD_EMPLOYEE',
        payload: result
    }
}