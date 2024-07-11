import React, { Fragment, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { saveAs } from 'file-saver'
import { pdf } from '@react-pdf/renderer'

import moment from 'moment'
import StockEntryReport from '../../Reports/StockEntryReport'
import FormBackground from '../../SupportComponents/FormBackground'

import { Button } from 'reactstrap'
import TreeList, { Column, HeaderFilter, Scrolling, Selection } from 'devextreme-react/tree-list'
import { CellContainer, CellContent } from '../../SupportComponents/StyledComponents'

import { getStockEntries } from '../../../actions/StockEntriesAction'

import styled from 'styled-components'

const StockEntries = () => {

    const user = useSelector(state => state.user.loginUser)
    const stockEntries = useSelector(state => state.stock.stockEntries)
    
    const dispatch = useDispatch()
    const treeListRef = useRef(null)
    
    useEffect(() => {
        dispatch(getStockEntries())
    }, [])

    const handlePdfGenrating = async () => {
        const blob = await pdf(
            <StockEntryReport
                user={user}
                reportGridRef={treeListRef}
            />
        ).toBlob()
        saveAs(blob, `Stock Entry Report.pdf`)
    }

    const renderStockEntryIdColumn = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.stockEntryId}
                </CellContent>
            </CellContainer>
        )
    }

    const renderStockEntryNameColumn = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.stockEntryName}
                </CellContent>
            </CellContainer>
        )
    }

    const renderStockEntryWarehouseColumn = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.stockEntryWarehouse}
                </CellContent>
            </CellContainer>
        )
    }

    const renderStockEntryQuantityColumn = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.stockEntryQuantity}
                </CellContent>
            </CellContainer>
        )
    }

    const renderStockEntryToColumn = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.stockEntryTo}
                </CellContent>
            </CellContainer>
        )
    }

    const renderStockEntryDateColumn = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {moment(e.data.stockEntryDate).format("DD/MM/YYYY")}
                </CellContent>
            </CellContainer>
        )
    }

    const renderTreelist = () => {
        return (
            <Fragment>

                <Header>
                    <HeaderSpan>Stock Entry History</HeaderSpan>
                    <Button size="sm" className={"form-action-button"} onClick={() => handlePdfGenrating()}>
                        <i style={{marginRight: 10}} className='fal fa-file-pdf' />
                        Generate Pdf
                    </Button>
                </Header>

                <TreeList
                    elementAttr={{
                        id: "stock-entry-treelist",
                        class: "project-treelist"
                    }}
                    keyExpr={"stockEntryId"}
                    ref={treeListRef}
                    showBorders={true}
                    showRowLines={true}
                    showColumnLines={true}
                    dataSource={stockEntries}
                    allowColumnResizing={true}
                    rowAlternationEnabled={true}
                    noDataText={'No Plan'}
                    height={"calc(100vh - 195px)"}
                    className={'dev-form-treelist'}
                    columnResizingMode={"nextColumn"}>

                    <Selection mode={"single"} />

                    <Scrolling mode={"standard"} />

                    <HeaderFilter visible={true} allowSearch={true} />

                    <Column
                        caption={"Entry-Id"}
                        dataField={"stockEntryId"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderStockEntryIdColumn} 
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-item-column"}
                    />

                    <Column
                        caption={"Item Name"}
                        dataField={"stockEntryName"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderStockEntryNameColumn} 
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-column"}
                    />
                        
                    <Column
                        caption={"Warehouse"}
                        dataField={"stockEntryWarehouse"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderStockEntryWarehouseColumn} 
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-column"}
                    />

                    <Column
                        caption={"Quantity"}
                        dataField={"stockEntryQuantity"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderStockEntryQuantityColumn} 
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-column"}
                    />

                    <Column
                        caption={"Entry To"}
                        dataField={"stockEntryTo"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderStockEntryToColumn} 
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-column"}
                    />
                    
                    <Column
                        caption={"Entry Date"}
                        dataField={"stockEntryDate"}
                        alignment={"center"}
                        allowSorting={false}
                        cellRender={renderStockEntryDateColumn} 
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

export default StockEntries

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