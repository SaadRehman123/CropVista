import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import moment from 'moment/moment'
import notify from 'devextreme/ui/notify'

import { Button, Modal, ModalBody, ModalHeader } from 'reactstrap'
import { DateBox, NumberBox, SelectBox, TextBox } from 'devextreme-react'
import { FormButtonContainer, FormGroupContainer, FormGroupItem, FormLabel } from '../SupportComponents/StyledComponents'

import { toggleCreatePlanPopup } from '../../actions/PopupActions'
import { addCropsPlan, getCropsBySeason, getPlannedCrops, updateCropsPlan } from '../../actions/CropsActions'

const CreatePlan = () => {

    const crops = useSelector(state => state.crops.cropsBySeason)
    const seasons = useSelector(state => state.seasons.getSeasons)
    const cropPlanRef = useSelector(state => state.view.cropPlanRef)
    const plannedCrops = useSelector(state => state.crops.plannedCrops)
    const createPlanPopup = useSelector(state => state.popup.toggleCreatePlanPopup)
    
    const [validationErrors, setValidationErrors] = useState([])
    const [formData, setFormData] = useState({ season: "", crop: "", acre: "", startDate: "", endDate: "", status: "" })
    const [invalid, setInvalid] = useState({ season: false, crop: false, acre: false, startDate: false, endDate: false })
    
    const dispatch = useDispatch()

    useEffect(() => {
        validateStartAndEndDate(formData.startDate, formData.endDate)
    }, [formData.startDate, formData.endDate])
    
    useEffect(() => {
        if (createPlanPopup.type === "UPDATE") {            
            const instance = cropPlanRef.current.instance
            const selectedRow = instance.getSelectedRowsData()
            
            setFormData({
                season: selectedRow[0].season,
                crop: selectedRow[0].crop,
                acre: (selectedRow[0].acre).toString(),
                startDate: selectedRow[0].startdate,
                endDate: selectedRow[0].enddate,
                status: selectedRow[0].status
            })        
        }
    }, [createPlanPopup.type])
    
    const toggle = () => {
        dispatch(toggleCreatePlanPopup({ open: false, type: "" }))
        setFormData({ season: "", crop: "", acre: "", startDate: "", endDate: "", status: "" })
        setInvalid({ season: false, crop: false, acre: false, startDate: false, endDate: false })
    }

    const onValueChanged = (e, name) => {
        const value = e.value
        if (name === "season" && value !== "") dispatch(getCropsBySeason(value))
        setFormData(prevState => {
            const updatedState = { ...prevState, [name]: value }
            if (name === 'startDate' || name === 'endDate') {
                validateStartAndEndDate(updatedState.startDate, updatedState.endDate)
            }
            return updatedState
        })
    }

    const handleOnFocusIn = (e) => {
        const name = e.event.target.accessKey
        setInvalid((prevInvalid) => ({
            ...prevInvalid,
            [name]: false,
        }))
    }

    const handleOnFocusOut = (e) => {
        const name = e.event.target.accessKey
        if(name === "acre"){
            let flag = false
            if(parseInt(formData.acre) < 1 || parseInt(formData.acre) > 5000){
                flag = true
            }
            setInvalid((prevInvalid) => ({
                ...prevInvalid,
                [name]: setFormDataAcre(formData).trim() === "" || flag === true ? true : false,
            }))
        }
        else {
            setInvalid((prevInvalid) => ({
                ...prevInvalid,
                [name]: formData[name].trim() === "" ? true : false,
            }))
        }
    }

    const validateStartAndEndDate = (startDate, endDate) => {
        let flag = false
        const endDateObj = new Date(endDate)
        const startDateObj = new Date(startDate)
            
        if (startDateObj >= endDateObj) {
            flag = true
            setValidationErrors([{ message: "End Date should be greater than Start Date" }])
        }
        else {
            const diffMonths = (endDateObj.getFullYear() - startDateObj.getFullYear()) * 12 + (endDateObj.getMonth() - startDateObj.getMonth())
            if (diffMonths < 3) {
                flag = true
                setValidationErrors([{ message: "Planning period must exceed 3 months" }])
            }
            if (diffMonths > 8) {
                flag = true
                setValidationErrors([{ message: "Planning period must not exceed 8 months" }])
            }
        }
        
        setInvalid(prevInvalid => ({
            ...prevInvalid,
            startDate: flag,
            endDate: flag,
        }))
    }

    const handleOnSubmit = (e) => {
        e.preventDefault()
        
        const instance = cropPlanRef.current.instance
        const selectedRow = instance.getSelectedRowsData()

        if (formData.season.trim() === "" || formData.crop.trim() === "" || setFormDataAcre(formData).trim() === "" || moment(formData.startDate).format("DD/MM/yyyy") === "Invalid date" || moment(formData.endDate).format("DD/MM/yyyy") === "Invalid date") {
            return notify("Form fields cannot be empty", "error", 2000)
        }

        if (invalid.season === true || invalid.acre === true || invalid.crop === true || invalid.startDate === true || invalid.endDate === true) {
            return notify("Please correct the invalid fields", "error", 2000)
        }
        
        const data = crops.find((item) => item.name === formData.crop)

        const task = {
            id: "",
            season: formData.season,
            crop: formData.crop,
            acre: parseInt(formData.acre),
            startdate: moment(formData.startDate).format("YYYY-MM-DD"),
            enddate: moment(formData.endDate).format("YYYY-MM-DD"),
            status: "Pending",
            itemId: data.cropId 
        }

        if(createPlanPopup.type === "UPDATE"){
            const isUpdated = validateChanges(selectedRow, task)
            if(!isUpdated){
                notify("No Changes Detected", "info", 2000)
                return
            }
        }

        if(createPlanPopup.type === "CREATE"){
            dispatch(addCropsPlan(task)).then(res => {
                const data = res.payload.data
                if(data.success) {
                    instance.getDataSource().store().insert(data.result)
                    instance.refresh()
                    notify("Crop Plan Create Successfully", "info", 2000)
                }
                else {
                    notify(data.message, "info", 2000)
                }
                toggle()
            })
        }
        else if (createPlanPopup.type === "UPDATE") {
            if(selectedRow.length > 0){
                dispatch(updateCropsPlan(selectedRow[0].id, task)).then(res => {
                    const data = res.payload.data
                    if(data.success){
                        instance.getDataSource().store().update(data.result.id, data.result)
                        instance.refresh()
                        notify("Crop Plan Updated Successfully", "info", 2000)
                    }
                    else {
                        notify(data.message + " ...Refreshing", "info", 2000)
                        setTimeout(() => dispatch(getPlannedCrops()), 1000)
                    }
                    toggle()
                })
            }
        }
    }

    const renderHeader = () => {
        if (createPlanPopup.type === "CREATE") return "Create Plan"
        else if (createPlanPopup.type === "UPDATE") return "Update Plan"
    }

    const renderBody = () => {

        const dataSource = crops.filter(item => {
            const cropPlans = plannedCrops.filter(cropItem => cropItem.itemId === item.cropId)
            if(cropPlans.length === 0){
                return cropPlans
            }
            else {
                const hasClosedOrCancelled = cropPlans.some(cropItem => ["Closed", "Cancelled"].includes(cropItem.status))
                const hasExcludedStatuses = cropPlans.some(cropItem => ["Pending", "Planned", "Release", "Completed"].includes(cropItem.status))
            
                return hasClosedOrCancelled && !hasExcludedStatuses
            }
        }).map(item => item.name)
        
        return (
            <form onSubmit={handleOnSubmit}>
                <FormGroupContainer>
                    <FormGroupItem>
                        <FormLabel>Season</FormLabel>
                        <SelectBox
                            elementAttr={{
                                class: "form-selectbox"
                            }}
                            accessKey={'season'}
                            value={formData.season}
                            onFocusIn={handleOnFocusIn}
                            placeholder={"Select Season"}
                            onFocusOut={handleOnFocusOut}
                            onValueChanged={(e) => onValueChanged(e, 'season')}
                            readOnly={createPlanPopup.type === "UPDATE" ? true : false}
                            dataSource={ seasons.map((item) => { return item.seasons }) }
                            validationStatus={invalid.season === false ? "valid" : "invalid"}
                        />
                    </FormGroupItem>
                
                    <FormGroupItem>
                        <FormLabel>Crop</FormLabel>
                        {createPlanPopup.type !== "UPDATE" ? 
                            <SelectBox
                                elementAttr={{
                                    class: "form-selectbox"
                                }}
                                accessKey={'crop'}
                                value={formData.crop}
                                dataSource={dataSource}
                                placeholder={"Select Crop"}
                                onFocusIn={handleOnFocusIn}
                                onFocusOut={handleOnFocusOut}
                                onValueChanged={(e) => onValueChanged(e, 'crop')}
                                disabled={formData.season === "" ? true : false}
                                readOnly={createPlanPopup.type === "UPDATE" ? true : false}
                                validationStatus={invalid.crop === false ? "valid" : "invalid"}
                            /> 
                            : 
                            <TextBox
                                elementAttr={{
                                    class: "form-textbox"
                                }}
                                readOnly={true}
                                accessKey={'crop'}
                                placeholder='Select Crop'
                                value={formData.crop}
                            />
                        }
                    </FormGroupItem>

                    <FormGroupItem>
                        <FormLabel>Acre</FormLabel>
                        <NumberBox 
                            elementAttr={{
                                class: "form-numberbox"
                            }}
                            step={1}
                            accessKey={'acre'}
                            value={formData.acre}
                            onFocusIn={handleOnFocusIn}
                            onFocusOut={handleOnFocusOut}
                            placeholder={"Enter Acre i.e (1 - 5000)"}
                            onValueChanged={(e) => onValueChanged(e, 'acre')}
                            validationStatus={invalid.acre === false ? "valid" : "invalid"}
                        />
                    </FormGroupItem>
                
                    <div style={{ display: 'flex', justifyContent: "space-between", marginTop: 5, marginBottom: 5 }}>
                        <FormGroupItem>
                            <FormLabel>Start Date</FormLabel>
                            <DateBox
                                elementAttr={{
                                    class: "form-datebox",
                                }}
                                width={225}
                                type={"date"}
                                min={new Date()}
                                accessKey={'startDate'}
                                openOnFieldClick={true}
                                value={formData.startDate}
                                placeholder={"DD/MM/YYYY"}
                                displayFormat={"dd/MM/yyyy"}
                                validationErrors={validationErrors}
                                validationMessagePosition={"bottom"}
                                onValueChanged={(e) => onValueChanged(e, 'startDate')}
                                validationStatus={invalid.startDate === false ? "valid" : "invalid"}
                            />
                        </FormGroupItem>
                    
                        <FormGroupItem>
                            <FormLabel>End Date</FormLabel>
                            <DateBox
                                elementAttr={{
                                    class: "form-datebox"
                                }}
                                width={225}
                                type={"date"}
                                min={new Date()}
                                accessKey={'endDate'}
                                openOnFieldClick={true}
                                value={formData.endDate}
                                placeholder={"DD/MM/YYYY"}
                                displayFormat={"dd/MM/yyyy"}
                                validationErrors={validationErrors}
                                validationMessagePosition={"bottom"}
                                onValueChanged={(e) => onValueChanged(e, 'endDate')}
                                validationStatus={invalid.endDate === false ? "valid" : "invalid"}
                            />
                        </FormGroupItem>
                    </div>
                </FormGroupContainer>
                <FormButtonContainer style={{ marginTop: 20 }}>
                    <Button size="sm" className={"form-action-button"}>
                        {createPlanPopup.type === "UPDATE" ? "Update" : "Create"} Plan
                    </Button>
                    <Button size="sm" className={"form-close-button"} onClick={() => toggle()}>
                        Close
                    </Button>
                </FormButtonContainer>
            </form>
        )
    }

    return (
        <Modal size={"l"} centered={true} backdrop={"static"} isOpen={createPlanPopup.open} toggle={toggle}>
            <ModalHeader className={"popup-header"} toggle={toggle}>{renderHeader()}</ModalHeader>
            <ModalBody>{renderBody()}</ModalBody>
        </Modal>
    )
}

export default CreatePlan

const setFormDataAcre = (formData) => {
    if (formData.acre === null || formData.acre === undefined) return ''
    else return formData.acre.toString()
}

const validateChanges = (selectedRow, formData) => {

    const { id, ...task } = formData

    const reconstructedStructure = {
        season: selectedRow[0].season,
        crop: selectedRow[0].crop,
        acre: selectedRow[0].acre,
        startdate: moment(selectedRow[0].startdate).format("YYYY-MM-DD"),
        enddate: moment(selectedRow[0].enddate).format("YYYY-MM-DD"),
        status: selectedRow[0].status
    }

    const keys1 = Object.keys(reconstructedStructure)
    const keys2 = Object.keys(task)
    
    if (keys1.length !== keys2.length) {
        return true
    }

    for (const key of keys1) {
        if (reconstructedStructure[key] !== task[key]) {
            return true
        }
    }

    return false
}