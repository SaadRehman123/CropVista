import { combineReducers } from "redux"
import testreducer from "./testreducer"

const rootReducers = combineReducers({
    test: testreducer
})

export default rootReducers