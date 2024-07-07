import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import moment from 'moment'
import notify from 'devextreme/ui/notify'
import DataSource from 'devextreme/data/data_source'
import FormBackground from '../../SupportComponents/FormBackground'

import { Button } from 'reactstrap'
import { DateBox, SelectBox, TextBox, TreeList } from 'devextreme-react'
import { Column, Editing, Scrolling, Selection } from 'devextreme-react/tree-list'
import { CellContainer, CellContent, FormButtonContainer, FormGroupContainer, FormGroupItem, FormLabel, Header, HeaderSpan } from '../../SupportComponents/StyledComponents'

import { assignClientId } from '../../../utilities/CommonUtilities'
import { addPurchaseOrder, getPurchaseOrder, getPurchaseRequest, getRequestForQuotation, getVendorQuotation, updatePurchaseRequest, updateRequestForQuotation, updateVendorQuotation } from '../../../actions/PurchaseAction'

const CreatePurchaseOrder = () => {

    const itemMaster = useSelector(state => state.item.itemMaster)
    const vendorMaster = useSelector(state => state.vendor.vendorMaster)
    const purchaseRequest = useSelector(state => state.purchase.purchaseRequest)
    const vendorQuotation = useSelector(state => state.purchase.vendorQuotation)
    const requestForQuotation = useSelector(state => state.purchase.requestForQuotation)
    const purchaseOrderAction = useSelector(state => state.purchase.purchaseOrderAction)

    const [treeListData, setTreeListData] = useState([])
    const [vendorDataSource, setVendorDataSource] = useState([])

    const [invalid, setInvalid] = useState({ requiredBy: false, vendorId: false, pr_Id: false })
    const [formData, setFormData] = useState({ creationDate: "", requiredBy: "", vendorId: "", vendorName: "", vendorAddress: "", vendorNumber: "", purchaseOrderStatus: "", pr_Id: "" })

    const dispatch = useDispatch()
    const treelistRef = useRef(null)

    const purchaseOrderDataSource = new DataSource({
        store: {
            data: assignClientId(treeListData),
            type: 'array',
            key: 'clientId',
        }
    })

    useEffect(() => {
        if (purchaseOrderAction.type === "CREATE") {
            setFormData(prevState => ({ ...prevState, creationDate: Date.now(), purchaseOrderStatus: "Pending" }))            
        }
        else if (purchaseOrderAction.type === "UPDATE") {
            setFormData({
                pr_Id: purchaseOrderAction.node.data.pr_Id,
                creationDate: purchaseOrderAction.node.data.creationDate,
                requiredBy: purchaseOrderAction.node.data.requiredBy,
                vendorId: purchaseOrderAction.node.data.vendorId,
                vendorName: purchaseOrderAction.node.data.vendorName,
                vendorAddress: purchaseOrderAction.node.data.vendorAddress,
                vendorNumber: purchaseOrderAction.node.data.vendorNumber,
                purchaseOrderStatus: purchaseOrderAction.node.data.purchaseOrderStatus
            })
            setTreeListData(purchaseOrderAction.node.data.children)
        }
    }, [])

    const onValueChanged = (e, name) => {
        let value = e.value
        if (value === null) value = ""

        if (name === "vendorId") {
            const vendor = vendorMaster.find((vendor) => vendor.vendorId === value.vendorId) 
            if(vendor){
                setFormData((prevState) => ({ 
                    ...prevState,
                    vendorId: vendor.vendorId,
                    vendorName: vendor.vendorName,
                    vendorAddress: vendor.vendorAddress,
                    vendorNumber: vendor.vendorNumber
                }))

                const items = value.children.map(item => {
                    return {
                        ...item,
                        pro_Id: "",
                        pro_ItemId: ""
                    }
                })

                setTreeListData(items)
            }
        }
        else if(name === "pr_Id"){
            const id = requestForQuotation.find(item => item.pr_Id === value)
            const date = purchaseRequest.find(item => item.purchaseRequestId === value)

            if(id){
                setFormData((prevState) => ({ ...prevState, [name]: value, requiredBy: date ? date.pR_RequiredBy : "" }))
                const arr = vendorQuotation.filter((item) => item.rfq_Id === id.rfq_Id)
                setVendorDataSource(arr)
            }
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
        else if(name === "pr_Id") {
            setInvalid((prevInvalid) => ({
                ...prevInvalid,
                [name]: formData[name].trim() === "" ? true : false
            }))
        }
    }

    const handleOnSubmit = (e) => {
        e.preventDefault()
    
        if (formData.requiredBy === "" || formData.pr_Id === "" || formData.vendorId === "") {
            return notify("Form fields cannot be empty", "error", 2000)
        }

        if (invalid.requiredBy === true || invalid.vendorId === true || invalid.pr_Id === true) {
            return notify("Please correct the invalid fields", "error", 2000)
        }

        const purchaseOrder = {
            pro_Id: "",
            creationDate : moment(formData.creationDate).format('YYYY-MM-DD'),
            requiredBy : moment(formData.requiredBy).format('YYYY-MM-DD'),
            pr_Id : formData.pr_Id,
            vendorId : formData.vendorId,
            vendorName : formData.vendorName,
            vendorAddress : formData.vendorAddress,
            vendorNumber : formData.vendorNumber,
            purchaseOrderStatus : "Created",
            total : calculateTotal(),
            children: [...treeListData]
        }

        if (purchaseOrderAction.type === "CREATE") {
            dispatch(addPurchaseOrder(purchaseOrder)).then((res) => {
                const response = res.payload.data
                if(response.success){

                    const pr = purchaseRequest.find(item => item.purchaseRequestId === formData.pr_Id)
                    if(pr){
                        dispatch(updatePurchaseRequest({ ...pr, pR_Status: "Ordered" }, pr.purchaseRequestId)).then((resX) => {
                            if(resX.payload.data.success){
                                dispatch(getPurchaseRequest(0))
                            }
                        })
                    }
                    
                    const rfq = requestForQuotation.find(item => item.pr_Id === formData.pr_Id)
                    const vq = vendorQuotation.filter(item => item.rfq_Id === rfq.rfq_Id)

                    if(vq){
                        vq.forEach((item) => {
                            if(item.vendorId === formData.vendorId){
                                dispatch(updateVendorQuotation( { ...item, vq_Status: "Booked" } , item.vq_Id))
                            }
                            else {
                                dispatch(updateVendorQuotation( { ...item, vq_Status: "Closed" } , item.vq_Id))
                            }
                        })
                    }

                    if(rfq) {
                        dispatch(updateRequestForQuotation({ ...rfq, rfq_Status: "Closed" }, rfq.rfq_Id))
                    }

                    setFormData((prevState) => ({
                        ...prevState,
                        pr_Id: "",
                        requiredBy: "",
                        vendorId: "",
                        vendorName: "",
                        vendorAddress: "",
                        vendorNumber: ""
                    }))

                    setTreeListData([])
                    setVendorDataSource([])
                    dispatch(getPurchaseOrder(0))
                    dispatch(getVendorQuotation(0))
                    dispatch(getRequestForQuotation(0))
                    notify("Purchase Order Created Successfully")
                }
            })
        }
    }

    const renderContent = () => {
        return(
            <Fragment>
                <Header>
                    <HeaderSpan>Create Purchase Order</HeaderSpan>
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
                                        validationStatus={"valid"}
                                    />
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
                                        readOnly={true}
                                        placeholder={"DD/MM/YYYY"}
                                        displayFormat={"dd/MM/yyyy"}
                                        validationMessagePosition={"bottom"}
                                        validationStatus={"valid"}
                                    />
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
                            </div>
                            
                            <div style={{width: 500, margin: "0 20px"}}>
                                <FormGroupItem>
                                    <FormLabel>Purchase Request</FormLabel>
                                    {purchaseOrderAction.type !== "UPDATE" ? 
                                        <SelectBox
                                            elementAttr={{
                                                class: "form-selectbox"
                                            }}
                                            searchTimeout={200}
                                            searchEnabled={true}
                                            searchMode={'contains'}
                                            accessKey={'pr_Id'}
                                            dataSource={purchaseRequest.filter((purchase) => purchase.pR_Status === "RFQ Created").map((item) => {
                                                return item.purchaseRequestId
                                            })}
                                            disabled={purchaseRequest.filter((purchase) => purchase.pR_Status === "RFQ Created").length === 0 ? true : false}
                                            value={formData.pr_Id}
                                            openOnFieldClick={true}
                                            onFocusIn={handleOnFocusIn}
                                            onFocusOut={handleOnFocusOut}
                                            placeholder={"Select Purchase Request"}
                                            dropDownOptions={{ maxHeight: 300 }}
                                            onValueChanged={(e) => onValueChanged(e, 'pr_Id')}
                                            validationStatus={invalid.pr_Id === false ? "valid" : "invalid"}
                                        />
                                        : 
                                        <TextBox
                                            elementAttr={{
                                                class: "form-textbox"
                                            }}
                                            readOnly={true}
                                            accessKey={'pr_Id'}
                                            placeholder='Select PR-Id'
                                            value={formData.pr_Id}
                                        />
                                    }
                                </FormGroupItem>

                                <FormGroupItem>
                                    <FormLabel>Vendor Id</FormLabel>
                                    {purchaseOrderAction.type !== "UPDATE" ? 
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
                                            disabled={vendorDataSource.length === 0 ? true : false}
                                            dataSource={vendorDataSource.map((item) => {
                                                return {
                                                    vendorId: item.vendorId,
                                                    vendorName: item.vendorName,
                                                    children: item.children
                                                }
                                            })}
                                            value={formData.vendorId}
                                            openOnFieldClick={true}
                                            acceptCustomValue={true}
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

                                <FormGroupItem>
                                    <FormLabel>Status</FormLabel>
                                    <TextBox
                                        elementAttr={{
                                            class: "form-textbox"
                                        }}
                                        readOnly={true}
                                        accessKey={'purchaseOrderStatus'}
                                        value={formData.purchaseOrderStatus}
                                        placeholder={'Status'}
                                    />
                                </FormGroupItem>

                                {purchaseOrderAction.type !== "UPDATE" && (
                                    <FormButtonContainer style={{ marginTop: 30 }}>
                                        <Button size="sm" className={"form-action-button"}>
                                            Save Purchase Order
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
        if (!data.itemQuantity) data.itemQuantity = 1
        if (!data.rate) data.rate = 0

        //For Now
        setTreeListData(prevData => {
            return [...prevData].sort((a, b) => a.clientId - b.clientId)
        })
    }

    const handleOnCellPrepared = (e) => {
        if (e.rowType === "data") {
            if (e.column.dataField === "itemQuantity") {
                if (e.value <= 0) {
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
                        id: "create-purchase-order-treelist",
                        class: "project-treelist"
                    }}
                    keyExpr={"clientId"}
                    ref={treelistRef}
                    showBorders={true}
                    showRowLines={true}
                    showColumnLines={true}
                    dataSource={purchaseOrderDataSource}
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
                        allowEditing={false}
                        cellRender={renderItemContent}
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
                        allowEditing={false}
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
                        allowEditing={false}
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

export default CreatePurchaseOrder