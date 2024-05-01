import { combineReducers } from "redux"

import BomReducer from "./BomReducer"
import UserReducer from "./UserReducer"
import ViewReducer from "./ViewReducer"
import PopupReducer from "./PopupReducer"
import CropsReducer from "./CropsReducer"
import SeasonsReducer from "./SeasonsReducer"
import ResourceReducer from "./ResourceReducer"
import WarehouseReducer from "./WarehouseReducer"
import ItemReducer from "./ItemReducer"

const rootReducers = combineReducers({
    bom: BomReducer,
    user: UserReducer,
    view: ViewReducer,
    item: ItemReducer,
    popup: PopupReducer,
    crops: CropsReducer,
    seasons: SeasonsReducer,
    resource: ResourceReducer,
    warehouse: WarehouseReducer
})

export default rootReducers