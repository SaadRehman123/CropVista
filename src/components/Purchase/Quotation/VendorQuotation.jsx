import React, { Fragment } from 'react'
import { useNavigate } from 'react-router-dom'

import FormBackground from '../../SupportComponents/FormBackground'

import { Button } from 'reactstrap'
import { Header, HeaderSpan } from '../../SupportComponents/StyledComponents'

const VendorQuotation = () => {
    
    const navigate = useNavigate()

    const renderTreelist = () => {
        return (
            <Fragment>
                <Header>
                    <HeaderSpan>Vendor Quotation History</HeaderSpan>
                    <Button size="sm" className={"form-action-button"} onClick={() => navigate('/app/Create_Vendor_Quotation')}>
                        <i style={{marginRight: 10}} className='fal fa-plus' />
                        Create Vendor Quotation
                    </Button>
                </Header>
            </Fragment>
        )
    }

    return (
        <FormBackground Form={[renderTreelist()]} />
    )
}

export default VendorQuotation
