import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { Chart, CommonSeriesSettings, Export, SeriesTemplate, Size, Title, Tooltip } from 'devextreme-react/chart'

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

    const customizeTooltip = (arg) => {
        return {
            text: `${arg.argument} - ${arg.value} Acre`,
        }
    }

    const legendClickHandler = (e) => {
        const arg = e.target
        toggleVisibility(arg)
    }

    const toggleVisibility = (item) => {
        item.isVisible() ? item.hide() : item.show()
    }

    return (
        <Chart
            id="chart"
            palette="Soft"
            dataSource={dataSource}
            onLegendClick={legendClickHandler}>
            <CommonSeriesSettings
                argumentField="crop"
                valueField="acre"
                type="bar"
                ignoreEmptyPoints={true}
            />
            <Size width={1000} height={240} />
            <Export enabled={true} fileName={"Planned Crop Acreage Distribution"}/>
            <Tooltip
                enabled={true}
                customizeTooltip={customizeTooltip}>
            </Tooltip>
            <Title text="Planned Crop Acreage Distribution" />
            <SeriesTemplate nameField="crop" />
        </Chart>
    )
}

export default BarChart