
import React from 'react'
import BarChart from '../Charts/BarChart'
import SalesChart from '../Charts/SalesChart'
import ProductionChart from '../Charts/ProductionChart'
import FormBackground from '../../SupportComponents/FormBackground'

const DashboardContainer = () => {
    
    const renderPieChart = () => {
        return (
            <div style={{ display : "flex", alignContent: "center", justifyContent: "space-evenly" }}>
                <SalesChart />
                <ProductionChart />
            </div>
        )
    }

    const renderBarChart = () => {
        return (
            <div style={{ padding: 20, display : "flex", alignContent: "center", justifyContent: "space-evenly" }}>
                <BarChart />
            </div>
        )
    }

    return (
        <FormBackground Form={[renderPieChart(), renderBarChart()]} />
    )
}

export default DashboardContainer