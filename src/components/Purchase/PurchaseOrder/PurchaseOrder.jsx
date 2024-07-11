import React, { Fragment, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import moment from 'moment'
import FormBackground from '../../SupportComponents/FormBackground'

import { Badge, Button } from 'reactstrap'
import { TreeList } from 'devextreme-react'
import { Column, HeaderFilter, Scrolling, Selection } from 'devextreme-react/tree-list'
import { CellContainer, CellContent, Header, HeaderSpan } from '../../SupportComponents/StyledComponents'

import { setPurchaseOrderRef, toggleDeletePopup } from '../../../actions/ViewActions'
import { getPurchaseOrder, purchaseOrderActionType } from '../../../actions/PurchaseAction'

import styled from 'styled-components'

const PurchaseOrder = () => {
    
    const purchaseOrder = useSelector(state => state.purchase.purchaseOrder)

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const treeListRef = useRef()

    useEffect(() => {
        dispatch(setPurchaseOrderRef(treeListRef))
    }, [])

    useEffect(() => {
        dispatch(getPurchaseOrder(0))
    }, [])

    const handleOnClick = () => {
        navigate('/app/Create_Purchase_Order')
        dispatch(purchaseOrderActionType({ node: null, type: "CREATE" }))
    }

    const handleOnViewClick = (e) => {
        dispatch(purchaseOrderActionType({ node: e, type: "UPDATE" }))
        navigate('/app/Create_Purchase_Order')
    }

    const renderPurchaseOrderIdColumn = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.pro_Id}
                </CellContent>
            </CellContainer>
        )
    }
    
    const renderPurchaseRequestIdColumn = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.pr_Id}
                </CellContent>
            </CellContainer>
        )
    }

    const renderVendorNameColumn = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.vendorName}
                </CellContent>
            </CellContainer>
        )
    }

    const renderRequiredByColumn = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {moment(e.data.requiredBy).format("DD/MM/YYYY")}
                </CellContent>
            </CellContainer>
        )
    }
    
    const renderStatusColumn = (e) => {
        return (
            <CellContainer style={{ alignItems: 'center' }}>
                <Badge className={"status-badge"} color={setColor(e)}>
                    <span className='fad fa-circle' style={{ fontSize: 8, marginRight: 5, left: -3 }} />
                    <span>{e.data.purchaseOrderStatus}</span>
                </Badge>
            </CellContainer>
        )
    }

    const renderActionColumn = (e) => {
        return (
            <ActionCellContainer>
                <button
                    title='View Purchase Order'
                    className='fal fa-eye treelist-edit-button'
                    onClick={() => handleOnViewClick(e)} />

                {e.data.purchaseOrderStatus === "Created" && (
                    <button
                        title='Cancel Purchase Order'
                        className='fal fa-trash treelist-delete-button'
                        onClick={() => dispatch(toggleDeletePopup({ active: true, type:"PURCHASE_ORDER" }))} />
                )}
            </ActionCellContainer>
        )
    }

    const renderTreelist = () => {
        return (
            <Fragment>
                <Header>
                    <HeaderSpan>Purchase Order History</HeaderSpan>
                    <Button size="sm" className={"form-action-button"} onClick={() => handleOnClick()}>
                        <i style={{marginRight: 10}} className='fal fa-plus' />
                        Create Purchase Order
                    </Button>
                </Header>

                <TreeList
                    elementAttr={{
                        id: "purchase-order-treelist",
                        class: "project-treelist"
                    }}
                    ref={treeListRef}
                    showBorders={true}
                    showRowLines={true}
                    showColumnLines={true}
                    allowColumnResizing={true}
                    rowAlternationEnabled={true}
                    dataSource={purchaseOrder}
                    keyExpr={"pro_Id"}
                    height={"calc(100vh - 195px)"}
                    className={'dev-form-treelist'}
                    columnResizingMode={"nextColumn"}
                    noDataText={'No Request For Quotation'}>

                    <Selection mode={"single"} />

                    <Scrolling mode={"standard"} />

                    <HeaderFilter visible={true} allowSearch={true} />

                    <Column
                        caption={"PRO-Id"}
                        dataField={"pro_Id"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderPurchaseOrderIdColumn}
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-item-column"}
                    />

                    <Column
                        caption={"PR-Id"}
                        dataField={"pr_Id"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderPurchaseRequestIdColumn} 
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-column"}
                    />

                    <Column
                        caption={"Vendor Name"}
                        dataField={"vendorName"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderVendorNameColumn} 
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-column"}
                    />
                        
                    <Column
                        caption={"Required By"}
                        dataField={"requiredBy"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderRequiredByColumn} 
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-column"}
                    />
                        
                    <Column
                        width={120}
                        minWidth={120}
                        caption={"Status"}
                        dataField={"purchaseOrderStatus"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderStatusColumn}
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
                        allowFiltering={false}
                        cellRender={renderActionColumn}
                        headerCellRender={renderActionHeaderCell} 
                        cssClass={"project-treelist-column"}
                    />
                </TreeList>
            </Fragment>
        )
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

    return (
        <FormBackground Form={[renderTreelist()]} />
    )
}

export default PurchaseOrder

const ActionCellContainer = styled.div`
    display: flex;
    font-size: 16px;
    align-items: center;
    justify-content: space-evenly;
`

const setColor = (e) => {
    let color

    if(e.data.purchaseOrderStatus === "Created"){
        color = 'success'
    }
    else if(e.data.purchaseOrderStatus === "GR Created"){
        color = 'info'
    }
    else if(e.data.purchaseOrderStatus === "Cancelled"){
        color = 'danger'
    }

    return color
}