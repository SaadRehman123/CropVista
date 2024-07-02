import React, { Fragment, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

import FormBackground from '../../SupportComponents/FormBackground'

import { Button } from 'reactstrap'
import { CellContainer, CellContent, Header, HeaderSpan } from '../../SupportComponents/StyledComponents'
import styled from 'styled-components'
import { TreeList } from 'devextreme-react'
import { Column, Scrolling, Selection } from 'devextreme-react/tree-list'
import { purchaseInvoiceActionType } from '../../../actions/PurchaseAction'
import { useDispatch, useSelector } from 'react-redux'
import { toggleDeletePopup } from '../../../actions/ViewActions'
import moment from 'moment'

const PurchaseInvoice = () => {
    const purchaseInvoice = useSelector(state => state.purchase.purchaseInvoice)

    const navigate = useNavigate()

    const dispatch = useDispatch()

    const treeListRef = useRef()

    const handleOnEditClick = (e) => {
        dispatch(purchaseInvoiceActionType({ node: e, type: "UPDATE" }))
        navigate('/app/Create_Purchase_Invoice')
    }
    
    const handleOnCreate = (e) => {
        dispatch(purchaseInvoiceActionType({ node: null, type: "CREATE" }))
        navigate('/app/Create_Purchase_Invoice')
    }

    const renderGoodsReceiptId = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.pi_id}
                </CellContent>
            </CellContainer>
        )
    }

    const renderGoodsReceiptName = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.piName}
                </CellContent>
            </CellContainer>
        )
    }

    const renderCreationDateColumn = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {moment(e.data.pi_CreationDate).format("DD/MM/YYYY")}
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
                    onClick={() => dispatch(toggleDeletePopup({ active: true, type: "PURCHASE_INVOICE_ACTION_TYPE" }))} />
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
                    keyExpr={"pi_id"}
                    height={"calc(100vh - 195px)"}
                    className={'dev-form-treelist'}
                    columnResizingMode={"nextColumn"}
                    noDataText={'No Purchase Invoice'}>

                    <Selection mode={"single"} />

                    <Scrolling mode={"standard"} />

                    <Column
                        caption={"PI-Id"}
                        dataField={"pi_id"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderGoodsReceiptId}
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-item-column"}
                    />

                    <Column
                        caption={"Purchase Invoice Name"}
                        dataField={"piName"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderGoodsReceiptName}
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-column"}
                    />

                    <Column
                        caption={"Creation Date"}
                        dataField={"pi_CreationDate"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderCreationDateColumn}
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-column"}
                    />

                    <Column
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

export default PurchaseInvoice

const ActionCellContainer = styled.div`
    display: flex;
    font-size: 16px;
    align-items: center;
    justify-content: space-evenly;
`