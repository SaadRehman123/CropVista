import React, { Fragment, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Badge, Button } from 'reactstrap'
import TreeList, { Column, Scrolling, Selection } from 'devextreme-react/tree-list'

import FormBackground from '../../SupportComponents/FormBackground'

import { toggleCreateWarehousePopup } from '../../../actions/PopupActions'
import { setWarehouseRef, toggleDeletePopup } from '../../../actions/ViewActions'
import { CellContainer, CellContent } from '../../SupportComponents/StyledComponents'

import styled from 'styled-components'

const Warehouse = () => {

    const warehouses = useSelector(state => state.warehouse.warehouses)

    const treeListRef = useRef(null)

    const dispatch = useDispatch()
    
    useEffect(() => {
        dispatch(setWarehouseRef(treeListRef))
    }, [])

    const handleOnEditClick = () => {
        setTimeout(() => {
            dispatch(toggleCreateWarehousePopup({ open: true, type: "UPDATE" }))
        }, 0)
    }

    const renderWarehouseIdColumn = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.wrId}
                </CellContent>
            </CellContainer>
        )
    }

    const renderNameColumn = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.name}
                </CellContent>
            </CellContainer>
        )
    }

    const renderWarehouseTypeColumn = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.wrType}
                </CellContent>
            </CellContainer>
        )
    }

    const renderInactiveColumn = (e) => {
        return (
            <CellContainer style={{ alignItems: 'center' }}>
                <Badge className={"active-badge"} color={!e.data.active ? "secondary" : "success"}>
                    <span className='fad fa-circle' style={{ fontSize: 8, marginRight: 5, left: -3 }} />
                    <span>Active</span>
                </Badge>
            </CellContainer>
        )
    }

    const renderLocationColumn = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.location}
                </CellContent>
            </CellContainer>
        )
    }
    
    const renderActionColumn = (e) => {
        return (
            <ActionCellContainer>
                <button
                    title='Edit Warehouse'
                    className='fal fa-pen treelist-edit-button'
                    onClick={() => handleOnEditClick()} />

                <button
                    title='Delete Warehouse'
                    className='fal fa-trash treelist-delete-button'
                    onClick={() => dispatch(toggleDeletePopup({ active: true, type:"WAREHOUSE" }))} />
            </ActionCellContainer>
        )
    }

    const renderTreelist = () => {

        return (
            <Fragment>

                <Header>
                    <HeaderSpan>Warehouse History</HeaderSpan>
                    <Button size="sm" className={"form-action-button"} onClick={() => dispatch(toggleCreateWarehousePopup({ open: true, type: "CREATE" }))}>
                        <i style={{marginRight: 10}} className='fal fa-plus' />
                        Create Warehouse
                    </Button>
                </Header>

                <TreeList
                    elementAttr={{
                        id: "warehouse-treelist",
                        class: "project-treelist"
                    }}
                    keyExpr={"wrId"}
                    ref={treeListRef}
                    showBorders={true}
                    showRowLines={true}
                    showColumnLines={true}
                    dataSource={warehouses}
                    allowColumnResizing={true}
                    rowAlternationEnabled={true}
                    noDataText={'No Warehouse'}
                    height={"calc(100vh - 195px)"}
                    className={'dev-form-treelist'}
                    columnResizingMode={"nextColumn"}>

                    <Selection mode={"single"} />

                    <Scrolling mode={"standard"} />

                    <Column
                        caption={"Warehouse-Id"}
                        dataField={"wrId"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderWarehouseIdColumn} 
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-item-column"}
                    />

                    <Column
                        caption={"Name"}
                        dataField={"name"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderNameColumn} 
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-column"}
                    />
                        
                    <Column
                        caption={"Type"}
                        dataField={"wrType"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderWarehouseTypeColumn} 
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-column"}
                    />

                    <Column
                        caption={"Location"}
                        dataField={"location"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderLocationColumn} 
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-column"}
                    />

                    <Column
                        width={102}
                        minWidth={102}
                        caption={"Active"}
                        dataField={"inactive"}
                        alignment={"center"}
                        allowSorting={false}
                        cellRender={renderInactiveColumn} 
                        headerCellRender={renderActiveHeaderCell}
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

    const renderActiveHeaderCell = (e) => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 29 }}>
                <span style={{ color: "#444", fontSize: "14px", fontWeight: "700" }}>
                    {e.column.caption}
                </span>
            </div>
        )
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

export default Warehouse

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