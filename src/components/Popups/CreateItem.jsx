import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import notify from 'devextreme/ui/notify'

import { Button, Modal, ModalBody, ModalHeader } from 'reactstrap'
import { NumberBox, SelectBox, TextBox, CheckBox } from 'devextreme-react'
import { FormButtonContainer, FormGroupContainer, FormGroupItem, FormLabel } from '../SupportComponents/StyledComponents'

import { addCrops } from '../../actions/CropsActions'
import { toggleCreateItemPopup } from '../../actions/PopupActions'
import { addItemMaster, getItemMaster, updateItemMaster } from '../../actions/ItemActions'
import { addInventory, getInventory, updateInventory } from '../../actions/InventoryAction'

const CreateItem = () => {

    const itemMaster = useSelector(state => state.item.itemMaster)
    const warehouses = useSelector(state => state.warehouse.warehouses)
    const itemMasterRef = useSelector(state => state.view.itemMasterRef)
    const inventory = useSelector(state => state.inventory.inventoryStatus)
    const createItemPopup = useSelector(state => state.popup.toggleCreateItemPopup)

    const [itemType, setItemType] = useState("")
    const [formData, setFormData]= useState({ active: false, itemName:"", itemType:"", valuationRate:"0", sellingRate:"0", UOM:"", season: "", warehouseId: "" })
    const [invalid, setInvalid] = useState({ itemId: false, itemName: false, itemType: false, sellingRate: false, valuationRate: false, UOM: false, season: false, warehouseId: false })
    
    const [warehouseDateSource, setWarehouseDateSource]= useState([])
    
    const dispatch = useDispatch()

    const toggle = () => {
        dispatch(toggleCreateItemPopup({ open: false, type: "" }))

        setItemType("")
        setFormData({ active: false, itemName:"", itemType:"", valuationRate:"", sellingRate:"", UOM:"", season: "", warehouseId: "" })
        setInvalid({ itemId: false, itemName: false, itemType: false, sellingRate: false, valuationRate: false, UOM: false, season: false, warehouseId: false })
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
                season: selectedRow[0].season,
                warehouseId: selectedRow[0].warehouseId
            })
        }
    }, [createItemPopup.type])

    const onValueChanged = (e, name) => {
        let value = e.value
        if (value === null) value = ""

        if (name === "itemType") {
            const warehouse = warehouses.filter((item) => item.wrType === value && item.active === true)
            
            if(warehouse.length !== 0) {
                setWarehouseDateSource(warehouse)
            }
            
            setItemType(value)

            if (value === "Raw Material" && createItemPopup.type === "CREATE") {
                setFormData((prevState) => ({
                    ...prevState,
                    [name]: value,
                    warehouseId: "" ,
                    season: ""
                }))
            }
            else if(value === "Finish Good" && createItemPopup.type === "CREATE") {
                setFormData((prevState) => ({
                    ...prevState,
                    [name]: value,
                    warehouseId: ""
                }))
            }
        }
        else {
            setFormData((prevState) => ({ ...prevState, [name]: value }))
        }
    }

    const onWarehouseChange = (e) => {
        let value = e.value
        if (value === null) value = ""
        
        if(value && typeof value === "object"){
            setFormData((prevState) => ({ ...prevState, warehouseId: value.wrId }))
        }
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

        if (formData.itemName === "" || formData.itemType === "" || formData.UOM === "") {
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
            sellingRate: 0,
            valuationRate: 0,
            disable: formData.active,
            UOM: formData.UOM,
            season: formData.season,
            warehouseId: formData.warehouseId
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

                    const inventoryItem = {
                        "inventoryId": "",
                        "inventoryItem": data.result.itemName,
                        "inventoryQuantity": 0,
                        "inventoryWarehouse": data.result.warehouseId
                    }

                    dispatch(addInventory(inventoryItem))

                    instance.getDataSource().store().insert(data.result).then(() => instance.refresh())                    
                    dispatch(getItemMaster())
                    setWarehouseDateSource([])
                    notify("Item Created Successfully", "info", 2000)
                    toggle()
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
                        
                        if(inventory.some((item) => item.inventoryItem === data.result.itemName)){
                            const item = inventory.find((item) => item.inventoryItem === data.result.itemName)
                            if(item){
                                dispatch(updateInventory(item.inventoryId, {
                                    ...item,
                                    inventoryWarehouse: data.result.warehouseId
                                })).then((done) => {
                                    if(done.payload.data.success){
                                        dispatch(getInventory())
                                    }
                                })
                            }
                        }
                        
                        notify("Item Updated Successfully", "info", 2000)
                        dispatch(getItemMaster())
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

    const renderItems = (e) => {
        return (
            <div style={{ display: "flex", flexDirection: "row", whiteSpace: 'pre-line' }}>
                <span>{e.wrId}</span>
                <span style={{ marginLeft: "auto", }}>
                    {e.name}
                </span>
            </div>
        )
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
                            disabled={itemType === "Finish Good" ? false : true}
                            readOnly={createItemPopup.type !== "CREATE" ? true : false}
                            value={formData.season}
                            openOnFieldClick={true}
                            onFocusIn={handleOnFocusIn}
                            onFocusOut={handleOnFocusOut}
                            placeholder={"Select Season No"}
                            dropDownOptions={{ maxHeight: 300 }}
                            onValueChanged={(e) => onValueChanged(e, 'season')}
                            validationStatus={invalid.season === false || itemType === "Raw Material" ? "valid" : "invalid"}
                        />
                    </FormGroupItem>

                    <FormGroupItem>
                        <FormLabel>Warehouse</FormLabel>
                        <SelectBox
                            elementAttr={{
                                class: "form-selectbox"
                            }}
                            searchTimeout={200}
                            accessKey={'warehouseId'}
                            searchEnabled={true}
                            displayExpr={'wrId'}
                            searchMode={'contains'}
                            searchExpr={'name'}
                            disabled={warehouseDateSource.length === 0 ? true : false}
                            dataSource={warehouseDateSource.filter((wr) => wr.active === true).map(item => {
                                return {
                                    wrId: item.wrId,
                                    name: item.name,
                                    wrType: item.wrType,
                                    active: item.active
                                }
                            })}
                            value={formData.warehouseId}
                            openOnFieldClick={true}
                            acceptCustomValue={true}
                            onFocusIn={handleOnFocusIn}
                            onFocusOut={handleOnFocusOut}
                            placeholder={"Select Warehouse"}
                            dropDownOptions={{ maxHeight: 300 }}
                            itemRender={(e) => renderItems(e)}
                            onValueChanged={(e) => onWarehouseChange(e)}
                            validationStatus={invalid.warehouseId === false ? "valid" : "invalid"}
                        />
                    </FormGroupItem>

                    <div style={{ display: 'flex', marginTop: 5, marginBottom: 5 }}>
                        <FormGroupItem>
                            <FormLabel>UoM</FormLabel>
                            <SelectBox
                                elementAttr={{
                                    class: "form-selectbox"
                                }}
                                width={400}
                                searchTimeout={200}
                                accessKey={'UOM'}
                                searchEnabled={true}
                                searchMode={'contains'}
                                dataSource={["Kg", "Each", "Piece", "Gram" ]}
                                value={formData.UOM}
                                openOnFieldClick={true}
                                onFocusIn={handleOnFocusIn}
                                onFocusOut={handleOnFocusOut}
                                placeholder={"Select UoM"}
                                dropDownOptions={{ maxHeight: 300 }}
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