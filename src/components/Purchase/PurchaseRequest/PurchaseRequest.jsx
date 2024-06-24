import React, { Fragment } from 'react'
import { useNavigate } from 'react-router-dom'

import FormBackground from '../../SupportComponents/FormBackground'

import { Button } from 'reactstrap'
import { Header, HeaderSpan } from '../../SupportComponents/StyledComponents'

const PurchaseRequest = () => {

    const navigate = useNavigate()

    const renderTreelist = () => {
        return (
            <Fragment>
                <Header>
                    <HeaderSpan>Purchase Request History</HeaderSpan>
                    <Button size="sm" className={"form-action-button"} onClick={() => navigate('/app/Create_Purchase_Request')}>
                        <i style={{marginRight: 10}} className='fal fa-plus' />
                        Create Purchase Request
                    </Button>
                </Header>
            </Fragment>
        )
    }

    return (
        <FormBackground Form={[renderTreelist()]} />
    )
}

export default PurchaseRequest
