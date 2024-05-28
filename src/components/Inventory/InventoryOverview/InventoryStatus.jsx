import React, { Fragment, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import FormBackground from '../../SupportComponents/FormBackground'

import TreeList, { Column, Scrolling, Selection } from 'devextreme-react/tree-list'
import { CellContainer, CellContent } from '../../SupportComponents/StyledComponents'

import styled from 'styled-components'
import { getInventory } from '../../../actions/InventoryAction'

const InventoryStatus = () => {

    const inventory = useSelector(state => state.inventory.inventoryStatus)

    const treeListRef = useRef(null)
    const dispatch = useDispatch(null)

    useEffect(() => {
        dispatch(getInventory())
    }, [])

    const renderInventoryIdColumn = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.inventoryId}
                </CellContent>
            </CellContainer>
        )
    }    

    const renderInventoryNameColumn = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.inventoryItem}
                </CellContent>
            </CellContainer>
        )
    }
    
    const renderInventoryQuantityColumn = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.inventoryQuantity}
                </CellContent>
            </CellContainer>
        )
    }

    const renderInventoryWarehouseColumn = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.inventoryWarehouse}
                </CellContent>
            </CellContainer>
        )
    }

    const renderTreelist = () => {
        return (
            <Fragment>

                <Header>
                    <HeaderSpan>Inventory History</HeaderSpan>
                </Header>

                <TreeList
                    elementAttr={{
                        id: "inventory-treelist",
                        class: "project-treelist"
                    }}
                    keyExpr={"inventoryId"}
                    ref={treeListRef}
                    showBorders={true}
                    showRowLines={true}
                    showColumnLines={true}
                    dataSource={inventory}
                    allowColumnResizing={true}
                    rowAlternationEnabled={true}
                    noDataText={'No Inventory'}
                    height={"calc(100vh - 195px)"}
                    className={'dev-form-treelist'}
                    columnResizingMode={"nextColumn"}>

                    <Selection mode={"single"} />

                    <Scrolling mode={"standard"} />

                    <Column
                        caption={"Inventory-Id"}
                        dataField={"inventoryId"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderInventoryIdColumn} 
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-item-column"}
                    />

                    <Column
                        caption={"Item Name"}
                        dataField={"inventoryItem"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderInventoryNameColumn} 
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-column"}
                    />
                        
                    <Column
                        caption={"Quantity"}
                        dataField={"inventoryQuantity"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderInventoryQuantityColumn} 
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-column"}
                    />

                    <Column
                        caption={"Warehouse"}
                        dataField={"inventoryWarehouse"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderInventoryWarehouseColumn} 
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-column"}
                    />
                </TreeList>
            </Fragment>
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

export default InventoryStatus

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