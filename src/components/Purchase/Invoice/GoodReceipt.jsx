import React, { Fragment, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

import FormBackground from '../../SupportComponents/FormBackground'

import { Button } from 'reactstrap'
import { CellContainer, CellContent, Header, HeaderSpan } from '../../SupportComponents/StyledComponents'
import moment from 'moment'
import { toggleDeletePopup } from '../../../actions/ViewActions'
import { TreeList } from 'devextreme-react'
import { Column, Scrolling, Selection } from 'devextreme-react/tree-list'
import { useDispatch, useSelector } from 'react-redux'
import { goodReceiptActionType } from '../../../actions/PurchaseAction'
import styled from 'styled-components'

const GoodReceipt = () => {
    const goodsReceipt = useSelector(state => state.purchase.goodsReceipt)

    const navigate = useNavigate()

    const dispatch = useDispatch()

    const treeListRef = useRef()

    const handleOnEditClick = (e) => {
        dispatch(goodReceiptActionType({ node: e, type: "UPDATE" }))
        navigate('/app/Create_Good_Receipt')
    }

    const renderGoodsReceiptId = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.gr_Id}
                </CellContent>
            </CellContainer>
        )
    }

    const renderGoodsReceiptName = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.grName}
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
                    {e.data.gr_Status}
                </CellContent>
            </CellContainer>
        )
    }

    const renderActionColumn = (e) => {
        return (
            <ActionCellContainer>
                <button
                    title='Edit Goods Receipt'
                    className='fal fa-pen treelist-edit-button'
                    onClick={() => handleOnEditClick(e)} />

                <button
                    title='Cancel Goods Receipt'
                    className='fal fa-trash treelist-delete-button'
                    onClick={() => dispatch(toggleDeletePopup({ active: true, type: "GOOD_RECEIPT_ACTION_TYPE" }))} />
            </ActionCellContainer>
        )
    }

    const renderTreelist = () => {
        return (
            <Fragment>
                <Header>
                    <HeaderSpan>Good Receipt History</HeaderSpan>
                    <Button size="sm" className={"form-action-button"} onClick={() => navigate('/app/Create_Good_Receipt')}>
                        <i style={{ marginRight: 10 }} className='fal fa-plus' />
                        Create Good Receipt
                    </Button>
                </Header>

                <TreeList
                    elementAttr={{
                        id: "goods-receipt-treelist",
                        class: "project-treelist"
                    }}
                    ref={treeListRef}
                    showBorders={true}
                    showRowLines={true}
                    showColumnLines={true}
                    allowColumnResizing={true}
                    rowAlternationEnabled={true}
                    dataSource={goodsReceipt}
                    keyExpr={"gr_Id"}
                    height={"calc(100vh - 195px)"}
                    className={'dev-form-treelist'}
                    columnResizingMode={"nextColumn"}
                    noDataText={'No Goods Receipt'}>

                    <Selection mode={"single"} />

                    <Scrolling mode={"standard"} />

                    <Column
                        caption={"GR-Id"}
                        dataField={"gr_Id"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderGoodsReceiptId}
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-item-column"}
                    />

                    <Column
                        caption={"Goods Receipt Name"}
                        dataField={"poName"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderGoodsReceiptName}
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-column"}
                    />

                    <Column
                        caption={"Creation Date"}
                        dataField={"gr_CreationDate"}
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

export default GoodReceipt

const ActionCellContainer = styled.div`
    display: flex;
    font-size: 16px;
    align-items: center;
    justify-content: space-evenly;
`