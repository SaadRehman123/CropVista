import React, { Fragment, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import FormBackground from '../../SupportComponents/FormBackground'

import { Badge, Button } from 'reactstrap'
import TreeList, { Column, Scrolling, Selection } from 'devextreme-react/tree-list'
import { CellContainer, CellContent } from '../../SupportComponents/StyledComponents'
import { setItemMasterTreeRef, toggleDeletePopup } from '../../../actions/ViewActions'

import styled from 'styled-components'

const ItemMaster = () => {

    const itemDataSource = useSelector(state => state.item.itemMaster)
    
    const navigate = useNavigate()
    const treeListRef = useRef(null)

    const dispatch = useDispatch()

    useEffect(() => {
        // dispatch(ItemMasterActionType({ node: null, type: "CREATE" }))
    }, [])

    useEffect(() => {
       dispatch(setItemMasterTreeRef(treeListRef))
    }, [])

    const handleOnEditClick = (e) => {
     //   dispatch(bomActionType({ node: e, type: "UPDATE" }))
       // navigate('/app/create_ItemMastewe')
    }
    
    const renderItemIdColumn = (e)=> {
        return(
            <CellContainer>
                <CellContent>
                    {e.data.itemId}
                </CellContent>
            </CellContainer>
        )
    }

   const renderItemName = (e)=>{
        return(
            <CellContainer>
                <CellContent>
                    {e.data.itemName}
                </CellContent>
            </CellContainer>
        )
    }

    const renderItemTypeColumn = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.itemType}
                </CellContent>
            </CellContainer>
        )
    }

    const renderSellingRateColumn = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.sellingRate.toLocaleString("en", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
                </CellContent>
            </CellContainer>
        )
    }

    const renderValuationRateColumn =(e)=>{
        return(
            <CellContainer>
                <CellContent>
                    {e.data.valuationRate.toLocaleString("en", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
                </CellContent>
            </CellContainer>
        )
    }

    const renderUOMColumn = (e) =>{
        return(
            <CellContainer>
                <CellContent>
                    {e.data.UOM}
                </CellContent>
            </CellContainer>
        )
    }

    const renderDisableColumn = (e) => {
        return (
            <CellContainer style={{ alignItems: 'center' }}>
                <Badge className={"active-badge"} color={!e.data.disable ? "secondary" : "success"}>
                    <span className='fad fa-circle' style={{ fontSize: 8, marginRight: 5, left: -3 }} />
                    <span>Disabled</span>
                </Badge>
            </CellContainer>
        )
    }

    const renderActionColumn = (e) => {
        return (
            <ActionCellContainer>
                <button
                    title='Edit Item Master'
                    className='fal fa-pen treelist-edit-button'
                    onClick={() => handleOnEditClick(e)}/>
                <button
                    title='Delete Item Master'
                    className='fal fa-trash treelist-delete-button'
                    onClick={() => dispatch(toggleDeletePopup({ active: true, type:"ITEM_MASTER" }))} />
            </ActionCellContainer>
        )
    }

    const renderTreelist = () => {
        return (
            <Fragment>
                <Header>
                    <HeaderSpan>Item Master</HeaderSpan>
                    <Button size="sm" className={"form-action-button"} onClick={() => navigate('/app/Create_Item')}>
                        <i style={{marginRight: 10}} className='fal fa-plus' />
                        Create Item Master
                    </Button>
                </Header>

                <TreeList
                    elementAttr={{
                        id: "item-master-treelist",
                        class: "project-treelist"
                    }}
                    keyExpr={"itemId"}
                    ref={treeListRef}
                    showBorders={true}
                    showRowLines={true}
                    showColumnLines={true}
                    allowColumnResizing={true}
                    dataSource={itemDataSource}
                    rowAlternationEnabled={true}
                    noDataText={'Item Not Available'}
                    height={"calc(100vh - 195px)"}
                    className={'dev-form-treelist'}
                    columnResizingMode={"nextColumn"}>

                    <Selection mode={"single"} />

                    <Scrolling mode={"standard"} />

                    <Column
                        caption={"Item ID"}
                        dataField={"itemId"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderItemIdColumn} 
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-item-column"}
                    />

                    <Column
                        caption={"Item Name"}
                        dataField={"itemName"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderItemName} 
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-column"}
                    />
                        
                    <Column
                        caption={"Item Type"}
                        dataField={"itemType"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderItemTypeColumn} 
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-column"}
                    />

                    <Column
                        caption={"Selling Rate"}
                        dataField={"sellingRate"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderSellingRateColumn} 
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-column"}
                    />

                    <Column 
                        caption={"Valuation Rate"}
                        dataField={"valuationRate"}
                        alignment={"left"}
                        allowSorting={false}
                        headerCellRender={renderHeaderCell}
                        cellRender={renderValuationRateColumn} 
                        cssClass={"project-treelist-column"}
                    />

                    <Column 
                        caption={"UOM"}
                        dataField={"UOM"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderUOMColumn} 
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-column"}
                    />

                    <Column
                        width={110}
                        minWidth={110}
                        caption={"Disable"}
                        dataField={"disable"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderDisableColumn} 
                        headerCellRender={renderDisableHeaderCell}
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

    const renderDisableHeaderCell = (e) => {
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

export default ItemMaster

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