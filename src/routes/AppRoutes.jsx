import React from 'react'
import { Route, Routes } from 'react-router-dom'

import DashboardContainer from '../components/Dashboard/DashboardContainer'

const AppRoutes = () => {
    return (
        <div>
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
