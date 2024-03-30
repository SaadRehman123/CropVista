import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { setNavToolbarTitle } from '../../../actions/ViewActions'

import DashboardNavigation from './DashboardNavigation'
import ProductionNavigation from './ProductionNavigation'
import InventoryNavigation from './InventoryNavigation'
import PurchaseNavigation from './PurchaseNavigation'
import SalesNavigation from './SalesNavigation'

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
            <DashboardNavigation navigations={navigations} sectionsState={sectionsState} handleOnExpand={handleOnExpand} handleOnClick={handleOnClick} activeTab={activeTab} />
            <ProductionNavigation navigations={navigations} sectionsState={sectionsState} handleOnExpand={handleOnExpand} handleOnClick={handleOnClick} activeTab={activeTab} handleOnSectionClick={handleOnSectionClick}/>
            {/* <InventoryNavigation navigations={navigations} sectionsState={sectionsState} handleOnExpand={handleOnExpand} handleOnClick={handleOnClick} activeTab={activeTab} />
            <PurchaseNavigation navigations={navigations} sectionsState={sectionsState} handleOnExpand={handleOnExpand} handleOnClick={handleOnClick} activeTab={activeTab} />
            <SalesNavigation navigations={navigations} sectionsState={sectionsState} handleOnExpand={handleOnExpand} handleOnClick={handleOnClick} activeTab={activeTab} /> */}
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

const navigations = [
    {id: "dashboard", name: "Dashboard", icon: "fal fa-analytics", pad: 20, type: "overview"},
    {id: "crop-plan", name: "Crop-Plan", icon: "fal fa-ballot-check", pad: 25, type: "production"},
]