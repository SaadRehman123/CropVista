import React, { Fragment, useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import moment from "moment"
import notify from "devextreme/ui/notify"
import DataSource from "devextreme/data/data_source"
import FormBackground from '../../SupportComponents/FormBackground'

import { Button } from "reactstrap"
import { DateBox, SelectBox, TextBox, TreeList } from "devextreme-react"
import { Column, Editing, Scrolling, Selection } from 'devextreme-react/tree-list'
import { CellContainer, CellContent, FormButtonContainer, FormGroupContainer, FormGroupItem, FormLabel, Header, HeaderSpan } from '../../SupportComponents/StyledComponents'

import { assignClientId } from "../../../utilities/CommonUtilities"
import { getInventory, updateInventory } from "../../../actions/InventoryAction"
import { addGoodIssue, getGoodIssue, getSaleOrder, updateSaleOrder } from "../../../actions/SalesActions"

const CreateGoodIssue = () => {

    const saleOrder = useSelector(state => state.sales.saleOrder)
    const inventory = useSelector(state => state.inventory.inventoryStatus)
    const goodIssueAction = useSelector(state => state.sales.goodIssueAction)

    const [treeListData, setTreeListData] = useState([])

    const [invalid, setInvalid] = useState({ saleOrder_Id: false })
    const [quantityAvaiable, isQuantityAvaiable] = useState(true)
    const [formData, setFormData] = useState({ saleOrder_Id: "", creationDate: "", customerId: "", customerName: "", customerAddress: "", customerNumber: "", gi_Status: "" })

    const dispatch = useDispatch()
    const treelistRef = useRef(null)

    const goodIssueDataSource = new DataSource({
        store: {
            data: assignClientId(treeListData),
            type: 'array',
            key: 'clientId',
        }
    })
    
    useEffect(() => {
        if (goodIssueAction.type === "CREATE") {
            setFormData(prevState => ({ ...prevState, creationDate: Date.now(), gi_Status: "Pending" }))            
        }
        else if (goodIssueAction.type === "VIEW") {
            setFormData({
                saleOrder_Id: goodIssueAction.node.data.saleOrder_Id,
                creationDate: goodIssueAction.node.data.creationDate,
                customerId: goodIssueAction.node.data.customerId,
                customerName: goodIssueAction.node.data.customerName,
                customerAddress: goodIssueAction.node.data.customerAddress,
                customerNumber: goodIssueAction.node.data.customerNumber,
                gi_Status: goodIssueAction.node.data.gi_Status
            })
            setTreeListData(goodIssueAction.node.data.children) 
        }
    }, [])

    useEffect(() => {
        if(!quantityAvaiable){
            return notify("Some items are not available or less then required Quantity in inventory", "error", 2000)
        }
    }, [quantityAvaiable])

    const onValueChanged = (e) => {
        let value = e.value
        if (value === null) value = ""

        if(value && typeof value === 'object'){
            setFormData((prevState) => ({ 
                ...prevState,
                saleOrder_Id: value.saleOrder_Id,
                customerId: value.customerId,
                customerName: value.customerName,
                customerAddress: value.customerAddress,
                customerNumber: value.customerNumber
            }))

            const items = value.children.map(item => {
                return {
                    ...item,
                    gi_Id: "",
                    gi_ItemId: ""
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
        
        if(name === "saleOrder_Id"){
            setInvalid((prevInvalid) => ({
                ...prevInvalid,
                [name]: formData[name].trim() === "" ? true : false
            }))
        }
    }

    const handleOnSubmit = (e) => {
        e.preventDefault()
    
        if (formData.saleOrder_Id === "") {
            return notify("Form fields cannot be empty", "error", 2000)
        }

        if (invalid.saleOrder_Id === true) {
            return notify("Please correct the invalid fields", "error", 2000)
        }

        if(!quantityAvaiable){
            return notify("Some items are not available or less then required Quantity in inventory", "error", 2000)
        }

        const goodIssue = {
            gi_Id: "",
            creationDate : moment(formData.creationDate).format('YYYY-MM-DD'),
            saleOrder_Id : formData.saleOrder_Id,
            customerId : formData.customerId,
            customerName : formData.customerName,
            customerAddress : formData.customerAddress,
            customerNumber : formData.customerNumber,
            total : calculateTotal(),
            gi_Status : "Created",
            children: [...treeListData]
        }

        if (goodIssueAction.type === "CREATE") {
            dispatch(addGoodIssue(goodIssue)).then((res) => {
                const response = res.payload.data
                if(response.success){
                    const SO = saleOrder.find(item => item.saleOrder_Id === formData.saleOrder_Id)
                    if(SO){
                        dispatch(updateSaleOrder({ ...SO, so_Status: "GI Created" }, SO.saleOrder_Id)).then((resX) => {
                            if(resX.payload.data.success){
                                dispatch(getSaleOrder(0))
                            }
                        })
                    }

                    response.result.children.forEach((child) => {
                        if(inventory.some((item) => item.inventoryItem === child.itemName)){
                            const item = inventory.find((item) => item.inventoryItem === child.itemName)
                            if(item){
                                dispatch(updateInventory(item.inventoryId, {
                                    ...item,
                                    inventoryQuantity: item.inventoryQuantity - child.itemQuantity
                                }))
                            }
                        }
                    })

                    setFormData((prevState) => ({
                        ...prevState,
                        saleOrder_Id: "",
                        customerId: "",
                        customerName: "",
                        customerAddress: "",
                        customerNumber: ""
                    }))
                    setTreeListData([])
                    dispatch(getInventory())
                    dispatch(getGoodIssue(0))
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
                                    <FormLabel>Customer Id</FormLabel>
                                    <TextBox
                                        elementAttr={{
                                            class: "form-textbox"
                                        }}
                                        readOnly={true}
                                        accessKey={'customerId'}
                                        placeholder={"Enter Address"}
                                        value={formData.customerId}
                                    />
                                </FormGroupItem>

                                <FormGroupItem>
                                    <FormLabel>Customer Address</FormLabel>
                                    <TextBox
                                        elementAttr={{
                                            class: "form-textbox"
                                        }}
                                        readOnly={true}
                                        accessKey={'customerAddress'}
                                        placeholder={"Enter Address"}
                                        value={formData.customerAddress}
                                    />
                                </FormGroupItem>

                                <FormGroupItem>
                                    <FormLabel>Status</FormLabel>
                                    <TextBox
                                        elementAttr={{
                                            class: "form-textbox"
                                        }}
                                        readOnly={true}
                                        accessKey={'gi_Status'}
                                        value={formData.gi_Status}
                                        placeholder={'Status'}
                                    />
                                </FormGroupItem>
                            </div>
                            <div style={{width: 500, margin: "0 20px"}}>
                                <FormGroupItem>
                                    <FormLabel>Sale Order</FormLabel>
                                    {goodIssueAction.type === "CREATE" ?
                                        <SelectBox
                                            elementAttr={{
                                                class: "form-selectbox"
                                            }}
                                            searchTimeout={200}
                                            accessKey={'saleOrder_Id'}
                                            searchEnabled={true}
                                            displayExpr={'saleOrder_Id'}
                                            searchMode={'contains'}
                                            searchExpr={'customerName'}
                                            dataSource={saleOrder.filter((SO) => SO.so_Status === "Created").map(item => {
                                                return {
                                                    saleOrder_Id: item.saleOrder_Id,
                                                    customerId: item.customerId,
                                                    customerName: item.customerName,
                                                    customerAddress: item.customerAddress,
                                                    customerNumber: item.customerNumber,
                                                    children: item.children
                                                }
                                            })}
                                            value={formData.saleOrder_Id}
                                            openOnFieldClick={true}
                                            acceptCustomValue={true}
                                            onFocusIn={handleOnFocusIn}
                                            onFocusOut={handleOnFocusOut}
                                            itemRender={(e) => {
                                                return (
                                                    <div style={{ display: "flex", flexDirection: "row", whiteSpace: 'pre-line' }}>
                                                        <span>{e.saleOrder_Id}</span>
                                                        <span style={{ marginLeft: "auto", }}>
                                                            {e.customerName}
                                                        </span>
                                                    </div>
                                                )
                                            }}
                                            placeholder={"Select Sale Order"}
                                            dropDownOptions={{ maxHeight: 300 }}
                                            onValueChanged={(e) => onValueChanged(e)}
                                            validationStatus={invalid.saleOrder_Id === false ? "valid" : "invalid"}
                                        />
                                        :
                                        <TextBox
                                            elementAttr={{
                                                class: "form-textbox"
                                            }}
                                            readOnly={true}
                                            accessKey={'saleOrder_Id'}
                                            value={formData.saleOrder_Id}
                                        />
                                    }
                                </FormGroupItem>

                                <FormGroupItem>
                                    <FormLabel>Customer Name</FormLabel>
                                    <TextBox
                                        elementAttr={{
                                            class: "form-textbox"
                                        }}
                                        readOnly={true}
                                        accessKey={'customerName'}
                                        placeholder={"Enter Name"}
                                        value={formData.customerName}
                                    />
                                </FormGroupItem>

                                <FormGroupItem>
                                    <FormLabel>Customer Contact</FormLabel>
                                    <TextBox
                                        elementAttr={{
                                            class: "form-textbox"
                                        }}
                                        readOnly={true}
                                        accessKey={'customerNumber'}
                                        placeholder={"Enter Contact"}
                                        value={formData.customerNumber}
                                    />
                                </FormGroupItem>
                                {goodIssueAction.type === "CREATE" && (
                                    <FormButtonContainer style={{ marginTop: 45 }}>
                                        <Button size="sm" className={"form-action-button"}>
                                            Save Good Issue
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

        setTreeListData(prevData => {
            return [...prevData].sort((a, b) => a.clientId - b.clientId)
        })
    }

    const handleOnCellPrepared = (e) => {
        if (e.rowType === "data" && e.column.dataField === "itemQuantity") {
            if(goodIssueAction.type === "CREATE" && treeListData[e.rowIndex]){
                const item = treeListData[e.rowIndex].itemName
                const requiredQuantity = treeListData[e.rowIndex].itemQuantity

                const inventoryItem = inventory.find(inv => inv.inventoryItem === item)

                if (inventoryItem && inventoryItem.inventoryQuantity < requiredQuantity) {
                    e.cellElement.style.setProperty("background-color", "#ff00004f", "important")
                    isQuantityAvaiable(false)
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
                        id: "create-good-issue-treelist",
                        class: "project-treelist"
                    }}
                    keyExpr={"clientId"}
                    ref={treelistRef}
                    showBorders={true}
                    showRowLines={true}
                    showColumnLines={true}
                    dataSource={goodIssueDataSource}
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

export default CreateGoodIssue
