import React from 'react'
import styled from 'styled-components'

const FormBackground = ({ Form }) => {
    return (
        <>
            {Form.map((form, index) => (
                <Background key={index}>{form}</Background>
            ))}
        </>
    )
}

export default FormBackground

const Background = styled.div`
    margin: 10px;
    border-radius: 12px;
    background-color: white;
    box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 8px;
`