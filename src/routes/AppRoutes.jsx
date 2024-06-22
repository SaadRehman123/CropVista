import React from 'react'
import { Route, Routes } from 'react-router-dom'

import Inventory from '../components/Cards/Inventory'
import Production from '../components/Cards/Production'
import CropPlan from '../components/Production/Crops/CropPlan'
import Resource from '../components/Inventory/Resource/Resource'
import Warehouse from '../components/Inventory/Warehouse/Warehouse'
import StockEntries from '../components/Inventory/Stock/StockEntries'
import ItemMaster from '../components/Inventory/ItemMaster/ItemMaster'
import CreateBOM from '../components/Production/BillOfMaterial/CreateBOM'
import VendorMaster from '../components/Purchase/VendorMaster/VendorMaster'
import CreateVendor from '../components/Purchase/VendorMaster/CreateVendor'
import ProductionOrder from '../components/Production/Order/ProductionOrder'
import BillOfMaterial from '../components/Production/BillOfMaterial/BillOfMaterial'
import DashboardContainer from '../components/Overview/Dashboard/DashboardContainer'
import InventoryStatus from '../components/Inventory/InventoryOverview/InventoryStatus'
import CreateProductionOrder from '../components/Production/Order/CreateProductionOrder'

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
                <Route
                    path="Inventory_Status"
                    element={<InventoryStatus />}>
                </Route>
                <Route
                    path="Vendor_Master"
                    element={<VendorMaster />}>
                </Route>
                <Route
                    path="Create_Vendor"
                    element={<CreateVendor />}>
                </Route>
            </Routes>
        </div>
    )
}

export default AppRoutes
