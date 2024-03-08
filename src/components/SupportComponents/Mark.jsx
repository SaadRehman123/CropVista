import React from 'react'
import styled from 'styled-components'

const Mark = (props) => {
    return (
        <Indicator
            top={props.top}
            title={props.title}
            className='fal fa-exclamation-circle'
            display={props.condition ? "block" : "none"}
        />
    )
}

export default Mark

const Indicator = styled.i`
    left: 310px;
    color: #FF2A2A;
    font-weight: 600;
    position: absolute;
    top: ${(props) => props.top}px;
    display: ${(props) => props.display};
`