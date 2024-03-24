import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { getPlannedCrops } from '../../../actions/CropsActions'
import { setNavToolbarTitle } from '../../../actions/ViewActions'

import styled from 'styled-components'

const NavigationContainer = () => {

    const [sectionsState, setSectionsState] = useState({
        overview: true,
        production: true,
        inventory: true,
        purchase: true,
        sales: true
    })

    const activeTab = useSelector(state => state.view.setNavToolbarTitle)

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleOnExpand = (section) => {
        setSectionsState(prevState => ({
            ...prevState, 
            [section]: !prevState[section]
        }))
    }

    const handleOnSectionClick = (section) => {
        if (section === "production"){
            navigate('/app/production')
        }
    }

    const handleOnClick = (obj) => {
        if(obj.id === "dashboard"){
            navigate('/app/dashboard')
            dispatch(setNavToolbarTitle(obj.name))
        }
        else if(obj.id === "crop-plan"){
            navigate('/app/crop-plan')
            dispatch(setNavToolbarTitle(obj.name))
        }
    }

    return (
        <Container>
            <SectionContainer>
                <DropIcon className={sectionsState.overview ? 'fal fa-chevron-down' : 'fal fa-chevron-right'} marginTop={13} onClick={() => handleOnExpand('overview')} /><Title marginTop={15} marginRight={95}>Overview</Title>
            </SectionContainer>
            <NavNavigationContainer height={sectionsState.overview ? 45 : 0}>
                {navigations.map(item => {
                    return (
                        item.type === 'overview' && (
                            <ItemContainer pad={item.pad} active={activeTab === item.id} onClick={() => handleOnClick(item)} key={item.id}>
                                <Icon className={item.icon} />
                                <NavigationButton>{item.name}</NavigationButton>
                            </ItemContainer>
                        )
                    )
                })}
            </NavNavigationContainer>
            <SectionContainer>
                <DropIcon className={sectionsState.production ? 'fal fa-chevron-down' : 'fal fa-chevron-right'} marginTop={10} onClick={() => handleOnExpand('production')} /><Title marginTop={10} marginRight={78} onClick={() => handleOnSectionClick('production')}>Production</Title>
            </SectionContainer>
            <NavNavigationContainer height={sectionsState.production ? 100 : 0}>
                {navigations.map(item => {
                    return (
                        item.type === 'production' && (
                            <ItemContainer pad={item.pad} active={activeTab === item.id} onClick={() => handleOnClick(item)} key={item.id}>
                                <Icon className={item.icon} />
                                <NavigationButton style={{ paddingTop: 2 }}>{item.name}</NavigationButton>
                            </ItemContainer>
                        )
                    )
                })}
            </NavNavigationContainer>
            <SectionContainer>
                <DropIcon className={sectionsState.inventory ? 'fal fa-chevron-down' : 'fal fa-chevron-right'} marginTop={10} onClick={() => handleOnExpand('inventory')} /><Title marginTop={10} marginRight={87} onClick={() => handleOnSectionClick('inventory')}>Inventory</Title>
            </SectionContainer>
            <NavNavigationContainer height={sectionsState.inventory ? 100 : 0}>
                {navigations.map(item => {
                    return (
                        item.type === 'inventory' && (
                            <ItemContainer pad={item.pad} active={activeTab === item.id} onClick={() => handleOnClick(item)} key={item.id}>
                                <Icon className={item.icon} />
                                <NavigationButton style={{ paddingTop: 2 }}>{item.name}</NavigationButton>
                            </ItemContainer>
                        )
                    )
                })}
            </NavNavigationContainer>
            <SectionContainer>
                <DropIcon className={sectionsState.purchase ? 'fal fa-chevron-down' : 'fal fa-chevron-right'} marginTop={10} onClick={() => handleOnExpand('purchase')} /><Title marginTop={10} marginRight={90} onClick={() => handleOnSectionClick('purchase')}>Purchase</Title>
            </SectionContainer>
            <NavNavigationContainer height={sectionsState.purchase ? 100 : 0}>
                {navigations.map(item => {
                    return (
                        item.type === 'purchase' && (
                            <ItemContainer pad={item.pad} active={activeTab === item.id} onClick={() => handleOnClick(item)} key={item.id}>
                                <Icon className={item.icon} />
                                <NavigationButton style={{ paddingTop: 2 }}>{item.name}</NavigationButton>
                            </ItemContainer>
                        )
                    )
                })}
            </NavNavigationContainer>
            <SectionContainer>
                <DropIcon className={sectionsState.sales ? 'fal fa-chevron-down' : 'fal fa-chevron-right'} marginTop={10} onClick={() => handleOnExpand('sales')} /><Title marginTop={10} marginRight={116} onClick={() => handleOnSectionClick('sales')}>Sales</Title>
            </SectionContainer>
            <NavNavigationContainer height={sectionsState.sales ? 100 : 0}>
                {navigations.map(item => {
                    return (
                        item.type === 'sales' && (
                            <ItemContainer pad={item.pad} active={activeTab === item.id} onClick={() => handleOnClick(item)} key={item.id}>
                                <Icon className={item.icon} />
                                <NavigationButton style={{ paddingTop: 2 }}>{item.name}</NavigationButton>
                            </ItemContainer>
                        )
                    )
                })}
            </NavNavigationContainer>
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

const SectionContainer = styled.div`
    display: flex;
    cursor: pointer;
    align-items: center;
`

const NavNavigationContainer = styled.div`
    overflow: hidden;
    height: ${(prop) => prop.height}px;
    transition: height 0.4s ease-in-out;
`

const DropIcon = styled.i`
    color: #333C44;
    font-weight: 700;

    margin-right: 4px;
    margin-top: ${(prop) => prop.marginTop}px;
`

const Title = styled.span`
    font-size: 13px;
    font-family: 'RobotoFallback';
    
    color: #333C44;
    font-weight: 600;
    text-transform: uppercase;

    margin-top: ${(prop) => prop.marginTop}px;
    margin-right: ${(prop) => prop.marginRight}px;
`

const ItemContainer = styled.div`
    width: 165px;
    font-size: 14px;
    border-radius: 5px;
    
    margin-top: 5px;
    margin-bottom: 2px;

    cursor: pointer;
    overflow: hidden;

    color: #1F272E;
    padding: ${(prop) => `8px 12px 8px ${prop.pad}px`};
    background-color: ${prop => prop.active ? "#EBEEF0" : "transparent"};

    &:hover{
        background-color: #EBEEF0;
    }
`

const Icon = styled.i`
    font-size: 18px;
    position: relative;
`

const NavigationButton = styled.button`
    border: none;
    background-color: transparent;
`

const navigations = [
    {id: "dashboard", name: "Dashboard", icon: "fal fa-analytics", pad: 20, type: "overview"},
    {id: "crop-plan", name: "Crop-Plan", icon: "fal fa-ballot-check", pad: 25, type: "production"},
]