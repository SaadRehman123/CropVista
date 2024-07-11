import React, { Fragment, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import FormBackground from '../../SupportComponents/FormBackground'

import { Badge, Button } from 'reactstrap'
import TreeList, { Column, HeaderFilter, Scrolling, Selection } from 'devextreme-react/tree-list'
import { CellContainer, CellContent } from '../../SupportComponents/StyledComponents'

import { getItemMaster } from '../../../actions/ItemActions'
import { setItemMasterTreeRef } from '../../../actions/ViewActions'
import { toggleCreateItemPopup } from '../../../actions/PopupActions'

import styled from 'styled-components'

const ItemMaster = () => {

    const itemMasterDataSource = useSelector(state => state.item.itemMaster)
    
    const treeListRef = useRef(null)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getItemMaster())
    }, [])

    useEffect(() => {
       dispatch(setItemMasterTreeRef(treeListRef))
    }, [])

    const handleOnCreate = () => {
        dispatch(toggleCreateItemPopup({ open: true, type: "CREATE" }))
    }

    const handleOnEditClick = () => {
        setTimeout(() => {
            dispatch(toggleCreateItemPopup({ open: true, type: "UPDATE" }))
        }, 0)
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

    const renderUOMColumn = (e) =>{
        return(
            <CellContainer>
                <CellContent>
                    {e.data.uom}
                </CellContent>
            </CellContainer>
        )
    }

    const renderDisableColumn = (e) => {
        return (
            <CellContainer style={{ alignItems: 'center' }}>
                <Badge className={"active-badge"} color={!e.data.disable ? "success" : "secondary"}>
                    <span className='fad fa-circle' style={{ fontSize: 8, marginRight: 5, left: -3 }} />
                    <span>{!e.data.disable ? "Active" : "Disabled"}</span>
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
            </ActionCellContainer>
        )
    }

    const renderTreelist = () => {
        return (
            <Fragment>
                <Header>
                    <HeaderSpan>Item Master</HeaderSpan>
                    <Button size="sm" className={"form-action-button"} onClick={() => handleOnCreate()}>
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
                    rowAlternationEnabled={true}
                    height={"calc(100vh - 195px)"}
                    className={'dev-form-treelist'}
                    noDataText={'Item Not Available'}
                    columnResizingMode={"nextColumn"}
                    dataSource={itemMasterDataSource}>

                    <Selection mode={"single"} />

                    <Scrolling mode={"standard"} />

                    <HeaderFilter visible={true} allowSearch={true} />

                    <Column
                        caption={"Item-Id"}
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
                        caption={"UoM"}
                        dataField={"uom"}
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
                        allowFiltering={false}
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