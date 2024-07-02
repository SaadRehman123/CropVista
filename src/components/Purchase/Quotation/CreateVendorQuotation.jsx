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
import { CellContainer, CellContent, FormButtonContainer, FormGroupContainer, FormGroupItem, FormLabel, Header, HeaderSpan } from '../../SupportComponents/StyledComponents'

import { assignClientId } from '../../../utilities/CommonUtilities'
import { addVendorQuotation, getVendorQuotation, updateVendorQuotation } from '../../../actions/PurchaseAction'

const CreateVendorQuotation = () => {

    const itemMaster = useSelector(state => state.item.itemMaster)
    const vendorMaster = useSelector(state => state.vendor.vendorMaster)
    const vendorQuotation = useSelector(state => state.purchase.vendorQuotation)
    const requestForQuotation = useSelector(state => state.purchase.requestForQuotation)
    const vendorQuotationAction = useSelector(state => state.purchase.vendorQuotationAction)

    const [treeListData, setTreeListData] = useState([])
    const [rfqDataSource, setRfqDataSource] = useState([])
    const [vendorDataSource, setVendorDataSource] = useState([])

    const [invalid, setInvalid] = useState({ vendorId: false, rfq_Id: false })
    const [formData, setFormData] = useState({ creationDate: "", vendorId: "", vendorName: "", vendorAddress: "", vendorNumber: "", vendorQuotationStatus: "", rfq_Id: "" })

    const dispatch = useDispatch()
    const treelistRef = useRef(null)

    const vendorQuotationDataSource = new DataSource({
        store: {
            data: assignClientId(treeListData),
            type: 'array',
            key: 'clientId'
        }
    })

    useEffect(() => {
        if (vendorQuotationAction.type === "CREATE") {
            const updatedRFQ = requestForQuotation.map(rfq => {
                const rfqVendors = rfq.childrenVendors.filter(rfqVendor => {
                    const isVendorInQuotation = vendorQuotation.some(vq => 
                        vq.rfq_Id === rfq.rfq_Id && vq.vendorId === rfqVendor.vendorId
                    )
                    return !isVendorInQuotation
                })

                return {
                    ...rfq,
                    childrenVendors: rfqVendors
                }
            }).filter(rfq => rfq.childrenVendors.length > 0)

            setRfqDataSource(updatedRFQ)
        }
    }, [vendorDataSource])

    useEffect(() => {
        if (vendorQuotationAction.type === "CREATE") {
            setFormData(prevState => ({ ...prevState, creationDate: Date.now(), vendorQuotationStatus: "Pending" }))            
        }
        else if (vendorQuotationAction.type === "UPDATE") {
            setFormData({
                creationDate: vendorQuotationAction.node.data.vq_CreationDate,
                vendorId: vendorQuotationAction.node.data.vendorId,
                vendorName: vendorQuotationAction.node.data.vendorName,
                vendorAddress: vendorQuotationAction.node.data.vendorAddress,
                vendorNumber: vendorQuotationAction.node.data.vendorNumber,
                vendorQuotationStatus: vendorQuotationAction.node.data.vq_Status,
                rfq_Id: vendorQuotationAction.node.data.rfq_Id
            })
            setTreeListData(vendorQuotationAction.node.data.children)
        }
    }, [])

    const onValueChanged = (e, name) => {
        let value = e.value
        if (value === null) value = ""

        if (name === "rfq_Id") {
            setFormData((prevState) => ({ 
                ...prevState,
                rfq_Id: value
            }))

            const RFQ = rfqDataSource.find((rfq) => rfq.rfq_Id === value)
            if(RFQ){
                const uniqueItemData = RFQ.childrenItems.reduce((acc, current) => {
                    if (!acc.some(item => item.rfq_ItemId === current.rfq_ItemId)) {
                        let newItem = { ...current }
                        
                        delete newItem.rfq_Id
                        delete newItem.rfq_ItemId
                
                        acc.push({
                            ...newItem,
                            vq_Id: "",
                            vq_ItemId: "",
                            rate: 0,
                            amount: 0
                        })
                    }
                    return acc
                }, [])
                
                const uniqueVendorData = RFQ.childrenVendors.reduce((acc, current) => {
                    if (!acc.some(vendor => vendor.rfq_VendorId === current.rfq_VendorId)) {
                        acc.push(current)
                    }
                    return acc
                }, [])

                setTreeListData([...uniqueItemData])
                setVendorDataSource([...uniqueVendorData])
            }
            else {
                setTreeListData([])
                setVendorDataSource([])
            }
        }
 
        const vendor = vendorMaster.find((vendor) => vendor.vendorId === value.vendorId) 
        if(vendor){
            setFormData((prevState) => ({ 
                ...prevState,
                vendorId: vendor.vendorId,
                vendorName: vendor.vendorName,
                vendorAddress: vendor.vendorAddress,
                vendorNumber: vendor.vendorNumber
            }))
        }
    }

    const handleOnFocusIn = (e) => {
        const name = e.event.target.accessKey
        setInvalid((prevInvalid) => ({
            ...prevInvalid,
            [name]: false
        }))
    }

    const handleOnFocusOut = (e) => {
        const name = e.event.target.accessKey
        if (formData[name] === null) formData[name] = ""
        
        if(name === "vendorId"){
            setInvalid((prevInvalid) => ({
                ...prevInvalid,
                [name]: formData[name].trim() === "" ? true : false
            }))
        }
        else if(name === "rfq_Id"){
            setInvalid((prevInvalid) => ({
                ...prevInvalid,
                [name]: formData[name].trim() === "" ? true : false
            }))
        }
    }

    const handleOnItemValueChanged = (e) => {
        let value = e.value

        if(value === null){
            value = ""
        }

        const instance = treelistRef.current.instance
        const selectRow = instance.getSelectedRowsData()[0]

        if (selectRow) {
            
            const selectedItem = itemMaster.find((item) => item.itemId === value)

            if (selectedItem) {
                const updatedData = { ...selectRow, itemId: selectedItem.itemId, itemName: selectedItem.itemName, uom: selectedItem.uom, rate: selectedItem.sellingRate }
    
                vendorQuotationDataSource.store().update(selectRow.clientId, updatedData).then(() => {
                    vendorQuotationDataSource.reload()
                })
            }
        }
    }

    const handleOnSubmit = (e) => {
        e.preventDefault()
    
        if (formData.creationDate === "" || formData.rfq_Id === "" || formData.vendorId === "") {
            return notify("Form fields cannot be empty", "error", 2000)
        }

        if (invalid.rfq_Id === true || invalid.vendorId === true) {
            return notify("Please correct the invalid fields", "error", 2000)
        }

        if(treeListData.length === 0){
            return notify("Please add atleast one item for creating request for quotation", "error", 2000)
        }

        for (const row of treeListData) {
            if (row.itemQuantity <= 0 || row.rate <= 0) {
                return notify("Some rows have incomplete or incorrect info please fix them before saving", "error", 2000)
            }
        }

        const vendorQuotation = {
            vq_Id: "",
            rfq_Id: formData.rfq_Id,
            vendorId: formData.vendorId,
            vendorName: formData.vendorName,
            vendorAddress: formData.vendorAddress,
            vendorNumber: formData.vendorNumber,
            vq_CreationDate: moment(formData.creationDate).format('YYYY-MM-DD'),
            vq_Status: "Created",
            total: calculateTotal(),
            children: [...treeListData]
        }

        if(vendorQuotationAction.type === "CREATE"){
            dispatch(addVendorQuotation(vendorQuotation)).then((res) => {
                const response = res.payload.data
                if(response.success){
                    const updatedVendorDataSource = vendorDataSource.filter(vendor => vendor.vendorId !== vendorQuotation.vendorId);
                    setFormData((prevState) => ({ 
                        ...prevState,
                        vendorId: "",
                        vendorName: "",
                        vendorAddress: "",
                        vendorNumber: ""
                    }))
                    dispatch(getVendorQuotation(0))
                    setVendorDataSource(updatedVendorDataSource)
                    notify("Vendor Quotation Created Successfully")
                }
            })
        }
        else if(vendorQuotationAction.type === "UPDATE"){
            dispatch(updateVendorQuotation(vendorQuotation, vendorQuotationAction.node.data.vq_Id)).then((res) => {
                if(res.payload.data.success){
                    notify("Vendor Quotation Updated Successfully")
                }
            })
        }
    }

    console.log(vendorDataSource);

    const renderContent = () => {
        return(
            <Fragment>
                <Header>
                    <HeaderSpan>Create Vendor Quotation</HeaderSpan>
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
                                        readOnly={true}
                                        min={new Date()}
                                        openOnFieldClick={true}
                                        accessKey={'creationDate'}
                                        placeholder={"DD/MM/YYYY"}
                                        displayFormat={"dd/MM/yyyy"}
                                        value={formData.creationDate}
                                    />
                                </FormGroupItem>

                                <FormGroupItem>
                                    <FormLabel>Vendor Id</FormLabel>
                                    {vendorQuotationAction.type !== "UPDATE" ?
                                        <SelectBox
                                            elementAttr={{
                                                class: "form-selectbox"
                                            }}
                                            searchTimeout={200}
                                            accessKey={'vendorId'}
                                            searchEnabled={true}
                                            displayExpr={'vendorId'}
                                            searchMode={'contains'}
                                            searchExpr={'vendorName'}
                                            dataSource={vendorDataSource.map((item) => {
                                                return {
                                                    vendorId: item.vendorId,
                                                    vendorName: item.vendorName
                                                }
                                            })}
                                            value={formData.vendorId}
                                            openOnFieldClick={true}
                                            acceptCustomValue={true}
                                            disabled={vendorDataSource.length === 0 ? true : false}
                                            onFocusIn={handleOnFocusIn}
                                            onFocusOut={handleOnFocusOut}
                                            itemRender={(e) => {
                                                return (
                                                    <div style={{ display: "flex", flexDirection: "row", whiteSpace: 'pre-line' }}>
                                                        <span>{e.vendorId}</span>
                                                        <span style={{ marginLeft: "auto", }}>
                                                            {e.vendorName}
                                                        </span>
                                                    </div>
                                                )
                                            }}
                                            placeholder={"Select Vendor"}
                                            dropDownOptions={{ maxHeight: 300 }}
                                            onValueChanged={(e) => onValueChanged(e, 'vendorId')}
                                            validationStatus={invalid.vendorId === false ? "valid" : "invalid"}
                                        />
                                        :
                                        <TextBox
                                            elementAttr={{
                                                class: "form-textbox"
                                            }}
                                            readOnly={true}
                                            accessKey={'vendorId'}
                                            value={formData.vendorId}
                                        />
                                    }
                                </FormGroupItem>

                                <FormGroupItem>
                                    <FormLabel>Vendor Address</FormLabel>
                                    <TextBox
                                        elementAttr={{
                                            class: "form-textbox"
                                        }}
                                        readOnly={true}
                                        accessKey={'vendorAddress'}
                                        placeholder={"Enter Address"}
                                        value={formData.vendorAddress}
                                    />
                                </FormGroupItem>
                                
                                <FormGroupItem>
                                    <FormLabel>Status</FormLabel>
                                    <TextBox
                                        elementAttr={{
                                            class: "form-textbox"
                                        }}
                                        readOnly={true}
                                        accessKey={'vendorQuotationStatus'}
                                        value={formData.vendorQuotationStatus}
                                        placeholder={'Status'}
                                    />
                                </FormGroupItem>
                            </div>
                            <div style={{width: 500, margin: "0 20px"}}>
                                <FormGroupItem>
                                    <FormLabel>Request For Quotation</FormLabel>
                                    {vendorQuotationAction.type !== "UPDATE" ? 
                                        <SelectBox
                                            elementAttr={{
                                                class: "form-selectbox"
                                            }}
                                            searchTimeout={200}
                                            searchEnabled={true}
                                            searchMode={'contains'}
                                            accessKey={'rfq_Id'}
                                            dataSource={rfqDataSource.map((item) => {
                                                return item.rfq_Id
                                            })}
                                            value={formData.rfq_Id}
                                            openOnFieldClick={true}
                                            onFocusIn={handleOnFocusIn}
                                            onFocusOut={handleOnFocusOut}
                                            dropDownOptions={{ maxHeight: 300 }}
                                            placeholder={"Select Request For Quotation"}
                                            onValueChanged={(e) => onValueChanged(e, 'rfq_Id')}
                                            validationStatus={invalid.rfq_Id === false ? "valid" : "invalid"}
                                        /> 
                                        :
                                        <TextBox
                                            elementAttr={{
                                                class: "form-textbox"
                                            }}
                                            readOnly={true}
                                            accessKey={'rfq_Id'}
                                            value={formData.rfq_Id}
                                        />
                                    }
                                </FormGroupItem>

                                <FormGroupItem>
                                    <FormLabel>Vendor Name</FormLabel>
                                    <TextBox
                                        elementAttr={{
                                            class: "form-textbox"
                                        }}
                                        readOnly={true}
                                        accessKey={'vendorName'}
                                        placeholder={"Enter Name"}
                                        value={formData.vendorName}
                                    />
                                </FormGroupItem>

                                <FormGroupItem>
                                    <FormLabel>Vendor Contact</FormLabel>
                                    <TextBox
                                        elementAttr={{
                                            class: "form-textbox"
                                        }}
                                        readOnly={true}
                                        accessKey={'vendorNumber'}
                                        placeholder={"Enter Contact"}
                                        value={formData.vendorNumber}
                                    />
                                </FormGroupItem>

                                <FormButtonContainer style={{ marginTop: 45 }}>
                                    <Button size="sm" className={"form-action-button"}>
                                        {vendorQuotationAction.type === "UPDATE" ? "Update" : "Save"} Vendor Quotation
                                    </Button>
                                </FormButtonContainer>
                            </div>
                        </div>
                    </FormGroupContainer>
                </form>
            </Fragment>
        )
    }

    const calculateTotal = () => {
        return treeListData.reduce((sum, item) => {
            const total = item.itemQuantity * item.rate
            return sum + total
        }, 0)
    }
    
    const renderTotal = () => {
        const totalSum = calculateTotal()
        return (
            <div style={{ padding: 10, float: "right", fontSize: 15, fontWeight: 700, borderRadius: 5, marginTop: 10, marginBottom: 10, backgroundColor: "lightgray" }}>
                Total: {totalSum.toLocaleString("en", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
            </div>
        )
    }

    const renderTotalQuantity = () => {
        return (
            <div style={{ padding: 10, float: "right", fontSize: 15, fontWeight: 700, borderRadius: 5, marginTop: 10, marginBottom: 10, marginRight: 10, backgroundColor: "lightgray" }}>
                Total Item Quantity: {treeListData.length.toLocaleString("en", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
            </div>
        )
    }

    const handleOnSaved = (e) => {
        const data = e.changes[0].data
        if (!data.itemQuantity) data.itemQuantity = 0
        if (!data.rate) data.rate = 0

        data.amount = data.itemQuantity * data.rate

        //For Now
        setTreeListData(prevData => {
            return [...prevData].sort((a, b) => a.clientId - b.clientId)
        })
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
        const selectedIds = treeListData.map(item => item.itemId)
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

    const renderRateCell = ({ data }) => {
        return (
            <CellContainer>
                <CellContent>
                    {data.rate.toLocaleString("en", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
                </CellContent>
            </CellContainer>
        )
    }

    const renderAmountCell = ({ data }) => {
        const value = data.itemQuantity * data.rate
        return (
            <CellContainer>
                <CellContent>
                    {value.toLocaleString("en", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
                </CellContent>
            </CellContainer>
        )
    }

    const renderTreelist = () => {
        return (
            <Fragment>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Header>
                        <HeaderSpan>Items</HeaderSpan>
                    </Header>
                </div>
                
                <TreeList
                    elementAttr={{
                        id: "create-vendor-quotation-treelist",
                        class: "project-treelist"
                    }}
                    keyExpr={"clientId"}
                    ref={treelistRef}
                    showBorders={true}
                    showRowLines={true}
                    showColumnLines={true}
                    dataSource={vendorQuotationDataSource}
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
                        allowEditing={true}
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
                        allowEditing={false}
                        allowSorting={false}
                        cellRender={renderUomCell} 
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-item-column"}
                    />

                    <Column
                        caption={"Rate"}
                        dataField={"rate"}
                        alignment={"left"}
                        allowEditing={true}
                        allowSorting={false}
                        cellRender={renderRateCell} 
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-item-column"}
                    />
 
                    <Column
                        caption={"Amount"}
                        dataField={"amount"}
                        alignment={"left"}
                        allowEditing={false}
                        allowSorting={false}
                        cellRender={renderAmountCell} 
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-item-column"}
                    />
                </TreeList>
                {renderTotal()}
                {renderTotalQuantity()}
            </Fragment>
        )
    }

    return (
        <FormBackground Form={[renderContent(), renderTreelist()]} />
    )
}

export default CreateVendorQuotation