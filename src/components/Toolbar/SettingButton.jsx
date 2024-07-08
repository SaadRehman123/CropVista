import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { getInitials } from '../../utilities/CommonUtilities'
import { toggleLogoutPopup } from '../../actions/PopupActions'

import "./styles.css"
import styled from 'styled-components'

const SettingButton = () => {

    const user = useSelector(state => state.user.loginUser)
    const dispatch = useDispatch()

    const renderSettingBtn = () => {
        if(user){
            const initials = getInitials(user.name)
            return <div className='setting-btn' onClick={() => dispatch(toggleLogoutPopup(true))}>{initials}</div>
        }
    }

    return (
        <Container>
            {renderSettingBtn()}
        </Container>
    )
}

export default SettingButton

const Container = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    
    top: 8px;
    right: 16px;
    position: absolute;
`