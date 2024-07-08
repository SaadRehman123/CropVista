import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import PieChart, { Legend, Series, Tooltip, Label, Connector, Export, Size } from 'devextreme-react/pie-chart'

const ProductionChart = ({ selectedYear }) => {

    const stockEntries = useSelector(state => state.stock.stockEntries)

    const [dataSource, setDataSource] = useState([])

    useEffect(() => {
        const filteredData = stockEntries.filter(stock => {
            const stockEntryYear = new Date(stock.stockEntryDate).getFullYear()
            return stockEntryYear === selectedYear && stock.stockEntryTo === "Inventory"
        })

        const formattedData = filteredData.reduce((acc, stock) => {
            const existingCrop = acc.find(item => item.crop === stock.stockEntryName)
            if (existingCrop) {
                existingCrop.val += stock.stockEntryQuantity
            }
            else {
                acc.push({ crop: stock.stockEntryName, val: stock.stockEntryQuantity })
            }
            return acc
        }, [])

        setDataSource(formattedData)
    }, [selectedYear])


    const customizeTooltip = (arg) => {
        return {
            text: `${arg.valueText} Kg`,
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
            type="doughnut"
            palette="Soft Pastel"
            title="Annual Crop Production"
            dataSource={dataSource}
            onLegendClick={legendClickHandler}>
            <Series argumentField="crop" valueField="val">
                <Label visible={true} customizeText={(arg) => `${arg.valueText} Kg`} >
                    <Connector visible={true} />
                </Label>
            </Series>
            <Size width={500} height={280} />
            <Export enabled={true} fileName={"Annual Crop Production"} />
            <Legend
                margin={0}
                verticalAlignment="top"
                horizontalAlignment="right">
            </Legend>
            <Tooltip
                enabled={true}
                customizeTooltip={customizeTooltip}>
            </Tooltip>
        </PieChart>
    )
}

export default ProductionChart