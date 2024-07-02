import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { Chart, CommonSeriesSettings, Export, SeriesTemplate, Size, Title } from 'devextreme-react/chart'

const BarChart = () => {

    const plannedCrops = useSelector(state => state.crops.plannedCrops)
    
    const [dataSource, setDataSource] = useState()

    useEffect(() => {
        const filteredData = plannedCrops.filter(item => item.status !== "Closed" && item.status !== "Cancelled")
        const cropMap = filteredData.reduce((acc, item) => {
            if (acc[item.crop]) {
                acc[item.crop] += item.acre
            } else {
                acc[item.crop] = item.acre
            }
            return acc
        }, {})

        const newDataSource = Object.keys(cropMap).map(crop => ({
            crop,
            acre: cropMap[crop],
        }))

        setDataSource(newDataSource)
    }, [])

    return (
        <Chart
            id="chart"
            palette="Soft"
            dataSource={dataSource}>
            <CommonSeriesSettings
                argumentField="crop"
                valueField="acre"
                type="bar"
                ignoreEmptyPoints={true}
            />
            <Size width={1000}/>
            <Export enabled={true} fileName={"Planned Crop Acreage Distribution"}/>
            <Title text="Planned Crop Acreage Distribution" />
            <SeriesTemplate nameField="crop" />
        </Chart>
    )
}

export default BarChart