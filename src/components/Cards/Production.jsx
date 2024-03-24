import React from 'react'
import { useNavigate } from 'react-router-dom'

import { Card, CardBody, CardHeader, CardText, CardTitle } from 'reactstrap'

import FormBackground from '../SupportComponents/FormBackground'

import styled from 'styled-components'
import './styles.css'

const Production = () => {

    const navigate = useNavigate()

    const handleOnCardClick = (id) => {
        if (id === 1) {
            navigate('/app/crop-plan')
        }
    }

    const renderCards = () => {
        return (
            <CardContainer>
                {card.map((item) => {
                    return(
                        <Card key={item.id} id={"card"} className="my-2" color="light" style={{width: '20rem'}} onClick={() => handleOnCardClick(item.id)}>
                            <CardHeader className='card-header'>Production</CardHeader>
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
        <>
            <FormBackground Form={renderCards()} />
        </>
    )
}

export default Production

const CardContainer = styled.div`
    padding: 10px 20px;
    display: grid;
    grid-template-columns: auto auto auto;
`

const card = [
    { id: 1, name: "Crop-Plan", text: "Explore and manage your crop plans to visualize and organize cultivation strategies for different crops"},
]