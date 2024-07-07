import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import moment from 'moment'
import notify from 'devextreme/ui/notify'
import DataSource from 'devextreme/data/data_source'
import CreateJobCard from '../../Popups/CreateJobCard'
import FormBackground from '../../SupportComponents/FormBackground'

import { Button } from 'reactstrap'
import { Badge, Progress } from 'reactstrap'
import { DateBox, NumberBox, SelectBox, TextBox } from 'devextreme-react'
import TreeList, { Column, Editing, Scrolling, Selection } from 'devextreme-react/tree-list'
import { CellContainer, CellContent, FormButtonContainer, FormGroupContainer, FormGroupItem, FormLabel } from '../../SupportComponents/StyledComponents'

import { assignClientId } from '../../../utilities/CommonUtilities'
import { setProductionOrderItemResource } from '../../../actions/ViewActions'
import { getPlannedCrops, updateCropsPlan } from '../../../actions/CropsActions'
import { addInventory, updateInventory } from '../../../actions/InventoryAction'
import { addStockEntries, getStockEntries } from '../../../actions/StockEntriesAction'
import { toggleCreateJobCardPopup, toggleLowSupplyPopup } from '../../../actions/PopupActions'
import { addPoRouteStages, addProductionOrder, getProductionOrder, updatePoRouteStages, updateProductionOrder } from '../../../actions/ProductionOrderAction'

import styled from 'styled-components'

const CreateProductionOrder = () => {

    const bom = useSelector(state => state.bom.Bom)
    const plannedCrops = useSelector(state => state.crops.plannedCrops)
    const inventory = useSelector(state => state.inventory.inventoryStatus)
    const productionOrder = useSelector(state => state.production.productionOrder)
    const productionOrderAction = useSelector(state => state.production.productionOrderAction)

    const [formData, setFormData] = useState({ itemId: "", productDescription: "", quantity: "", productionStdCost: "", status: "", startDate: "", endDate: "", warehouseId: "" })

    const [save, setSave] = useState(false)
    const [close, setClose] = useState(false)
    const [release, setRelease] = useState(false)
    const [complete, setComplete] = useState(false)
    const [treeListData, setTreeListData] = useState([])
    const [selectedItem, setSeletctedItem] = useState("")

    const dispatch = useDispatch()
    const treelistRef = useRef()

    const itemResourceDatasource = new DataSource({
        store: {
            data: assignClientId(treeListData.sort((a, b) => a.PO_RouteStage - b.PO_RouteStage)),
            type: 'array',
            key: 'clientId',
        }
    })

    useEffect(() => {
        if (formData.status === "Release") {
            setRelease(true)
        }
    }, [formData])

    useEffect(() => {
        if (formData.status === "Closed") {
            setClose(true)
        }
    }, [formData])

    useEffect(() => {
        const item = productionOrder.find((item) => item.productionNo === formData.itemId && item.status === "Planned")        
        if(item && item.productionOrderId !== "" && item.status !== "Release"){
            setSave(true)
        }
    }, [formData])
    
    useEffect(() => {
        if (treeListData.length > 0 && treeListData.every(item => item.PO_Status === "Completed")) {
            setComplete(true)
        }
    }, [treeListData])

    useEffect(() => {
        dispatch(setProductionOrderItemResource(treelistRef))
    }, [])

    useEffect(() => {
        if (productionOrderAction.type === "UPDATE") {
            setFormData({
                itemId: productionOrderAction.node.data.productionNo, 
                productDescription: productionOrderAction.node.data.productDescription, 
                quantity: productionOrderAction.node.data.quantity, 
                productionStdCost: productionOrderAction.node.data.productionStdCost, 
                startDate: productionOrderAction.node.data.startDate, 
                endDate: productionOrderAction.node.data.endDate,
                warehouseId: productionOrderAction.node.data.warehouse,
                status: productionOrderAction.node.data.status
            })

            setSeletctedItem(productionOrderAction.node.data.productionNo)
        }
    }, [productionOrderAction.type])

    useEffect(() => {
        const order = productionOrder.find((item) => item.productionNo === formData.itemId && item.status === "Release")
        if (order && treeListData.length > 0 && treeListData.every(item => item.PO_Status === "Completed")) {
            const pOrder = productionOrder.find((item) => item.productionOrderId === treeListData[0].PO_productionOrderId)
            if(pOrder){
                const { children, ...rest } = pOrder
                const obj = {
                    ...rest,
                    status: "Completed"
                }

                dispatch(updateProductionOrder(obj, obj.productionOrderId)).then((res) => {
                    const data = res.payload.data
                    if(data.success){
                        setFormData((prev) => ({
                            ...prev,
                            status: "Completed"
                        }))

                        const result = data.result
                        if (plannedCrops.some(plannedCrop => plannedCrop.itemId === result.productionNo)) {
                            const crop = plannedCrops.filter(plannedCrop => plannedCrop.itemId === result.productionNo && plannedCrop.status !== "Closed" && plannedCrop.status !== "Completed" && plannedCrop.status !== "Cancelled")
                            
                            if(crop && crop.length > 0){
                                crop.forEach((crop) => {
                                    let dataX = {
                                        "id": crop.id,
                                        "season": crop.season,
                                        "crop": crop.crop,
                                        "acre": crop.acre,
                                        "startdate": crop.startdate,
                                        "enddate": crop.enddate,
                                        "status": "Completed",
                                        "itemId" : crop.itemId
                                    }

                                    dispatch(updateCropsPlan(dataX.id, dataX))
                                })

                                dispatch(getPlannedCrops())
                            }
                        }

                        notify("Production Order Completed", "info", 2000)
                    }
                })
            }
        }
    }, [treeListData])

    useEffect(() => {
        const array = productionOrder.filter((item) => item.productionNo === selectedItem && item.status !== "Closed" && item.status !== "Cancelled")
        
        if (array && array.length > 0) {
            const dataSource = array[0].children.map((child) => ({
                PO_productionOrderId: child.pO_productionOrderId,
                PO_RouteStageId : child.pO_RouteStageId,
                PO_RouteStage: child.pO_RouteStage,
                PO_Type : child.pO_Type,
                PO_ItemNo : child.pO_ItemNo,
                PO_ItemDescription : child.pO_ItemDescription,
                PO_Quantity: child.pO_Quantity,
                PO_Uom : child.pO_Uom,
                PO_WarehouseId : child.pO_WarehouseId,
                PO_UnitPrice : child.pO_UnitPrice,
                PO_Total : child.pO_Total,
                PO_Status : child.pO_Status
            }))
            
            setTreeListData(dataSource)
        }
        else {
            const product = bom.find((item) => item.productId === selectedItem)
            if(product) {
                const dataSource = product.children.map((child) => ({
                    PO_RouteStageId : "",
                    PO_RouteStage: child.routeSequence,
                    PO_Type : child.type,
                    PO_ItemNo : child.id,
                    PO_ItemDescription : child.name,
                    PO_Quantity: child.itemquantity,
                    PO_Uom : child.uom,
                    PO_WarehouseId : child.warehouseId,
                    PO_UnitPrice : child.unitPrice,
                    PO_Total : child.total,
                    PO_Status : "Pending"
                }))
                
                setTreeListData(dataSource)
            }
        }
        
    }, [productionOrder, selectedItem])

    useEffect(() => {
        const calculateRequiredQuantities = (treeListData) => {
            const requiredQuantities = {}
    
            treeListData.forEach(item => {
                if (!item.PO_ItemNo.startsWith("RE")) {
                    if (!requiredQuantities[item.PO_ItemDescription]) {
                        requiredQuantities[item.PO_ItemDescription] = {
                            itemId: item.PO_ItemNo,
                            requiredQuantity: 0,
                            uom: item.PO_Uom
                        }
                    }
                    requiredQuantities[item.PO_ItemDescription].requiredQuantity += item.PO_Quantity
                }
            })
    
            return requiredQuantities
        }
    
        const getAvailableQuantities = (inventory) => {
            const availableQuantities = {}
    
            inventory.forEach(item => {
                availableQuantities[item.inventoryItem] = {
                    inventoryId: item.inventoryId,
                    availableQuantity: item.inventoryQuantity
                }
            })
    
            return availableQuantities
        }
    
        const filterAvailableQuantities = (availableQuantities, requiredQuantities) => {
            const filteredAvailableQuantities = {}
    
            for (const item in requiredQuantities) {
                if (availableQuantities[item] !== undefined) {
                    filteredAvailableQuantities[item] = availableQuantities[item]
                }
            }
    
            return filteredAvailableQuantities
        }
    
        const findLowSupplyItems = (requiredQuantities, filteredAvailableQuantities) => {
            const lowSupplyItems = []
    
            for (const item in requiredQuantities) {
                const requiredQuantity = requiredQuantities[item].requiredQuantity
                const availableQuantity = filteredAvailableQuantities[item].availableQuantity
    
                if (requiredQuantity > availableQuantity) {
                    lowSupplyItems.push({
                        itemName: item,
                        itemId: requiredQuantities[item].itemId,
                        itemQuantity: requiredQuantity,
                        availableQuantity: availableQuantity,
                        uom: requiredQuantities[item].uom,
                        pR_itemId: "",
                        pR_Id: ""
                    })
                }
            }
    
            return lowSupplyItems
        }
    
        const availableQuantities = getAvailableQuantities(inventory)
        const requiredQuantities = calculateRequiredQuantities(treeListData.filter((item) => item.PO_Status === "Pending"))
        const filteredAvailableQuantities = filterAvailableQuantities(availableQuantities, requiredQuantities)
        const lowSupplyItems = findLowSupplyItems(requiredQuantities, filteredAvailableQuantities)
            
        if (lowSupplyItems.length !== 0) dispatch(toggleLowSupplyPopup({ active: true, arr: lowSupplyItems, body: (
            <>
                <p>The following Supplies are running low</p>
                <h6>Avaiable Quantity</h6>
                <ul style={{ listStyleType: 'disc', paddingLeft: 17 }}>
                    {lowSupplyItems.map((item, index) => (
                        <li key={index} style={{ color: "#444", fontSize: "14px", fontWeight: "700" }}>Item: {item.itemName} || Quantity: {item.availableQuantity}</li>
                    ))}
                </ul>
                <hr />
                <h6>Required Quantity</h6>
                <ul style={{ listStyleType: 'disc', paddingLeft: 17 }}>
                    {lowSupplyItems.map((item, index) => (
                        <li key={index} style={{ color: "#444", fontSize: "14px", fontWeight: "700" }}>Item: {item.itemName} || Quantity: {item.itemQuantity}</li>
                    ))}
                </ul>
            </>
        )}))

    }, [formData])
    

    const onValueChanged = (e) => {
        const value = e.value
        
        if (typeof value === 'object') {
            const product = bom.find((item) => item.productId === value.itemId)
            const cropPlan = plannedCrops.find((item) => item.itemId === product.productId)

            setSeletctedItem(value.itemId)

            if (product && cropPlan) {
                setFormData({
                    itemId: value.itemId,
                    productDescription: product.productDescription,
                    quantity: product.quantity,
                    productionStdCost: product.productionStdCost, 
                    status: product.bomStatus, 
                    startDate: cropPlan.startdate,
                    endDate: cropPlan.enddate,
                    warehouseId: product.wrId,
                    status: "Draft"
                })
            }
        }
    }

    const renderItems = (e, type) => {
        if(type === "product"){
            return (
                <div style={{ display: "flex", flexDirection: "row", whiteSpace: 'pre-line' }}>
                    <span>{e.itemId}</span>
                    <span style={{ marginLeft: "auto", }}>
                        {e.crop}
                    </span>
                </div>
            )
        }
        else if (type === "warehouse") {
            return (
                <div style={{ display: "flex", flexDirection: "row", whiteSpace: 'pre-line' }}>
                    <span>{e.wrId}</span>
                    <span style={{ marginLeft: "auto", }}>
                        {e.name}
                    </span>
                </div>
            )
        }
    }

    const handleOnSubmit = (e) => {
        e.preventDefault()
        
        if(formData.itemId === "" || formData.productDescription === "" || formData.quantity === "" || formData.productionStdCost === "" || formData.status === "" || formData.startDate === "" || formData.endDate === "" || formData.warehouseId === "" ) {
            return notify("Form fields cannot be empty", "error", 2000)
        }

        for (const row of treeListData) {
            if (row.PO_Quantity <= 0 || row.PO_Total <= 0) {
                return notify("Some rows have incomplete or incorrect info please fix them before saving", "error", 2000)
            }
        }

        const productionOrder = {
            productionOrderId: "",
            productionNo: formData.itemId,
            productDescription: formData.productDescription,
            productionStdCost: formData.productionStdCost,
            quantity: formData.quantity,
            status: "Planned",
            currentDate: moment(Date.now()).format('YYYY-MM-DD'),
            startDate: moment(formData.startDate).format('YYYY-MM-DD'),
            endDate: moment(formData.endDate).format('YYYY-MM-DD'),
            warehouse: formData.warehouseId,
            productionId: "",
        }

        dispatch(addProductionOrder(productionOrder)).then((res) => {
            const data = res.payload.data
            const routeStageData = treeListData.map((item) => {
                item.PO_productionOrderId = data.result.productionOrderId
                return item
            })

            if(data.success) {
                dispatch(addPoRouteStages(routeStageData)).then((resX) => {
                    const data = resX.payload.data
                    if(data.success) {
                        setFormData((prev) => ({
                            ...prev,
                            status: "Planned"
                        }))

                        const updatedTreeListData = treeListData.map((item, index) => {
                            const resultItem = data.result[index]
                            return {
                                ...item,
                                PO_RouteStageId: resultItem.pO_RouteStageId
                            }
                        })

                        setTreeListData(updatedTreeListData)
                        setSave(true)

                        dispatch(getProductionOrder(0)).then((res) => {
                            const data = res.payload.data.result
                            data.forEach((dataItem) => {
                                if (dataItem.status === "Planned" && plannedCrops.some(plannedCrop => plannedCrop.itemId === dataItem.productionNo)) {
                                    const crop = plannedCrops.filter(plannedCrop => plannedCrop.itemId === dataItem.productionNo && plannedCrop.status !== "Closed" && plannedCrop.status !== "Completed" && plannedCrop.status !== "Cancelled")

                                    if(crop && crop.length > 0){
                                        crop.forEach((crop) => {
                                            let dataX = {
                                                "id": crop.id,
                                                "season": crop.season,
                                                "crop": crop.crop,
                                                "acre": crop.acre,
                                                "startdate": crop.startdate,
                                                "enddate": crop.enddate,
                                                "status": "Planned",
                                                "itemId" : crop.itemId
                                            }

                                            dispatch(updateCropsPlan(dataX.id, dataX))
                                        })
                                        dispatch(getPlannedCrops())
                                    }
                                }
                            })
                        })

                        notify("Production Order Created Successfully", "info", 2000)
                    }
                })
            }
            else {
                notify(data.message, "info", 2000)
            }
        })
    }

    const handleOnCellPrepared = (e) => {
        if (e.rowType === "data") {
            if (e.column.dataField === "PO_Quantity" || e.column.dataField === "PO_Total") {
                if (e.value < 0 || (e.values[4] * e.values[7]) < 0) {
                    e.cellElement.style.setProperty("background-color", "#ff00004f", "important")
                }
            }
        }
    }

    const handleOnEditorPreparing = (e) => {
        if (e.parentType !== "dataRow" || (e.dataField !== "PO_Quantity")) return

        if (e.row.node.data.PO_Status === "Completed") {
            e.editorOptions.disabled = true
        }
    }

    const handleOnSaved = (e) => {
        const data = e.changes[0].data
        if (data.PO_RouteStageId && data.PO_Status !== "Completed"){
            dispatch(updatePoRouteStages(data, data.PO_RouteStageId)).then((res) => {
                if (res.payload.data.success) {
                    const updatedItem = res.payload.data.result
                    
                    setTreeListData(prevData => 
                        prevData.map(item => 
                            item.id === updatedItem.id ? { ...item, ...updatedItem } : item
                        )
                    )
                    
                    notify("Route Stage Updated Successfully", "info", 2000)
                }
            })
        }
        else {
            setTreeListData(prevData => 
                prevData.map(item => 
                    item.clientId === data.clientId ? { ...item, ...data } : item
                )
            )
        }
    }

    const ProgressBar = useCallback(() => {
        const totalRows = treeListData.length
        const completedRows = treeListData.filter(item => item.PO_Status === 'Completed').length
        const progress = (completedRows / totalRows) * 100

        return (
            <Progress multi style={{ height: 25 }}>
                <Progress animated bar color="success" value={isNaN(progress) ? 0 : progress}>{`${progress.toFixed(0)}%`}</Progress>
            </Progress>
        )
    }, [productionOrder])

    const handleOnFocusOut = (e) => {
        const name = e.event.target.accessKey

        if(name === "itemId"){
            setFormData((prev) => ({
                ...prev,
                [name]: selectedItem
            }))
        }
    }

    const handleOnStart = () => {
        dispatch(getProductionOrder(0))
        dispatch(toggleCreateJobCardPopup(true))
    }

    const handleOnReleaseProduction = () => {
        setRelease(true)
        const pOrder  = productionOrder.find((item) => item.productionOrderId === treeListData[0].PO_productionOrderId)
        if(pOrder){
            const { children, ...rest } = pOrder
            const obj = {
                ...rest,
                status: "Release"
            }

            dispatch(updateProductionOrder(obj, obj.productionOrderId)).then((res) => {
                if(res.payload.data.success){
                    setFormData((prev) => ({
                        ...prev,
                        status: "Release"
                    }))

                    const result = res.payload.data.result
                    if (plannedCrops.some(plannedCrop => plannedCrop.itemId === result.productionNo)) {
                        const crop = plannedCrops.filter(plannedCrop => plannedCrop.itemId === result.productionNo && plannedCrop.status !== "Closed" && plannedCrop.status !== "Completed" && plannedCrop.status !== "Cancelled")

                        if(crop && crop.length > 0){
                            crop.forEach((crop) => {
                                let dataX = {
                                    "id": crop.id,
                                    "season": crop.season,
                                    "crop": crop.crop,
                                    "acre": crop.acre,
                                    "startdate": crop.startdate,
                                    "enddate": crop.enddate,
                                    "status": "Release",
                                    "itemId": crop.itemId
                                }

                                dispatch(updateCropsPlan(dataX.id, dataX))
                            })

                            dispatch(getPlannedCrops())
                        }
                    }
                    
                    notify("Production Order Release", "info", 2000)
                }
            })
        }
    }

    const handleOnCloseProduction = () => {
        const pOrder = productionOrder.find((item) => item.productionOrderId === treeListData[0].PO_productionOrderId)

        if(pOrder){
            const { children, ...rest } = pOrder
            const obj = {
                ...rest,
                status: "Closed"
            }

            dispatch(updateProductionOrder(obj, obj.productionOrderId)).then((res) => {
                const data = res.payload.data
                if(data.success){
                    setFormData((prev) => ({
                        ...prev,
                        status: "Closed"
                    }))

                    const result = data.result

                    const stockEntries = {
                        StockEntryId : "",
                        StockEntryName : result.productDescription,
                        StockEntryWarehouse : result.warehouse,
                        StockEntryQuantity : result.quantity,
                        StockEntryTo: "Inventory",
                        StockEntryDate: moment(Date.now()).format('YYYY-MM-DD'),
                        ProductionOrderId: result.productionOrderId
                    }

                    if(inventory.some((item) => item.inventoryItem === result.productDescription)){
                        const item = inventory.find((item) => item.inventoryItem === result.productDescription)
                        if(item){
                            dispatch(updateInventory(item.inventoryId, {
                                ...item,
                                inventoryQuantity: item.inventoryQuantity + result.quantity
                            }))
                        }
                    }
                    else {
                        const item = {
                            "inventoryId": "",
                            "inventoryItem": result.productDescription,
                            "inventoryQuantity": result.quantity,
                            "inventoryWarehouse": result.warehouse
                        }

                        dispatch(addInventory(item))
                    }

                    dispatch(addStockEntries(stockEntries)).then((resX) => {
                        if(resX.payload.data.success) dispatch(getStockEntries())
                    })

                    if (plannedCrops.some(plannedCrop => plannedCrop.itemId === result.productionNo)) {
                        const crop = plannedCrops.filter(plannedCrop => plannedCrop.itemId === result.productionNo  && plannedCrop.status !== "Closed" && plannedCrop.status !== "Cancelled")

                        if(crop && crop.length > 0){
                            crop.forEach((crop) => {
                                let dataX = {
                                    "id": crop.id,
                                    "season": crop.season,
                                    "crop": crop.crop,
                                    "acre": crop.acre,
                                    "startdate": crop.startdate,
                                    "enddate": crop.enddate,
                                    "status": "Closed",
                                    "itemId": crop.itemId
                                }

                                dispatch(updateCropsPlan(dataX.id, dataX))
                            })

                            dispatch(getPlannedCrops())
                        }
                    }

                    notify("Production Order Closed", "info", 2000)
                }
            })
        }
    }

    const renderForm = () => {
        return(
            <Fragment>
                <Header>
                    <HeaderSpan>Create Production Order</HeaderSpan>
                    <div style={{ display: "flex", justifyContent: "space-around" }}>
                        <Button size="sm" disabled={handleOnDisable(treeListData, save, release)} className={"form-action-button"} onClick={() => handleOnReleaseProduction()}>
                            <i style={{marginRight: 10}} className='fas fa-check-circle' />
                            Release Production
                        </Button>
                        
                        <Button size="sm" style={{ marginLeft: 10 }} disabled={!release || complete ? true : false} className={"form-action-button"} onClick={() => handleOnStart()}>
                            <i style={{marginRight: 10}} className='fas fa-play' />
                            Start Production
                        </Button>

                        {complete && close === false && (
                            <Button size="sm" color={"danger"} style={{ marginLeft: 10 }} onClick={() => handleOnCloseProduction()}>
                                <i style={{marginRight: 10}} className='fas fa-times-circle' />
                                Close Production
                            </Button>
                        )}
                    </div>
                </Header>

                <div style={{ margin: 10 }}>{ProgressBar()}</div>

                <form onSubmit={handleOnSubmit}>
                    <FormGroupContainer>
                        <div style={{ display: 'flex', justifyContent: "", marginTop: 5, marginBottom: 5 }}>
                            <div style={{width: 500, margin: "0 20px 20px 20px"}}>
                                <FormGroupItem>
                                    <FormLabel>Product No</FormLabel>
                                    {productionOrderAction.type !== "UPDATE" ? 
                                        <SelectBox
                                            elementAttr={{
                                                class: "form-selectbox"
                                            }}
                                            searchTimeout={200}
                                            accessKey={'itemId'}
                                            searchEnabled={true}
                                            readOnly={save || productionOrderAction.type === "UPDATE" ? true : false}
                                            displayExpr={'itemId'}
                                            searchMode={'contains'}
                                            searchExpr={'itemName'}
                                            dataSource={plannedCrops.filter((item) => bom.some(bomItem => bomItem.productId === item.itemId) && item.status === "Pending")}
                                            openOnFieldClick={true}
                                            value={formData.itemId}
                                            acceptCustomValue={true}
                                            onFocusOut={handleOnFocusOut}
                                            placeholder={"Select Product No"}
                                            dropDownOptions={{ maxHeight: 300 }}
                                            itemRender={(e) => renderItems(e, "product")}
                                            onValueChanged={(e) => onValueChanged(e)}
                                        />
                                        : 
                                        <TextBox
                                            elementAttr={{
                                                class: "form-textbox"
                                            }}
                                            readOnly={true}
                                            accessKey={'itemId'}
                                            placeholder='Select Product No'
                                            value={formData.itemId}
                                        />
                                    }
                                </FormGroupItem>
                            
                                <FormGroupItem>
                                    <FormLabel>Product Description</FormLabel>
                                    <TextBox
                                        elementAttr={{
                                            class: "form-textbox"
                                        }}
                                        readOnly={true}
                                        accessKey={'productDescription'}
                                        value={formData.productDescription}
                                        placeholder={'Product Description'}
                                    />
                                </FormGroupItem>

                                <FormGroupItem>
                                    <FormLabel>Quantity</FormLabel>
                                    <NumberBox
                                        elementAttr={{
                                            class: "form-numberbox"
                                        }}
                                        type={"number"}
                                        value={formData.quantity}
                                        readOnly={true}
                                        accessKey={'quantity'}
                                        placeholder={"Enter Quantity"}
                                    />
                                </FormGroupItem>

                                <FormGroupItem>
                                    <FormLabel>Production Std Cost</FormLabel>
                                    <NumberBox
                                        elementAttr={{
                                            class: "form-numberbox"
                                        }}
                                        type={"number"}
                                        readOnly={true}
                                        value={formData.productionStdCost}
                                        accessKey={'productionStdCost'}
                                        placeholder={"Enter Production Std Cost"}
                                    />
                                </FormGroupItem>

                                <FormGroupItem>
                                    <FormLabel>Status</FormLabel>
                                    <TextBox
                                        elementAttr={{
                                            class: "form-textbox"
                                        }}
                                        readOnly={true}
                                        accessKey={'status'}
                                        value={formData.status}
                                        placeholder={'Status'}
                                    />
                                </FormGroupItem>
                            </div>
                            <div style={{width: 500, margin: "0 20px"}}>
                                <FormGroupItem>
                                    <FormLabel>Current Date</FormLabel>
                                    <TextBox
                                        elementAttr={{
                                            class: "form-textbox"
                                        }}
                                        readOnly={true}
                                        accessKey={'productDescription'}
                                        value={moment(Date.now()).format("DD/MM/yyyy")}
                                        placeholder={'Product Description'}
                                    />
                                </FormGroupItem>

                                <FormGroupItem>
                                    <FormLabel>Start Date</FormLabel>
                                    <DateBox
                                        elementAttr={{
                                            class: "form-datebox",
                                        }}
                                        width={500}
                                        type={"date"}
                                        min={new Date()}
                                        readOnly={true}
                                        accessKey={'startDate'}
                                        openOnFieldClick={true}
                                        value={formData.startDate}
                                        placeholder={"DD/MM/YYYY"}
                                        displayFormat={"dd/MM/yyyy"}
                                        validationStatus={"valid"}
                                    />
                                </FormGroupItem>

                                <FormGroupItem>
                                    <FormLabel>End Date</FormLabel>
                                    <DateBox
                                        elementAttr={{
                                            class: "form-datebox",
                                        }}
                                        width={500}
                                        type={"date"}
                                        min={new Date()}
                                        readOnly={true}
                                        accessKey={'startDate'}
                                        openOnFieldClick={true}
                                        value={formData.endDate}
                                        placeholder={"DD/MM/YYYY"}
                                        displayFormat={"dd/MM/yyyy"}
                                    />
                                </FormGroupItem>

                                <FormGroupItem>
                                    <FormLabel>Warehouse</FormLabel>
                                    <TextBox
                                        elementAttr={{
                                            class: "form-textbox"
                                        }}
                                        readOnly={true}
                                        accessKey={'productDescription'}
                                        value={formData.warehouseId}
                                        placeholder={'Product Description'}
                                    />
                                </FormGroupItem>
                                <FormButtonContainer style={{ marginTop: 45 }}>
                                    <Button disabled={save || productionOrderAction.type === "UPDATE" ? true : false} size="sm" className={"form-action-button"}>
                                        {productionOrderAction.type === "UPDATE" ? "" : "Save"} Production Order
                                    </Button>
                                </FormButtonContainer>
                            </div>
                        </div>
                    </FormGroupContainer>
                </form>
            </Fragment>
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

    const renderRouteStageCell = ({ data }) => {
        return (
            <CellContainer>
                <CellContent>
                    {data.PO_RouteStage}
                </CellContent>
            </CellContainer>
        )
    }

    const renderTypeCell = ({ data }) => {
        return (
            <CellContainer>
                <CellContent>
                    {data.PO_Type}
                </CellContent>
            </CellContainer>
        )
    }

    const renderItemNumberCell = ({ data }) => {
        return (
            <CellContainer>
                <CellContent>
                    {data.PO_ItemNo}
                </CellContent>
            </CellContainer>
        )
    }

    const renderNameCell = ({ data }) => {
        return (
            <CellContainer>
                <CellContent>
                    {data.PO_ItemDescription}
                </CellContent>
            </CellContainer>
        )
    }

    const renderQuantityColumn = ({ data }) => {
        return (
            <CellContainer>
                <CellContent>
                    {data.PO_Quantity}
                </CellContent>
            </CellContainer>
        )
    }

    const renderUomCell = ({ data }) => {
        return (
            <CellContainer>
                <CellContent>
                    {data.PO_Uom}
                </CellContent>
            </CellContainer>
        )
    }

    const renderWarehouseCell = ({ data }) => {
        return (
            <CellContainer>
                <CellContent>
                    {data.PO_WarehouseId}
                </CellContent>
            </CellContainer>
        )
    }

    const renderUnitPriceCell = ({ data }) => {
        return (
            <CellContainer>
                <CellContent>
                    {data.PO_UnitPrice.toLocaleString("en", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
                </CellContent>
            </CellContainer>
        )
    }

    const renderTotalCell = ({ data }) => {
        const value = data.PO_Quantity * data.PO_UnitPrice
        return (
            <CellContainer>
                <CellContent>
                    {value.toLocaleString("en", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
                </CellContent>
            </CellContainer>
        )
    }

    const renderStatusCell = ({ data }) => {
        return (
            <CellContainer style={{ alignItems: 'center' }}>
                <Badge className={"status-badge"} color={data.PO_Status === "Pending" ? "warning" : "success"}>
                    <span className='fad fa-circle' style={{ fontSize: 8, marginRight: 5, left: -3 }} />
                    <span>{data.PO_Status}</span>
                </Badge>
            </CellContainer>
        )
    }

    const calculateTotal = () => {
        return treeListData.reduce((sum, item) => {
            const total = item.PO_Quantity * item.PO_UnitPrice;
            return sum + total;
        }, 0);
    }
    
    const renderTotal = () => {
        const totalSum = calculateTotal()
        return (
            <div style={{ padding: 10, float: "right", fontSize: 15, fontWeight: 700, borderRadius: 5, marginTop: 10, marginBottom: 10, backgroundColor: "lightgray" }}>
                Total: {totalSum.toLocaleString("en", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
            </div>
        )
    }

    const renderTreelist = () => {
        return (
            <>
                <TreeList
                    elementAttr={{
                        id: "production-order-bom-treelist",
                        class: "project-treelist"
                    }}
                    keyExpr={"clientId"}
                    ref={treelistRef}
                    showBorders={true}
                    showRowLines={true}
                    showColumnLines={true}
                    dataSource={itemResourceDatasource}
                    allowColumnResizing={true}
                    rowAlternationEnabled={true}
                    noDataText={'No Data'}
                    className={'dev-form-treelist'}
                    columnResizingMode={"nextColumn"}
                    onSaved={handleOnSaved}
                    onEditorPreparing={handleOnEditorPreparing}
                    onCellPrepared={handleOnCellPrepared}>
                    
                    <Selection mode={"single"} />

                    <Scrolling mode={"standard"} />

                    <Editing
                        mode='cell'
                        allowUpdating={true}
                        startEditAction='dblClick'
                        selectTextOnEditStart={true} 
                        texts={{ confirmDeleteMessage: '' }}
                    />

                    <Column
                        caption={"Route Stage"}
                        dataField={"PO_RouteStage"}
                        alignment={"left"}
                        allowSorting={false}
                        allowEditing={false}
                        cellRender={renderRouteStageCell}
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-item-column"}
                    />

                    <Column
                        caption={"Type"}
                        dataField={"PO_Type"}
                        alignment={"left"}
                        allowSorting={false}
                        allowEditing={false}
                        cellRender={renderTypeCell}
                        editCellRender={renderTypeCell}
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-item-column"}
                    />

                    <Column
                        caption={"Item No"}
                        dataField={"PO_ItemNo"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderItemNumberCell}
                        editCellRender={renderItemNumberCell}
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-item-column"}
                    />

                    <Column
                        width={140}
                        caption={"Item Description"}
                        dataField={"PO_ItemDescription"}
                        alignment={"left"}
                        allowEditing={false}
                        allowSorting={false}
                        cellRender={renderNameCell} 
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-column"}
                    />
                        
                    <Column
                        caption={"Quantity"}
                        dataField={"PO_Quantity"}
                        alignment={"left"}
                        allowSorting={false}
                        allowEditing={true}
                        editorOptions={"dxNumberBox"}
                        cellRender={renderQuantityColumn}
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-column"}
                    />

                    <Column
                        caption={"UoM"}
                        dataField={"PO_Uom"}
                        alignment={"left"}
                        allowEditing={false}
                        allowSorting={false}
                        cellRender={renderUomCell} 
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-item-column"}
                    />

                    <Column
                        caption={"Warehouse"}
                        dataField={"PO_WarehouseId"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderWarehouseCell} 
                        editCellRender={renderWarehouseCell}
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-column"}
                    />

                    <Column
                        caption={"Unit Price"}
                        dataField={"PO_UnitPrice"}
                        alignment={"left"}
                        allowSorting={false}
                        editorOptions={"dxNumberBox"}
                        allowEditing={false}
                        cellRender={renderUnitPriceCell} 
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-column"}
                    />

                    <Column
                        caption={"Total"}
                        dataField={"PO_Total"}
                        alignment={"left"}
                        allowSorting={false}
                        allowEditing={false}
                        cellRender={renderTotalCell} 
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-column"}
                    />

                    <Column
                        caption={"Status"}
                        dataField={"PO_Status"}
                        alignment={"left"}
                        allowSorting={false}
                        allowEditing={false}
                        cellRender={renderStatusCell} 
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-column"}
                    />
                </TreeList>
                <CreateJobCard productionOrder={selectedItem} />
                {renderTotal()}
            </>
        )
    }

    return (
        <FormBackground Form={[renderForm(), renderTreelist()]} />
    )
}

export default CreateProductionOrder

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

const handleOnDisable = (treeListData, save, release) => {
    
    if (release) {
        return true
    }

    if (treeListData.length === 0) {
        return true
    }

    if (treeListData.length > 0 && !save) {
        return true
    }

    return false
}