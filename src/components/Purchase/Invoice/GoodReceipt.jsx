import React, { Fragment, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import moment from 'moment'
import styled from 'styled-components'
import FormBackground from '../../SupportComponents/FormBackground'

import { Badge, Button } from 'reactstrap'
import { TreeList } from 'devextreme-react'
import { Column, Scrolling, Selection } from 'devextreme-react/tree-list'
import { CellContainer, CellContent, Header, HeaderSpan } from '../../SupportComponents/StyledComponents'

import { setGoodReceiptRef, toggleDeletePopup } from '../../../actions/ViewActions'
import { getGoodReceipt, goodReceiptActionType } from '../../../actions/PurchaseAction'

const GoodReceipt = () => {

    const goodReceipt = useSelector((state) => state.purchase.goodReceipt)

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const treeListRef = useRef()

    useEffect(() => {
        dispatch(setGoodReceiptRef(treeListRef))
    }, [])

    useEffect(() => {
        dispatch(getGoodReceipt(0))
    }, [])

    const handleOnClick = () => {
        navigate('/app/Create_Good_Receipt')
        dispatch(goodReceiptActionType({ node: null, type: "CREATE" }))
    }

    const handleOnViewClick = (e) => {
        dispatch(goodReceiptActionType({ node: e, type: "UPDATE" }))
        navigate('/app/Create_Good_Receipt')
    }

    const renderGoodReceiptIdColumn = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.gr_Id}
                </CellContent>
            </CellContainer>
        )
    }
    
    const renderPurchaseOrderColumn = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.pro_Id}
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

    const renderCreationDateColumn = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {moment(e.data.creationDate).format("DD/MM/YYYY")}
                </CellContent>
            </CellContainer>
        )
    }
    
    const renderStatusColumn = (e) => {
        return (
            <CellContainer style={{ alignItems: 'center' }}>
                <Badge className={"status-badge"} color={setColor(e)}>
                    <span className='fad fa-circle' style={{ fontSize: 8, marginRight: 5, left: -3 }} />
                    <span>{e.data.gr_Status}</span>
                </Badge>
            </CellContainer>
        )
    }

    const renderActionColumn = (e) => {
        return (
            <ActionCellContainer>
                <button
                    title='View Good Receipt'
                    className='fal fa-eye treelist-edit-button'
                    onClick={() => handleOnViewClick(e)} />

                {e.data.gr_Status === "Created" && (
                    <button
                        title='Cancel Good Receipt'
                        className='fal fa-trash treelist-delete-button'
                        onClick={() => dispatch(toggleDeletePopup({ active: true, type:"GOOD_RECEIPT" }))} />
                )}
            </ActionCellContainer>
        )
    }

    const renderTreelist = () => {
        return (
            <Fragment>
                <Header>
                    <HeaderSpan>Good Receipt History</HeaderSpan>
                    <Button size="sm" className={"form-action-button"} onClick={() => handleOnClick()}>
                        <i style={{marginRight: 10}} className='fal fa-plus' />
                        Create Good Receipt
                    </Button>
                </Header>
                
                <TreeList
                    elementAttr={{
                        id: "good-receipt-treelist",
                        class: "project-treelist"
                    }}
                    ref={treeListRef}
                    showBorders={true}
                    showRowLines={true}
                    showColumnLines={true}
                    allowColumnResizing={true}
                    rowAlternationEnabled={true}
                    dataSource={goodReceipt}
                    keyExpr={"gr_Id"}
                    height={"calc(100vh - 195px)"}
                    className={'dev-form-treelist'}
                    columnResizingMode={"nextColumn"}
                    noDataText={'No Good Receipt'}>

                    <Selection mode={"single"} />

                    <Scrolling mode={"standard"} />

                    <Column
                        caption={"GR-Id"}
                        dataField={"gr_Id"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderGoodReceiptIdColumn}
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-item-column"}
                    />

                    <Column
                        caption={"PRO-Id"}
                        dataField={"pro_Id"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderPurchaseOrderColumn}
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-item-column"}
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
                        caption={"Creation Date"}
                        dataField={"creationDate"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderCreationDateColumn} 
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-column"}
                    />
                        
                    <Column
                        width={115}
                        minWidth={115}
                        caption={"Status"}
                        dataField={"gr_Status"}
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

export default GoodReceipt

const ActionCellContainer = styled.div`
    display: flex;
    font-size: 16px;
    align-items: center;
    justify-content: space-evenly;
`

const setColor = (e) => {
    let color

    if(e.data.gr_Status === "Created"){
        color = 'info'
    }
    else if(e.data.gr_Status === "Un-Paid"){
        color = 'warning'
    }
    else if(e.data.gr_Status === "Paid"){
        color = 'success'
    }
    else if(e.data.gr_Status === "Cancelled"){
        color = 'danger'
    }

    return color
}