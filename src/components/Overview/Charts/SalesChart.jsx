import React from 'react'
import PieChart, { Series, Label, Connector, Size, Export, Tooltip } from 'devextreme-react/pie-chart'

const SalesChart = () => {

    const dataSource = [
        {
            crop: "Cotton",
            sales: 10000,
        },
        {
            crop: "Sweet Potato",
            sales: 70000,
        },
        {
            crop: "Wheat",
            sales: 10000,
        },
        {
            crop: "Corn",
            sales: 70000,
        },
        {
            crop: "Rice",
            sales: 60000,
        },
        {
            crop: "Mustard Seed",
            sales: 54000,
        }
    ]

    const customizeTooltip = (arg) => {
        return {
            text: `${arg.valueText} - ${(arg.percent * 100).toFixed(2)}%`,
        }
    }
    
    const pointClickHandler = (e) => {
        toggleVisibility(e.target);
    }
    
    const legendClickHandler = (e) => {
        const arg = e.target;
        const item = e.component.getAllSeries()[0].getPointsByArg(arg)[0];
        toggleVisibility(item);
    }

    const toggleVisibility = (item) => {
        item.isVisible() ? item.hide() : item.show();
    }

    return (
        <PieChart
            id="pie"
            palette="Bright"
            title="Annual Crop Sales Distribution"
            dataSource={dataSource}
            onPointClick={pointClickHandler}
            onLegendClick={legendClickHandler}>

            <Series 
                valueField="sales"
                argumentField="crop">
                <Label visible={true} customizeText={(pointInfo) => `${(pointInfo.percent * 100).toFixed(2)}%`}>
                    <Connector visible={true} width={1} />
                </Label>
            </Series>

            <Size width={500} />
            <Export enabled={true} fileName={"Annual Crop Sales Distribution"} />
            <Tooltip
                enabled={true}
                customizeTooltip={customizeTooltip}>
            </Tooltip>
        </PieChart>
    )
}

export default SalesChart