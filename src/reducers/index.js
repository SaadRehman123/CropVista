import { combineReducers } from "redux"

import BomReducer from "./BomReducer"
import UserReducer from "./UserReducer"
import ViewReducer from "./ViewReducer"
import ItemReducer from "./ItemReducer"
import PopupReducer from "./PopupReducer"
import CropsReducer from "./CropsReducer"
import SeasonsReducer from "./SeasonsReducer"
import ResourceReducer from "./ResourceReducer"
import PurchaseReducer from "./PurchaseReducer"
import WarehouseReducer from "./WarehouseReducer"
import InventoryReducer from "./InventoryReducer"
import ProductionReducer from "./ProductionReducer"
import StockEntriesReducer from "./StockEntriesReducer"
import VendorMasterReducer from "./VendorMasterReducer"

const rootReducers = combineReducers({
    bom: BomReducer,
    user: UserReducer,
    view: ViewReducer,
    item: ItemReducer,
    popup: PopupReducer,
    crops: CropsReducer,
    seasons: SeasonsReducer,
    resource: ResourceReducer,
    purchase: PurchaseReducer,
    stock: StockEntriesReducer,
    warehouse: WarehouseReducer,
    vendor: VendorMasterReducer,
    inventory : InventoryReducer,
    production: ProductionReducer
})

export default rootReducers