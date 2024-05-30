import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import notify from 'devextreme/ui/notify'

import { Button, Modal, ModalBody, ModalHeader } from 'reactstrap'
import { NumberBox, SelectBox, TextBox, CheckBox } from 'devextreme-react'
import { FormButtonContainer, FormGroupContainer, FormGroupItem, FormLabel } from '../SupportComponents/StyledComponents'

import { addCrops } from '../../actions/CropsActions'
import { toggleCreateItemPopup } from '../../actions/PopupActions'
import { addItemMaster, getItemMaster, updateItemMaster } from '../../actions/ItemActions'

const CreateItem = () => {

    const itemMaster = useSelector(state => state.item.itemMaster)
    const itemMasterRef = useSelector(state => state.view.itemMasterRef)
    const createItemPopup = useSelector(state => state.popup.toggleCreateItemPopup)

    const [itemType, setItemType] = useState("")
    const [formData,setFormData]= useState ({ active: false, itemName:"", itemType:"", valuationRate:"", sellingRate:"", UOM:"", season: "" })
    const [invalid, setInvalid] = useState({ itemId: false, itemName: false, itemType: false, sellingRate: false, valuationRate: false, UOM: false, season: false })

    const dispatch = useDispatch()

    const toggle = () => {
        dispatch(toggleCreateItemPopup({ open: false, type: "" }))

        setItemType("")
        setFormData({ active: false, itemName:"", itemType:"", valuationRate:"", sellingRate:"", UOM:"", season: "" })
        setInvalid({ itemId: false, itemName: false, itemType: false, sellingRate: false, valuationRate: false, UOM: false, season: false })
    }

    useEffect(() => {
        if (createItemPopup.type === "UPDATE") {            
            const instance = itemMasterRef.current.instance
            const selectedRow = instance.getSelectedRowsData()

            setFormData({
                itemName: selectedRow[0].itemName,
                itemType: selectedRow[0].itemType,
                sellingRate: selectedRow[0].sellingRate,
                valuationRate: selectedRow[0].valuationRate,
                active: selectedRow[0].disable,
                UOM: selectedRow[0].uom,
                season: selectedRow[0].season
            })
        }
    }, [createItemPopup.type])

    const onValueChanged = (e, name) => {
        const value = e.value

        if (name === "itemType") {
            setItemType(value)

            if (value === "Raw Material") {
                setFormData((prevState) => ({
                    ...prevState,
                    [name]: value,
                    season: ""
                }))
                return
            }
        }

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
        
        if (formData[name] === null) {
            formData[name] = ""
        }

        if(name === "itemName"){
            const flag = itemMaster.some(item => item.itemName.toLowerCase() === formData.itemName.toLowerCase())

            if (flag) {
                notify("Item already exists!", "error", 2000)
            }

            setInvalid((prevInvalid) => ({
                ...prevInvalid,
                [name]: formData[name].trim() === "" || flag === true ? true : false
            }))
        }
        else if(name === "season"){
            setInvalid((prevInvalid) => ({
                ...prevInvalid,
                season: itemType === "Finish Good" && formData.season === "" ? true : false
            }))
        }
        else if (name === "sellingRate") {
            let flag = false
            if(parseInt(formData.sellingRate) <= 0){
                flag = true
            }
            setInvalid((prevInvalid) => ({
                ...prevInvalid,
                [name]: setFormateNumber(formData).trim() === "" || flag === true ? true : false,
            }))
        }
        else if (name === "valuationRate") {
            let flag = false
            if(parseInt(formData.valuationRate) <= 0){
                flag = true
            }
            setInvalid((prevInvalid) => ({
                ...prevInvalid,
                [name]: setFormateNumber(formData).trim() === "" || flag === true ? true : false,
            }))
        }
        else {
            setInvalid((prevInvalid) => ({
                ...prevInvalid,
                [name]: formData[name] === "" ? true : false
            }))
        }
    }

    const handleOnSubmit = (e) => {
        e.preventDefault()

        const instance = itemMasterRef.current.instance
        const selectedRow = instance.getSelectedRowsData()

        if (formData.itemName === "" || formData.itemType === "" || setFormateNumber(formData).trim() === "" ||  formData.UOM === "") {
            return notify("Form fields cannot be empty", "error", 2000)
        }

        if (invalid.itemName === true || invalid.itemType === true || invalid.sellingRate === true || invalid.valuationRate === true) {
            return notify("Please correct the invalid fields", "error", 2000)
        }
    
        if (itemType === "Finish Good" && formData.season === "") {
            return
        }

        const item = {
            itemId: "",
            itemName: formData.itemName,
            itemType: formData.itemType,
            sellingRate: formData.sellingRate,
            valuationRate: formData.valuationRate,
            disable: formData.active,
            UOM: formData.UOM,
            season: formData.season
        }

        if (createItemPopup.type === "CREATE") {
            dispatch(addItemMaster(item)).then((res) => {
                const data = res.payload.data
                if(data.success){
                    
                    if (item.itemType === "Finish Good") {
                        const crop = {
                            cropId: data.result.itemId,
                            name: data.result.itemName,
                            season: data.result.season
                        }

                        dispatch(addCrops(crop))
                    }

                    instance.getDataSource().store().insert(data.result).then(() => instance.refresh())                    
                    
                    toggle()
                    notify("Item Created Successfully", "info", 2000)
                }
                else {
                    notify(data.message, "info", 2000)
                }
            })
        }
        else if(createItemPopup.type === "UPDATE"){
            if(selectedRow.length > 0){
                dispatch(updateItemMaster(selectedRow[0].itemId, item)).then(res => {
                    const data = res.payload.data
                    if(data.success){
                        instance.getDataSource().store().update(data.result.itemId, data.result).then(() => instance.refresh())
                        notify("Item Updated Successfully", "info", 2000)
                    }
                    else {
                        notify(data.message + " ...Refreshing", "info", 2000)
                        setTimeout(() => dispatch(getItemMaster()), 1000)
                    }
                    toggle()
                })
            }
        }
    }

    const renderHeader = () => {
        if (createItemPopup.type === "CREATE") return "Create Item"
        else if (createItemPopup.type === "UPDATE") return "Update Item"
    }

    const renderBody = () => {
        return(
            <form onSubmit={handleOnSubmit}>
                <FormGroupContainer>
                    <FormGroupItem>
                        <FormLabel>Item Name</FormLabel>
                        <TextBox
                            elementAttr={{
                                class: "form-textbox"
                            }}
                            accessKey={'itemName'}
                            placeholder='Enter Item Name'
                            onFocusIn={handleOnFocusIn}
                            onFocusOut={handleOnFocusOut}
                            value={formData.itemName}
                            onValueChanged={(e) => onValueChanged(e, 'itemName')}
                            readOnly={createItemPopup.type !== "CREATE" ? true : false}
                            validationStatus={invalid.itemName === false ? "valid" : "invalid"}
                        />
                    </FormGroupItem>
                
                    <FormGroupItem>
                        <FormLabel>Item Type</FormLabel>
                        <SelectBox
                            elementAttr={{
                                class: "form-selectbox"
                            }}
                            searchTimeout={200}
                            accessKey={'itemType'}
                            searchEnabled={true}
                            searchMode={'contains'}
                            searchExpr={'itemType'}
                            readOnly={createItemPopup.type !== "CREATE" ? true : false}
                            dataSource={["Finish Good", "Raw Material" ]}
                            value={formData.itemType}
                            openOnFieldClick={true}
                            acceptCustomValue={true}
                            onFocusIn={handleOnFocusIn}
                            onFocusOut={handleOnFocusOut}
                            placeholder={"Select Product No"}
                            dropDownOptions={{ maxHeight: 300 }}
                            onValueChanged={(e) => onValueChanged(e, 'itemType')}
                            validationStatus={invalid.itemType === false ? "valid" : "invalid"}
                        />
                    </FormGroupItem>
                    
                    <FormGroupItem>
                        <FormLabel>Season</FormLabel>
                        <SelectBox
                            elementAttr={{
                                class: "form-selectbox"
                            }}
                            searchTimeout={200}
                            accessKey={'season'}
                            searchEnabled={true}
                            searchExpr={'season'}
                            searchMode={'contains'}
                            dataSource={["Kharif", "Rabi"]}
                            readOnly={createItemPopup.type !== "CREATE" ? true : false}
                            disabled={itemType === "Finish Good" ? false : true}
                            value={formData.season}
                            openOnFieldClick={true}
                            acceptCustomValue={true}
                            onFocusIn={handleOnFocusIn}
                            onFocusOut={handleOnFocusOut}
                            placeholder={"Select Season No"}
                            dropDownOptions={{ maxHeight: 300 }}
                            onValueChanged={(e) => onValueChanged(e, 'season')}
                            validationStatus={invalid.season === false || itemType === "Raw Material" ? "valid" : "invalid"}
                        />
                    </FormGroupItem>
                    
                    <div style={{ display: 'flex', justifyContent: "space-between", marginTop: 5, marginBottom: 5 }}>
                        <FormGroupItem>
                            <FormLabel>Selling Rate</FormLabel>
                            <NumberBox
                                elementAttr={{
                                    class: "form-numberbox"
                                }}
                                step={1}
                                width={225}
                                type={'number'}
                                accessKey={'sellingRate'}
                                value={formData.sellingRate}
                                onFocusIn={handleOnFocusIn}
                                onFocusOut={handleOnFocusOut}
                                placeholder={"Enter Selling Rate"}
                                onValueChanged={(e) => onValueChanged(e, 'sellingRate')}
                                validationStatus={invalid.sellingRate === false ? "valid" : "invalid"}
                            />
                        </FormGroupItem>

                        <FormGroupItem>
                            <FormLabel>Valuation Rate</FormLabel>
                            <NumberBox
                                elementAttr={{
                                    class: "form-numberbox"
                                }}
                                step={1}
                                width={225}
                                type={'number'}
                                accessKey={'valuationRate'}
                                value={formData.valuationRate}
                                onFocusIn={handleOnFocusIn}
                                onFocusOut={handleOnFocusOut}
                                placeholder={"Enter Valuation Rate"}
                                onValueChanged={(e) => onValueChanged(e, 'valuationRate')}
                                validationStatus={invalid.valuationRate === false ? "valid" : "invalid"}
                            />
                        </FormGroupItem>
                    </div>

                    <div style={{ display: 'flex', justifyContent: "", marginTop: 5, marginBottom: 5 }}>
                        <FormGroupItem>
                            <FormLabel>UoM</FormLabel>
                            <TextBox
                                elementAttr={{
                                    class: "form-textbox"
                                }}
                                width={225}
                                accessKey={'UOM'}
                                placeholder={"Enter UoM"}
                                value={formData.UOM}
                                onFocusIn={handleOnFocusIn}
                                onFocusOut={handleOnFocusOut}
                                onValueChanged={(e) => onValueChanged(e, 'UOM')}
                                validationStatus={invalid.UOM === false ? "valid" : "invalid"}
                            />
                        </FormGroupItem>

                        <FormGroupItem style={{ marginTop: 8, marginLeft: 15 }}>
                            <FormLabel>Disable</FormLabel>  
                            <CheckBox
                                style={{ marginBottom: 7 }}
                                value={formData.active}
                                onValueChanged={(e) => onValueChanged(e, 'active')}
                            />
                        </FormGroupItem>
                    </div>

                    <FormButtonContainer style={{ marginTop: 20 }}>
                        <Button size="sm" className={"form-action-button"}>
                            {createItemPopup.type === "UPDATE" ? "Update" : "Create"} Item
                        </Button>
                        <Button size="sm" className={"form-close-button"} onClick={() => toggle()}>
                            Close
                        </Button>
                    </FormButtonContainer>
                </FormGroupContainer>
            </form>
        )
    }

    return (
        <Modal size={"l"} centered={true} backdrop={"static"} isOpen={createItemPopup.open} toggle={toggle}>
            <ModalHeader className={"popup-header"} toggle={toggle}>{renderHeader()}</ModalHeader>
            <ModalBody>{renderBody()}</ModalBody>
        </Modal>
    )
}

export default CreateItem

const setFormateNumber = (formData) => {
    let result = ''
    if (formData.sellingRate !== null && formData.sellingRate !== undefined) {
        result = formData.sellingRate.toString()
    } 
    else if (formData.valuationRate !== null && formData.valuationRate !== undefined) {
        result = formData.valuationRate.toString()
    }
    return result
}