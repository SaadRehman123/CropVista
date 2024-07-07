import React, { Fragment, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import FormBackground from '../../SupportComponents/FormBackground'

import { Badge, Button } from 'reactstrap'
import TreeList, { Column, Scrolling, Selection } from 'devextreme-react/tree-list'
import { CellContainer, CellContent, Header, HeaderSpan } from '../../SupportComponents/StyledComponents'

import { setCustomerMasterRef, toggleDeletePopup } from '../../../actions/ViewActions'
import { customerMasterActionType, getCustomerMaster } from '../../../actions/CustomerActions'

import styled from 'styled-components'

const CustomerMaster = () => {

    const customerMaster = useSelector(state => state.customer.customerMaster)
    
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const treeListRef = useRef(null)

    useEffect(() => {
        dispatch(setCustomerMasterRef(treeListRef))
    }, [])

    useEffect(() => {
        dispatch(getCustomerMaster())
    }, [])

    const handleOnCreate = () => {
        dispatch(customerMasterActionType({ node: null, type: "CREATE" }))
        navigate('/app/Create_Customer')
    }

    const handleOnEditClick = (e) => {
        dispatch(customerMasterActionType({ node: e, type: "UPDATE" }))
        navigate('/app/Create_Customer')
    }

    const renderActionHeaderCell = (e) => {
        return <span style={{ fontWeight: "bold", fontSize: "14px", color: "black" }}> {e.column.caption} </span>
    }

    const renderHeaderCell = (e) => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 8 }}>
                <span style={{ color: "#444", fontSize: "14px", fontWeight: "700" }}>
                    {e.column.caption}
                </span>
            </div>
        )
    }

    const renderCustomerIdColumn = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.customerId}
                </CellContent>
            </CellContainer>
        )
    }

    const renderCustomerNameColumn = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.customerName}
                </CellContent>
            </CellContainer>
        )
    }

    const renderCustomerContactColumn = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.customerNumber}
                </CellContent>
            </CellContainer>
        )
    }
    
    const renderCustomerAddressColumn = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.customerAddress}
                </CellContent>
            </CellContainer>
        )
    }
    
    const renderCustomerEmailColumn = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.customerEmail}
                </CellContent>
            </CellContainer>
        )
    }

    const renderCustomerDisableColumn = (e) => {
        return (
            <CellContainer style={{ alignItems: 'center' }}>
                <Badge className={"active-badge"} color={!e.data.disable ? "success" : "secondary"}>
                    <span className='fad fa-circle' style={{ fontSize: 8, marginRight: 5, left: -3 }} />
                    <span>{!e.data.disable ? "Active" : "Disabled"}</span>
                </Badge>
            </CellContainer>
        )
    }

    const renderActionColumn = (e) => {
        return (
            <ActionCellContainer>
                <button
                    title='Edit Customer'
                    className='fal fa-pen treelist-edit-button'
                    onClick={() => handleOnEditClick(e)}/>

                <button
                    title='Delete Customer'
                    className='fal fa-trash treelist-delete-button'
                    onClick={() => dispatch(toggleDeletePopup({ active: true, type:"CUSTOMER_MASTER" }))} />
            </ActionCellContainer>
        )
    }

    const renderTreelist = () => {
        return (
            <Fragment>
                <Header>
                    <HeaderSpan>Customer History</HeaderSpan>
                    <Button size="sm" className={"form-action-button"} onClick={() => handleOnCreate()}>
                        <i style={{marginRight: 10}} className='fal fa-plus' />
                        Create Customer
                    </Button>
                </Header>

                <TreeList
                    elementAttr={{
                        id: "customer-master-treelist",
                        class: "project-treelist"
                    }}
                    keyExpr={"customerId"}
                    ref={treeListRef}
                    showBorders={true}
                    showRowLines={true}
                    showColumnLines={true}
                    dataSource={customerMaster}
                    allowColumnResizing={true}
                    rowAlternationEnabled={true}
                    noDataText={'No customer'}
                    height={"calc(100vh - 195px)"}
                    className={'dev-form-treelist'}
                    columnResizingMode={"nextColumn"}>

                    <Selection mode={"single"} />

                    <Scrolling mode={"standard"} />

                    <Column
                        caption={"Customer-Id"}
                        dataField={"customerId"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderCustomerIdColumn}
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-item-column"}
                    />

                    <Column
                        caption={"Name"}
                        dataField={"customerName"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderCustomerNameColumn}
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-item-column"}
                    />

                    <Column
                        caption={"Contact"}
                        dataField={"customerNumber"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderCustomerContactColumn} 
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-column"}
                    />

                    <Column
                        caption={"Address"}
                        dataField={"customerAddress"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderCustomerAddressColumn} 
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-column"}
                    />

                    <Column
                        caption={"Email"}
                        dataField={"customerEmail"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderCustomerEmailColumn} 
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-column"}
                    />

                    <Column
                        width={115}
                        minWidth={115}
                        caption={"Disable"}
                        dataField={"disable"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderCustomerDisableColumn} 
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-column"}
                    />

                    <Column
                        width={98}
                        minWidth={98}
                        caption={"Actions"}
                        dataField={"actions"}
                        alignment={"center"}
                        allowSorting={false}
                        cellRender={renderActionColumn}
                        headerCellRender={renderActionHeaderCell} 
                        cssClass={"project-treelist-column"}
                    />
                </TreeList>
            </Fragment>
        )
    }

    return (
        <FormBackground Form={[renderTreelist()]} />
    )
}

export default CustomerMaster

const ActionCellContainer = styled.div`
    display: flex;
    font-size: 16px;
    align-items: center;
    justify-content: space-evenly;
`