import React from 'react'
import styled from 'styled-components'
import SettingButton from './SettingButton'

const Toolbar = () => {
    return (
       <Container>
            <SettingButton />
       </Container>
    )
}

export default Toolbar

const Container = styled.div`
    height: 50px;
    display: flex;
    align-items: center;
    background-color: white;
    box-shadow: rgba(17, 17, 26, 0.1) 0px 1px 0px;
`