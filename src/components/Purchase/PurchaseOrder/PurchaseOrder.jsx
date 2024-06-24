import React, { Fragment } from 'react'
import { useNavigate } from 'react-router-dom'

import FormBackground from '../../SupportComponents/FormBackground'

import { Button } from 'reactstrap'
import { Header, HeaderSpan } from '../../SupportComponents/StyledComponents'

const PurchaseOrder = () => {
    
    const navigate = useNavigate()

    const renderTreelist = () => {
        return (
            <Fragment>
                <Header>
                    <HeaderSpan>Purchase Order History</HeaderSpan>
                    <Button size="sm" className={"form-action-button"} onClick={() => navigate('/app/Create_Purchase_Order')}>
                        <i style={{marginRight: 10}} className='fal fa-plus' />
                        Create Purchase Order
                    </Button>
                </Header>
            </Fragment>
        )
    }

    return (
        <FormBackground Form={[renderTreelist()]} />
    )
}

export default PurchaseOrder

