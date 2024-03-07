import axios from "axios"

import { Properties } from "../utilities/Properties"

export const loginUser = (user, email, password) => {
    const result = axios({
        method: 'POST',
        url: `rest/authenticateUserProfile/login/${email}/${password}`,
        data: user,
        ...Properties,
    })
    return {
        type: 'LOGIN_USER',
        payload: result
    }
} 

export const getAllUsers = () => {
    const result = axios({
        method: 'GET',
        url: `rest/users/getUsers`,
        ...Properties,
    })
    return {
        type: 'GET_ALL_USERS',
        payload: result
    }
}

export const addUser = (obj) => {
    const result = axios({
        method: 'POST',
        url: `rest/users/create`,
        data: obj,
        ...Properties,
    })
    return {
        type: 'ADD_USER',
        payload: result
    }
}