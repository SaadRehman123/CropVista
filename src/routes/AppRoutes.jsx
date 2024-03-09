import React from 'react'
import { Route, Routes } from 'react-router-dom'

import ToolbarContainer from '../components/Toolbar/ToolbarContainer'
import DashboardContainer from '../components/Dashboard/DashboardContainer'
import CropsPlanning from '../components/Crops/CropsPlanning'

const AppRoutes = () => {
    return (
        <div>
            <ToolbarContainer />
            <Routes>
                <Route
                    index
                    path="dashboard"
                    element={<DashboardContainer />}>
                </Route>
                <Route
                    path="crops-planning"
                    element={<CropsPlanning />}>
                </Route>
            </Routes>
        </div>
    )
}

export default AppRoutes
