
import React, { useState } from 'react'

import BarChart from '../Charts/BarChart'
import SalesChart from '../Charts/SalesChart'
import ProductionChart from '../Charts/ProductionChart'
import YearPicker from '../../SupportComponents/YearPicker'
import FormBackground from '../../SupportComponents/FormBackground'

const DashboardContainer = () => {
    const currentYear = new Date().getFullYear()
    const [selectedYear, setSelectedYear] = useState(currentYear)

    const handleYearChange = (year) => {
        setSelectedYear(year)
    }

    const renderPieChart = () => {
        return (
            <div>
                <div style={{width: 200, marginLeft: 100}}>
                    <YearPicker selectedYear={selectedYear} onChange={handleYearChange} startYear={2000} endYear={5000} />
                </div>

                <div style={{ display : "flex", alignContent: "center", justifyContent: "space-evenly" }}>
                    <SalesChart />
                    <ProductionChart selectedYear={selectedYear} />
                </div>
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