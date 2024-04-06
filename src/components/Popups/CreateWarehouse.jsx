import React, { useEffect, useState } from 'react'
import { toggleCreateWarehousePopup } from '../../actions/PopupActions'
import { Button, Modal, ModalBody, ModalHeader } from 'reactstrap'
import { useDispatch, useSelector } from 'react-redux'
import notify from 'devextreme/ui/notify'
import { CheckBox, TextBox, SelectBox } from 'devextreme-react'
import { FormButtonContainer, FormGroupContainer, FormGroupItem, FormLabel } from '../SupportComponents/StyledComponents'
import { addWarehouse } from '../../actions/WarehouseAction'

const CreateWarehouse = () => {

    const warehouseRef = useSelector(state => state.view.warehouseRef)
    const createWarehouse = useSelector(state => state.popup.toggleCreateWarehousePopup)

    const [invalid, setInvalid] = useState({ name: false, wrType: false, location: false })
    const [formData, setFormData] = useState({ name: "", wrType: "", location: "", active: false })

    const dispatch = useDispatch()

    useEffect(() => {
        if (createWarehouse.type === "UPDATE") {            
            const instance = warehouseRef.current.instance
            const selectedRow = instance.getSelectedRowsData()
            
            setFormData({
                name: selectedRow[0].name,
                wrType: selectedRow[0].wrType,
                location: selectedRow[0].location,
                active: selectedRow[0].inactive
            })        
        }
    }, [createWarehouse.type])

    const toggle = () => {
        setInvalid({ name: false, wrType: false, location: false })
        dispatch(toggleCreateWarehousePopup({ open: false, type: "" }))
        setFormData({ name: "", wrType: "", location: "", active: true })
    }

    const onValueChanged = (e, name) => {
        const value = e.value
        setFormData((prevState) => ({ ...prevState, [name]: value }))
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
        setInvalid((prevInvalid) => ({
            ...prevInvalid,
            [name]: formData[name].trim() === "" ? true : false,
        }))
    }

    const handleOnSubmit = (e) => {
        e.preventDefault()

        const instance = warehouseRef.current.instance
        const selectedRow = instance.getSelectedRowsData()

        const task = {
            wrId: "",
            name: formData.name,
            wrType: formData.wrType,
            inactive: formData.active,
            location: formData.location
        }

        if (formData.name.trim() === "" || formData.wrType.trim() === "" || formData.location.trim() === "") {
            return
        }

        if (invalid.name === true || invalid.wrType === true || invalid.location === true) {
            return
        }

        if(createWarehouse.type === "UPDATE"){
            const isUpdated = validateChanges(selectedRow, task)
            if(!isUpdated){
                notify("No Changes Detected", "info", 2000)
                return
            }
        }

        if(createWarehouse.type === "CREATE"){
            dispatch(addWarehouse(task)).then(res => {
                const data = res.payload.data
                if(data.success) {
                    instance.getDataSource().store().insert(data.result)
                    instance.refresh()
                    notify("Warehouse Create Successfully", "info", 2000)
                }
                else {
                    notify(data.message, "info", 2000)
                }
                toggle()
            })
        }
        else if (createWarehouse.type === "UPDATE") {
            if(selectedRow.length > 0){
                    // dispatch(updateCropsPlan(selectedRow[0].id, task)).then(res => {
                    //     const data = res.payload.data
                    //     if(data.success){
                    //         instance.getDataSource().store().update(data.result.id, data.result)
                    //         instance.refresh()
                    //         notify("Crop Plan Updated Successfully", "info", 2000)
                    //     }
                    //     else {
                    //         notify(data.message + " ...Refreshing", "info", 2000)
                    //         setTimeout(() => dispatch(getPlannedCrops()), 1000)
                    //     }
                    //     toggle()
                    // })
            }
        }
    }

    const renderHeader = () => {
        if (createWarehouse.type === "CREATE") return "Create Warehouse"
        else if (createWarehouse.type === "UPDATE") return "Update Warehouse"
    }

    const renderBody = () => {
        return (
            <form onSubmit={handleOnSubmit}>
                <FormGroupContainer>
                    <FormGroupItem>
                        <FormLabel>Name</FormLabel>
                        <TextBox
                            elementAttr={{
                                class: "form-textbox"
                            }}
                            accessKey={'name'}
                            value={formData.name}
                            onFocusIn={handleOnFocusIn}
                            placeholder={"Enter Name"}
                            onFocusOut={handleOnFocusOut}
                            onValueChanged={(e) => onValueChanged(e, 'name')}
                            validationStatus={invalid.name === false ? "valid" : "invalid"}
                        />
                    </FormGroupItem>

                    <FormGroupItem>
                        <FormLabel>Type</FormLabel>
                        <SelectBox
                            elementAttr={{
                                class: "form-selectbox"
                            }}
                            accessKey={'wrType'}
                            value={formData.wrType}
                            onFocusIn={handleOnFocusIn}
                            placeholder={"Select Warehouse Type"}
                            onFocusOut={handleOnFocusOut}
                            onValueChanged={(e) => onValueChanged(e, 'wrType')}
                            dataSource={["Quarantine", "Finish Good", "Raw Material"]}
                            validationStatus={invalid.wrType === false ? "valid" : "invalid"}
                        />
                    </FormGroupItem>
                    
                    <div style={{ display: 'flex', justifyContent: "space-between", marginTop: 5, marginBottom: 5 }}>                 
                        <FormGroupItem>
                            <FormLabel>Location</FormLabel>
                            <TextBox
                                elementAttr={{
                                    class: "form-areabox"
                                }}
                                width={225}
                                accessKey={'location'}
                                value={formData.location}
                                onFocusIn={handleOnFocusIn}
                                placeholder={"Enter Location"}
                                onFocusOut={handleOnFocusOut}
                                onValueChanged={(e) => onValueChanged(e, 'location')}
                                validationStatus={invalid.location === false ? "valid" : "invalid"}
                            />
                        </FormGroupItem>
                        
                        <FormGroupItem style={{ marginRight: 160 }}>
                            <FormLabel>Active</FormLabel>
                            <CheckBox
                                style={{
                                    marginBottom: 8
                                }}
                                value={formData.active}
                                onValueChanged={(e) => onValueChanged(e, 'active')}
                            />
                        </FormGroupItem>
                    </div>

                </FormGroupContainer>
                <FormButtonContainer style={{ marginTop: 20 }}>
                    <Button size="sm" className={"form-action-button"}>
                        {createWarehouse.type === "UPDATE" ? "Update" : "Create"} Warehouse
                    </Button>
                    <Button size="sm" className={"form-close-button"} onClick={() => toggle()}>
                        Close
                    </Button>
                </FormButtonContainer>
            </form>
        )
    }

    return (
        <Modal size={"l"} centered={true} backdrop={"static"} isOpen={createWarehouse.open} toggle={toggle}>
            <ModalHeader className={"popup-header"} toggle={toggle}>{renderHeader()}</ModalHeader>
            <ModalBody>{renderBody()}</ModalBody>
        </Modal>
    )
}

export default CreateWarehouse

const validateChanges = (selectedRow, formData) => {

    const { wrId, ...task } = formData

    const reconstructedStructure = {
        name: selectedRow[0].name,
        wrType: selectedRow[0].wrType,
        location: selectedRow[0].location,
        inactive: selectedRow[0].inactive
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