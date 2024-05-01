import axios from "axios"
import { Properties } from "../utilities/Properties"

export const getItemMaster = () => {
    const result = axios({
        method: 'GET',
        url: `/rest/itemMaster/getItemMaster`,
        ...Properties,
    })
    return {
        type: 'GET_ITEM_MASTER',
        payload: result
    }
}