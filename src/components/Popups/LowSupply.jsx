import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'

import { toggleLowSupplyPopup } from '../../actions/PopupActions'
import { purchaseRequestActionType } from '../../actions/PurchaseAction'

import styled from 'styled-components'

const LowSupply = () => {
    
    const lowSupplyPopup = useSelector(state => state.popup.lowSupplyPopup)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const toggle = () => dispatch(toggleLowSupplyPopup({ active: true, arr: [], body: null }))

    const handleOnSubmit = () => {
        dispatch(purchaseRequestActionType({ node: lowSupplyPopup.arr, type: "COMP_CREATE" }))
        navigate('/app/Create_Purchase_Request')
        toggle()
    }

    return (
        <>
            {lowSupplyPopup.body && (
                <Modal size={"l"} centered={true} backdrop={"static"} isOpen={lowSupplyPopup.active} toggle={toggle}>
                    <ModalHeader className={"popup-header"} toggle={toggle}>Low Supply</ModalHeader>
                    <ModalBody>{lowSupplyPopup.body}</ModalBody>
                    <ModalFooter>
                        <div style={{ display: "flex", flexDirection: "row-reverse", marginTop: 10 }}>
                            <ConfirmButton onClick={handleOnSubmit}>Purchase Request</ConfirmButton>
                            <CancelButton onClick={toggle}>Okay</CancelButton>
                        </div>
                    </ModalFooter>
                </Modal>
            )}
        </>
    )
}

export default LowSupply

const ConfirmButton = styled.button`
    font-size: 13px;
        
    color: #4285f4;
    background-color: #FFFFFF;

    border: 1px solid #eeeeee; 
    cursor: pointer;

    width: auto;
    height: 30px;
    border-radius: 5px;
    margin-left: 4px;

    transition: 0.2s background-color, color;
    &:hover,
    &:focus,
    &:focus-within {
        background-color: #4285f4;
        color: #FFFFFF;
    }
`

const CancelButton = styled.button`
    font-size: 13px;
        
    color: #0A1A1E;
    background-color: #ffffff;

    border: 1px solid #eeeeee; 
    cursor: pointer;

    width: auto;
    height: 30px;
    border-radius: 5px;

    transition: 0.2s border-color;
    &:hover,
    &:focus,
    &:focus-within {
        border-color: #0A1A1E;
    }
`