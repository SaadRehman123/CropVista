import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'


import {Button as FormButton} from 'reactstrap'  
import TreeList, { Button, Column, Editing, Scrolling, Selection } from 'devextreme-react/tree-list'

import notify from 'devextreme/ui/notify'

import { addCropsPlan, getCropsBySeason, getPlannedCrops } from '../../actions/CropsActions'

import styled from 'styled-components'
import moment from 'moment/moment'
import { DateBox, Form, SelectBox, TextBox } from 'devextreme-react'

import './styles.css'
import { ButtonItem, Label, RequiredRule, SimpleItem } from 'devextreme-react/form'

const CropsPlanning = () => {

    const crops = useSelector(state => state.crops.cropsBySeason)
    const seasons = useSelector(state => state.seasons.getSeasons)
    const plannedCrops = useSelector(state => state.crops.plannedCrops)
    
    const [season, setSeason] = useState('')
    const [crop, setCrop] = useState('')
    const [acre, setAcre] = useState(0)
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')

    const treeListRef = useRef(null)

    const dispatch = useDispatch()

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

    const handleOnSeasonChange = (e) => {
        dispatch(getCropsBySeason(e))
        setSeason(e);
    }
    const handleOnCropChange = (e) => {
        setCrop(e);
    }
    const handleOnAcreChange = (e) => {
        setAcre(e);
    }
    const handleOnStartDateChange = (e) => {
        setStartDate(e);
    }
    const handleOnEndDateChange = (e) => {
        setEndDate(e);
    }

    const handleOnSubmit = (e) => {
        e.preventDefault()
        const instance = treeListRef.current.instance

        const plannedCrop = {
            season: season,
            crop: crop,
            acre: acre,
            startdate: moment(startDate).format("YYYY-MM-DD"),
            enddate: moment(endDate).format("YYYY-MM-DD")
        }

        dispatch(addCropsPlan(plannedCrop)).then(res => {
            if(res.payload.data.success){
                dispatch(getPlannedCrops()).then(res => {
                    if(res.payload.data.success){
                        instance.refresh()
                    }
                })
                notify("Crop Plan Added", "success", 2000)
            }
        })
    }

    const renderForm = () => {
        return (
            // <Container>
            <form onSubmit={handleOnSubmit} style={{ display: 'flex', padding: 20, width: "50%", flexDirection: "column" }}>
                <SelectBox
                    style={{ marginBottom: 20 }}
                    placeholder='Season'
                    dataSource={seasons.map(item => item.seasons)}
                    onValueChange={handleOnSeasonChange}
                    name="season"
                />
                <SelectBox
                    style={{ marginBottom: 20 }}
                    placeholder='Crop'
                    disabled={season === "" ? true : false}
                    dataSource={crops.map(item => item.name)}
                    name="crop"
                    onValueChange={handleOnCropChange}
                />
                <TextBox
                    style={{ marginBottom: 20 }}
                    placeholder="Acre"
                    name="acre"
                    onValueChange={handleOnAcreChange}
                />
                <DateBox
                    style={{ marginBottom: 20 }}
                    placeholder='Start Date'
                    pickerType='calendar'
                    type='date'
                    name="startDate"
                    onValueChange={handleOnStartDateChange}
                />
                <DateBox
                    style={{ marginBottom: 20 }}
                    placeholder='End Date'
                    pickerType='calendar'
                    type='date'
                    name="endDate"
                    onValueChange={handleOnEndDateChange}
                />

                <FormButton outline>Save</FormButton>
            </form>
            // </Container>
        )
    }

    console.log(plannedCrops);

    const renderTreelist = () => {
        return (
            <div>
                <TreeList
                    keyExpr={"id"}
                    ref={treeListRef}
                    showBorders={true}
                    showRowLines={true}
                    showColumnLines={true}
                    dataSource={plannedCrops}
                    allowColumnResizing={true}
                    rowAlternationEnabled={true}
                    height={"calc(100vh - 105px)"}
                    columnResizingMode={"nextColumn"}>

                    <Editing 
                        mode="row"
                        allowDeleting={true} 
                    />

                    <Column
                        caption={"Season"}
                        dataField={"season"}
                        allowSorting={false}
                        headerCellRender={renderHeaderCell}
                        cellRender={renderSeasonColumn} 
                    />
                        
                    <Column
                        caption={"Crop"}
                        dataField={"crop"}
                        allowSorting={false}
                        headerCellRender={renderHeaderCell}
                        cellRender={renderCropColumn} 
                    />

                    <Column
                        caption={"Acre"}
                        dataField={"acre"}
                        alignment={"left"}
                        allowSorting={false}
                        headerCellRender={renderHeaderCell}
                        cellRender={renderAcreColumn} 
                    />

                    <Column
                        caption={"Start Date"}
                        dataField={"startDate"}
                        allowSorting={false}
                        headerCellRender={renderHeaderCell}
                        cellRender={renderStartDateColumn} 
                    />

                    <Column
                        caption={"End Date"}
                        dataField={"endDate"}
                        allowSorting={false}
                        headerCellRender={renderHeaderCell}
                        cellRender={renderEndDateColumn} 
                    />

                    <Column
                        type="buttons"
                        caption='Action'
                        allowSorting={false}
                        headerCellRender={renderHeaderCell}>
                        <Button
                            hint='Edit'
                            visible={true}
                            icon='fal fa-pencil'
                            cssClass={"treelist-edit-button"}
                            onClick={() => alert("Edit Row")} />
                        <Button
                            hint="Delete"
                            visible={true}
                            icon='fal fa-trash'
                            cssClass={"treelist-delete-button"}
                            onClick={() => alert("Delete Row")} />
                    </Column>
                </TreeList>
            </div>
        )
    }

    const renderHeaderCell = (e) => {
        return <span style={{ fontWeight: "bold", fontSize: "14px", color: "black" }}> {e.column.caption} </span>
    }

    return (
        <div>
            <h1>Crops Planning</h1>
            {renderForm()}
            {renderTreelist()}
        </div>
    )
}

export default CropsPlanning

export const ActionCellContainer = styled.span`
    font-size: 16px;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
`

// const Container = styled.div`
//     width: 300px;
//     display: flex;
//     align-items: center;
//     border: 2px solid #ddd;
//     border-radius: 6px;
//     padding: 4px;
//     margin-left: 6px;
//     background-color: white;
//     &:hover {
//         border: 2px solid #ccc;
//     }
//     &:focus-within {
//         border: 2px solid #ccc;
//     }
// `

// const Input = styled.input`
//     // border: none;
//     // width: 180px;
//     margin-bottom: 20px;
// `