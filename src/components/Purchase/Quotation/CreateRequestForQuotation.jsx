import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import moment from 'moment'
import notify from 'devextreme/ui/notify'
import DataSource from 'devextreme/data/data_source'
import FormBackground from '../../SupportComponents/FormBackground'
import SelectBoxTreelist from '../../SupportComponents/SelectBoxTreelist'

import { Button } from 'reactstrap'
import { DateBox, SelectBox, TextBox, TreeList } from 'devextreme-react'
import { Column, Editing, Scrolling, Selection } from 'devextreme-react/tree-list'
import { CellContainer, CellContent, FormButtonContainer, FormGroupContainer, FormGroupItem, FormLabel } from '../../SupportComponents/StyledComponents'

import { assignClientId } from '../../../utilities/CommonUtilities'
import { addRequestForQuotation, addRequestForQuotationItems, addRequestForQuotationVendors, deleteRequestForQuotationItems, deleteRequestForQuotationVendor, getPurchaseRequest, getRequestForQuotation, updatePurchaseRequest, updateRequestForQuotation } from '../../../actions/PurchaseAction'

import styled from 'styled-components'

const CreateRequestForQuotation = () => {

    const itemMaster = useSelector(state => state.item.itemMaster)
    const vendorMaster = useSelector(state => state.vendor.vendorMaster)
    const purchaseRequest = useSelector(state => state.purchase.purchaseRequest)
    const requestForQuotationAction = useSelector(state => state.purchase.requestForQuotationAction)
    
    const [itemDeletedRows, setItemDeletedRows] = useState([])
    const [itemTreeListData, setItemTreeListData] = useState([])
    
    const [vendorDeletedRows, setVendorDeletedRows] = useState([])
    const [vendorTreeListData, setVendorTreeListData] = useState([])

    const [invalid, setInvalid] = useState({ requiredBy: false, purchaseRequestId: false })
    const [formData, setFormData] = useState({ creationDate: "", requiredBy: "", purchaseRequestId: "", requestForQuotationStatus: "" })

    const dispatch = useDispatch()
    
    const itemTreelistRef = useRef(null)
    const vendorTreelistRef = useRef(null)

    const vendorDataSource = new DataSource({
        store: {
            data: assignClientId(vendorTreeListData),
            type: 'array',
            key: 'clientId',
        }
    })

    const itemDataSource = new DataSource({
        store: {
            data: assignClientId(itemTreeListData),
            type: 'array',
            key: 'clientId',
        }
    })

    useEffect(() => {
        dispatch(getRequestForQuotation(0))
    }, [])

    useEffect(() => {
        if (requestForQuotationAction.type === "CREATE") {
            setFormData(prevState => ({ ...prevState, creationDate: Date.now(), requestForQuotationStatus: "Pending" }))            
        }
        else if (requestForQuotationAction.type === "UPDATE"  || requestForQuotationAction.type === "VIEW") {
            setFormData({
                creationDate: requestForQuotationAction.node.data.rfq_CreationDate,
                requiredBy: requestForQuotationAction.node.data.rfq_RequiredBy,
                requestForQuotationStatus: requestForQuotationAction.node.data.rfq_Status,
                purchaseRequestId: requestForQuotationAction.node.data.pr_Id
            })
            
            const uniqueItemData = requestForQuotationAction.node.data.childrenItems.reduce((acc, current) => {
                if (!acc.some(item => item.rfq_ItemId === current.rfq_ItemId)) {
                    acc.push(current)
                }
                return acc
            }, [])
    
            const uniqueVendorData = requestForQuotationAction.node.data.childrenVendors.reduce((acc, current) => {
                if (!acc.some(vendor => vendor.rfq_VendorId === current.rfq_VendorId)) {
                    acc.push(current)
                }
                return acc
            }, [])

            setItemTreeListData([...uniqueItemData])          
            setVendorTreeListData([...uniqueVendorData])
        }
    }, [])

    const handleOnVendorAddRow = () => {
        const newClientID = vendorTreeListData.length > 0 ? Math.max(...vendorTreeListData.map(item => item.clientId)) + 1 : 1
        const newRow = getVendorObj(newClientID)
        setVendorTreeListData([...vendorTreeListData, newRow])
    }

    const handleOnItemAddRow = () => {
        const newClientID = itemTreeListData.length > 0 ? Math.max(...itemTreeListData.map(item => item.clientId)) + 1 : 1
        const newRow = getItemObj(newClientID)
        setItemTreeListData([...itemTreeListData, newRow])
    }

    const handleOnVendorRowRemove = (e) => {
        const deletedRow = vendorTreeListData.find(item => item.clientId === e.row.key)
        setVendorDeletedRows(prevDeletedRows => [...prevDeletedRows, deletedRow])

        const updatedData = vendorTreeListData.filter(item => item.clientId !== e.row.key)
        setVendorTreeListData(updatedData)
        
        vendorDataSource.store().remove(e.row.key).then(() => {
            vendorDataSource.reload()
        })
    }
    
    const handleOnItemRowRemove = (e) => {
        const deletedRow = itemTreeListData.find(item => item.clientId === e.row.key)
        if(deletedRow.rfq_itemId !== ""){
            setItemDeletedRows(prevDeletedRows => [...prevDeletedRows, deletedRow])
        }

        const updatedData = itemTreeListData.filter(item => item.clientId !== e.row.key)
        setItemTreeListData(updatedData)
        
        itemDataSource.store().remove(e.row.key).then(() => {
            itemDataSource.reload()
        })
    }

    const handleOnItemValueChanged = (e) => {
        let value = e.value

        if (value === null) value = ""

        const instance = itemTreelistRef.current.instance
        const selectRow = instance.getSelectedRowsData()[0]

        if (selectRow) {
            
            const selectedItem = itemMaster.find((item) => item.itemId === value)

            if (selectedItem) {
                const updatedData = { ...selectRow, itemId: selectedItem.itemId, itemName: selectedItem.itemName, uom: selectedItem.uom }
    
                itemDataSource.store().update(selectRow.clientId, updatedData).then(() => {
                    itemDataSource.reload()
                })
            }
        }
    }

    const handleOnVendorValueChanged = (e) => {
        let value = e.value

        if (value === null) value = ""

        const instance = vendorTreelistRef.current.instance
        const selectRow = instance.getSelectedRowsData()[0]

        if (selectRow) {
            
            const selectedItem = vendorMaster.find((item) => item.vendorId === value)

            if (selectedItem) {
                const updatedData = { ...selectRow, vendorId: selectedItem.vendorId, vendorName: selectedItem.vendorName, vendorNumber: selectedItem.vendorNumber }
    
                vendorDataSource.store().update(selectRow.clientId, updatedData).then(() => {
                    vendorDataSource.reload()
                })
            }
        }
    }

    const onValueChanged = (e, name) => {
        let value = e.value
        if (value === null) value = ""
        
        if(name === "requiredBy"){
            setFormData(prevState => ({ ...prevState, requiredBy: value }))
        }
        else if (name === "purchaseRequestId") {
            setFormData(prevState => ({ ...prevState, purchaseRequestId: value }))

            if (value !== "") {
                dispatch(getPurchaseRequest(value)).then((res) => {
                    const response = res.payload.data
                    if(response.success){
                        const arr = response.result[0].children.map((item) => {
                            return {
                                rfq_Id: "",
                                uom: item.uom,
                                rfq_itemId: "",
                                itemId: item.itemId,
                                itemName: item.itemName,
                                itemQuantity: item.itemQuantity,
                            }
                        })
    
                        setItemTreeListData(arr)
                    }
                })
            }
            else {
                setItemTreeListData([])
            }
        }

        if (name === "requiredBy") {
            setInvalid(prevState => ({...prevState, requiredBy: value === "" || !value ? true : false}))  
        }
        else if (name === "purchaseRequestId") {
            setInvalid(prevState => ({...prevState, purchaseRequestId: value === "" || !value ? true : false}))  
        }
    }

    const handleOnSubmit = (e) => {
        e.preventDefault()
    
        if (formData.creationDate === "" || formData.requiredBy === "" || formData.purchaseRequestId === "") {
            return notify("Form fields cannot be empty", "error", 2000)
        }

        if (invalid.requiredBy === true || invalid.purchaseRequestId === true) {
            return notify("Please correct the invalid fields", "error", 2000)
        }

        if(itemTreeListData.length === 0){
            return notify("Please add atleast one item for creating request for quotation", "error", 2000)
        }

        if(vendorTreeListData.length === 0){
            return notify("Please add atleast one vendor for creating request for quotation", "error", 2000)
        }

        for (const row of itemTreeListData) {
            if (!row.itemId || !row.itemName || row.itemQuantity <= 0 || !row.uom) {
                return notify("Some rows have incomplete or incorrect info please fix them before saving", "error", 2000)
            }
        }
        
        for (const row of vendorTreeListData) {
            if (!row.vendorId || !row.vendorName || !row.vendorNumber) {
                return notify("Some rows have incomplete or incorrect info please fix them before saving", "error", 2000)
            }
        }

        const requestForQuotation = {
            rfq_Id: "",
            pr_Id: formData.purchaseRequestId,
            rfq_CreationDate: moment(formData.creationDate).format('YYYY-MM-DD'),
            rfq_RequiredBy: moment(formData.requiredBy).format('YYYY-MM-DD'),
            rfq_Status: "Created",
            childrenItems: [...itemTreeListData],
            childrenVendors: [...vendorTreeListData]
        }

        if (requestForQuotationAction.type === "CREATE") {
            dispatch(addRequestForQuotation(requestForQuotation)).then((res) => {
                const response = res.payload.data
                if (response.success) {

                    const data = purchaseRequest.find((item) => item.purchaseRequestId === formData.purchaseRequestId)
                    if (data) {
                        const dataX = {
                            ...data,
                            pR_Status: "RFQ Created"
                        }

                        dispatch(updatePurchaseRequest(dataX, dataX.purchaseRequestId)).then((res) => {
                            if(res.payload.data.success){
                                dispatch(getPurchaseRequest(0))
                            }
                        })

                        dispatch(getRequestForQuotation(0))
                    }

                    setFormData({
                        creationDate: Date.now(),
                        requiredBy: "",
                        purchaseRequestId: "",
                        requestForQuotationStatus: "Pending"
                    })
                    setItemTreeListData([])
                    setVendorTreeListData([])
                    notify("Request For Quotation Created Successfully", "info", 2000)
                }
            })
        }
        else if (requestForQuotationAction.type === "UPDATE") {
            dispatch(updateRequestForQuotation(requestForQuotation, requestForQuotationAction.node.data.rfq_Id)).then((resX) => {
                const data = resX.payload.data
                if (data.success) {

                    const filteredChildrenItems = requestForQuotation.childrenItems.filter(child => child.rfq_itemId === "").map((item) => {
                        return {
                            ...item,
                            rfq_Id: requestForQuotationAction.node.data.rfq_Id
                        }
                    })

                    const filteredChildrenVendors = requestForQuotation.childrenVendors.filter(child => child.rfq_VendorId === "").map((vendor) => {
                        return {
                            ...vendor,
                            rfq_Id: requestForQuotationAction.node.data.rfq_Id
                        }
                    })

                    if (filteredChildrenItems.length !== 0) {
                        dispatch(addRequestForQuotationItems(requestForQuotationAction.node.data.rfq_Id, filteredChildrenItems)).then((res) => {
                            const data = res.payload.data
                            if (data.success) {
                                dispatch(getRequestForQuotation(0))
                            }
                        })
                    }

                    if (filteredChildrenVendors.length !== 0) {
                        dispatch(addRequestForQuotationVendors(requestForQuotationAction.node.data.rfq_Id, filteredChildrenVendors)).then((res) => {
                            const data = res.payload.data
                            if (data.success) {
                                dispatch(getRequestForQuotation(0))
                            }
                        })
                    }

                    if(itemDeletedRows.length !== 0) {
                        dispatch(deleteRequestForQuotationItems(itemDeletedRows))
                        setItemDeletedRows([])
                    }

                    if(vendorDeletedRows.length !== 0) {
                        dispatch(deleteRequestForQuotationVendor(vendorDeletedRows))
                        setVendorDeletedRows([])
                    }

                    notify("Request For Quotation Updated Successfully", "info", 2000)
                }
            })
        }
    }

    const renderContent = () => {
        return(
            <Fragment>
                <Header>
                    <HeaderSpan>Create Request For Quotation</HeaderSpan>
                </Header>

                <form onSubmit={handleOnSubmit}>
                    <FormGroupContainer>
                        <div style={{ display: 'flex', justifyContent: "", marginTop: 5, marginBottom: 5 }}>
                            <div style={{width: 500, margin: "0 20px 20px 20px"}}>
                                <FormGroupItem>
                                    <FormLabel>Creation Date</FormLabel>
                                    <DateBox
                                        elementAttr={{
                                            class: "form-datebox",
                                        }}
                                        type={"date"}
                                        accessKey={'creationDate'}
                                        openOnFieldClick={true}
                                        readOnly={true}
                                        value={formData.creationDate}
                                        placeholder={"DD/MM/YYYY"}
                                        validationStatus={"valid"}
                                        displayFormat={"dd/MM/yyyy"}
                                    />
                                </FormGroupItem>
                                
                                <FormGroupItem>
                                    <FormLabel>Status</FormLabel>
                                    <TextBox
                                        elementAttr={{
                                            class: "form-textbox"
                                        }}
                                        readOnly={true}
                                        accessKey={'requestForQuotationStatus'}
                                        value={formData.requestForQuotationStatus}
                                        placeholder={'Status'}
                                    />
                                </FormGroupItem>
                            </div>

                            <div style={{width: 500, margin: "0 20px"}}>
                                <FormGroupItem>
                                    <FormLabel>Purchase Request</FormLabel>
                                    {requestForQuotationAction.type === "CREATE" ? 
                                        <SelectBox
                                            elementAttr={{
                                                class: "form-selectbox"
                                            }}
                                            searchTimeout={200}
                                            searchEnabled={true}
                                            searchMode={'contains'}
                                            accessKey={'purchaseRequestId'}
                                            dataSource={purchaseRequest.filter((purchase) => purchase.pR_Status === "Created").map((item) => {
                                                return item.purchaseRequestId
                                            })}
                                            value={formData.purchaseRequestId}
                                            openOnFieldClick={true}
                                            placeholder={"Select Purchase Request"}
                                            dropDownOptions={{ maxHeight: 300 }}
                                            onValueChanged={(e) => onValueChanged(e, 'purchaseRequestId')}
                                            validationStatus={invalid.purchaseRequestId === false ? "valid" : "invalid"}
                                        />
                                        : 
                                        <TextBox
                                            elementAttr={{
                                                class: "form-textbox"
                                            }}
                                            readOnly={true}
                                            accessKey={'purchaseRequestId'}
                                            placeholder='Select PR-Id'
                                            value={formData.purchaseRequestId}
                                        />
                                    }
                                </FormGroupItem>

                                <FormGroupItem>
                                    <FormLabel>Required By</FormLabel>
                                    <DateBox
                                        elementAttr={{
                                            class: "form-datebox",
                                        }}
                                        type={"date"}
                                        min={new Date()}
                                        accessKey={'requiredBy'}
                                        openOnFieldClick={true}
                                        value={formData.requiredBy}
                                        readOnly={requestForQuotationAction.type === "VIEW" ? true : false}
                                        placeholder={"DD/MM/YYYY"}
                                        displayFormat={"dd/MM/yyyy"}
                                        validationMessagePosition={"bottom"}
                                        onValueChanged={(e) => onValueChanged(e, "requiredBy")}
                                        validationStatus={invalid.requiredBy === false ? "valid" : "invalid"}
                                    />
                                </FormGroupItem>

                                {requestForQuotationAction.type !== "VIEW" && (
                                    <FormButtonContainer style={{ marginTop: 30 }}>
                                        <Button size="sm" className={"form-action-button"}>
                                            {requestForQuotationAction.type === "UPDATE" ? "Update" : "Save"} Request For Quotation
                                        </Button>
                                    </FormButtonContainer>
                                )}
                            </div>
                        </div>
                    </FormGroupContainer>
                </form>
            </Fragment>
        )
    }

    const handleOnSaved = (e) => {
        const data = e.changes[0].data
        if (!data.itemQuantity) data.itemQuantity = 0
    }

    const handleOnCellPrepared = (e) => {
        if (e.rowType === "data") {
            if (e.column.dataField === "itemQuantity") {
                if (e.value < 0) {
                    e.cellElement.style.setProperty("background-color", "#ff00004f", "important")
                }
            }
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

    const renderItemNameCell = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.itemName}
                </CellContent>
            </CellContainer>
        )
    }

    const renderItemContent = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.itemId}
                </CellContent>
            </CellContainer>
        )
    }

    const renderItems = (e) => {
        return (
            <div style={{ display: "flex", flexDirection: "row", whiteSpace: 'pre-line' }}>
                <span>{e.itemId}</span>
                <span style={{ marginLeft: "auto", }}>
                    {e.itemName}
                </span>
            </div>
        )
    }

    const filterItems = () => {
        const selectedIds = itemTreeListData.map(item => item.itemId)
        return itemMaster.filter(item => item.itemType === "Raw Material" && item.disable === false && !selectedIds.includes(item.itemId))
    }
    
    const renderItemIdCell = (e) => {
        const filteredDataSource = filterItems()

        return (
            <SelectBoxTreelist
                event={e}
                valueExpr={"itemId"}
                searchExpr={"itemName"}
                itemRender={(e) => renderItems(e)}
                renderType={"itemId"}
                displayExpr={"itemId"}
                dataSource={filteredDataSource}
                placeholder={"Choose Item"}
                noDataText={"Item Not Present"}
                handleOnValueChanged={handleOnItemValueChanged}
                renderContent={() => renderItemContent(e)}
                disabled={false}
            />
        )
    }
    
    const renderQuantityColumn = ({ data }) => {
        return (
            <CellContainer>
                <CellContent>
                    {data.itemQuantity}
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

    const renderItemActionColumn = (e) => {
        return (
            <ActionCellContainer>
                <button
                    title='Delete Item'
                    className='fal fa-trash treelist-delete-button'
                    onClick={() => handleOnItemRowRemove(e)} />
            </ActionCellContainer>
        )
    }
    
    const renderItemTreelist = () => {
        return (
            <Fragment>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Header>
                        <HeaderSpan>Items</HeaderSpan>
                    </Header>

                    {requestForQuotationAction.type !== "VIEW" && (
                        <AddButton onClick={() => handleOnItemAddRow()}><i className='fal fa-plus' style={{ marginRight: 5 }} />
                            Add Row
                        </AddButton>
                    )}
                </div>

                <TreeList
                    elementAttr={{
                        id: "create-rfq-item-treelist",
                        class: "project-treelist"
                    }}
                    keyExpr={"clientId"}
                    ref={itemTreelistRef}
                    showBorders={true}
                    showRowLines={true}
                    showColumnLines={true}
                    dataSource={itemDataSource}
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
                        caption={"Item Id"}
                        dataField={"itemId"}
                        alignment={"left"}
                        allowSorting={false}
                        allowEditing={requestForQuotationAction.type !== "VIEW" ? true : false}
                        cellRender={renderItemIdCell}
                        editCellRender={renderItemIdCell}
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-item-column"}
                    />
                    
                    <Column
                        caption={"Item Name"}
                        dataField={"itemName"}
                        alignment={"left"}
                        allowSorting={false}
                        allowEditing={false}
                        cellRender={renderItemNameCell}
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-item-column"}
                    />
                        
                    <Column
                        caption={"Quantity"}
                        dataField={"itemQuantity"}
                        alignment={"left"}
                        allowSorting={false}
                        allowEditing={requestForQuotationAction.type === "VIEW" ? false : true}
                        editorOptions={"dxNumberBox"}
                        cellRender={renderQuantityColumn}
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-column"}
                    />

                    <Column
                        caption={"UoM"}
                        dataField={"uom"}
                        alignment={"left"}
                        allowEditing={false}
                        allowSorting={false}
                        cellRender={renderUomCell} 
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-item-column"}
                    />

                    {requestForQuotationAction.type !== "VIEW" && (
                        <Column
                            width={75}
                            minWidth={75}
                            caption={"Actions"}
                            dataField={"actions"}
                            alignment={"center"}
                            allowSorting={false}
                            allowEditing={false}
                            cellRender={renderItemActionColumn}
                            headerCellRender={renderActionHeaderCell} 
                            cssClass={"project-treelist-column"}
                        />
                    )}
                </TreeList>
            </Fragment>
        )
    }
    
    const renderVendors = (e) => {
        return (
            <div style={{ display: "flex", flexDirection: "row", whiteSpace: 'pre-line' }}>
                <span>{e.vendorId}</span>
                <span style={{ marginLeft: "auto", }}>
                    {e.vendorName}
                </span>
            </div>
        )
    }

    const filterVendor = () => {
        const selectedIds = vendorTreeListData.map(item => item.vendorId)
        return vendorMaster.filter(item => item.isDisabled === false && !selectedIds.includes(item.vendorId))
    }

    const renderVendorIdCell = (e) => {
        const filteredDataSource = filterVendor()

        return (
            <SelectBoxTreelist
                event={e}
                valueExpr={"vendorId"}
                searchExpr={"vendorName"}
                itemRender={(e) => renderVendors(e)}
                renderType={"vendorId"}
                displayExpr={"vendorId"}
                dataSource={filteredDataSource}
                placeholder={"Choose Item"}
                noDataText={"Item Not Present"}
                handleOnValueChanged={handleOnVendorValueChanged}
                renderContent={() => renderVendorContent(e)}
                disabled={requestForQuotationAction.type === "VIEW" ? true : false}
            />
        )
    }
    
    const renderVendorContent = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.vendorId}
                </CellContent>
            </CellContainer>
        )
    }

    const renderVendorNameCell = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.vendorName}
                </CellContent>
            </CellContainer>
        )
    }

    const renderVendorContact = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.vendorNumber}
                </CellContent>
            </CellContainer>
        )
    }
    
    const renderVendorActionColumn = (e) => {
        return (
            <ActionCellContainer>
                <button
                    title='Delete Vendor'
                    className='fal fa-trash treelist-delete-button'
                    onClick={() => handleOnVendorRowRemove(e)} />
            </ActionCellContainer>
        )
    }

    const renderVendorTreelist = () => {
        return (
            <Fragment>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Header>
                        <HeaderSpan>Vendors</HeaderSpan>
                    </Header>
                    {requestForQuotationAction.type !== "VIEW" && (
                        <AddButton onClick={() => handleOnVendorAddRow()}><i className='fal fa-plus' style={{ marginRight: 5 }} />
                            Add Row
                        </AddButton>
                    )}
                </div>
                <TreeList
                    elementAttr={{
                        id: "create-rfq-vendor-treelist",
                        class: "project-treelist"
                    }}
                    keyExpr={"clientId"}
                    ref={vendorTreelistRef}
                    showBorders={true}
                    showRowLines={true}
                    showColumnLines={true}
                    allowColumnResizing={true}
                    rowAlternationEnabled={true}
                    dataSource={vendorDataSource}
                    noDataText={'No Data'}
                    className={'dev-form-treelist'}
                    columnResizingMode={"nextColumn"}>
                    
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
                        caption={"vendor Id"}
                        dataField={"vendorId"}
                        alignment={"left"}
                        allowSorting={false}
                        allowEditing={requestForQuotationAction.type !== "VIEW" ? true : false}
                        cellRender={renderVendorIdCell}
                        editCellRender={renderVendorIdCell}
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-item-column"}
                    />
                    
                    <Column
                        caption={"Vendor Name"}
                        dataField={"vendorName"}
                        alignment={"left"}
                        allowSorting={false}
                        allowEditing={false}
                        cellRender={renderVendorNameCell}
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-item-column"}
                    />
                        
                    <Column
                        caption={"Contact"}
                        dataField={"vendorNumber"}
                        alignment={"left"}
                        allowEditing={false}
                        allowSorting={false}
                        cellRender={renderVendorContact} 
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-item-column"}
                    />

                    {requestForQuotationAction.type !== "VIEW" && (
                        <Column
                            width={75}
                            minWidth={75}
                            caption={"Actions"}
                            dataField={"actions"}
                            alignment={"center"}
                            allowSorting={false}
                            allowEditing={false}
                            cellRender={renderVendorActionColumn}
                            headerCellRender={renderActionHeaderCell} 
                            cssClass={"project-treelist-column"}
                        />
                    )}
                </TreeList>
            </Fragment>
        )
    }

    return (
        <FormBackground Form={[renderContent(), renderVendorTreelist(), renderItemTreelist()]} />
    )
}

export default CreateRequestForQuotation

const getVendorObj = (clientId) => {
    return {
        rfq_Id: "",
        vendorId: "",
        vendorName: "",
        vendorNumber: "",
        rfq_VendorId: "",
        clientId: clientId
    }
}

const getItemObj = (clientId) => {
    return {
        uom: "",
        itemId: "",
        rfq_Id: "",
        itemName: "",
        rfq_itemId: "",
        itemQuantity: 0,
        clientId: clientId
    }
}

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