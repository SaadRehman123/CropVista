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
        else if (section === "purchase"){
            navigate('/app/purchase')
        }
    }

    const handleOnClick = (obj) => {
        if(obj.id === "dashboard"){
            navigate('/app/Dashboard')
            dispatch(setNavToolbarTitle(obj.name))
        }
        else if(obj.id === "crop-plan"){
            navigate('/app/Crop-Plan')
            dispatch(setNavToolbarTitle(obj.name))
        }
        else if(obj.id === "warehouse"){
            navigate('/app/Warehouse')
            dispatch(setNavToolbarTitle(obj.name))
        }
        else if(obj.id === "resource"){
            navigate('/app/Resources')
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
        else if(obj.id === "inventory-status"){
            navigate('/app/Inventory_Status')
            dispatch(setNavToolbarTitle(obj.name))
        }
        else if(obj.id === "vendorMaster"){
            navigate('/app/Vendor_Master')
            dispatch(setNavToolbarTitle(obj.name))
        }
        else if(obj.id === "purchase-request"){
            navigate('/app/Purchase_Request')
            dispatch(setNavToolbarTitle(obj.name))
        }
        else if(obj.id === "purchase-order"){
            navigate('/app/Purchase_Order')
            dispatch(setNavToolbarTitle(obj.name))
        }
        else if(obj.id === "request-for-quotation"){
            navigate('/app/Request_For_Quotation')
            dispatch(setNavToolbarTitle(obj.name))
        }
        else if(obj.id === "vendor-quotation"){
            navigate('/app/Vendor_Quotation')
            dispatch(setNavToolbarTitle(obj.name))
        }
        else if(obj.id === "good-receipt"){
            navigate('/app/Good_Receipt')
            dispatch(setNavToolbarTitle(obj.name))
        }
        else if(obj.id === "purchase-invoice"){
            navigate('/app/Purchase_Invoice')
            dispatch(setNavToolbarTitle(obj.name))
        }
    }

    return (
        <Container>
            <DashboardNavigation navigations={navigations} sectionsState={sectionsState} handleOnExpand={handleOnExpand} handleOnClick={handleOnClick} activeTab={activeTab} />
            <ProductionNavigation navigations={navigations} sectionsState={sectionsState} handleOnExpand={handleOnExpand} handleOnClick={handleOnClick} activeTab={activeTab} handleOnSectionClick={handleOnSectionClick} />
            <InventoryNavigation navigations={navigations} sectionsState={sectionsState} handleOnExpand={handleOnExpand} handleOnClick={handleOnClick} activeTab={activeTab} handleOnSectionClick={handleOnSectionClick} />
            <PurchaseNavigation navigations={navigations} sectionsState={sectionsState} handleOnExpand={handleOnExpand} handleOnClick={handleOnClick} activeTab={activeTab} handleOnSectionClick={handleOnSectionClick} />
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
    {id: "dashboard", name: "Dashboard", icon: "fal fa-analytics", pad: 10, type: "overview"},
    {id: "resource", name: "Resources", icon: "fal fa-user-plus", pad: 10, type: "inventory"},
    {id: "warehouse", name: "Warehouse", icon: "fal fa-warehouse", pad: 10, type: "inventory"},
    {id: "itemMaster", name: "Item Master", icon: "fal fa-cart-plus", pad: 10, type: "inventory"},
    {id: "stock-entry", name: "Stock Entries", icon: "fal fa-cubes", pad: 10, type: "inventory"},
    {id: "inventory-status", name: "Inventory Status", icon: "fal fa-boxes", pad: 10, type: "inventory"},
    {id: "crop-plan", name: "Crop-Plan", icon: "fal fa-ballot-check", pad: 10, type: "production"},
    {id: "bom", name: "Bill Of Material", icon: "fal fa-file-invoice", pad: 10, type: "production"},
    {id: "production-order", name: "Production Order", icon: "fal fa-file-chart-line", pad: 10, type: "production"},
    {id: "purchase-request", name: "Purchase Request", icon: "fal fa-file-alt", pad: 10, type: "purchase"},
    {id: "purchase-order", name: "Purchase Order", icon: "fal fa-file-contract", pad: 10, type: "purchase"},
    {id: "request-for-quotation", name: "Req For Quotation", icon: "fal fa-file-signature", pad: 8, type: "purchase"},
    {id: "vendor-quotation", name: "Vendor Quotation", icon: "fal fa-file-user", pad: 10, type: "purchase"},
    {id: "good-receipt", name: "Good Receipt", icon: "fal fa-receipt", pad: 10, type: "purchase"},
    {id: "purchase-invoice", name: "Purchase Invoice", icon: "fal fa-file-invoice-dollar", pad: 10, type: "purchase"},
    {id: "vendorMaster", name: "Vendor Master", icon: "fal fa-users", pad: 5, type: "purchase"}
]