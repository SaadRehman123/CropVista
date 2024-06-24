import React, { Fragment } from 'react'
import { useNavigate } from 'react-router-dom'

import FormBackground from '../../SupportComponents/FormBackground'

import { Button } from 'reactstrap'
import { Header, HeaderSpan } from '../../SupportComponents/StyledComponents'

const GoodReceipt = () => {

    const navigate = useNavigate()

    const renderTreelist = () => {
        return (
            <Fragment>
                <Header>
                    <HeaderSpan>Good Receipt History</HeaderSpan>
                    <Button size="sm" className={"form-action-button"} onClick={() => navigate('/app/Create_Good_Receipt')}>
                        <i style={{marginRight: 10}} className='fal fa-plus' />
                        Create Good Receipt
                    </Button>
                </Header>
            </Fragment>
        )
    }

    return (
        <FormBackground Form={[renderTreelist()]} />
    )
}

export default GoodReceipt
