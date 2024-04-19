import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import notify from 'devextreme/ui/notify'

import { TextBox, SelectBox } from 'devextreme-react'
import { Button, Modal, ModalBody, ModalHeader } from 'reactstrap'

import { toggleCreateResourcePopup } from '../../actions/PopupActions'
import { addResource, getResource, updateResource } from '../../actions/ResourceAction'
import { FormButtonContainer, FormGroupContainer, FormGroupItem, FormLabel } from '../SupportComponents/StyledComponents'

const CreateResource = () => {

    const resourceRef = useSelector(state => state.view.resourceRef)
    const createResource = useSelector(state => state.popup.toggleCreateResourcePopup)

    const [invalid, setInvalid] = useState({ name: false, rType: false })
    const [formData, setFormData] = useState({ name: "", rType: "" })

    const dispatch = useDispatch()

    useEffect(() => {
        if (createResource.type === "UPDATE") {            
            const instance = resourceRef.current.instance
            const selectedRow = instance.getSelectedRowsData()
            
            setFormData({
                name: selectedRow[0].name,
                rType: selectedRow[0].rType
            })        
        }
    }, [createResource.type])

    const toggle = () => {
        setInvalid({ name: false, rType: false })
        dispatch(toggleCreateResourcePopup({ open: false, type: "" }))
        setFormData({ name: "", rType: "" })
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

        const instance = resourceRef.current.instance
        const selectedRow = instance.getSelectedRowsData()

        const task = {
            rId: "",
            name: formData.name,
            rType: formData.rType
        }

        if (formData.name.trim() === "" || formData.rType.trim() === "") {
            return
        }

        if (invalid.name === true || invalid.rType === true) {
            return
        }

        if(createResource.type === "UPDATE"){
            const isUpdated = validateChanges(selectedRow, task)
            if(!isUpdated){
                notify("No Changes Detected", "info", 2000)
                return
            }
        }

        if(createResource.type === "CREATE"){
            dispatch(addResource(task)).then(res => {
                const data = res.payload.data
                if(data.success) {
                    instance.getDataSource().store().insert(data.result)
                    instance.refresh()
                    notify("Resource Create Successfully", "info", 2000)
                }
                else {
                    notify(data.message, "info", 2000)
                }
                toggle()
            })
        }
        else if (createResource.type === "UPDATE") {
            if(selectedRow.length > 0){
                dispatch(updateResource(selectedRow[0].rId, task)).then(res => {
                    const data = res.payload.data
                    if(data.success){
                        instance.getDataSource().store().update(data.result.rId, data.result)
                        instance.refresh()
                        notify("Resource Updated Successfully", "info", 2000)
                    }
                    else {
                        notify(data.message + " ...Refreshing", "info", 2000)
                        setTimeout(() => dispatch(getResource()), 1000)
                    }
                    toggle()
                })
            }
        }
    }

    const renderHeader = () => {
        if (createResource.type === "CREATE") return "Create Resource"
        else if (createResource.type === "UPDATE") return "Update Resource"
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
                            accessKey={'rType'}
                            value={formData.rType}
                            onFocusIn={handleOnFocusIn}
                            placeholder={"Select Resource Type"}
                            onFocusOut={handleOnFocusOut}
                            onValueChanged={(e) => onValueChanged(e, 'rType')}
                            dataSource={["Machine", "Labour"]}
                            validationStatus={invalid.rType === false ? "valid" : "invalid"}
                        />
                    </FormGroupItem>
                </FormGroupContainer>

                <FormButtonContainer style={{ marginTop: 20 }}>
                    <Button size="sm" className={"form-action-button"}>
                        {createResource.type === "UPDATE" ? "Update" : "Create"} Resource
                    </Button>
                    <Button size="sm" className={"form-close-button"} onClick={() => toggle()}>
                        Close
                    </Button>
                </FormButtonContainer>
            </form>
        )
    }

    return (
        <Modal size={"l"} centered={true} backdrop={"static"} isOpen={createResource.open} toggle={toggle}>
            <ModalHeader className={"popup-header"} toggle={toggle}>{renderHeader()}</ModalHeader>
            <ModalBody>{renderBody()}</ModalBody>
        </Modal>
    )
}

export default CreateResource

const validateChanges = (selectedRow, formData) => {

    const { rId, ...task } = formData

    const reconstructedStructure = {
        name: selectedRow[0].name,
        rType: selectedRow[0].rType
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