import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import PieChart, { Series, Label, Connector, Size, Export, Tooltip } from 'devextreme-react/pie-chart'

const SalesChart = ({ selectedYear }) => {

    const goodIssue = useSelector(state => state.sales.goodIssue)

    const [dataSource, setDataSource] = useState([])

    useEffect(() => {
        const filteredData = goodIssue.filter((gi) => new Date(gi.creationDate).getFullYear() === selectedYear && gi.gi_Status !== 'Cancelled').flatMap(gi => gi.children)

        const result = filteredData.reduce((acc, item) => {
            const existingItem = acc.find(i => i.crop === item.itemName)
            if (existingItem) existingItem.sales += item.itemQuantity
            else acc.push({ crop: item.itemName, sales: item.itemQuantity })
            return acc
        }, [])

        setDataSource(result)
    }, [selectedYear])

    const customizeTooltip = (arg) => {
        return {
            text: `${arg.valueText} - ${(arg.percent * 100).toFixed(2)}%`,
        }
    }
    
    const legendClickHandler = (e) => {
        const arg = e.target
        const item = e.component.getAllSeries()[0].getPointsByArg(arg)[0]
        toggleVisibility(item)
    }

    const toggleVisibility = (item) => {
        item.isVisible() ? item.hide() : item.show()
    }

    return (
        <PieChart
            id="pie"
            palette="Bright"
            title="Annual Crop Sales Distribution"
            dataSource={dataSource}
            onLegendClick={legendClickHandler}>
            <Series 
                valueField="sales"
                argumentField="crop">
                <Label visible={true} customizeText={(pointInfo) => `${(pointInfo.percent * 100).toFixed(2)}%`}>
                    <Connector visible={true} width={1} />
                </Label>
            </Series>
            <Size width={500} height={280} />
            <Export enabled={true} fileName={"Annual Crop Sales Distribution"} />
            <Tooltip
                enabled={true}
                customizeTooltip={customizeTooltip}>
            </Tooltip>
        </PieChart>
    )
}

export default SalesChart