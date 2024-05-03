import React, { Fragment, useEffect, useRef } from 'react'
import FormBackground from '../../SupportComponents/FormBackground'
import styled from 'styled-components'
import { Button } from 'reactstrap'
import { TreeList } from 'devextreme-react'
import { Column, Scrolling, Selection } from 'devextreme-react/tree-list'
import { CellContainer, CellContent } from '../../SupportComponents/StyledComponents'
import { useDispatch, useSelector } from 'react-redux'
import { setBomRef, toggleDeletePopup } from '../../../actions/ViewActions'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'

const ItemMaster = () => {

    const ItemDataSource = useSelector(state => state.bom.Bom)
    
    const navigate = useNavigate()
    const treeListRef = useRef(null)

    const dispatch = useDispatch()

    useEffect(() => {
       // dispatch(getBom(0))
      //  dispatch(bomActionType({ node: null, type: "CREATE" }))
    }, [])

    useEffect(() => {
      //  dispatch(setBomRef(treeListRef))
    }, [])

    const handleOnEditClick = (e) => {
     //   dispatch(bomActionType({ node: e, type: "UPDATE" }))
       // navigate('/app/create_ItemMastewe')
     }

    
    const renderItemIDColumn = (e)=> {
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
                    {e.data.itemtype}
                </CellContent>
            </CellContainer>
        )
    }

    const renderSellingRateColumn = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {(e.data.sellingRate)}
                </CellContent>
            </CellContainer>
        )
    }
    const renderValuationRateColumn =(e)=>{
        return(
            <CellContainer>
                <CellContent>
                    {e.data.valuationRate}
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
                    onClick={() => dispatch(toggleDeletePopup({ active: true, type:"ItemMaster" }))} />
            </ActionCellContainer>
        )
    }

    const renderTreelist = () => {
        return (
            <Fragment>

                { <Header>
                    <HeaderSpan>Item Master</HeaderSpan>
                    <Button size="sm" className={"form-action-button"} onClick={() => navigate('/app/Create_Item')}>
                        <i style={{marginRight: 10}} className='fal fa-plus' />
                        Create Item Master
                    </Button>
                </Header> }

                <TreeList
                    elementAttr={{
                        id: "ItemMaster-treelist",
                        class: "project-treelist"
                    }}
                    keyExpr={"itemId"}
                    ref={treeListRef}
                    showBorders={true}
                    showRowLines={true}
                    showColumnLines={true}
                    dataSource={ItemDataSource}
                    allowColumnResizing={true}
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
                        cellRender={renderItemIDColumn} 
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
                        cellRender={renderValuationRateColumn} 
                        headerCellRender={renderHeaderCell}
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
export default ItemMaster;
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