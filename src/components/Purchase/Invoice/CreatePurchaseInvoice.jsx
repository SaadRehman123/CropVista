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
import { addPurchaseInvoice, getGoodReceipt, getPurchaseInvoice, updateGoodReceipt, updatePurchaseInvoice } from '../../../actions/PurchaseAction'

const CreatePurchaseInvoice = () => {

    const goodReceipt = useSelector((state) => state.purchase.goodReceipt)
    const purchaseInvoiceAction = useSelector(state => state.purchase.purchaseInvoiceAction)

    const [treeListData, setTreeListData] = useState([])

    const [invalid, setInvalid] = useState({ gr_Id: false, dueDate: false })
    const [formData, setFormData] = useState({ gr_Id: "", creationDate: "", dueDate: "", vendorId: "", vendorName: "", vendorAddress: "", vendorNumber: "", pi_Status: "", paid: false })

    const dispatch = useDispatch()
    const treelistRef = useRef(null)

    const purchaseInvoiceDataSource = new DataSource({
        store: {
            data: assignClientId(treeListData),
            type: 'array',
            key: 'clientId',
        }
    })

    useEffect(() => {
        if (purchaseInvoiceAction.type === "CREATE") {
            setFormData(prevState => ({ ...prevState, creationDate: Date.now(), pi_Status: "Un-Paid" }))
        }
        else if (purchaseInvoiceAction.type === "UPDATE" || purchaseInvoiceAction.type === "VIEW") {
            setFormData({
                gr_Id: purchaseInvoiceAction.node.data.gr_Id, 
                creationDate: purchaseInvoiceAction.node.data.creationDate,
                dueDate: purchaseInvoiceAction.node.data.dueDate,
                vendorId: purchaseInvoiceAction.node.data.vendorId,
                vendorName: purchaseInvoiceAction.node.data.vendorName,
                vendorAddress: purchaseInvoiceAction.node.data.vendorAddress,
                vendorNumber: purchaseInvoiceAction.node.data.vendorNumber,
                pi_Status: purchaseInvoiceAction.node.data.pi_Status,
                paid: purchaseInvoiceAction.node.data.paid
            })
            setTreeListData(purchaseInvoiceAction.node.data.children)
        }
    }, [])

    const onValueChanged = (e, name) => {
        let value = e.value
        if (value === null) value = ""

        if(name === "gr_Id" && value && typeof value === 'object'){
            setFormData((prevState) => ({
                ...prevState,
                gr_Id: value.gr_Id,
                vendorId: value.vendorId,
                vendorName: value.vendorName,
                vendorAddress: value.vendorAddress,
                vendorNumber: value.vendorNumber
            }))

            const items = value.children.map((item) => {
                item.pi_Id = ""
                item.pi_ItemId = ""

                return item
            })

            setTreeListData(items)
        }
        else if(name === "dueDate"){
            setFormData(prevState => ({ ...prevState, dueDate: value }))
            setInvalid(prevState => ({ ...prevState, dueDate: value === "" || !value ? true : false }))
        }
        else if(name === "paid"){
            setFormData(prevState => ({ ...prevState, paid: value, pi_Status: value ? "Paid" : "Un-Paid" }))
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

        if (name === "gr_Id") {
            setInvalid((prevInvalid) => ({
                ...prevInvalid,
                [name]: formData[name].trim() === "" ? true : false
            }))
        }
    }

    const handleOnSubmit = (e) => {
        e.preventDefault()

        if (formData.gr_Id === "" || formData.dueDate === "") {
            return notify("Form fields cannot be empty", "error", 2000)
        }

        if(invalid.gr_Id === true || invalid.dueDate === true){
            return notify("Please correct the invalid fields", "error", 2000)
        }

        const purchaseInvoice = {
            pi_Id: "",
            dueDate: moment(formData.dueDate).format('YYYY-MM-DD'),
            creationDate : moment(formData.creationDate).format('YYYY-MM-DD'),
            gr_Id: formData.gr_Id,
            vendorId : formData.vendorId,
            vendorName : formData.vendorName,
            vendorAddress : formData.vendorAddress,
            vendorNumber : formData.vendorNumber,
            pi_Status : formData.pi_Status,
            paid: formData.paid,
            total : calculateTotal(),
            children: [...treeListData]
        }

        if(purchaseInvoiceAction.type === "CREATE"){
            dispatch(addPurchaseInvoice(purchaseInvoice)).then((res) => {
                const response = res.payload.data
                if(response.success){
                    const gr = goodReceipt.find(item => item.gr_Id === formData.gr_Id)
                    if(gr){
                        dispatch(updateGoodReceipt({ ...gr, gr_Status: formData.pi_Status }, gr.gr_Id)).then((resX) => {
                            if(resX.payload.data.success){
                                dispatch(getGoodReceipt(0))
                            }
                        })
                    }

                    setFormData((prevState) => ({
                        ...prevState,
                        gr_Id: "",
                        dueDate: "",
                        vendorId: "",
                        vendorName: "",
                        vendorNumber: "",
                        vendorAddress: "",
                        pi_Status: "Un-Paid",
                        paid: false,
                    }))
                    setTreeListData([])
                    dispatch(getPurchaseInvoice(0))
                    notify("Purchase Invoice Created Successfully")
                }
            })
        }
        else if(purchaseInvoiceAction.type === "UPDATE") {
            dispatch(updatePurchaseInvoice(purchaseInvoice, purchaseInvoiceAction.node.data.pi_Id)).then((res) => {
                const response = res.payload.data
                if(response.success){
                    const gr = goodReceipt.find(item => item.gr_Id === formData.gr_Id)
                    if(gr){
                        dispatch(updateGoodReceipt({ ...gr, gr_Status: formData.pi_Status }, gr.gr_Id)).then((resX) => {
                            if(resX.payload.data.success){
                                dispatch(getGoodReceipt(0))
                            }
                        })
                    }
                    dispatch(getPurchaseInvoice(0))
                    notify("Purchase Invoice Updated Successfully")
                }
            })
        }
    }

    const renderContent = () => {
        return (
            <Fragment>
                <Header>
                    <HeaderSpan>Create Purchase Invoice</HeaderSpan>
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
                                    <FormLabel>Good Receipt</FormLabel>
                                    {purchaseInvoiceAction.type === "CREATE" ?
                                        <SelectBox
                                            elementAttr={{
                                                class: "form-selectbox"
                                            }}
                                            searchTimeout={200}
                                            accessKey={'gr_Id'}
                                            searchEnabled={true}
                                            displayExpr={'gr_Id'}
                                            searchMode={'contains'}
                                            searchExpr={'vendorName'}
                                            dataSource={goodReceipt.filter((gr) => gr.gr_Status === "Created").map(item => {
                                                return {
                                                    gr_Id: item.gr_Id,
                                                    vendorId: item.vendorId,
                                                    vendorName: item.vendorName,
                                                    vendorAddress: item.vendorAddress,
                                                    vendorNumber: item.vendorNumber,
                                                    children: item.children
                                                }
                                            })}
                                            value={formData.gr_Id}
                                            openOnFieldClick={true}
                                            acceptCustomValue={true}
                                            onFocusIn={handleOnFocusIn}
                                            onFocusOut={handleOnFocusOut}
                                            itemRender={(e) => {
                                                return (
                                                    <div style={{ display: "flex", flexDirection: "row", whiteSpace: 'pre-line' }}>
                                                        <span>{e.gr_Id}</span>
                                                        <span style={{ marginLeft: "auto", }}>
                                                            {e.vendorName}
                                                        </span>
                                                    </div>
                                                )
                                            }}
                                            placeholder={"Select Good Receipt"}
                                            dropDownOptions={{ maxHeight: 300 }}
                                            onValueChanged={(e) => onValueChanged(e, "gr_Id")}
                                            validationStatus={invalid.gr_Id === false ? "valid" : "invalid"}
                                        />
                                        :
                                        <TextBox
                                            elementAttr={{
                                                class: "form-textbox"
                                            }}
                                            readOnly={true}
                                            accessKey={'gr_Id'}
                                            value={formData.gr_Id}
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
                                    <FormLabel>Paid</FormLabel>
                                    <CheckBox
                                        width={20}
                                        value={formData.paid}
                                        style={{ marginTop: 10 }}
                                        onValueChanged={(e) => onValueChanged(e, 'paid')}
                                        disabled={purchaseInvoiceAction.type === "VIEW" ? true : false}
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
                                        readOnly={purchaseInvoiceAction.type === "VIEW" || formData.pi_Status === "Over-Due" ? true : false}
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
                                        placeholder={"Enter Vendor"}
                                        value={formData.vendorId}
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
                               
                                <FormGroupItem>
                                    <FormLabel>Status</FormLabel>
                                    <TextBox
                                        elementAttr={{
                                            class: "form-textbox"
                                        }}
                                        readOnly={true}
                                        accessKey={'pi_Status'}
                                        value={formData.pi_Status}
                                        placeholder={'Status'}
                                    />
                                </FormGroupItem>

                                {purchaseInvoiceAction.type !== "VIEW" && (
                                    <FormButtonContainer style={{ marginTop: 25 }}>
                                        <Button size="sm" className={"form-action-button"}>
                                            {purchaseInvoiceAction.type === "UPDATE" ? "Update" : "Save"} Purchase Invoice
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
                        id: "create-purchase-invoice-treelist",
                        class: "project-treelist"
                    }}
                    keyExpr={"clientId"}
                    ref={treelistRef}
                    showBorders={true}
                    showRowLines={true}
                    showColumnLines={true}
                    dataSource={purchaseInvoiceDataSource}
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

export default CreatePurchaseInvoice
