import React from 'react'
import { useNavigate } from 'react-router-dom'

import { Card, CardBody, CardHeader, CardText, CardTitle } from 'reactstrap'

import FormBackground from '../SupportComponents/FormBackground'

import './styles.css'
import styled from 'styled-components'

const Purchase = () => {

    const navigate = useNavigate()

    const handleOnCardClick = (id) => {
        if (id === 1) {
            navigate('/app/Purchase_Request')
        }
        else if (id === 2) {
            navigate('/app/Request_For_Quotation')
        }
        else if (id === 3) {
            navigate('/app/Vendor_Quotation')
        }
        else if (id === 4) {
            navigate('/app/Purchase_Order')
        }
        else if (id === 5) {
            navigate('/app/Good_Receipt')
        }
        else if (id === 6) {
            navigate('/app/Purchase_Invoice')
        }
        else if (id === 7) {
            navigate('/app/Vendor_Master')
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

export default Purchase

const CardContainer = styled.div`
    padding: 10px 20px;
    display: grid;
    grid-template-columns: auto auto auto;
`

const card = [
    { id: 1, name: "Purchase Request", text: "Initiate procurement processes by submitting purchase requests, detailing required items and quantities to facilitate efficient purchasing"},
    { id: 2, name: "Request For Quotation", text: "Request price quotations from vendors to compare offerings and negotiate terms, ensuring competitive pricing and optimal procurement decisions"},
    { id: 3, name: "Vendor Quotation", text: "Receive and evaluate detailed price quotations from vendors, comparing offers to make informed purchasing decisions and optimize procurement costs"},
    { id: 4, name: "Purchase Order", text: "Formally authorize the purchase of goods or services from vendors, specifying terms, quantities, and agreed prices for seamless transaction management"},
    { id: 5, name: "Good Receipt", text: "Record the receipt of goods from vendors into inventory, ensuring accuracy in quantity and quality to maintain efficient supply chain operations"},
    { id: 6, name: "Purchase Invoice", text: "Receive and process invoices from vendors for goods or services purchased, ensuring timely and accurate payments while maintaining financial transparency"},
    { id: 7, name: "Vendor Master", text: "Create and maintain detailed records of all vendors, ensuring accurate and up-to-date information for streamlined procurement processes"}
]