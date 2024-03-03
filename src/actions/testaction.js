import axios from "axios"

import { Properties } from "../utilities/Properties"

export const getWheather = () => {
    const result = axios({
        method: 'GET',
        url: `/WeatherForecast`,
        ...Properties,
    })
    return {
        type: 'WHEATHER',
        payload: result
    }
}