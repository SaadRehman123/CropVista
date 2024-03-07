import { combineReducers } from "redux"

import UserReducer from "./UserReducer"

const rootReducers = combineReducers({
    user: UserReducer
})

export default rootReducers