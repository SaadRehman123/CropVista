import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import moment from 'moment'
import notify from 'devextreme/ui/notify'
import DataSource from 'devextreme/data/data_source'
import FormBackground from '../../SupportComponents/FormBackground'

import { Button } from 'reactstrap'
import { Column, Editing, Scrolling, Selection } from 'devextreme-react/tree-list'
import { CheckBox, DateBox, SelectBox, TextBox, TreeList } from 'devextreme-react'
import { CellContainer, CellContent, FormButtonContainer, FormGroupContainer, FormGroupItem, FormLabel, Header, HeaderSpan } from '../../SupportComponents/StyledComponents'

import { assignClientId } from '../../../utilities/CommonUtilities'
import { addSaleInvoice, getGoodIssue, getSaleInvoice, updateGoodIssue, updateSaleInvoice } from '../../../actions/SalesActions'

const CreateSalesInvoice = () => {

    const goodIssue = useSelector(state => state.sales.goodIssue)
    const saleInvoice = useSelector((state) => state.sales.saleInvoice)
    const saleInvoiceAction = useSelector(state => state.sales.saleInvoiceAction)

    const [treeListData, setTreeListData] = useState([])

    const [invalid, setInvalid] = useState({ gi_Id: false, dueDate: false })
    const [formData, setFormData] = useState({ gi_Id: "", creationDate: "", dueDate: "", customerId: "", customerName: "", customerAddress: "", customerNumber: "", si_Status: "", paid: false })

    const dispatch = useDispatch()
    const treelistRef = useRef(null)

    const saleInvoiceDataSource = new DataSource({
        store: {
            data: assignClientId(treeListData),
            type: 'array',
            key: 'clientId',
        }
    })

    useEffect(() => {
        if (saleInvoiceAction.type === "CREATE") {
            setFormData(prevState => ({ ...prevState, creationDate: Date.now(), si_Status: "Un-Paid" }))
        }
        else if (saleInvoiceAction.type === "UPDATE" || saleInvoiceAction.type === "VIEW") {
            setFormData({
                gi_Id: saleInvoiceAction.node.data.gi_Id,
                creationDate: saleInvoiceAction.node.data.creationDate,
                dueDate: saleInvoiceAction.node.data.dueDate,
                customerId: saleInvoiceAction.node.data.customerId,
                customerName: saleInvoiceAction.node.data.customerName,
                customerAddress: saleInvoiceAction.node.data.customerAddress,
                customerNumber: saleInvoiceAction.node.data.customerNumber,
                si_Status: saleInvoiceAction.node.data.si_Status,
                paid: saleInvoiceAction.node.data.paid
            })
            setTreeListData(saleInvoiceAction.node.data.children)
        }
    }, [])

    const onValueChanged = (e, name) => {
        let value = e.value
        if (value === null) value = ""

        if(name === "gi_Id" && value && typeof value === 'object'){
            setFormData((prevState) => ({
                ...prevState,
                gi_Id: value.gi_Id,
                customerId: value.customerId,
                customerName: value.customerName,
                customerAddress: value.customerAddress,
                customerNumber: value.customerNumber
            }))

            const items = value.children.map((item) => {
                item.si_ItemId = ""
                item.salesInvoice_Id = ""

                return item
            })

            setTreeListData(items)
        }
        else if(name === "dueDate"){
            setFormData(prevState => ({ ...prevState, dueDate: value }))
            setInvalid(prevState => ({ ...prevState, dueDate: value === "" || !value ? true : false }))
        }
        else if(name === "paid"){
            setFormData(prevState => ({ ...prevState, paid: value, si_Status: value ? "Paid" : "Un-Paid" }))
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

        if (name === "gi_Id") {
            setInvalid((prevInvalid) => ({
                ...prevInvalid,
                [name]: formData[name].trim() === "" ? true : false
            }))
        }
    }

    const handleOnSubmit = (e) => {
        e.preventDefault()

        if (formData.gi_Id === "" || formData.dueDate === "") {
            return notify("Form fields cannot be empty", "error", 2000)
        }

        if(invalid.gi_Id === true || invalid.dueDate === true){
            return notify("Please correct the invalid fields", "error", 2000)
        }

        const saleInvoice = {
            salesInvoice_Id: "",
            gi_Id: formData.gi_Id,
            dueDate: moment(formData.dueDate).format('YYYY-MM-DD'),
            creationDate : moment(formData.creationDate).format('YYYY-MM-DD'),
            customerId : formData.customerId,
            customerName : formData.customerName,
            customerAddress : formData.customerAddress,
            customerNumber : formData.customerNumber,
            si_Status : formData.si_Status,
            paid: formData.paid,
            total : calculateTotal(),
            children: [...treeListData]
        }

        if(saleInvoiceAction.type === "CREATE"){
            dispatch(addSaleInvoice(saleInvoice)).then((res) => {
                const response = res.payload.data
                if(response.success){
                    const gi = goodIssue.find(item => item.gi_Id === formData.gi_Id)
                    if(gi){
                        dispatch(updateGoodIssue({ ...gi, gi_Status: formData.si_Status }, gi.gi_Id)).then((resX) => {
                            if(resX.payload.data.success){
                                dispatch(getGoodIssue(0))
                            }
                        })
                    }

                    setFormData((prevState) => ({
                        ...prevState,
                        gi_Id: "",
                        dueDate: "",
                        customerId: "",
                        customerName: "",
                        customerNumber: "",
                        customerAddress: "",
                        si_Status: "Un-Paid",
                        paid: false,
                    }))
                    setTreeListData([])
                    dispatch(getSaleInvoice(0))
                    notify("Sale Invoice Created Successfully")
                }
            })
        }
        else if(saleInvoiceAction.type === "UPDATE") {
            dispatch(updateSaleInvoice(saleInvoice, saleInvoiceAction.node.data.salesInvoice_Id)).then((res) => {
                const response = res.payload.data
                if(response.success){
                    const gi = goodIssue.find(item => item.gi_Id === formData.gi_Id)
                    if(gi){
                        dispatch(updateGoodIssue({ ...gi, gi_Status: formData.si_Status }, gi.gi_Id)).then((resX) => {
                            if(resX.payload.data.success){
                                dispatch(getGoodIssue(0))
                            }
                        })
                    }
                    dispatch(getSaleInvoice(0))
                    notify("Sale Invoice Updated Successfully")
                }
            })
        }
    }

    const renderContent = () => {
        return (
            <Fragment>
                <Header>
                    <HeaderSpan>Create Sale Invoice</HeaderSpan>
                </Header>

                <form onSubmit={handleOnSubmit}>
                    <FormGroupContainer>
                        <div style={{ display: 'flex', justifyContent: "", marginTop: 5, marginBottom: 5 }}>
                            <div style={{ width: 500, margin: "0 20px 20px 20px" }}>
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
                                        validationStatus={'valid'}
                                    />
                                </FormGroupItem>

                                <FormGroupItem>
                                    <FormLabel>Good Issue</FormLabel>
                                    {saleInvoiceAction.type === "CREATE" ?
                                        <SelectBox
                                            elementAttr={{
                                                class: "form-selectbox"
                                            }}
                                            searchTimeout={200}
                                            accessKey={'gi_Id'}
                                            searchEnabled={true}
                                            displayExpr={'gi_Id'}
                                            searchMode={'contains'}
                                            searchExpr={'customerName'}
                                            dataSource={goodIssue.filter((gi) => gi.gi_Status === "Created").map(item => {
                                                return {
                                                    gi_Id: item.gi_Id,
                                                    customerId: item.customerId,
                                                    customerName: item.customerName,
                                                    customerAddress: item.customerAddress,
                                                    customerNumber: item.customerNumber,
                                                    children: item.children
                                                }
                                            })}
                                            value={formData.gi_Id}
                                            openOnFieldClick={true}
                                            acceptCustomValue={true}
                                            onFocusIn={handleOnFocusIn}
                                            onFocusOut={handleOnFocusOut}
                                            itemRender={(e) => {
                                                return (
                                                    <div style={{ display: "flex", flexDirection: "row", whiteSpace: 'pre-line' }}>
                                                        <span>{e.gi_Id}</span>
                                                        <span style={{ marginLeft: "auto", }}>
                                                            {e.customerName}
                                                        </span>
                                                    </div>
                                                )
                                            }}
                                            placeholder={"Select Good Issue"}
                                            dropDownOptions={{ maxHeight: 300 }}
                                            onValueChanged={(e) => onValueChanged(e, "gi_Id")}
                                            validationStatus={invalid.gi_Id === false ? "valid" : "invalid"}
                                        />
                                        :
                                        <TextBox
                                            elementAttr={{
                                                class: "form-textbox"
                                            }}
                                            readOnly={true}
                                            accessKey={'gi_Id'}
                                            value={formData.gi_Id}
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
                                    <FormLabel>Paid</FormLabel>
                                    <CheckBox
                                        width={20}
                                        value={formData.paid}
                                        style={{ marginTop: 10 }}
                                        onValueChanged={(e) => onValueChanged(e, 'paid')}
                                        disabled={saleInvoiceAction.type === "VIEW" ? true : false}
                                    />
                                </FormGroupItem>
                            </div>

                            <div style={{ width: 500, margin: "0 20px" }}>
                                <FormGroupItem>
                                    <FormLabel>Due Date</FormLabel>
                                    <DateBox
                                        elementAttr={{
                                            class: "form-datebox",
                                        }}

                                        type={"date"}
                                        min={new Date()}
                                        accessKey={'dueDate'}
                                        openOnFieldClick={true}
                                        value={formData.dueDate}
                                        placeholder={"DD/MM/YYYY"}
                                        displayFormat={"dd/MM/yyyy"}
                                        validationMessagePosition={"bottom"}
                                        onValueChanged={(e) => onValueChanged(e, "dueDate")}
                                        validationStatus={invalid.dueDate === false ? "valid" : "invalid"}
                                        readOnly={saleInvoiceAction.type === "VIEW" || formData.si_Status === "Over-Due" ? true : false}
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
                                        placeholder={"Enter Customer"}
                                        value={formData.customerId}
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
                               
                                <FormGroupItem>
                                    <FormLabel>Status</FormLabel>
                                    <TextBox
                                        elementAttr={{
                                            class: "form-textbox"
                                        }}
                                        readOnly={true}
                                        accessKey={'pi_Status'}
                                        value={formData.si_Status}
                                        placeholder={'Status'}
                                    />
                                </FormGroupItem>

                                {saleInvoiceAction.type !== "VIEW" && (
                                    <FormButtonContainer style={{ marginTop: 25 }}>
                                        <Button size="sm" className={"form-action-button"}>
                                            {saleInvoiceAction.type === "UPDATE" ? "Update" : "Save"} Sale Invoice
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

    const renderItemIdCell = ({ data }) => {
        return (
            <CellContainer>
                <CellContent>
                    {data.itemId}
                </CellContent>
            </CellContainer>
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

    const renderQuantityColumn = ({ data }) => {
        return (
            <CellContainer>
                <CellContent>
                    {data.itemQuantity}
                </CellContent>
            </CellContainer>
        )
    }
    
    const renderUomCell = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.uom}
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
                        id: "create-sale-invoice-treelist",
                        class: "project-treelist"
                    }}
                    keyExpr={"clientId"}
                    ref={treelistRef}
                    showBorders={true}
                    showRowLines={true}
                    showColumnLines={true}
                    dataSource={saleInvoiceDataSource}
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

export default CreateSalesInvoice
