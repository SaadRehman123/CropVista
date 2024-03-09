import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import useSignOut from 'react-auth-kit/hooks/useSignOut'

import { Button, Modal, ModalBody, ModalHeader } from 'reactstrap'

import { setLogin } from '../../actions/ViewActions'
import { toggleSettingPopup } from '../../actions/PopupActions'

import './styles.css'

const GeneralSettingPopup = () => {

    const generalSettingPopup = useSelector(state => state.popup.toggleSettingPopup)

    const signOut = useSignOut()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const toggle = () => dispatch(toggleSettingPopup(false))

    const handleOnLogout = () => {
        dispatch(toggleSettingPopup(false))
        dispatch(setLogin(false))
        
        setTimeout(() => {
            signOut()
            navigate('/auth/login')
        }, 1000 )
    }

    const renderContent = () => {
        return(
            <Button onClick={() => handleOnLogout()} outline>Logout</Button>
        )
    }

    return (
        <Modal size={"l"} centered={true} backdrop={"static"} isOpen={generalSettingPopup} toggle={toggle}>
            <ModalHeader className={"popup-header"} toggle={toggle}>General Setting</ModalHeader>
            <ModalBody>{renderContent()}</ModalBody>
        </Modal>
    )
}

export default GeneralSettingPopup