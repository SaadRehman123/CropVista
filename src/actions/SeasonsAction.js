import axios from "axios"
import { Properties } from "../utilities/Properties"

export const getSeasons = () => {
    const result = axios({
        method: 'GET',
        url: `/rest/seasons/getSeasons`,
        ...Properties,
    })
    return {
        type: 'GET_SEASONS',
        payload: result
    }
}
