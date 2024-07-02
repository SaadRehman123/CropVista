import React, { Fragment, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import moment from 'moment'
import FormBackground from '../../SupportComponents/FormBackground'

import { Button } from 'reactstrap'
import { TreeList } from 'devextreme-react'
import { Column, Scrolling, Selection } from 'devextreme-react/tree-list'
import { CellContainer, CellContent, Header, HeaderSpan } from '../../SupportComponents/StyledComponents'

import { toggleDeletePopup } from '../../../actions/ViewActions'
import { requestForQuotationActionType } from '../../../actions/PurchaseAction'

import styled from 'styled-components'

const RequestForQuotation = () => {

    const requestForQuotation = useSelector(state => state.purchase.requestForQuotation)

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const treeListRef = useRef()

    const handleOnEditClick = (e) => {
        dispatch(requestForQuotationActionType({ node: e, type: "UPDATE" }))
        navigate('/app/Create_Request_For_Quotation')
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
                    {moment(e.data.rfq_CreationDate).format("DD/MM/YYYY")}
                </CellContent>
            </CellContainer>
        )
    }

    const renderRequiredByColumn = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {moment(e.data.rfq_RequiredBy).format("DD/MM/YYYY")}
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

    const renderStatusColumn = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.rfq_Status}
                </CellContent>
            </CellContainer>
        )
    }

    const renderActionColumn = (e) => {
        return (
            <ActionCellContainer>
                <button
                    title='Edit Request For Quotation'
                    className='fal fa-pen treelist-edit-button'
                    onClick={() => handleOnEditClick(e)} />

                <button
                    title='Cancel Request For Quotation'
                    className='fal fa-trash treelist-delete-button'
                    onClick={() => dispatch(toggleDeletePopup({ active: true, type:"REQUEST_FOR_QUOTATION" }))} />
            </ActionCellContainer>
        )
    }

    const renderTreelist = () => {
        return (
            <Fragment>
                <Header>
                    <HeaderSpan>Request For Quotation History</HeaderSpan>
                    <Button size="sm" className={"form-action-button"} onClick={() => navigate('/app/Create_Request_For_Quotation')}>
                        <i style={{marginRight: 10}} className='fal fa-plus' />
                        Create Request For Quotation
                    </Button>
                </Header>

                <TreeList
                    elementAttr={{
                        id: "request-for-quotation-treelist",
                        class: "project-treelist"
                    }}
                    ref={treeListRef}
                    showBorders={true}
                    showRowLines={true}
                    showColumnLines={true}
                    allowColumnResizing={true}
                    rowAlternationEnabled={true}
                    dataSource={requestForQuotation}
                    keyExpr={"rfq_Id"}
                    height={"calc(100vh - 195px)"}
                    className={'dev-form-treelist'}
                    columnResizingMode={"nextColumn"}
                    noDataText={'No Request For Quotation'}>

                    <Selection mode={"single"} />

                    <Scrolling mode={"standard"} />

                    <Column
                        caption={"RFQ-Id"}
                        dataField={"rfq_Id"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderRequestForQuotationIdColumn}
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-item-column"}
                    />

                    <Column
                        caption={"Creation Date"}
                        dataField={"rfq_CreationDate"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderCreationDateColumn} 
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-column"}
                    />
                        
                    <Column
                        caption={"Required By"}
                        dataField={"rfq_RequiredBy"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderRequiredByColumn} 
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-column"}
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
                        caption={"Status"}
                        dataField={"rfq_Status"}
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

export default RequestForQuotation

const ActionCellContainer = styled.div`
    display: flex;
    font-size: 16px;
    align-items: center;
    justify-content: space-evenly;
`