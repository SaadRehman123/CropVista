import React from 'react'
import { useNavigate } from 'react-router-dom'

import { Card, CardBody, CardHeader, CardText, CardTitle } from 'reactstrap'

import FormBackground from '../SupportComponents/FormBackground'

import './styles.css'
import styled from 'styled-components'

const Sales = () => {

    const navigate = useNavigate()

    const handleOnCardClick = (id) => {
        if (id === 1) {
            navigate('/app/Sale_Order')
        }
        else if (id === 2) {
            navigate('/app/Good_Issue')
        }
        else if (id === 3) {
            navigate('/app/Sale_Invoice')
        }
        else if (id === 4) {
            navigate('/app/Customer_Master')
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

export default Sales

const CardContainer = styled.div`
    padding: 10px 20px;
    display: grid;
    grid-template-columns: auto auto auto;
`

const card = [
    { id: 1, name: "Sale Order", text: "Efficiently manage sale orders with real-time tracking. Create, update, and review sale orders to streamline your sales process and ensure timely fulfillment."},
    { id: 2, name: "Good Issue", text: "Track the movement of goods with ease. Record goods issue transactions to ensure accurate inventory levels and smooth material handling within your organization."},
    { id: 3, name: "Sale Invoice", text: "Simplify billing with detailed sales invoices. Generate, send, and manage invoices to keep your financial records accurate and up-to-date."},
    { id: 4, name: "Customer Master", text: "Maintain comprehensive customer profiles. Store and update customer information to enhance relationships and provide personalized service."}
]