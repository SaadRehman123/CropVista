import React, { Fragment, useEffect, useRef, useState } from 'react'
import FormBackground from '../../SupportComponents/FormBackground'
import { CellContainer, CellContent, FormButtonContainer, FormGroupContainer, FormGroupItem, FormLabel, Header, HeaderSpan } from '../../SupportComponents/StyledComponents'
import { CheckBox, DateBox, SelectBox, TextBox, TreeList } from 'devextreme-react'
import { Column, Editing, Scrolling, Selection } from 'devextreme-react/tree-list'
import { Button } from 'reactstrap'
import { assignClientId } from '../../../utilities/CommonUtilities'
import DataSource from 'devextreme/data/data_source'
import { useDispatch, useSelector } from 'react-redux'

const CreatePurchaseInvoice = () => {
    const vendorMaster = useSelector(state => state.vendor.vendorMaster)
    const purchaseInvoiceAction = useSelector(state => state.purchase.purchaseInvoiceAction)

    const [treeListData, setTreeListData] = useState([])

    const [invalid, setInvalid] = useState({ vendorId: false })
    const [formData, setFormData] = useState({ creationDate: "", dueDate: "", vendorId: "", vendorName: "", vendorAddress: "", vendorNumber: "", purchaseInvoiceStatus: "", paid: false })

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
        if (purchaseInvoiceAction.type === "CREATE") {
            setFormData(prevState => ({ ...prevState, creationDate: Date.now() }))
        }
        else if (purchaseInvoiceAction.type === "UPDATE") {
            setFormData({
                creationDate: "",
                dueDate: "",
                vendorId: "",
                vendorName: "",
                vendorAddress: "",
                vendorNumber: "",
                purchaseInvoiceStatus: "",
                paid: false
            })
        }
    }, [])

    const onValueChanged = (e) => {
        let value = e.value
        if (value === null) value = ""

        const vendor = vendorMaster.find((vendor) => vendor.vendorId ?? vendor.vendorId === value.vendorId)
        if (vendor) {
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

        if (name === "vendorId") {
            setInvalid((prevInvalid) => ({
                ...prevInvalid,
                [name]: formData[name].trim() === "" ? true : false
            }))
        }
    }

    const handleOnSubmit = (e) => {
        e.preventDefault()
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
                                    <FormLabel>Vendor Id</FormLabel>
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
                                        dataSource={vendorMaster.filter((vendor) => vendor.isDisabled === false).map((item) => {
                                            return {
                                                vendorId: item.vendorId,
                                                vendorName: item.vendorName
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
                                    <FormLabel>Due Date</FormLabel>
                                    <DateBox
                                        elementAttr={{
                                            class: "form-datebox",
                                        }}
                                        type={"date"}
                                        readOnly={true}
                                        min={new Date()}
                                        openOnFieldClick={true}
                                        accessKey={'dueDate'}
                                        placeholder={"DD/MM/YYYY"}
                                        displayFormat={"dd/MM/yyyy"}
                                        value={formData.dueDate}
                                    />
                                </FormGroupItem>

                                <FormGroupItem style={{ marginTop: 8, marginLeft: 15 }}>
                                    <FormLabel>Paid</FormLabel>
                                    <CheckBox
                                        style={{ marginBottom: 7 }}
                                        value={formData.paid}
                                        onValueChanged={(e) => onValueChanged(e, 'paid')}
                                    />
                                </FormGroupItem>
                            </div>
                            <div style={{ width: 500, margin: "0 20px" }}>
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

                                <FormGroupItem>
                                    <FormLabel>Status</FormLabel>
                                    <TextBox
                                        elementAttr={{
                                            class: "form-textbox"
                                        }}
                                        readOnly={true}
                                        accessKey={'purchaseInvoiceStatus'}
                                        value={formData.purchaseInvoiceStatus}
                                        placeholder={'Status'}
                                    />
                                </FormGroupItem>

                                <FormButtonContainer style={{ marginTop: 30 }}>
                                    <Button size="sm" className={"form-action-button"}>
                                        {purchaseInvoiceAction.type === "UPDATE" ? "Update" : "Save"} Purchase Invoice
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
            const total = item.acceptedQuantity * item.rate
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
        if (!data.acceptedQuantity) data.acceptedQuantity = 0
        if (!data.rate) data.rate = 0

        //For Now
        setTreeListData(prevData => {
            return [...prevData].sort((a, b) => a.clientId - b.clientId)
        })
    }

    const handleOnCellPrepared = (e) => {
        if (e.rowType === "data") {
            if (e.column.dataField === "acceptedQuantity") {
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

    const renderAcceptedQuantityColumn = ({ data }) => {
        return (
            <CellContainer>
                <CellContent>
                    {data.acceptedQuantity}
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
        const value = data.acceptedQuantity * data.rate
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
                        caption={"Accepted Quantity"}
                        dataField={"acceptedQuantity"}
                        alignment={"left"}
                        allowSorting={false}
                        allowEditing={true}
                        editorOptions={"dxNumberBox"}
                        cellRender={renderAcceptedQuantityColumn}
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

export default CreatePurchaseInvoice
