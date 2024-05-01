import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { setNavToolbarTitle } from '../../../actions/ViewActions'

import SalesNavigation from './SalesNavigation'
import PurchaseNavigation from './PurchaseNavigation'
import DashboardNavigation from './DashboardNavigation'
import InventoryNavigation from './InventoryNavigation'
import ProductionNavigation from './ProductionNavigation'

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
        else if (section === "inventory"){
            navigate('/app/inventory')
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
        else if(obj.id === "warehouse"){
            navigate('/app/warehouse')
            dispatch(setNavToolbarTitle(obj.name))
        }
        else if(obj.id === "resource"){
            navigate('/app/resource')
            dispatch(setNavToolbarTitle(obj.name))
        }
        else if(obj.id === "bom"){
            navigate('/app/Bill_Of_Material')
            dispatch(setNavToolbarTitle(obj.name))
        }
    }

    return (
        <Container>
            <DashboardNavigation navigations={navigations} sectionsState={sectionsState} handleOnExpand={handleOnExpand} handleOnClick={handleOnClick} activeTab={activeTab} />
            <ProductionNavigation navigations={navigations} sectionsState={sectionsState} handleOnExpand={handleOnExpand} handleOnClick={handleOnClick} activeTab={activeTab} handleOnSectionClick={handleOnSectionClick} />
            <InventoryNavigation navigations={navigations} sectionsState={sectionsState} handleOnExpand={handleOnExpand} handleOnClick={handleOnClick} activeTab={activeTab} handleOnSectionClick={handleOnSectionClick} />
            {/* <PurchaseNavigation navigations={navigations} sectionsState={sectionsState} handleOnExpand={handleOnExpand} handleOnClick={handleOnClick} activeTab={activeTab} handleOnSectionClick={handleOnSectionClick} /> */}
            {/* <SalesNavigation navigations={navigations} sectionsState={sectionsState} handleOnExpand={handleOnExpand} handleOnClick={handleOnClick} activeTab={activeTab} handleOnSectionClick={handleOnSectionClick} /> */}
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
    {id: "warehouse", name: "Warehouse", icon: "fal fa-warehouse", pad: 20, type: "inventory"},
    {id: "resource", name: "Resources", icon: "fal fa-user-plus", pad: 20, type: "inventory"},
    {id: "crop-plan", name: "Crop-Plan", icon: "fal fa-ballot-check", pad: 25, type: "production"},
    {id: "bom", name: "Bill Of Material", icon: "fal fa-file-invoice", pad: 27, type: "production"},
]