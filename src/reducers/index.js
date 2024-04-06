import { combineReducers } from "redux"

import UserReducer from "./UserReducer"
import ViewReducer from "./ViewReducer"
import PopupReducer from "./PopupReducer"
import CropsReducer from "./CropsReducer"
import SeasonsReducer from "./SeasonsReducer"
import WarehouseReducer from "./WarehouseReducer"

const rootReducers = combineReducers({
    user: UserReducer,
    view: ViewReducer,
    popup: PopupReducer,
    crops: CropsReducer,
    seasons: SeasonsReducer,
    warehouse: WarehouseReducer
})

export default rootReducers