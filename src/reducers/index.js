import { combineReducers } from "redux"

import UserReducer from "./UserReducer"
import ViewReducer from "./ViewReducer"
import PopupReducer from "./PopupReducer"

const rootReducers = combineReducers({
    user: UserReducer,
    view: ViewReducer,
    popup: PopupReducer
})

export default rootReducers