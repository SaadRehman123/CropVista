import React, { Fragment, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import moment from 'moment'
import FormBackground from '../../SupportComponents/FormBackground'

import { Button } from 'reactstrap'
import TreeList, { Column, Scrolling, Selection } from 'devextreme-react/tree-list'
import { CellContainer, CellContent } from '../../SupportComponents/StyledComponents'

import { getBom } from '../../../actions/BomActions'
import { getPlannedCrops } from '../../../actions/CropsActions'
import { getProductionOrder, productionOrderActionType } from '../../../actions/ProductionOrderAction'

import styled from 'styled-components'
import { setProductionOrderRef, toggleDeletePopup } from '../../../actions/ViewActions'

const ProductionOrder = () => {

    const productionOrder = useSelector(state => state.production.productionOrder)
    
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const treeListRef = useRef(null)

    useEffect(() => {
        dispatch(setProductionOrderRef(treeListRef))
    }, [])

    useEffect(() => {
        dispatch(getBom(0))
        dispatch(getPlannedCrops())
        dispatch(getProductionOrder(0))
    }, [])

    const handleOnEditClick = (e) => {
        dispatch(productionOrderActionType({ node: e, type: "UPDATE" }))
        navigate('/app/Create_Production_Order')
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

    const renderProductionOrderIdColumn = (e) => {
        return(
            <CellContainer>
                <CellContent>
                    {e.data.productionOrderId}
                </CellContent>
            </CellContainer>
        )
    }

    const renderProductionNoColumn = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.productionNo}
                </CellContent>
            </CellContainer>
        )
    }

    const renderProductDescriptionColumn = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.productDescription}
                </CellContent>
            </CellContainer>
        )
    }

    const renderQuantityColumn = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.quantity}
                </CellContent>
            </CellContainer>
        )
    }

    const renderStartDateColumn = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {moment(e.data.startDate).format("DD/MM/YYYY")}
                </CellContent>
            </CellContainer>
        )
    }

    const renderEndDateColumn = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {moment(e.data.endDate).format("DD/MM/YYYY")}
                </CellContent>
            </CellContainer>
        )
    }

    const renderActionColumn = (e) => {
        return (
            <ActionCellContainer>
                <button
                    title='Edit Production Order'
                    className='fal fa-pen treelist-edit-button'
                    onClick={() => handleOnEditClick(e)} />

                {/* <button
                    title='Delete Production Order'
                    className='fal fa-trash treelist-delete-button'
                    onClick={() => dispatch(toggleDeletePopup({ active: true, type:"PRODUCTION_ORDER" }))} /> */}
            </ActionCellContainer>
        )
    }

    const handleOnCreateProductionOrder = () => {
        dispatch(productionOrderActionType({ node: null, type: "Create" }))
        navigate('/app/Create_Production_Order')
    }

    const renderTreelist = () => {
        return (
            <Fragment>
                <Header>
                    <HeaderSpan>Production Order History</HeaderSpan>
                    <Button size="sm" className={"form-action-button"} onClick={() => handleOnCreateProductionOrder()}>
                        <i style={{marginRight: 10}} className='fal fa-plus' />
                        Create Production Order
                    </Button>
                </Header>
                
                <TreeList
                    elementAttr={{
                        id: "production-order-treelist",
                        class: "project-treelist"
                    }}
                    keyExpr={"productionOrderId"}
                    ref={treeListRef}
                    showBorders={true}
                    showRowLines={true}
                    showColumnLines={true}
                    dataSource={productionOrder}
                    allowColumnResizing={true}
                    rowAlternationEnabled={true}
                    noDataText={'No Production Order'}
                    height={"calc(100vh - 195px)"}
                    className={'dev-form-treelist'}
                    columnResizingMode={"nextColumn"}>

                    <Selection mode={"single"} />

                    <Scrolling mode={"standard"} />

                    <Column
                        caption={"Production Order-Id"}
                        dataField={"productionOrderId"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderProductionOrderIdColumn}
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-item-column"}
                    />

                    <Column
                        caption={"Product Id"}
                        dataField={"productionNo"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderProductionNoColumn}
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-item-column"}
                    />

                    <Column
                        caption={"Product Description"}
                        dataField={"productDescription"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderProductDescriptionColumn} 
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-column"}
                    />
                        
                    <Column
                        caption={"Quantity"}
                        dataField={"quantity"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderQuantityColumn} 
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-column"}
                    />

                    <Column
                        caption={"Start Date"}
                        dataField={"startDate"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderStartDateColumn} 
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-column"}
                    />

                    <Column
                        caption={"End Date"}
                        dataField={"endDate"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderEndDateColumn} 
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
    
    return (
        <FormBackground Form={[renderTreelist()]} />
    )
}

export default ProductionOrder

const ActionCellContainer = styled.div`
    display: flex;
    font-size: 16px;
    align-items: center;
    justify-content: space-evenly;
`

const Header = styled.div`
    padding: 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
`

const HeaderSpan = styled.span`
    color: #495057;
    font-size: 16px;
    font-weight: 500;
    font-family: 'RobotoFallback';
`