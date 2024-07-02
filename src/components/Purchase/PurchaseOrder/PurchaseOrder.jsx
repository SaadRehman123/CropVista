import React, { Fragment, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

import FormBackground from '../../SupportComponents/FormBackground'

import { Button } from 'reactstrap'
import { CellContainer, CellContent, Header, HeaderSpan } from '../../SupportComponents/StyledComponents'
import { useDispatch, useSelector } from 'react-redux'
import { purchaseOrderActionType } from '../../../actions/PurchaseAction'
import moment from 'moment'
import { toggleDeletePopup } from '../../../actions/ViewActions'
import { TreeList } from 'devextreme-react'
import { Column, Scrolling, Selection } from 'devextreme-react/tree-list'
import styled from 'styled-components'

const PurchaseOrder = () => {
    const purchaseOrder = useSelector(state => state.purchase.purchaseOrder)

    const navigate = useNavigate()

    const dispatch = useDispatch()

    const treeListRef = useRef()

    const handleOnEditClick = (e) => {
        dispatch(purchaseOrderActionType({ node: e, type: "UPDATE" }))
        navigate('/app/Create_Purchase_Order')
    }

    const renderPurchaseOrderId = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.po_Id}
                </CellContent>
            </CellContainer>
        )
    }

    const renderPurchaseOrderName = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.poName}
                </CellContent>
            </CellContainer>
        )
    }

    const renderCreationDateColumn = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {moment(e.data.po_CreationDate).format("DD/MM/YYYY")}
                </CellContent>
            </CellContainer>
        )
    }

    const renderStatusColumn = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.po_Status}
                </CellContent>
            </CellContainer>
        )
    }

    const renderActionColumn = (e) => {
        return (
            <ActionCellContainer>
                <button
                    title='Edit Purchase Order'
                    className='fal fa-pen treelist-edit-button'
                    onClick={() => handleOnEditClick(e)} />

                <button
                    title='Cancel Purchase Order'
                    className='fal fa-trash treelist-delete-button'
                    onClick={() => dispatch(toggleDeletePopup({ active: true, type: "PURCHASE_ORDER_ACTION_TYPE" }))} />
            </ActionCellContainer>
        )
    }

    const renderTreelist = () => {
        return (
            <Fragment>
                <Header>
                    <HeaderSpan>Purchase Order History</HeaderSpan>
                    <Button size="sm" className={"form-action-button"} onClick={() => navigate('/app/Create_Purchase_Order')}>
                        <i style={{ marginRight: 10 }} className='fal fa-plus' />
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
                    keyExpr={"po_Id"}
                    height={"calc(100vh - 195px)"}
                    className={'dev-form-treelist'}
                    columnResizingMode={"nextColumn"}
                    noDataText={'No Purchase Order'}>

                    <Selection mode={"single"} />

                    <Scrolling mode={"standard"} />

                    <Column
                        caption={"PO-Id"}
                        dataField={"po_Id"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderPurchaseOrderId}
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-item-column"}
                    />

                    <Column
                        caption={"Purchase Order Name"}
                        dataField={"poName"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderPurchaseOrderName}
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-column"}
                    />

                    <Column
                        caption={"Creation Date"}
                        dataField={"po_CreationDate"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderCreationDateColumn}
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-column"}
                    />

                    <Column
                        caption={"Status"}
                        dataField={"po_Status"}
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

export default PurchaseOrder

const ActionCellContainer = styled.div`
    display: flex;
    font-size: 16px;
    align-items: center;
    justify-content: space-evenly;
`