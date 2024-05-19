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
        else if(obj.id === "itemMaster"){
            navigate('/app/Item_Master')
            dispatch(setNavToolbarTitle(obj.name))
        }
        else if(obj.id === "production-order"){
            navigate('/app/Production_Order')
            dispatch(setNavToolbarTitle(obj.name))
        }
        else if(obj.id === "stock-entry"){
            navigate('/app/Stock_Entries')
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
    {id: "resource", name: "Resources", icon: "fal fa-user-plus", pad: 20, type: "inventory"},
    {id: "warehouse", name: "Warehouse", icon: "fal fa-warehouse", pad: 20, type: "inventory"},
    {id: "itemMaster", name: "Item Master", icon: "fal fa-cart-plus", pad: 22, type: "inventory"},
    {id: "stock-entry", name: "Stock Entries", icon: "fal fa-cubes", pad: 25, type: "inventory"},
    {id: "crop-plan", name: "Crop-Plan", icon: "fal fa-ballot-check", pad: 21, type: "production"},
    {id: "bom", name: "Bill Of Material", icon: "fal fa-file-invoice", pad: 21, type: "production"},
    {id: "production-order", name: "Production Order", icon: "fal fa-file-chart-line", pad: 21, type: "production"}
]