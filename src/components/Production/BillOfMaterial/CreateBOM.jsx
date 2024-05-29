import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import moment from 'moment'
import notify from 'devextreme/ui/notify'
import DataSource from 'devextreme/data/data_source'
import FormBackground from '../../SupportComponents/FormBackground'
import SelectBoxTreelist from '../../SupportComponents/SelectBoxTreelist'

import { Button } from 'reactstrap'
import { NumberBox, SelectBox, TextBox, TreeList } from 'devextreme-react'
import { Column, Editing, Scrolling, Selection } from 'devextreme-react/tree-list'
import { CellContainer, CellContent, FormButtonContainer, FormGroupContainer, FormGroupItem, FormLabel } from '../../SupportComponents/StyledComponents'

import { assignClientId } from '../../../utilities/CommonUtilities'
import { setItemResourceTreeRef } from '../../../actions/ViewActions'
import { addBom, addBomItemResource, deleteBomItemResource, getBom, updateBom, updateBomItemResource } from '../../../actions/BomActions'

import styled from 'styled-components'

const CreateBOM = () => {

    const bom = useSelector(state => state.bom.Bom)
    const bomAction = useSelector(state => state.bom.bomAction)
    const itemMaster = useSelector(state => state.item.itemMaster)
    const resources = useSelector(state => state.resource.resources)
    const warehouses = useSelector(state => state.warehouse.warehouses)

    const [type, setType] = useState("")
    const [deletedRows, setDeletedRows] = useState([])
    const [treeListData, setTreeListData] = useState([])
    const [itemDataSource, setItemDataSource] = useState({ type: "", dataSource: null })
    const [invalid, setInvalid] = useState({ itemId: false, warehouseId: false, productDescription: false, quantity: false, productionStdCost: false })
    const [formData, setFormData] = useState({ itemId: "", warehouseId: "", productDescription: "", quantity: "", productionStdCost: "" })

    const itemResourceDatasource = new DataSource({
        store: {
            data: assignClientId(treeListData),
            type: 'array',
            key: 'clientId',
        }
    })

    const itemResourceTreeRef = useRef(null)
    const dispatch = useDispatch()

    useEffect(() => {
        setItemResourceTreeRef(itemResourceTreeRef)
    }, [])

    useEffect(() => {
        if(bomAction.node && bomAction.type === "UPDATE"){
            const data = bomAction.node.data
            dispatch(getBom(data.bid)).then((res) => {
                if(res.payload.data.success){
                    const dataX = res.payload.data.result[0]
                    const Obj = itemMaster.find((item) => item.itemId === data.productId)

                    setFormData({ 
                        itemId: data.productId,
                        warehouseId: data.wrId, 
                        productDescription: Obj ? Obj : "", 
                        quantity: dataX.quantity, 
                        productionStdCost: dataX.productionStdCost
                    })

                    dataX.children.map((item, index) => {
                        item.clientId = index + 1
                        item.sequenceId = index

                        return item
                    })

                    setTreeListData(dataX.children.sort((a, b) => a.routeSequence - b.routeSequence))
                }
            })
        }
    }, [])

    const handleOnAddRow = () => {
        const newClientID = treeListData.length > 0 ? Math.max(...treeListData.map(item => item.clientId)) + 1 : 1
        const maxRouteSequence = treeListData.length > 0 ? Math.max(...treeListData.map(item => item.routeSequence)) : 1
        const newRow = getItemResourceObj(newClientID, maxRouteSequence)
        setTreeListData([...treeListData, newRow].sort((a, b) => a.routeSequence - b.routeSequence))
    }

    const renderItems = (e, type) => {
        if(type === "product"){
            return (
                <div style={{ display: "flex", flexDirection: "row", whiteSpace: 'pre-line' }}>
                    <span>{e.itemId}</span>
                    <span style={{ marginLeft: "auto", }}>
                        {e.itemName}
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

    const handleOnRowRemove = (e) => {
        const deletedRow = treeListData.find(item => item.clientId === e.row.key)
        setDeletedRows(prevDeletedRows => [...prevDeletedRows, deletedRow])

        const updatedData = treeListData.filter(item => item.clientId !== e.row.key)
        setTreeListData(updatedData)
        
        itemResourceDatasource.store().remove(e.row.key).then(() => {
            itemResourceDatasource.reload()
        })
    }

    const onValueChanged = (e, name) => {
        let value = null
    
        if (name === "warehouse") value = e.value.wrId
        else value = e.value

        if (name === "itemId") {
            let val = ""
            if (value && value.itemId) val = value.itemId
            else val = value

            const selectedItem = itemMaster.find((item) => item.itemId === val)
            const productName = selectedItem ? selectedItem.itemName : ""
            setFormData(prevState => ({ ...prevState, [name]: value, productDescription: productName }))
        }
        else {
            setFormData(prevState => ({ ...prevState, [name]: value }))
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

        const updatedFormData = {
            "itemId": !formData.itemId ? '' : formData.itemId.itemId,
            "warehouseId": !formData.warehouseId ? '' : formData.warehouseId.wrId ,
            "productDescription": formData.productDescription,
            "quantity": formData.quantity,
            "productionStdCost": formData.productionStdCost,
        }
        
        const name = e.event.target.accessKey
        if (name === "quantity") {
            let flag = false 
            if (parseInt(updatedFormData.quantity) < 0) {
                flag = true
            }

            setInvalid((prevInvalid) => ({
                ...prevInvalid,
                [name]: !updatedFormData[name] || setFormDataNumber(updatedFormData).trim() === "" || flag === true ? true : false,
            }))
        }
        else if (name === "productionStdCost") {
            let flag = false 
            if (parseInt(updatedFormData.productionStdCost) < 0) {
                flag = true
            }

            setInvalid((prevInvalid) => ({
                ...prevInvalid,
                [name]: !updatedFormData[name] || setFormDataNumber(updatedFormData).trim() === "" || flag === true ? true : false,
            }))
        }
        else if(name === "itemId" && bomAction.type === "CREATE"){
            setInvalid((prevInvalid) => ({
                ...prevInvalid,
                [name]: !updatedFormData[name] || updatedFormData[name].trim() === "" ? true : false,
            }))
        }
        else if(name === "itemId" && bomAction.type === "UPDATE"){
            setInvalid((prevInvalid) => ({
                ...prevInvalid,
                [name]: false,
            }))
        }
        else if(name === "warehouseId"){
            setInvalid((prevInvalid) => ({
                ...prevInvalid,
                [name]: !updatedFormData[name] || updatedFormData[name].trim() === "" ? true : false,
            }))
        }
        else {
            setInvalid((prevInvalid) => ({
                ...prevInvalid,
                [name]: updatedFormData[name].trim() === "" ? true : false,
            }))
        }
    }

    const handleOnSubmit = (e) => {
        e.preventDefault()

        if (formData.productDescription.trim() === "" || setFormDataNumber(formData).trim() === "") {
            return notify("Form fields cannot be empty", "error", 2000)
        }

        if (invalid.itemId === true || invalid.warehouseId === true || invalid.productDescription === true || invalid.quantity === true || invalid.productionStdCost === true){
            return notify("Please correct the invalid fields", "error", 2000)
        }

        if (treeListData.length === 0) {
            return notify("Please add atleast one item or resource to be used in BOM", "error", 2000)
        }

        for (const row of treeListData) {
            if (!row.type || !row.id || !row.name || row.itemquantity <= 0 || !row.uom || row.unitPrice <= 0 || !row.total) {
                return notify("Some rows have incomplete or incorrect info please fix them before saving", "error", 2000)
            }
        }

        const task = {
            BID : "",  
            productId : formData.itemId.itemId ? formData.itemId.itemId : formData.itemId,
            productDescription : formData.productDescription,
            productionStdCost : formData.productionStdCost,
            quantity : formData.quantity,
            wrId : formData.warehouseId.wrId ? formData.warehouseId.wrId : formData.warehouseId ,
            total : calculateTotal(),
            productPrice : 0,
            creationDate : moment(Date.now()).format('YYYY-MM-DD'),
            itemBID : ''
        }

        if(bomAction.type === "CREATE"){
            dispatch(addBom(task)).then(res => {
                const data = res.payload.data
                const itemResourceData = treeListData.map((item) => {
                    item.BID = data.result.bid
                    return item
                })
    
                if(data.success) {
                    dispatch(addBomItemResource(itemResourceData)).then((resX) => {
                        const data = resX.payload.data
                        if(data.success) {
                            notify("Bill Of Material Created Successfully", "info", 2000)
                        }
                    })
                }
                else {
                    notify(data.message, "info", 2000)
                }

                setFormData({
                    itemId: "",
                    quantity: "",
                    warehouseId: "",
                    productionStdCost: "", 
                    productDescription: ""
                })

                setTreeListData([])
            })
        }
        else if (bomAction.type === "UPDATE") {
            dispatch(updateBom(task, bomAction.node.data.bid)).then((resX) => {
                const data = resX.payload.data
                if (data.success) {
                    treeListData.forEach((item) => {

                        if(item.itemResourceId === ""){
                            let task = []
                            item.BID = data.result.bid
                            task.push(item)

                            dispatch(addBomItemResource(task))
                        }
                        else {
                            dispatch(updateBomItemResource(item, item.itemResourceId))
                        }

                        deletedRows.forEach((item) => {
                            if(item.itemResourceId !== "" && item.itemResourceId !== null && item.itemResourceId !== undefined){
                                dispatch(deleteBomItemResource(item, item.itemResourceId))
                            }
                        })
                    })
                    notify("Bill Of Material Updated Successfully", "info", 2000)
                }
            })
        }
    }

    const renderContent = () => {
        return(
            <Fragment>

                <Header>
                    <HeaderSpan>Create Bill of Material</HeaderSpan>
                </Header>

                <form onSubmit={handleOnSubmit}>
                    <FormGroupContainer>
                        <div style={{ display: 'flex', justifyContent: "", marginTop: 5, marginBottom: 5 }}>
                            <div style={{width: 500, margin: "0 20px 20px 20px"}}>
                                <FormGroupItem>
                                    <FormLabel>Product No</FormLabel>
                                    <SelectBox
                                        elementAttr={{
                                            class: "form-selectbox"
                                        }}
                                        searchTimeout={200}
                                        accessKey={'itemId'}
                                        readOnly={bomAction.type !== "CREATE" ? true : false}
                                        searchEnabled={true}
                                        displayExpr={'itemId'}
                                        searchMode={'contains'}
                                        searchExpr={'itemName'}
                                        dataSource={itemMaster.filter(item => item.itemType === "Finish Good" && item.disable === false && !bom.some(bomItem => bomItem.productId === item.itemId))}
                                        value={formData.itemId}
                                        openOnFieldClick={true}
                                        acceptCustomValue={true}
                                        onFocusIn={handleOnFocusIn}
                                        onFocusOut={handleOnFocusOut}
                                        placeholder={"Select Product No"}
                                        dropDownOptions={{ maxHeight: 300 }}
                                        itemRender={(e) => renderItems(e, "product")}
                                        onValueChanged={(e) => onValueChanged(e, 'itemId')}
                                        validationStatus={invalid.itemId === false ? "valid" : "invalid"}
                                    />
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
                                    <FormLabel>BOM Type</FormLabel>
                                    <TextBox
                                        elementAttr={{
                                            class: "form-textbox"
                                        }}
                                        readOnly={true}
                                        accessKey={'type'}
                                        value={"Production"}
                                    />
                                </FormGroupItem>
                            </div>
                            <div style={{width: 500, margin: "0 20px"}}>
                                <FormGroupItem>
                                    <FormLabel>Warehouse</FormLabel>
                                    <SelectBox
                                        elementAttr={{
                                            class: "form-selectbox"
                                        }}
                                        searchTimeout={200}
                                        searchExpr={'name'}
                                        searchEnabled={true}
                                        displayExpr={'wrId'}
                                        searchMode={'contains'}
                                        dataSource={warehouses.filter((warehouse) => warehouse.wrType === "Finish Good" && warehouse.active === true)}
                                        openOnFieldClick={true}
                                        acceptCustomValue={true}
                                        accessKey={'warehouseId'}
                                        onFocusIn={handleOnFocusIn}
                                        value={formData.warehouseId}
                                        onFocusOut={handleOnFocusOut}
                                        placeholder={"Select Warehouse"}
                                        dropDownOptions={{ maxHeight: 300 }}
                                        itemRender={(e) => renderItems(e, "warehouse")}
                                        onValueChanged={(e) => onValueChanged(e, 'warehouseId')}
                                        validationStatus={invalid.warehouseId === false ? "valid" : "invalid"}
                                    />
                                </FormGroupItem>

                                <FormGroupItem>
                                    <FormLabel>Quantity</FormLabel>
                                    <NumberBox
                                        elementAttr={{
                                            class: "form-numberbox"
                                        }}
                                        type={'number'}
                                        accessKey={'quantity'}
                                        value={formData.quantity}
                                        onFocusIn={handleOnFocusIn}
                                        onFocusOut={handleOnFocusOut}
                                        placeholder={"Enter Quantity"}
                                        onValueChanged={(e) => onValueChanged(e, 'quantity')}
                                        validationStatus={invalid.quantity === false ? "valid" : "invalid"}
                                    />
                                </FormGroupItem>

                                <FormGroupItem>
                                    <FormLabel>Production Std Cost</FormLabel>
                                    <NumberBox
                                        elementAttr={{
                                            class: "form-numberbox"
                                        }}
                                        type={"number"}
                                        onFocusIn={handleOnFocusIn}
                                        onFocusOut={handleOnFocusOut}
                                        value={formData.productionStdCost}
                                        accessKey={'productionStdCost'}
                                        placeholder={"Enter Production Std Cost"}
                                        onValueChanged={(e) => onValueChanged(e, 'productionStdCost')}
                                        validationStatus={invalid.productionStdCost === false ? "valid" : "invalid"}
                                    />
                                </FormGroupItem>

                                <FormButtonContainer style={{ marginTop: 30 }}>
                                    <Button size="sm" className={"form-action-button"}>
                                        {bomAction.type === "UPDATE" ? "Update" : "Save"} Bill Of Material
                                    </Button>
                                </FormButtonContainer>
                            </div>
                        </div>
                    </FormGroupContainer>
                </form>
            </Fragment>
        )
    }

    //Treelist Rendering

    const handleOnCellPrepared = (e) => {
        if (e.rowType === "data") {
            if (e.column.dataField === "itemquantity" || e.column.dataField === "unitPrice" || e.column.dataField === "total") {
                if (e.value < 0) {
                    e.cellElement.style.setProperty("background-color", "#ff00004f", "important")
                }
            }
        }
    }

    const handleOnSaved = (e) => {
        const data = e.changes[0].data
        if (!data.itemquantity) data.itemquantity = 0 
        if (!data.unitPrice) data.unitPrice = 0
        data.total = data.itemquantity * data.unitPrice

        const instance = itemResourceTreeRef.current.instance;
        const selectedRowIndex = instance.getRowIndexByKey(data.clientId)
        let maxRouteSequence = 0

        if (selectedRowIndex !== undefined && selectedRowIndex >= 0) {
            const rowsBeforeSelected = treeListData.slice(0, selectedRowIndex)
            const rowsAfterSelected = treeListData.slice(selectedRowIndex + 1)

            const allRouteSequences = [
                ...rowsBeforeSelected.map(item => item.routeSequence),
                ...rowsAfterSelected.map(item => item.routeSequence)
            ]

            if (allRouteSequences.length > 0) {
                maxRouteSequence = Math.max(...allRouteSequences)
            }

            if (data.routeSequence > maxRouteSequence + 1 || data.routeSequence === 0) {
                data.routeSequence = maxRouteSequence
            }
        }

        setTreeListData(prevData => {
            const newData = [...prevData]
            const index = newData.findIndex(item => item.clientId === data.clientId)
            if (index !== -1) {
                newData[index] = { ...newData[index], ...data }
            } else {
                newData.push(data)
            }
    
            return newData.sort((a, b) => a.routeSequence - b.routeSequence)
        })
    }

    const handleOnTypeValueChanged = (e) => {
        const value = e.value
        const instance = itemResourceTreeRef.current.instance
        const selectRow = instance.getSelectedRowsData()[0]
    
        if (selectRow) {
            const updatedData = { ...selectRow, type: value, id: "", name: "", uom: "", warehouseId: "", itemquantity: 0, unitPrice: 0 }
    
            itemResourceDatasource.store().update(selectRow.clientId, updatedData).then(() => {
                itemResourceDatasource.reload()
            })
        }

        if(value === "Item"){
            setItemDataSource({
                type: "Item",
                dataSource: itemMaster.filter((item) => item.itemType !== "Finish Good")
            })
        }
        else if(value === "Resource"){
            setItemDataSource({
                type: "Resource",
                dataSource: resources
            })
        }

        setType(value)
    }

    const handleOnItemValueChanged = (e) => {
        let uom
        let itemName

        const value = e.value
        const instance = itemResourceTreeRef.current.instance
        const selectRow = instance.getSelectedRowsData()[0]

        if (selectRow) {
            if(selectRow.type === "Resource"){
                const resource = resources.find((resource) => resource.rId === value)
                if (resource) {
                    itemName = resource.name
                    uom = resource.rType
                }
            }
            else if (selectRow.type === "Item") {
                const item = itemMaster.find((item) => item.itemId === value)
                if (item) {
                    itemName = item.itemName
                    uom = item.uom                    
                }
            }

            const updatedData = { ...selectRow, id: value, name: itemName, uom: uom }

            itemResourceDatasource.store().update(selectRow.clientId, updatedData).then(() => {
                itemResourceDatasource.reload()
            })
        }
    }

    const handleOnWarehouseValueChanged = (e) => {
        let value = e.value

        if(value === null){
            value = ""
        }

        const instance = itemResourceTreeRef.current.instance
        const selectRow = instance.getSelectedRowsData()[0]

        if (selectRow) {
            const updatedData = { ...selectRow, warehouseId: value }

            itemResourceDatasource.store().update(selectRow.clientId, updatedData).then(() => {
                itemResourceDatasource.reload()
            })
        }
    }

    const renderActionHeaderCell = (e) => {
        return <span style={{ fontWeight: "bold", fontSize: "14px", color: "black" }}> {e.column.caption} </span>
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

    const renderTypeContent = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.type}
                </CellContent>
            </CellContainer>
        )
    }

    const renderItemContent = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.id}
                </CellContent>
            </CellContainer>
        )
    }

    const renderWarehouseContent = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.warehouseId}
                </CellContent>
            </CellContainer>
        )
    }

    const renderRouteStageCell = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.routeSequence}
                </CellContent>
            </CellContainer>
        )
    }

    const renderTypeCell = (e) => {
        return (
            <SelectBoxTreelist 
                event={e}
                valueExpr={"type"}
                searchExpr={"type"}
                itemRender={(e) => {
                    return <span>{e.type}</span>
                }}
                renderType={"type"}
                displayExpr={"type"}
                dataSource={typeDatasource}
                placeholder={"Choose Type"}
                noDataText={"Type Not Present"}
                handleOnValueChanged={handleOnTypeValueChanged}
                renderContent={() => renderTypeContent(e)}
                disabled={false}
            />
        )
    }

    const renderItemNumberCell = (e) => {
        return (
            <SelectBoxTreelist 
                event={e}
                valueExpr={itemDataSource.type === "Item" ? "itemId" : "rId"}
                searchExpr={itemDataSource.type === "Item" ? "itemName" : "name"}
                itemRender={(e) => {
                    return (
                        <div style={{ display: "flex", flexDirection: "row", whiteSpace: 'pre-line' }}>
                            <span>{itemDataSource.type === "Item" ? e.itemId : e.rId}</span>
                            <span style={{ marginLeft: "auto", }}>
                                {itemDataSource.type === "Item" ? e.itemName : e.name}
                            </span>
                        </div>
                    )
                }}
                displayExpr={"id"}
                renderType={"id"}
                dataSource={itemDataSource.dataSource}
                placeholder={"Choose Item"}
                noDataText={"Item Not Present"}
                handleOnValueChanged={handleOnItemValueChanged}
                renderContent={() => renderItemContent(e)}
                disabled={false}
            />
        )
    }

    const renderNameCell = ({ data }) => {
        return (
            <CellContainer>
                <CellContent>
                    {data.name}
                </CellContent>
            </CellContainer>
        )
    }

    const renderQuantityColumn = ({ data }) => {
        return (
            <CellContainer>
                <CellContent>
                    {data.itemquantity}
                </CellContent>
            </CellContainer>
        )
    }

    const renderUomCell = ({ data }) => {
        return (
            <CellContainer>
                <CellContent>
                    {data.uom}
                </CellContent>
            </CellContainer>
        )
    }

    const renderWarehouseCell = (e) => {
        return (
            <SelectBoxTreelist
                event={e}
                valueExpr={"wrId"}
                searchExpr={"name"}
                itemRender={(e) => renderItems(e, "warehouse")}
                renderType={"wrId"}
                displayExpr={"wrId"}
                dataSource={warehouses.filter((warehouse) => warehouse.wrType === "Raw Material" && warehouse.active === true)}
                placeholder={"Choose Type"}
                noDataText={"Type Not Present"}
                handleOnValueChanged={handleOnWarehouseValueChanged}
                renderContent={() => renderWarehouseContent(e)}
                disabled={type === "Resource" ? true : false}
            />
        )
    }

    const renderUnitPriceCell = ({ data }) => {
        return (
            <CellContainer>
                <CellContent>
                    {data.unitPrice.toLocaleString("en", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
                </CellContent>
            </CellContainer>
        )
    }

    const renderTotalCell = ({ data }) => {
        const value = data.itemquantity * data.unitPrice 
        return (
            <CellContainer>
                <CellContent>
                    {value.toLocaleString("en", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
                </CellContent>
            </CellContainer>
        )
    }

    const renderActionColumn = (e) => {
        return (
            <ActionCellContainer>
                <button
                    title='Delete Bom'
                    className='fal fa-trash treelist-delete-button'
                    onClick={() => handleOnRowRemove(e)} />
            </ActionCellContainer>
        )
    }

    const calculateTotal = () => {
        return treeListData.reduce((sum, item) => {
            const total = item.itemquantity * item.unitPrice;
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
            <Fragment>
                <div style={{ display: "flex", flexFlow: "row-reverse" }}>
                    <AddButton onClick={() => handleOnAddRow()}><i className='fal fa-plus' style={{ marginRight: 5 }} />Add Row</AddButton>
                </div>
                <TreeList
                    elementAttr={{
                        id: "create-bom-treelist",
                        class: "project-treelist"
                    }}
                    keyExpr={"clientId"}
                    ref={itemResourceTreeRef}
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
                        dataField={"routeSequence"}
                        alignment={"left"}
                        allowSorting={false}
                        allowEditing={true}
                        cellRender={renderRouteStageCell}
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-item-column"}
                    />

                    <Column
                        caption={"Type"}
                        dataField={"type"}
                        alignment={"left"}
                        allowSorting={false}
                        allowEditing={true}
                        cellRender={renderTypeCell}
                        editCellRender={renderTypeCell}
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-item-column"}
                    />

                    <Column
                        caption={"Item No"}
                        dataField={"id"}
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
                        dataField={"name"}
                        alignment={"left"}
                        allowEditing={false}
                        allowSorting={false}
                        cellRender={renderNameCell} 
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-column"}
                    />
                        
                    <Column
                        caption={"Quantity"}
                        dataField={"itemquantity"}
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
                        dataField={"uom"}
                        alignment={"left"}
                        allowEditing={true}
                        allowSorting={false}
                        cellRender={renderUomCell} 
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-item-column"}
                    />

                    <Column
                        caption={"Warehouse"}
                        dataField={"warehouseId"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderWarehouseCell} 
                        editCellRender={renderWarehouseCell}
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-column"}
                    />

                    <Column
                        caption={"Unit Price"}
                        dataField={"unitPrice"}
                        alignment={"left"}
                        allowSorting={false}
                        editorOptions={"dxNumberBox"}
                        allowEditing={true}
                        cellRender={renderUnitPriceCell} 
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-column"}
                    />

                    <Column
                        caption={"Total"}
                        dataField={"total"}
                        alignment={"left"}
                        allowSorting={false}
                        allowEditing={false}
                        cellRender={renderTotalCell} 
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-column"}
                    />

                    <Column
                        width={75}
                        minWidth={75}
                        caption={"Actions"}
                        dataField={"actions"}
                        alignment={"center"}
                        allowSorting={false}
                        allowEditing={false}
                        cellRender={renderActionColumn}
                        headerCellRender={renderActionHeaderCell} 
                        cssClass={"project-treelist-column"}
                    />
                </TreeList>
                {renderTotal()}
            </Fragment>
        )
    }

    return (
        <FormBackground Form={[renderContent(), renderTreelist()]} />
    )
}

export default CreateBOM

const typeDatasource = [
    {id: 'item', type : "Item"},
    {id: 'resource', type : "Resource"}
]

const setFormDataNumber = (formData) => {
    let result = ''
    if (formData.quantity !== null && formData.quantity !== undefined) {
        result = formData.quantity.toString()
    } 
    else if (formData.productionStdCost !== null && formData.productionStdCost !== undefined) {
        result = formData.productionStdCost.toString()
    }
    return result
}

const getItemResourceObj = (clientId, routStage) => {
    return {
        type: "",
        id: "",
        name: "",
        itemquantity: 0,
        uom: "",
        warehouseId: "",
        unitPrice: 0,
        total: "",
        itemResourceId: "",
        routeSequence: routStage,
        clientId: clientId
    }
}
 
const AddButton = styled.button`
    font-size: 13px;
        
    color: #4285f4b5;
    background-color: #FFFFFF;

    border: 1px solid #eeeeee; 
    cursor: pointer;

    width: auto;
    height: 30px;
    margin: 10px;
    border-radius: 5px;

    transition: 0.2s background-color, color;
    &:hover,
    &:focus,
    &:focus-within {
        background-color: #4285f4b5;
        color: #FFFFFF;
    }
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

const ActionCellContainer = styled.div`
    display: flex;
    font-size: 16px;
    align-items: center;
    justify-content: space-evenly;
`