import React, { Fragment, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import moment from 'moment'
import FormBackground from '../../SupportComponents/FormBackground'

import { Badge, Button } from 'reactstrap'
import { TreeList } from 'devextreme-react'
import { Column, Scrolling, Selection } from 'devextreme-react/tree-list'
import { CellContainer, CellContent, Header, HeaderSpan } from '../../SupportComponents/StyledComponents'

import { getSaleOrder, saleOrderActionType } from '../../../actions/SalesActions'
import { setSaleOrderRef, toggleDeletePopup } from '../../../actions/ViewActions'

import styled from 'styled-components'

const SaleOrder = () => {

    const saleOrder = useSelector(state => state.sales.saleOrder)

    const navigate = useNavigate()
    const dispatch = useDispatch()
    
    const treeListRef = useRef()

    useEffect(() => {
        dispatch(setSaleOrderRef(treeListRef))
    }, [])

    useEffect(() => {
        dispatch(getSaleOrder(0))
    }, [])

    const handleOnClick = () => {
        navigate('/app/Create_Sale_Order')
        dispatch(saleOrderActionType({ node: null, type: "CREATE" }))
    }

    const handleOnEditClick = (e) => {
        dispatch(saleOrderActionType({ node: e, type: "UPDATE" }))
        navigate('/app/Create_Sale_Order')
    }

    const handleOnViewClick = (e) => {
        dispatch(saleOrderActionType({ node: e, type: "VIEW" }))
        navigate('/app/Create_Sale_Order')
    }

    const renderIdColumn = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.saleOrder_Id}
                </CellContent>
            </CellContainer>
        )
    }

    const renderNameColumn = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.customerName}
                </CellContent>
            </CellContainer>
        )
    }

    const renderContactColumn = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.customerNumber}
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

    const renderDeliveryDateColumn = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {moment(e.data.deliveryDate).format("DD/MM/YYYY")}
                </CellContent>
            </CellContainer>
        )
    }

    const renderStatusColumn = (e) => {
        return (
             <CellContainer style={{ alignItems: 'center' }}>
                <Badge className={"status-badge"} color={setColor(e)}>
                    <span className='fad fa-circle' style={{ fontSize: 8, marginRight: 5, left: -3 }} />
                    <span>{e.data.so_Status}</span>
                </Badge>
            </CellContainer>
        )
    }

    const renderActionColumn = (e) => {
        return (
            <ActionCellContainer>
                {e.data.so_Status === "Created" && (
                    <>
                        <button
                            title='Edit Sale Order'
                            className='fal fa-pen treelist-edit-button'
                            onClick={() => handleOnEditClick(e)} />

                        <button
                            title='Cancel Sale Order'
                            className='fal fa-trash treelist-delete-button'
                            onClick={() => dispatch(toggleDeletePopup({ active: true, type:"SALE_ORDER" }))} />
                    </>
                )}

                {e.data.so_Status !== "Created" && (
                    <button
                        title='View Sale Order'
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
                    <HeaderSpan>Sale Order History</HeaderSpan>
                    <Button size="sm" className={"form-action-button"} onClick={() => handleOnClick()}>
                        <i style={{marginRight: 10}} className='fal fa-plus' />
                        Create Sale Order
                    </Button>
                </Header>

                <TreeList
                    elementAttr={{
                        id: "sale-order-treelist",
                        class: "project-treelist"
                    }}
                    ref={treeListRef}
                    showBorders={true}
                    showRowLines={true}
                    showColumnLines={true}
                    allowColumnResizing={true}
                    rowAlternationEnabled={true}
                    dataSource={saleOrder}
                    keyExpr={"saleOrder_Id"}
                    height={"calc(100vh - 195px)"}
                    className={'dev-form-treelist'}
                    columnResizingMode={"nextColumn"}
                    noDataText={'No Sale Order'}>

                    <Selection mode={"single"} />

                    <Scrolling mode={"standard"} />

                    <Column
                        caption={"SO-Id"}
                        dataField={"saleOrder_Id"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderIdColumn}
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-item-column"}
                    />

                    <Column
                        caption={"Customer Name"}
                        dataField={"customerName"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderNameColumn}
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-item-column"}
                    />

                    <Column
                        caption={"Contact"}
                        dataField={"customerNumber"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderContactColumn}
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-item-column"}
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
                        caption={"Delivery Date"}
                        dataField={"deliveryDate"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderDeliveryDateColumn} 
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-column"}
                    />

                    <Column
                        width={123}
                        minWidth={123}
                        caption={"Status"}
                        dataField={"so_Status"}
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

export default SaleOrder

const ActionCellContainer = styled.div`
    display: flex;
    font-size: 16px;
    align-items: center;
    justify-content: space-evenly;
`

const setColor = (e) => {
    let color

    if(e.data.so_Status === "Created"){
        color = 'success'
    }
    else if(e.data.so_Status === "GI Created"){
        color = 'info'
    }
    else if(e.data.so_Status === "Cancelled"){
        color = 'danger'
    }

    return color
}