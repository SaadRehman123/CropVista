import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { setNavToolbarTitle } from '../../../actions/ViewActions'

import styled from 'styled-components'

const NavigationContainer = () => {

    const activeTab = useSelector(state => state.view.setNavToolbarTitle)

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleOnClick = (obj) => {
        if(obj.id === "dashboard"){
            navigate('/app/dashboard')
            dispatch(setNavToolbarTitle(obj.name))
        }
        else if(obj.id === "cropsPlanning"){
            navigate('/app/crops-planning')
            dispatch(setNavToolbarTitle(obj.name))
        }
    }

    return (
        <Container>
            <Title marginTop={15} marginRight={95}>Overview</Title>
            {navigations.map(item => {
                return (
                    item.type === 'overview' && (
                        <ItemContainer active={activeTab === item.name} onClick={() => handleOnClick(item)} key={item.id}>
                            <Icon top={45} left={35} className={item.icon} />
                            <NavigationButton>{item.name}</NavigationButton>
                        </ItemContainer>
                    )
                )
            })}
            <Title marginTop={10} marginRight={78}>Production</Title>
            {navigations.map(item => {
                return (
                    item.type === 'production' && (
                        <ItemContainer active={activeTab === item.name} onClick={() => handleOnClick(item)} key={item.id}>
                            <Icon top={115} left={38} className={item.icon} />
                            <NavigationButton style={{ paddingTop: 2 }}>{item.name}</NavigationButton>
                        </ItemContainer>
                    )
                )
            })}
        </Container>
    )
}

export default NavigationContainer

const Container = styled.div`
    width: 200px;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
`

const Title = styled.span`
    font-size: 13px;
    font-family: 'Roboto';
    
    color: #333C44;
    font-weight: 600;
    text-transform: uppercase;

    margin-top: ${(prop) => prop.marginTop}px;
    margin-right: ${(prop) => prop.marginRight}px;
`

const ItemContainer = styled.div`
    display: flex;
    align-items: center;
    
    width: 165px;
    font-size: 14px;
    border-radius: 5px;
    
    margin-top: 5px;
    margin-bottom: 2px;

    cursor: pointer;
    overflow: hidden;

    color: #1F272E;
    padding: 8px 12px 8px 38px;
    background-color: ${prop => prop.active ? "#EBEEF0" : "transparent"};

    &:hover{
        background-color: #EBEEF0;
    }
`

const Icon = styled.i`
    font-size: 18px;
    position: absolute;
    
    top: ${(prop) => prop.top}px;
    left: ${(prop) => prop.left}px;
`

const NavigationButton = styled.button`
    border: none;
    background-color: transparent;
`

const navigations = [
    {id: "dashboard", name: "Dashboard", icon: "fal fa-analytics", type: "overview"},
    {id: "cropsPlanning", name: "Crop-Plan", icon: "fal fa-ballot-check", type: "production"},
]