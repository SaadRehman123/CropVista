import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Input as SelectBox, Input as DatePicker, Input } from 'reactstrap'
import TreeList, { Column, Scrolling, Selection } from 'devextreme-react/tree-list'
import { Form, FormButton, FormButtonContainer, FormGroupContainer, FormGroupItem, FormLabel, Option } from '../SupportComponents/StyledComponents'

import notify from 'devextreme/ui/notify'
import FormBackground from '../SupportComponents/FormBackground'

import moment from 'moment/moment'

import { setCropPlanRef, toggleDeletePopup } from '../../actions/ViewActions'
import { addCropsPlan, getCropsBySeason, getPlannedCrops, updateCropsPlan } from '../../actions/CropsActions'

import styled from 'styled-components'
import './styles.css'

const CropsPlanning = () => {

    const crops = useSelector(state => state.crops.cropsBySeason)
    const seasons = useSelector(state => state.seasons.getSeasons)
    const plannedCrops = useSelector(state => state.crops.plannedCrops)
    
    const [update, setUpdate] = useState(false)
    const [message, setMessage] = useState("")
    const [validAcre, setValidAcre] = useState(false)
    const [validDate, setValidDate] = useState(false)
    const [formData, setFormData] = useState({ season: "", crop: "", acre: "", startDate: "", endDate: "" })
    const [indicator, setIndicator] = useState({ season: false, crop: false, acre: false, startDate: false, endDate: false })
    
    const treeListRef = useRef(null)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setCropPlanRef(treeListRef))
    }, [])
    
    useEffect(() => {
        if(parseInt(formData.acre) < 1 || parseInt(formData.acre) > 5000) setValidAcre(true)
        else setValidAcre(false)

        if(formData.startDate === "" || formData.endDate === ""){
            setValidDate(true)
            setMessage("Both Start Date and End Date Should be Selected")
        }
        else if (formData.startDate > formData.endDate) {
            setValidDate(true)
            setMessage("End Date Should Be Greater Than Start Date")
        }
        else {
            setValidDate(false)
        }
    }, [formData])

    const handleOnUpdate = () => {
        const instance = treeListRef.current.instance
        const selectedRow = instance.getSelectedRowsData()
        
        if(selectedRow.length > 0){
            setUpdate(true)
            dispatch(getCropsBySeason(selectedRow[0].season))
            setFormData({
                season: selectedRow[0].season,
                crop: selectedRow[0].crop,
                acre: (selectedRow[0].acre).toString(),
                startDate: moment(selectedRow[0].startdate).format("YYYY-MM-DD"),
                endDate: moment(selectedRow[0].enddate).format("YYYY-MM-DD")
            })
        }
    }

    const handleOnChange = (e) => {
        const { name, value } = e.target
        if(name === "season") dispatch(getCropsBySeason(value))
        setFormData(prevState => ({ ...prevState, [name]: value }))
    }

    const handleOnSubmit = (e) => {
        e.preventDefault()
        const instance = treeListRef.current.instance
        const selectedRow = instance.getSelectedRowsData()

        const plannedCrop = {
            season: formData.season,
            crop: formData.crop,
            acre: parseInt(formData.acre),
            startdate: moment(formData.startDate).format("YYYY-MM-DD"),
            enddate: moment(formData.endDate).format("YYYY-MM-DD")
        }
        
        const acreLimit = formData.acre.trim() < 1 || formData.acre.trim() > 2000
        if (formData.season.trim() === "" || formData.crop.trim() === "" || formData.acre.trim() === "" || formData.startDate.trim() === "" || formData.endDate.trim() === "" || acreLimit === true) {
            setIndicator({ 
                season: formData.season.trim() === "" ? true : false,
                crop: formData.crop.trim() === "" ? true : false,
                acre: formData.acre.trim() === "" || acreLimit === true ? true : false,
                startDate: formData.startDate.trim() === "" ? true : false,
                endDate: formData.endDate.trim() === "" ? true : false,
            })
            return
        }

        if(validAcre || validDate){
            return
        }

        if(update){
            const changes = validateChanges(selectedRow, plannedCrop)
            if(!changes){
                notify("No Changes Detected", "info", 2000)
                return
            }
        }

        if(!update){
            dispatch(addCropsPlan(plannedCrop)).then(res => {
                if(res.payload.data.success){
                    setFormData({ season: "", crop: "", acre: "", startDate: "", endDate: "" })
                    setIndicator({ season: false, crop: false, acre: false, startDate: false, endDate: false })
                    dispatch(getPlannedCrops()).then(res => {
                        if(res.payload.data.success){
                            instance.refresh()
                        }
                    })
                    notify("Crop Plan Added", "success", 2000)
                }
            })
        }
        else {
            const selectedRow = instance.getSelectedRowsData()
            if(selectedRow.length > 0 && update === true){
                dispatch(updateCropsPlan(selectedRow[0].id, plannedCrop)).then(res => {
                    if(res.payload.data.success){
                        setFormData({ season: "", crop: "", acre: "", startDate: "", endDate: "" })
                        setIndicator({ season: false, crop: false, acre: false, startDate: false, endDate: false })
                        setUpdate(false)
                        dispatch(getPlannedCrops()).then(res => {
                            if(res.payload.data.success){
                                instance.refresh()
                            }
                        })
                        notify("Crop Plan Updated", "success", 2000)
                    }
                })
            }
        }
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
                    className='fal fa-pencil treelist-edit-button'
                    onClick={() => handleOnUpdate()} />

                <button
                    title='Delete Plan'
                    className='fal fa-trash treelist-delete-button'
                    onClick={() => dispatch(toggleDeletePopup({ active: true, type:"CROP_PLAN" }))} />
            </ActionCellContainer>
        )
    }

    const renderForm = () => {
        return (
            <Form onSubmit={handleOnSubmit}>
                <FormGroupContainer>
                    <FormGroupItem style={{ marginRight : 15 }}>
                        <FormLabel>Season</FormLabel>
                        <SelectBox invalid={indicator.season} name={"season"} value={formData.season} type="select" className={"form-selectbox"} onChange={handleOnChange}>
                            <Option hidden={true} selected={true}>Select Season</Option>
                            {seasons.map((item) => {
                                return <Option>{item.seasons}</Option>
                            })}
                        </SelectBox>
                    </FormGroupItem>
                
                    <FormGroupItem style={{ marginLeft : 15 }}>
                        <FormLabel>Crop</FormLabel>
                        <SelectBox style={{ opacity: formData.season === "" ? 0.5 : "" }} invalid={indicator.crop} disabled={formData.season === "" ? true : false} name={"crop"} value={formData.crop} type="select" className={"form-selectbox"} onChange={handleOnChange}>
                            <Option hidden={true} selected={true}>Select Crop</Option>
                            {crops.map((item) => {
                                return <Option>{item.name}</Option>
                            })}
                        </SelectBox>
                    </FormGroupItem>

                    <FormGroupItem style={{ marginRight : 15 }}>
                        <FormLabel>Acre</FormLabel>
                        <Input invalid={indicator.acre} placeholder={"Number Of Acre"} name={"acre"} value={formData.acre} type='number' className={'form-textbox'} onChange={handleOnChange} />
                        <Validation show={validAcre}>Acre should be greater then 0 and less then 5000</Validation>
                    </FormGroupItem>
                
                    <FormGroupItem style={{ marginLeft : 15 }}>
                        <FormLabel>Start Date</FormLabel>
                        <DatePicker invalid={indicator.startDate} name={"startDate"} value={formData.startDate} type='date' className={"form-datebox"} onChange={handleOnChange} />
                        <Validation show={validDate}>{message}</Validation>
                    </FormGroupItem>
                
                    <FormGroupItem style={{ marginRight : 15 }}>
                        <FormLabel>End Date</FormLabel>
                        <DatePicker invalid={indicator.endDate} name={"endDate"} value={formData.endDate} type='date' className={"form-datebox"} onChange={handleOnChange} />
                        <Validation show={validDate}>{message}</Validation>
                    </FormGroupItem>
                </FormGroupContainer>
                            
                <FormButtonContainer>
                    <FormButton>{update ? "Update" : "Save"} Plan</FormButton>
                </FormButtonContainer>
            </Form>
        )
    }

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
                    noDataText={'No Plan'}
                    height={"calc(100vh - 430px)"}
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
            </div>
        )
    }

    const renderHeaderCell = (e) => {
        return <span style={{ fontWeight: "bold", fontSize: "14px", color: "black" }}> {e.column.caption} </span>
    }

    return (
        <div>
            <FormBackground Form={renderForm()} />
            <FormBackground Form={renderTreelist()} />
        </div>
    )
}

export default CropsPlanning

const validateChanges = (selectedRow, formData) => {
    const reconstructedStructure = {
        season: selectedRow[0].season,
        crop: selectedRow[0].crop,
        acre: selectedRow[0].acre,
        startdate: moment(selectedRow[0].startdate).format("YYYY-MM-DD"),
        enddate: moment(selectedRow[0].enddate).format("YYYY-MM-DD")
    }

    const keys1 = Object.keys(reconstructedStructure)
    const keys2 = Object.keys(formData)
    
    if (keys1.length !== keys2.length) {
        return true
    }

    for (const key of keys1) {
        if (reconstructedStructure[key] !== formData[key]) {
            return true
        }
    }

    return false
}

const ActionCellContainer = styled.div`
    display: flex;
    font-size: 16px;
    align-items: center;
    justify-content: space-evenly;
`

const Validation = styled.div`
    top: 70px;
    position: absolute;
    left: calc(100% - 305px);
    
    width: 305px;
    padding: 5px;

    cursor: default;
    font-weight: 600;
    border-radius: 5px;
    border: 1px solid red;
    
    color: white;
    background-color: #FF1717D9;
    display: ${(props) => props.show ? "block" : "none"}
`