import React from 'react'
import { useNavigate } from 'react-router-dom'

import { Card, CardBody, CardHeader, CardText, CardTitle } from 'reactstrap'

import FormBackground from '../SupportComponents/FormBackground'

import styled from 'styled-components'
import './styles.css'

const Inventory = () => {
    const navigate = useNavigate()

    const handleOnCardClick = (id) => {
        if (id === 1) {
            navigate('/app/warehouse')
        }
        else if (id === 2) {
            navigate('/app/resource')
        }
    }

    const renderCards = () => {
        return (
            <CardContainer>
                {card.map((item) => {
                    return(
                        <Card key={item.id} id={"card"} className="my-2" color="light" style={{width: '20rem'}} onClick={() => handleOnCardClick(item.id)}>
                            <CardHeader className='card-header'>Inventory</CardHeader>
                            <CardBody className='card-body'>
                                <CardTitle tag="h5">{item.name}</CardTitle>
                                <CardText className="card-text">{item.text}</CardText>
                            </CardBody>
                        </Card>
                    )
                })}
            </CardContainer>
        )
    }

    return (
        <FormBackground Form={[renderCards()]} />
    )
}

export default Inventory

const CardContainer = styled.div`
    padding: 10px 20px;
    display: grid;
    grid-template-columns: auto auto auto;
`

const card = [
    { id: 1, name: "Warehouse", text: "Manage your warehouse inventory efficiently by categorizing items into Raw Materials, Finished Goods, and Quarantine. Track stock levels, organize storage to ensure smooth supply chain management"},
    { id: 2, name: "Resource", text: "Efficiently manage your resources with real-time data. Add, update, and delete resources seamlessly to ensure smooth operations and optimal utilization"},
]