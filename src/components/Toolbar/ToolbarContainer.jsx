import React from 'react'

import Logo from './Logo'
import AppHeading from './AppHeading'
import SettingButton from './SettingButton'

import styled from 'styled-components'

const ToolbarContainer = () => {
    return (
       <Container>
            <Logo />
            <AppHeading />
            <SettingButton />
       </Container>
    )
}

export default ToolbarContainer

const Container = styled.div`
    height: 60px;
    display: flex;
    align-items: center;
    background-color: white;
    box-shadow: 0px 1px 2px rgba(25, 39, 52, 0.05), 0px 0px 4px rgba(25, 39, 52, 0.1);
`