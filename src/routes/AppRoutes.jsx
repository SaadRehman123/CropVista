import React from 'react'
import { Route, Routes } from 'react-router-dom'

import ToolbarContainer from '../components/Toolbar/ToolbarContainer'
import DashboardContainer from '../components/Dashboard/DashboardContainer'

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
            </Routes>
        </div>
    )
}

export default AppRoutes
