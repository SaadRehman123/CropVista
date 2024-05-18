import React from 'react'
import PieChart, { Legend, Series, Tooltip, Label, Connector, Export, Size } from 'devextreme-react/pie-chart'

const ProductionChart = () => {

    const dataSource = [
        {
            crop: 'Cotton',
            val: 1000,
        },
        {
            crop: 'Sweet Potato',
            val: 3000,
        },
        {
            crop: 'Wheat',
            val: 6000,
        },
        {
            crop: 'Corn',
            val: 8000,
        },
        {
            crop: 'Rice',
            val: 5000,
        },
        {
            crop: 'Mustard Seed',
            val: 2000,
        }
    ]

    const customizeTooltip = (arg) => {
        return {
            text: `${arg.valueText} Kg`,
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
            type="doughnut"
            palette="Soft Pastel"
            title="Annual Crop Production"
            dataSource={dataSource}
            onPointClick={pointClickHandler}
            onLegendClick={legendClickHandler}>
            <Series argumentField="crop" valueField="val">
                <Label visible={true} customizeText={(arg) => `${arg.valueText} Kg`} >
                    <Connector visible={true} />
                </Label>
            </Series>
            <Size width={500} />
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
