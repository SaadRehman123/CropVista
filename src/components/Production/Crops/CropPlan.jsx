import React, { Fragment, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Badge, Button } from 'reactstrap'
import TreeList, { Column, Scrolling, Selection } from 'devextreme-react/tree-list'

import FormBackground from '../../SupportComponents/FormBackground'

import moment from 'moment/moment'

import { getPlannedCrops } from '../../../actions/CropsActions'
import { toggleCreatePlanPopup } from '../../../actions/PopupActions'
import { setCropPlanRef, toggleDeletePopup } from '../../../actions/ViewActions'
import { CellContainer, CellContent } from '../../SupportComponents/StyledComponents'

import styled from 'styled-components'

const CropPlan = () => {

    const plannedCrops = useSelector(state => state.crops.plannedCrops)
    
    const treeListRef = useRef(null)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setCropPlanRef(treeListRef))
    }, [])

    useEffect(() => {
        dispatch(getPlannedCrops())
    }, [])

    const handleOnEditClick = () => {
        setTimeout(() => {
            dispatch(toggleCreatePlanPopup({ open: true, type: "UPDATE" }))
        }, 0)
    }

    const renderPlanIdColumn = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.id}
                </CellContent>
            </CellContainer>
        )
    }

    const renderSeasonColumn = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.season}
                </CellContent>
            </CellContainer>
        )
    }

    const renderCropColumn = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.crop}
                </CellContent>
            </CellContainer>
        )
    }

    const renderAcreColumn = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.acre}
                </CellContent>
            </CellContainer>
        )
    }

    const renderStartDateColumn = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {moment(e.data.startdate).format("DD/MM/YYYY")}
                </CellContent>
            </CellContainer>
        )
    }

    const renderEndDateColumn = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {moment(e.data.enddate).format("DD/MM/YYYY")}
                </CellContent>
            </CellContainer>
        )
    }
    
    const renderStatusColumn = (e) => {
        return (
            <CellContainer style={{ alignItems: 'center' }}>
                <Badge className={"status-badge"} color={setColor(e)}>
                    <span className='fad fa-circle' style={{ fontSize: 8, marginRight: 5, left: -3 }} />
                    <span>{e.data.status}</span>
                </Badge>
            </CellContainer>
        )
    }
    
    const renderActionColumn = (e) => {
        return (
            <ActionCellContainer>
                <button
                    title='Edit Plan'
                    className='fal fa-pen treelist-edit-button'
                    onClick={() => handleOnEditClick()} />

                <button
                    title='Delete Plan'
                    className='fal fa-trash treelist-delete-button'
                    onClick={() => dispatch(toggleDeletePopup({ active: true, type:"CROP_PLAN" }))} />
            </ActionCellContainer>
        )
    }

    const renderTreelist = () => {
        return (
            <Fragment>

                <Header>
                    <HeaderSpan>Plan History</HeaderSpan>
                    <Button size="sm" className={"form-action-button"} onClick={() => dispatch(toggleCreatePlanPopup({ open: true, type: "CREATE" }))}>
                        <i style={{marginRight: 10}} className='fal fa-plus' />
                        Create Plan
                    </Button>
                </Header>

                <TreeList
                    elementAttr={{
                        id: "crop-plan-treelist",
                        class: "project-treelist"
                    }}
                    keyExpr={"id"}
                    ref={treeListRef}
                    showBorders={true}
                    showRowLines={true}
                    showColumnLines={true}
                    dataSource={plannedCrops}
                    allowColumnResizing={true}
                    rowAlternationEnabled={true}
                    noDataText={'No Plan'}
                    height={"calc(100vh - 195px)"}
                    className={'dev-form-treelist'}
                    columnResizingMode={"nextColumn"}>

                    <Selection mode={"single"} />

                    <Scrolling mode={"standard"} />

                    <Column
                        caption={"Plan-Id"}
                        dataField={"id"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderPlanIdColumn} 
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-item-column"}
                    />

                    <Column
                        caption={"Season"}
                        dataField={"season"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderSeasonColumn} 
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-column"}
                    />
                        
                    <Column
                        caption={"Crop"}
                        dataField={"crop"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderCropColumn} 
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-column"}
                    />

                    <Column
                        caption={"Acre"}
                        dataField={"acre"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderAcreColumn} 
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
                        width={115}
                        minWidth={115}
                        caption={"Status"}
                        dataField={"status"}
                        alignment={"center"}
                        allowSorting={false}
                        cellRender={renderStatusColumn} 
                        headerCellRender={renderStatusHeaderCell}
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

    const renderStatusHeaderCell = (e) => {
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

export default CropPlan

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

const setColor = (e) => {
    let color

    if(e.data.status === "Pending"){
        color = 'warning'
    }
    else if(e.data.status === "Release"){
        color = 'info'
    }
    else if(e.data.status === "Completed"){
        color = 'success'
    }
    else if(e.data.status === "Closed"){
        color = 'danger'
    }

    return color
}