
import React, { useState } from 'react'

import { SelectBox } from 'devextreme-react'
import { FormGroupItem } from '../../SupportComponents/StyledComponents'

import BarChart from '../Charts/BarChart'
import SalesChart from '../Charts/SalesChart'
import ProductionChart from '../Charts/ProductionChart'
import FormBackground from '../../SupportComponents/FormBackground'

const DashboardContainer = () => {
    
    const currentYear = new Date().getFullYear()
    const years = Array.from({ length: 25 }, (_, i) => currentYear - i)

    const [selectedYear, setSelectedYear] = useState(currentYear)

    const renderPieChart = () => {
        return (
            <div>
                <div style={{ padding: 10, display: "flex", justifyContent: "flex-end" }}>
                    <FormGroupItem>
                        <SelectBox
                            elementAttr={{
                                class: "form-selectbox"
                            }}
                            width={150}
                            dataSource={years}
                            searchTimeout={200}
                            value={selectedYear}
                            searchEnabled={true}
                            openOnFieldClick={true}
                            searchMode={'contains'}
                            placeholder={"Select Year"}
                            onValueChanged={(e) => setSelectedYear(e.value)}
                            dropDownOptions={{ maxHeight: 200 }}
                        />
                    </FormGroupItem>
                </div>

                <div style={{ display : "flex", alignContent: "center", justifyContent: "space-evenly" }}>
                    <SalesChart selectedYear={selectedYear} />
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