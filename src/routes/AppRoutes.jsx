import React from 'react'
import { Route, Routes } from 'react-router-dom'

import Inventory from '../components/Cards/Inventory'
import Production from '../components/Cards/Production'
import CropPlan from '../components/Production/Crops/CropPlan'
import Resource from '../components/Inventory/Resource/Resource'
import Warehouse from '../components/Inventory/Warehouse/Warehouse'
import DashboardContainer from '../components/Overview/Dashboard/DashboardContainer'
import BillOfMaterial from '../components/Production/BillOfMaterial/BillOfMaterial'
import CreateBOM from '../components/Production/BillOfMaterial/CreateBOM'

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
            </Routes>
        </div>
    )
}

export default AppRoutes
