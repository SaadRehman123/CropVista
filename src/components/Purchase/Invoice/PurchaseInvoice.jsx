import React, { Fragment, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import moment from 'moment'
import FormBackground from '../../SupportComponents/FormBackground'

import { Button } from 'reactstrap'
import { TreeList } from 'devextreme-react'
import { Column, Scrolling, Selection } from 'devextreme-react/tree-list'
import { CellContainer, CellContent, Header, HeaderSpan } from '../../SupportComponents/StyledComponents'

import { toggleDeletePopup } from '../../../actions/ViewActions'
import { getPurchaseInvoice, purchaseInvoiceActionType } from '../../../actions/PurchaseAction'

import styled from 'styled-components'

const PurchaseInvoice = () => {

    const purchaseInvoice = useSelector(state => state.purchase.purchaseInvoice)

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const treeListRef = useRef()

    useEffect(() => {
        dispatch(getPurchaseInvoice(0))
    }, [])

    const handleOnEditClick = (e) => {
        dispatch(purchaseInvoiceActionType({ node: e, type: "UPDATE" }))
        navigate('/app/Create_Purchase_Invoice')
    }
    
    const handleOnCreate = (e) => {
        dispatch(purchaseInvoiceActionType({ node: null, type: "CREATE" }))
        navigate('/app/Create_Purchase_Invoice')
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

    const renderDueDateColumn = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {moment(e.data.dueDate).format("DD/MM/YYYY")}
                </CellContent>
            </CellContainer>
        )
    }

    const renderPurchaseInvoice = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.pi_Id}
                </CellContent>
            </CellContainer>
        )
    }

    const renderVendorName = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.vendorName}
                </CellContent>
            </CellContainer>
        )
    }

    const renderStatusColumn = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.pi_Status}
                </CellContent>
            </CellContainer>
        )
    }

    const renderActionColumn = (e) => {
        return (
            <ActionCellContainer>
                <button
                    title='Edit Purchase Invoice'
                    className='fal fa-pen treelist-edit-button'
                    onClick={() => handleOnEditClick(e)} />

                <button
                    title='Cancel Purchase Invoice'
                    className='fal fa-trash treelist-delete-button'
                    onClick={() => dispatch(toggleDeletePopup({ active: true, type: "PURCHASE_INVOICE" }))} />
            </ActionCellContainer>
        )
    }

    const renderTreelist = () => {
        return (
            <Fragment>
                <Header>
                    <HeaderSpan>Purchase Invoice History</HeaderSpan>
                    <Button size="sm" className={"form-action-button"} onClick={() => handleOnCreate()}>
                        <i style={{ marginRight: 10 }} className='fal fa-plus' />
                        Create Purchase Invoice
                    </Button>
                </Header>

                <TreeList
                    elementAttr={{
                        id: "purchase-invoice-treelist",
                        class: "project-treelist"
                    }}
                    ref={treeListRef}
                    showBorders={true}
                    showRowLines={true}
                    showColumnLines={true}
                    allowColumnResizing={true}
                    rowAlternationEnabled={true}
                    dataSource={purchaseInvoice}
                    keyExpr={"pi_Id"}
                    height={"calc(100vh - 195px)"}
                    className={'dev-form-treelist'}
                    columnResizingMode={"nextColumn"}
                    noDataText={'No Purchase Invoice'}>

                    <Selection mode={"single"} />

                    <Scrolling mode={"standard"} />

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
                        caption={"Due Date"}
                        dataField={"dueDate"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderDueDateColumn}
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-column"}
                    />

                    <Column
                        caption={"PI-Id"}
                        dataField={"pi_Id"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderPurchaseInvoice}
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-item-column"}
                    />

                    <Column
                        caption={"Vendor Name"}
                        dataField={"vendorName"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderVendorName}
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-column"}
                    />

                    <Column
                        caption={"Status"}
                        dataField={"pi_Status"}
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

export default PurchaseInvoice

const ActionCellContainer = styled.div`
    display: flex;
    font-size: 16px;
    align-items: center;
    justify-content: space-evenly;
`