import React, { Fragment, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import moment from 'moment'
import FormBackground from '../../SupportComponents/FormBackground'

import { Button } from 'reactstrap'
import { TreeList } from 'devextreme-react'
import { Column, Scrolling, Selection } from 'devextreme-react/tree-list'
import { CellContainer, CellContent, Header, HeaderSpan } from '../../SupportComponents/StyledComponents'

import { toggleDeletePopup } from '../../../actions/ViewActions'
import { getPurchaseRequest, purchaseRequestActionType } from '../../../actions/PurchaseAction'

import styled from 'styled-components'

const PurchaseRequest = () => {

    const purchaseRequest = useSelector(state => state.purchase.purchaseRequest)

    const navigate = useNavigate()
    const dispatch = useDispatch()
    
    const treeListRef = useRef()

    useEffect(() => {
        dispatch(getPurchaseRequest(0))
    }, [])

    const handleOnEditClick = (e) => {
        dispatch(purchaseRequestActionType({ node: e, type: "UPDATE" }))
        navigate('/app/Create_Purchase_Request')
    }

    const renderPurchaseRequestIdColumn = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.purchaseRequestId}
                </CellContent>
            </CellContainer>
        )
    }

    const renderCreationDateColumn = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {moment(e.data.pR_CreationDate).format("DD/MM/YYYY")}
                </CellContent>
            </CellContainer>
        )
    }

    const renderRequiredByColumn = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {moment(e.data.pR_RequiredBy).format("DD/MM/YYYY")}
                </CellContent>
            </CellContainer>
        )
    }

    const renderStatusColumn = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.pR_Status}
                </CellContent>
            </CellContainer>
        )
    }

    const renderActionColumn = (e) => {
        return (
            <ActionCellContainer>
                <button
                    title='Edit Purchase Request'
                    className='fal fa-pen treelist-edit-button'
                    onClick={() => handleOnEditClick(e)} />

                <button
                    title='Cancel Purchase Request'
                    className='fal fa-trash treelist-delete-button'
                    onClick={() => dispatch(toggleDeletePopup({ active: true, type:"PURCHASE_REQUEST" }))} />
            </ActionCellContainer>
        )
    }

    const renderTreelist = () => {
        return (
            <Fragment>
                <Header>
                    <HeaderSpan>Purchase Request History</HeaderSpan>
                    <Button size="sm" className={"form-action-button"} onClick={() => {
                        navigate('/app/Create_Purchase_Request')
                        dispatch(purchaseRequestActionType({ node: null, type: "CREATE" }))
                    }}>
                        <i style={{marginRight: 10}} className='fal fa-plus' />
                        Create Purchase Request
                    </Button>
                </Header>

                <TreeList
                    elementAttr={{
                        id: "purchase-request-treelist",
                        class: "project-treelist"
                    }}
                    ref={treeListRef}
                    showBorders={true}
                    showRowLines={true}
                    showColumnLines={true}
                    allowColumnResizing={true}
                    rowAlternationEnabled={true}
                    dataSource={purchaseRequest}
                    keyExpr={"purchaseRequestId"}
                    height={"calc(100vh - 195px)"}
                    className={'dev-form-treelist'}
                    columnResizingMode={"nextColumn"}
                    noDataText={'No Purchase Request'}>

                    <Selection mode={"single"} />

                    <Scrolling mode={"standard"} />

                    <Column
                        caption={"PR-Id"}
                        dataField={"purchaseRequestId"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderPurchaseRequestIdColumn}
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-item-column"}
                    />

                    <Column
                        caption={"Creation Date"}
                        dataField={"PR_CreationDate"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderCreationDateColumn} 
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-column"}
                    />
                        
                    <Column
                        caption={"Required By"}
                        dataField={"PR_RequiredBy"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderRequiredByColumn} 
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-column"}
                    />

                    <Column
                        caption={"Status"}
                        dataField={"PR_Status"}
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

export default PurchaseRequest

const ActionCellContainer = styled.div`
    display: flex;
    font-size: 16px;
    align-items: center;
    justify-content: space-evenly;
`