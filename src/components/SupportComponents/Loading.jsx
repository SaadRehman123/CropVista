import React from 'react'
import { useSelector } from 'react-redux'

import loader from '../../assets/loader.png'

import "./styles.css"
import styled from 'styled-components'

const Loading = () => {

    const loading = useSelector(state => state.view.loading)

    return (
        loading && (
            <Container>
                <div style={{ transform: "rotate(20deg)" }}>
                    <img className='cropvista-loader' src={loader} />
                </div>
                <span className='background-shadow-layer' />
            </Container>
        )
    )
}

export default Loading

const Container = styled.div`
    display: flex;
    align-content: center;
    justify-content: center;
    align-items: center;

    height: 100vh;
    width: 100vw;
`