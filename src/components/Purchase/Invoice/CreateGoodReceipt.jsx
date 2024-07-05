import React, { Fragment, useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import moment from "moment"
import notify from "devextreme/ui/notify"
import DataSource from "devextreme/data/data_source"
import FormBackground from "../../SupportComponents/FormBackground"

import { Button } from "reactstrap"
import { DateBox, SelectBox, TextBox, TreeList } from "devextreme-react"
import { Column, Editing, Scrolling, Selection } from 'devextreme-react/tree-list'
import { CellContainer, CellContent, FormButtonContainer, FormGroupContainer, FormGroupItem, FormLabel, Header, HeaderSpan } from "../../SupportComponents/StyledComponents"

import { updateInventory } from "../../../actions/InventoryAction"
import { assignClientId } from "../../../utilities/CommonUtilities"
import { addGoodReceipt, getGoodReceipt, getPurchaseOrder, updatePurchaseOrder } from "../../../actions/PurchaseAction"

const CreateGoodReceipt = () => {

    const inventory = useSelector(state => state.inventory.inventoryStatus)
    const purchaseOrder = useSelector(state => state.purchase.purchaseOrder)
    const goodReceiptAction = useSelector(state => state.purchase.goodReceiptAction)

    const [treeListData, setTreeListData] = useState([])

    const [invalid, setInvalid] = useState({ pro_Id: false })
    const [formData, setFormData] = useState({ pro_Id: "", creationDate: "", vendorId: "", vendorName: "", vendorAddress: "", vendorNumber: "", goodReceiptStatus: "" })

    const dispatch = useDispatch()
    const treelistRef = useRef(null)

    const goodReceiptDataSource = new DataSource({
        store: {
            data: assignClientId(treeListData),
            type: 'array',
            key: 'clientId',
        }
    })

    useEffect(() => {
        if (goodReceiptAction.type === "CREATE") {
            setFormData(prevState => ({ ...prevState, creationDate: Date.now(), goodReceiptStatus: "Pending" }))            
        }
        else if (goodReceiptAction.type === "UPDATE") {
            setFormData({
                pro_Id: goodReceiptAction.node.data.pro_Id,
                creationDate: goodReceiptAction.node.data.creationDate,
                vendorId: goodReceiptAction.node.data.vendorId,
                vendorName: goodReceiptAction.node.data.vendorName,
                vendorAddress: goodReceiptAction.node.data.vendorAddress,
                vendorNumber: goodReceiptAction.node.data.vendorNumber,
                goodReceiptStatus: goodReceiptAction.node.data.gr_Status
            })
            setTreeListData(goodReceiptAction.node.data.children) 
        }
    }, [])

    const onValueChanged = (e) => {
        let value = e.value
        if (value === null) value = ""

        if(value && typeof value === 'object'){
            setFormData((prevState) => ({ 
                ...prevState,
                pro_Id: value.pro_Id,
                vendorId: value.vendorId,
                vendorName: value.vendorName,
                vendorAddress: value.vendorAddress,
                vendorNumber: value.vendorNumber
            }))

            const items = value.children.map(item => {
                return {
                    ...item,
                    gr_Id: "",
                    gr_ItemId: ""
                }
            })

            setTreeListData(items)
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
        
        if(name === "pro_Id"){
            setInvalid((prevInvalid) => ({
                ...prevInvalid,
                [name]: formData[name].trim() === "" ? true : false
            }))
        }
    }

    const handleOnSubmit = (e) => {
        e.preventDefault()
    
        if (formData.pro_Id === "") {
            return notify("Form fields cannot be empty", "error", 2000)
        }

        if (invalid.pro_Id === true) {
            return notify("Please correct the invalid fields", "error", 2000)
        }

        const goodReceipt = {
            gr_Id: "",
            pro_Id : formData.pro_Id,
            vendorId : formData.vendorId,
            vendorName : formData.vendorName,
            vendorAddress : formData.vendorAddress,
            vendorNumber : formData.vendorNumber,
            creationDate : moment(formData.creationDate).format('YYYY-MM-DD'),
            total : calculateTotal(),
            gr_Status : "Created",
            children: [...treeListData]
        }

        if (goodReceiptAction.type === "CREATE") {
            dispatch(addGoodReceipt(goodReceipt)).then((res) => {
                const response = res.payload.data
                if(response.success){
                    const pro = purchaseOrder.find(item => item.pro_Id === formData.pro_Id)
                    if(pro){
                        dispatch(updatePurchaseOrder({ ...pro, purchaseOrderStatus: "GR Created" }, pro.pro_Id)).then((resX) => {
                            if(resX.payload.data.success){
                                dispatch(getPurchaseOrder(0))
                            }
                        })
                    }

                    response.result.children.forEach((child) => {
                        if(inventory.some((item) => item.inventoryItem === child.itemName)){
                            const item = inventory.find((item) => item.inventoryItem === child.itemName)
                            if(item){
                                dispatch(updateInventory(item.inventoryId, {
                                    ...item,
                                    inventoryQuantity: item.inventoryQuantity + child.itemQuantity
                                }))
                            }
                        }
                    })

                    setFormData((prevState) => ({
                        ...prevState,
                        pro_Id: "",
                        vendorId: "",
                        vendorName: "",
                        vendorAddress: "",
                        vendorNumber: ""
                    }))
                    setTreeListData([])
                    dispatch(getGoodReceipt(0))
                    notify("Good Receipt Created Successfully")
                }
            })
        }
    }

    const renderContent = () => {
        return(
            <Fragment>
                <Header>
                    <HeaderSpan>Create Good Receipt</HeaderSpan>
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
                                    <FormLabel>Vendor Id</FormLabel>
                                    <TextBox
                                        elementAttr={{
                                            class: "form-textbox"
                                        }}
                                        readOnly={true}
                                        accessKey={'vendorId'}
                                        placeholder={"Enter Address"}
                                        value={formData.vendorId}
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

                                <FormGroupItem>
                                    <FormLabel>Status</FormLabel>
                                    <TextBox
                                        elementAttr={{
                                            class: "form-textbox"
                                        }}
                                        readOnly={true}
                                        accessKey={'goodReceiptStatus'}
                                        value={formData.goodReceiptStatus}
                                        placeholder={'Status'}
                                    />
                                </FormGroupItem>
                            </div>
                            <div style={{width: 500, margin: "0 20px"}}>
                                <FormGroupItem>
                                    <FormLabel>Purchase Order</FormLabel>
                                    {goodReceiptAction.type !== "UPDATE" ?
                                        <SelectBox
                                            elementAttr={{
                                                class: "form-selectbox"
                                            }}
                                            searchTimeout={200}
                                            accessKey={'pro_Id'}
                                            searchEnabled={true}
                                            displayExpr={'pro_Id'}
                                            searchMode={'contains'}
                                            searchExpr={'vendorName'}
                                            dataSource={purchaseOrder.filter((PO) => PO.purchaseOrderStatus === "Created").map(item => {
                                                return {
                                                    pro_Id: item.pro_Id,
                                                    vendorId: item.vendorId,
                                                    vendorName: item.vendorName,
                                                    vendorAddress: item.vendorAddress,
                                                    vendorNumber: item.vendorNumber,
                                                    children: item.children
                                                }
                                            })}
                                            value={formData.pro_Id}
                                            openOnFieldClick={true}
                                            acceptCustomValue={true}
                                            onFocusIn={handleOnFocusIn}
                                            onFocusOut={handleOnFocusOut}
                                            itemRender={(e) => {
                                                return (
                                                    <div style={{ display: "flex", flexDirection: "row", whiteSpace: 'pre-line' }}>
                                                        <span>{e.pro_Id}</span>
                                                        <span style={{ marginLeft: "auto", }}>
                                                            {e.vendorName}
                                                        </span>
                                                    </div>
                                                )
                                            }}
                                            placeholder={"Select Purchase Order"}
                                            dropDownOptions={{ maxHeight: 300 }}
                                            onValueChanged={(e) => onValueChanged(e)}
                                            validationStatus={invalid.pro_Id === false ? "valid" : "invalid"}
                                        />
                                        :
                                        <TextBox
                                            elementAttr={{
                                                class: "form-textbox"
                                            }}
                                            readOnly={true}
                                            accessKey={'pro_Id'}
                                            value={formData.pro_Id}
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
                                {goodReceiptAction.type === "CREATE" && (
                                    <FormButtonContainer style={{ marginTop: 45 }}>
                                        <Button size="sm" className={"form-action-button"}>
                                            Save Good Receipt
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
        if (!data.itemQuantity) data.itemQuantity = 0
        if (!data.rate) data.rate = 0

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

    const renderItemIdCell = ({ data }) => {
        return (
            <CellContainer>
                <CellContent>
                    {data.itemId}
                </CellContent>
            </CellContainer>
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
                        id: "create-good-receipt-treelist",
                        class: "project-treelist"
                    }}
                    keyExpr={"clientId"}
                    ref={treelistRef}
                    showBorders={true}
                    showRowLines={true}
                    showColumnLines={true}
                    dataSource={goodReceiptDataSource}
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
                        cellRender={renderItemIdCell}
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
                        allowSorting={false}
                        allowEditing={false}
                        cellRender={renderUomCell}
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-column"}
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

export default CreateGoodReceipt