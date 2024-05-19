import React from 'react'
import { Chart, CommonSeriesSettings, Export, SeriesTemplate, Size, Title } from 'devextreme-react/chart'

const BarChart = () => {

    const dataSource = [
        {
            crop: 'Cotton',
            acre: 3,
        },
        {
            crop: 'Sweet Potato',
            acre: 2,
        },
        {
            crop: 'Wheat',
            acre: 3,
        },
        {
            crop: 'Corn',
            acre: 4,
        },
        {
            crop: 'Rice',
            acre: 6,
        },
        {
            crop: 'Mustard Seed',
            acre: 11,
        }
    ]

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
