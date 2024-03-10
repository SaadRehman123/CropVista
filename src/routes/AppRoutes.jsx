import React from 'react';
import { Route, Routes } from 'react-router-dom'

import CropsPlanning from '../components/Crops/CropsPlanning'
import DashboardContainer from '../components/Dashboard/DashboardContainer'

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
                    path="crops-planning"
                    element={<CropsPlanning />}>
                </Route>
            </Routes>
        </div>
    )
}

export default AppRoutes
