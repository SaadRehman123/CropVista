import React from 'react'
import { Route, Routes } from 'react-router-dom'

import Inventory from '../components/Cards/Inventory'
import Production from '../components/Cards/Production'
import CropPlan from '../components/Production/Crops/CropPlan'
import Resource from '../components/Inventory/Resource/Resource'
import Warehouse from '../components/Inventory/Warehouse/Warehouse'
import CreateItem from '../components/Inventory/ItemMaster/CreateItem'
import ItemMaster from '../components/Inventory/ItemMaster/ItemMaster'
import CreateBOM from '../components/Production/BillOfMaterial/CreateBOM'
import ProductionOrder from '../components/Production/Order/ProductionOrder'
import BillOfMaterial from '../components/Production/BillOfMaterial/BillOfMaterial'
import DashboardContainer from '../components/Overview/Dashboard/DashboardContainer'
import CreateProductionOrder from '../components/Production/Order/CreateProductionOrder'
import StockEntries from '../components/Inventory/Stock/StockEntries'

const AppRoutes = () => {
    return (
        <div style={{ backgroundColor: '#F9FAFA', height: '100vh' }}>
            <Routes>
                <Route
                    index
                    path="dashboard"
                    element={<DashboardContainer />}>
                </Route>
                <Route
                    path="production"
                    element={<Production />}>
                </Route>
                <Route
                    path="crop-plan"
                    element={<CropPlan />}>
                </Route>
                <Route
                    path="inventory"
                    element={<Inventory />}>
                </Route>
                <Route
                    path="warehouse"
                    element={<Warehouse />}>
                </Route>
                <Route
                    path="resource"
                    element={<Resource />}>
                </Route>
                <Route
                    path="Bill_Of_Material"
                    element={<BillOfMaterial />}>
                </Route>
                <Route
                    path="create_bom"
                    element={<CreateBOM />}>
                </Route>
                <Route
                    path="Item_Master"
                    element={<ItemMaster />}>
                </Route>
                <Route
                    path="Create_Item"
                    element={<CreateItem />}>
                </Route>
                <Route
                    path="Production_Order"
                    element={<ProductionOrder />}>
                </Route>
                <Route
                    path="Create_Production_Order"
                    element={<CreateProductionOrder />}>
                </Route>
                <Route
                    path="Stock_Entries"
                    element={<StockEntries />}>
                </Route>
            </Routes>
        </div>
    )
}

export default AppRoutes
