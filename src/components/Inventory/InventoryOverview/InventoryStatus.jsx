import React, { Fragment, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { saveAs } from 'file-saver'
import { pdf } from '@react-pdf/renderer'


import InventoryReport from '../../Reports/InventoryReport'
import FormBackground from '../../SupportComponents/FormBackground'

import { Button } from 'reactstrap'
import TreeList, { Column, HeaderFilter, Scrolling, Selection } from 'devextreme-react/tree-list'
import { CellContainer, CellContent } from '../../SupportComponents/StyledComponents'

import { getInventory } from '../../../actions/InventoryAction'

import styled from 'styled-components'

const InventoryStatus = () => {

    const user = useSelector(state => state.user.loginUser)
    const inventory = useSelector(state => state.inventory.inventoryStatus)

    const treeListRef = useRef(null)
    const dispatch = useDispatch(null)

    useEffect(() => {
        dispatch(getInventory())
    }, [])

    const handlePdfGenrating = async () => {
        const blob = await pdf(
            <InventoryReport
                user={user}
                reportGridRef={treeListRef}
            />
        ).toBlob()
        saveAs(blob, `Inventory Report.pdf`)
    }

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
                    <Button size="sm" className={"form-action-button"} onClick={() => handlePdfGenrating()}>
                        <i style={{marginRight: 10}} className='fal fa-file-pdf' />
                        Generate Pdf
                    </Button>
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

                    <HeaderFilter visible={true} allowSearch={true} />

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