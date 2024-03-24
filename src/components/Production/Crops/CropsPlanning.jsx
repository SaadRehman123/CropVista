import React, { Fragment, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Button } from 'reactstrap'
import TreeList, { Column, Scrolling, Selection } from 'devextreme-react/tree-list'

import FormBackground from '../../SupportComponents/FormBackground'

import moment from 'moment/moment'

import { toggleCreatePlanPopup } from '../../../actions/PopupActions'
import { setCropPlanRef, toggleDeletePopup } from '../../../actions/ViewActions'

import styled from 'styled-components'
import './styles.css'

const CropsPlanning = () => {

    const plannedCrops = useSelector(state => state.crops.plannedCrops)
    
    const treeListRef = useRef(null)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setCropPlanRef(treeListRef))
    }, [])

    const handleOnEditClick = () => {
        setTimeout(() => {
            dispatch(toggleCreatePlanPopup({ open: true, type: "UPDATE" }))
        }, 0)
    }

    const renderSeasonColumn = (e) => {
        return (
            <span>
                {e.data.season}
            </span>
        )
    }

    const renderCropColumn = (e) => {
        return (
            <span>
                {e.data.crop}
            </span>
        )
    }

    const renderAcreColumn = (e) => {
        return (
            <span>
                {e.data.acre}
            </span>
        )
    }

    const renderStartDateColumn = (e) => {
        return (
            <span>
                {moment(e.data.startdate).format("DD/MM/YYYY")}
            </span>
        )
    }

    const renderEndDateColumn = (e) => {
        return (
            <span>
                {moment(e.data.enddate).format("DD/MM/YYYY")}
            </span>
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
                        caption={"Season"}
                        dataField={"season"}
                        allowSorting={false}
                        cellRender={renderSeasonColumn} 
                        headerCellRender={renderHeaderCell}
                    />
                        
                    <Column
                        caption={"Crop"}
                        dataField={"crop"}
                        allowSorting={false}
                        cellRender={renderCropColumn} 
                        headerCellRender={renderHeaderCell}
                    />

                    <Column
                        caption={"Acre"}
                        dataField={"acre"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderAcreColumn} 
                        headerCellRender={renderHeaderCell}
                    />

                    <Column
                        caption={"Start Date"}
                        dataField={"startDate"}
                        allowSorting={false}
                        cellRender={renderStartDateColumn} 
                        headerCellRender={renderHeaderCell}
                    />

                    <Column
                        caption={"End Date"}
                        dataField={"endDate"}
                        allowSorting={false}
                        cellRender={renderEndDateColumn} 
                        headerCellRender={renderHeaderCell}
                    />

                    <Column
                        width={98}
                        minWidth={98}
                        caption={"Actions"}
                        dataField={"actions"}
                        alignment={"center"}
                        allowSorting={false}
                        cellRender={renderActionColumn}
                        headerCellRender={renderHeaderCell} 
                    />
                </TreeList>
            </Fragment>
        )
    }

    const renderHeaderCell = (e) => {
        return <span style={{ fontWeight: "bold", fontSize: "14px", color: "black" }}> {e.column.caption} </span>
    }

    return (
        <FormBackground Form={renderTreelist()} />
    )
}

export default CropsPlanning

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