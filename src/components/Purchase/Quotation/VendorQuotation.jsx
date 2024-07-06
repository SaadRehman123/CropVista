import React, { Fragment, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import moment from 'moment'
import FormBackground from '../../SupportComponents/FormBackground'

import { Badge, Button } from 'reactstrap'
import { TreeList } from 'devextreme-react'
import { Column, Scrolling, Selection } from 'devextreme-react/tree-list'
import { CellContainer, CellContent, Header, HeaderSpan } from '../../SupportComponents/StyledComponents'

import { setVendorQuotationRef, toggleDeletePopup } from '../../../actions/ViewActions'
import { getVendorQuotation, vendorQuotationActionType } from '../../../actions/PurchaseAction'

import styled from 'styled-components'

const VendorQuotation = () => {
    
    const vendorQuotation = useSelector(state => state.purchase.vendorQuotation)

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const treeListRef = useRef()
    
    useEffect(() => {
        dispatch(setVendorQuotationRef(treeListRef))
    }, [])
    
    useEffect(() => {
        dispatch(getVendorQuotation(0))
    }, [])

    const handleOnClick = () => {
        navigate('/app/Create_Vendor_Quotation')
        dispatch(vendorQuotationActionType({ node: null, type: "CREATE" }))
    }

    const handleOnEditClick = (e) => {
        dispatch(vendorQuotationActionType({ node: e, type: "UPDATE" }))
        navigate('/app/Create_Vendor_Quotation')
    }

    const handleOnViewClick = (e) => {
        dispatch(vendorQuotationActionType({ node: e, type: "VIEW" }))
        navigate('/app/Create_Vendor_Quotation')
    }

    const renderVendorQuotationId = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.vq_Id}
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

    const renderRequestForQuotationIdColumn = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.rfq_Id}
                </CellContent>
            </CellContainer>
        )
    }

    
    const renderCreationDateColumn = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {moment(e.data.vq_CreationDate).format("DD/MM/YYYY")}
                </CellContent>
            </CellContainer>
        )
    }

    const renderStatusColumn = (e) => {
        return (
            <CellContainer style={{ alignItems: 'center' }}>
                <Badge className={"status-badge"} color={setColor(e)}>
                    <span className='fad fa-circle' style={{ fontSize: 8, marginRight: 5, left: -3 }} />
                    <span>{e.data.vq_Status}</span>
                </Badge>
            </CellContainer>
        )
    }

    const renderActionColumn = (e) => {
        return (
            <ActionCellContainer>
                {e.data.vq_Status === "Created" && (
                    <>
                        <button
                            title='Edit Vendor Quotation'
                            className='fal fa-pen treelist-edit-button'
                            onClick={() => handleOnEditClick(e)} />

                        <button
                            title='Delete Vendor Quotation'
                            className='fal fa-trash treelist-delete-button'
                            onClick={() => dispatch(toggleDeletePopup({ active: true, type:"VENDOR_QUOTATION" }))} />
                    </>
                )}

                {e.data.vq_Status !== "Created" && (
                    <button
                        title='View Vendor Quotation'
                        className='fal fa-eye treelist-edit-button'
                        onClick={() => handleOnViewClick(e)} />
                )}
            </ActionCellContainer>
        )
    }

    const renderTreelist = () => {
        return (
            <Fragment>
                <Header>
                    <HeaderSpan>Vendor Quotation History</HeaderSpan>
                    <Button size="sm" className={"form-action-button"} onClick={() => handleOnClick()}>
                        <i style={{marginRight: 10}} className='fal fa-plus' />
                        Create Vendor Quotation
                    </Button>
                </Header>

                <TreeList
                    elementAttr={{
                        id: "vendor-quotation-treelist",
                        class: "project-treelist"
                    }}
                    ref={treeListRef}
                    showBorders={true}
                    showRowLines={true}
                    showColumnLines={true}
                    allowColumnResizing={true}
                    rowAlternationEnabled={true}
                    dataSource={vendorQuotation}
                    keyExpr={"vq_Id"}
                    height={"calc(100vh - 195px)"}
                    className={'dev-form-treelist'}
                    columnResizingMode={"nextColumn"}
                    noDataText={'No Vendor Quotation'}>

                    <Selection mode={"single"} />

                    <Scrolling mode={"standard"} />

                    <Column
                        caption={"VQ-Id"}
                        dataField={"vq_Id"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderVendorQuotationId}
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
                        caption={"RFQ-Id"}
                        dataField={"rfq_Id"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderRequestForQuotationIdColumn}
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-column"}
                    />

                    <Column
                        caption={"Creation Date"}
                        dataField={"vq_CreationDate"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderCreationDateColumn} 
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-column"}
                    />

                    <Column
                        width={110}
                        minWidth={110}
                        caption={"Status"}
                        dataField={"vq_Status"}
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

export default VendorQuotation

const ActionCellContainer = styled.div`
    display: flex;
    font-size: 16px;
    align-items: center;
    justify-content: space-evenly;
`

const setColor = (e) => {
    let color

    if(e.data.vq_Status === "Created"){
        color = 'success'
    }
    else if(e.data.vq_Status === "Booked"){
        color = 'info'
    }
    else if(e.data.vq_Status === "Cancelled"){
        color = 'danger'
    }

    return color
}