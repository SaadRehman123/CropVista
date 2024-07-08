import React, { Fragment } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import useSignOut from 'react-auth-kit/hooks/useSignOut'

import { Button, Modal, ModalBody, ModalHeader } from 'reactstrap'
import { FormButtonContainer, FormLabel } from '../SupportComponents/StyledComponents'

import { setLogin } from '../../actions/ViewActions'
import { toggleLogoutPopup } from '../../actions/PopupActions'

import './styles.css'

const LogoutPopup = () => {

    const logoutPopup = useSelector(state => state.popup.toggleLogoutPopup)

    const signOut = useSignOut()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const toggle = () => dispatch(toggleLogoutPopup(false))

    const handleOnLogout = () => {
        dispatch(toggleLogoutPopup(false))
        dispatch(setLogin(false))
        
        setTimeout(() => {
            signOut()
            navigate('/auth/login')
        }, 1000 )
    }

    const renderContent = () => {
        return(
            <Fragment>
                <FormLabel style={{ fontSize: 15, fontWeight: 500 }}>Are You Sure You Want To Logout From Crop Vista?</FormLabel>
                <FormButtonContainer style={{ marginTop: 20 }}>
                    <Button size="sm" className={"logout-button"} onClick={handleOnLogout}>
                        <i style={{ marginRight: 5 }} className={"fal fa-sign-out"} /> Logout
                    </Button>
                    <Button size="sm" className={"form-close-button"} onClick={() => toggle()}>Close</Button>
                </FormButtonContainer>
            </Fragment>
        )
    }

    return (
        <Modal size={"l"} centered={true} backdrop={"static"} isOpen={logoutPopup} toggle={toggle}>
            <ModalHeader className={"popup-header"} toggle={toggle}>Logout</ModalHeader>
            <ModalBody>{renderContent()}</ModalBody>
        </Modal>
    )
}

export default LogoutPopup