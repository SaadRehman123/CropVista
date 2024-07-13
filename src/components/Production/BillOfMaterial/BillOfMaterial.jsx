import React, { Fragment, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import moment from 'moment'
import FormBackground from '../../SupportComponents/FormBackground'

import { Button } from 'reactstrap'
import { CellContainer, CellContent } from '../../SupportComponents/StyledComponents'
import TreeList, { Column, HeaderFilter, Scrolling, Selection } from 'devextreme-react/tree-list'

import { bomActionType, getBom } from '../../../actions/BomActions'
import { setBomRef, toggleDeletePopup } from '../../../actions/ViewActions'

import styled from 'styled-components'

const BillOfMaterial = () => {

    const bomDatasource = useSelector(state => state.bom.Bom)
    
    const navigate = useNavigate()
    const treeListRef = useRef(null)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getBom(0))
        dispatch(bomActionType({ node: null, type: "CREATE" }))
    }, [])

    useEffect(() => {
        dispatch(setBomRef(treeListRef))
    }, [])

    const handleOnEditClick = (e) => {
        dispatch(bomActionType({ node: e, type: "UPDATE" }))
        navigate('/app/Create_Bom')
    }

    const renderBomIdColumn = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.bid}
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

    const renderCreationDateColumn = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {moment(e.data.creationDate).format("DD/MM/YYYY")}
                </CellContent>
            </CellContainer>
        )
    }

    const renderActionColumn = (e) => {
        return (
            <ActionCellContainer>
                <button
                    title='Edit Bom'
                    className='fal fa-pen treelist-edit-button'
                    onClick={() => handleOnEditClick(e)} />

                <button
                    title='Delete Bom'
                    className='fal fa-trash treelist-delete-button'
                    onClick={() => dispatch(toggleDeletePopup({ active: true, type:"BOM" }))} />
            </ActionCellContainer>
        )
    }

    const renderTreelist = () => {
        return (
            <Fragment>
                <Header>
                    <HeaderSpan>Bill of Material History</HeaderSpan>
                    <Button size="sm" className={"form-action-button"} onClick={() => navigate('/app/create_bom')}>
                        <i style={{marginRight: 10}} className='fal fa-plus' />
                        Create Bill of Material
                    </Button>
                </Header>

                <TreeList
                    elementAttr={{
                        id: "bom-treelist",
                        class: "project-treelist"
                    }}
                    keyExpr={"bid"}
                    ref={treeListRef}
                    showBorders={true}
                    showRowLines={true}
                    showColumnLines={true}
                    dataSource={bomDatasource}
                    allowColumnResizing={true}
                    rowAlternationEnabled={true}
                    noDataText={'No Bill of Material'}
                    height={"calc(100vh - 195px)"}
                    className={'dev-form-treelist'}
                    columnResizingMode={"nextColumn"}>

                    <Selection mode={"single"} />

                    <Scrolling mode={"standard"} />

                    <HeaderFilter visible={true} allowSearch={true} />

                    <Column
                        caption={"BOM-Id"}
                        dataField={"bid"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderBomIdColumn}
                        headerCellRender={renderHeaderCell}
                        sortOrder={"asc"}
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
                        caption={"Creation Date"}
                        dataField={"creationDate"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderCreationDateColumn} 
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

export default BillOfMaterial

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