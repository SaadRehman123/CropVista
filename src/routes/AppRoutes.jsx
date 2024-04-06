import React from 'react'
import { Route, Routes } from 'react-router-dom'

import Inventory from '../components/Cards/Inventory'
import Production from '../components/Cards/Production'
import CropPlan from '../components/Production/Crops/CropPlan'
import Warehouse from '../components/Inventory/Warehouse/Warehouse'
import DashboardContainer from '../components/Overview/Dashboard/DashboardContainer'

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
            </Routes>
        </div>
    )
}

export default AppRoutes
