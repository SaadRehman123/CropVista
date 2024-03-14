import React from 'react'
import styled from 'styled-components'

import logo from '../../assets/logo.png'

const Logo = () => {
    return (
        <Container>
            <ToolbarLogo src={logo} />
        </Container>
    )
}

export default Logo

const Container = styled.div`
    transform: rotate(25deg);
`

const ToolbarLogo = styled.img`
    top: -65px;
    width: 80px;
    height: 80px;
    position: absolute;
    margin-bottom: 10px;
`