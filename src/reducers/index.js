import { combineReducers } from "redux"

import UserReducer from "./UserReducer"
import ViewReducer from "./ViewReducer"

const rootReducers = combineReducers({
    user: UserReducer,
    view: ViewReducer
})

export default rootReducers