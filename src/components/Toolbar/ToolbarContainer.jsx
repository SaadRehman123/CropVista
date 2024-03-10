import React from 'react'
import styled from 'styled-components'
import SettingButton from './SettingButton'

const ToolbarContainer = () => {
    return (
       <Container>
            <SettingButton />
       </Container>
    )
}

export default ToolbarContainer

const Container = styled.div`
    height: 50px;
    display: flex;
    align-items: center;
    background-color: white;
    box-shadow: 0px 1px 2px rgba(25, 39, 52, 0.05), 0px 0px 4px rgba(25, 39, 52, 0.1);
`