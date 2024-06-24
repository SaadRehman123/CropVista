import React, { Fragment } from 'react'
import { useNavigate } from 'react-router-dom'

import FormBackground from '../../SupportComponents/FormBackground'

import { Button } from 'reactstrap'
import { Header, HeaderSpan } from '../../SupportComponents/StyledComponents'

const RequestForQuotation = () => {

    const navigate = useNavigate()

    const renderTreelist = () => {
        return (
            <Fragment>
                <Header>
                    <HeaderSpan>Request For Quotation History</HeaderSpan>
                    <Button size="sm" className={"form-action-button"} onClick={() => navigate('/app/Create_Request_For_Quotation')}>
                        <i style={{marginRight: 10}} className='fal fa-plus' />
                        Create Request For Quotation
                    </Button>
                </Header>
            </Fragment>
        )
    }

    return (
        <FormBackground Form={[renderTreelist()]} />
    )
}

export default RequestForQuotation
