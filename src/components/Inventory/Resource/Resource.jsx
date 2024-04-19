import React, { Fragment, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import FormBackground from '../../SupportComponents/FormBackground'

import { Button } from 'reactstrap'
import TreeList, { Column, Scrolling, Selection } from 'devextreme-react/tree-list'

import { toggleCreateResourcePopup } from '../../../actions/PopupActions'
import { setResourceRef, toggleDeletePopup } from '../../../actions/ViewActions'
import { CellContainer, CellContent } from '../../SupportComponents/StyledComponents'

import styled from 'styled-components'
import '../styles.css'

const Resource = () => {
    const resources = useSelector(state => state.resource.resources)

    const treeListRef = useRef(null)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setResourceRef(treeListRef))
    }, [])

    const handleOnEditClick = () => {
        setTimeout(() => {
            dispatch(toggleCreateResourcePopup({ open: true, type: "UPDATE" }))
        }, 0)
    }

    const renderResourceIdColumn = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.rId}
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

    const renderResourceTypeColumn = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.rType}
                </CellContent>
            </CellContainer>
        )
    }

    const renderActionColumn = (e) => {
        return (
            <ActionCellContainer>
                <button
                    title='Edit Resource'
                    className='fal fa-pen treelist-edit-button'
                    onClick={() => handleOnEditClick()} />

                <button
                    title='Delete Resource'
                    className='fal fa-trash treelist-delete-button'
                    onClick={() => dispatch(toggleDeletePopup({ active: true, type:"RESOURCE" }))} />
            </ActionCellContainer>
        )
    }

    const renderTreelist = () => {

        return (
            <Fragment>

                <Header>
                    <HeaderSpan>Resource History</HeaderSpan>
                    <Button size="sm" className={"form-action-button"} onClick={() => dispatch(toggleCreateResourcePopup({ open: true, type: "CREATE" }))}>
                        <i style={{marginRight: 10}} className='fal fa-plus' />
                        Create Resource
                    </Button>
                </Header>

                <TreeList
                    elementAttr={{
                        id: "resource-treelist",
                        class: "project-treelist"
                    }}
                    keyExpr={"rId"}
                    ref={treeListRef}
                    showBorders={true}
                    showRowLines={true}
                    showColumnLines={true}
                    dataSource={resources}
                    allowColumnResizing={true}
                    rowAlternationEnabled={true}
                    noDataText={'No Resource'}
                    height={"calc(100vh - 195px)"}
                    className={'dev-form-treelist'}
                    columnResizingMode={"nextColumn"}>

                    <Selection mode={"single"} />

                    <Scrolling mode={"standard"} />

                    <Column
                        caption={"Resource-Id"}
                        dataField={"rId"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderResourceIdColumn} 
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
                        dataField={"rType"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderResourceTypeColumn} 
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
        <FormBackground Form={renderTreelist()} />
    )
}

export default Resource

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