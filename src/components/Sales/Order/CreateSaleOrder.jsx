import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import DataSource from 'devextreme/data/data_source'
import { assignClientId } from '../../../utilities/CommonUtilities'
import styled from 'styled-components'
import { CellContainer, CellContent, FormButtonContainer, FormGroupContainer, FormGroupItem, FormLabel, Header, HeaderSpan } from '../../SupportComponents/StyledComponents'
import SelectBoxTreelist from '../../SupportComponents/SelectBoxTreelist'
import { DateBox, SelectBox, TextBox, TreeList } from 'devextreme-react'
import { Column, Editing, Scrolling, Selection } from 'devextreme-react/tree-list'
import { Button } from 'reactstrap'
import FormBackground from '../../SupportComponents/FormBackground'
import moment from 'moment'
import notify from 'devextreme/ui/notify'
import { addSaleOrder, addSaleOrderItems, deleteSaleOrderItems, getSaleOrder, updateSaleOrder } from '../../../actions/SalesActions'

const CreateSaleOrder = () => {

    const itemMaster = useSelector(state => state.item.itemMaster)
    const saleOrderAction = useSelector(state => state.sales.saleOrderAction)
    const customerMaster = useSelector(state => state.customer.customerMaster)

    const [deletedRows, setDeletedRows] = useState([])
    const [treeListData, setTreeListData] = useState([])

    const [invalid, setInvalid] = useState({ deliveryDate: false, customerId: false })
    const [formData, setFormData] = useState({ creationDate: "", deliveryDate: "", customerId: "", customerName: "", customerAddress: "", customerNumber: "", so_Status: "" })

    const dispatch = useDispatch()
    const treelistRef = useRef(null)

    const saleOrderDataSource = new DataSource({
        store: {
            data: assignClientId(treeListData),
            type: 'array',
            key: 'clientId',
        }
    })

    useEffect(() => {
        if (saleOrderAction.type === "CREATE") {
            setFormData(prevState => ({ ...prevState, creationDate: Date.now(), so_Status: "Pending" }))            
        }
        else if (saleOrderAction.type === "UPDATE" || saleOrderAction.type === "VIEW") {
            setFormData({
                creationDate: saleOrderAction.node.data.creationDate,
                deliveryDate: saleOrderAction.node.data.deliveryDate,
                customerId: saleOrderAction.node.data.customerId,
                customerName: saleOrderAction.node.data.customerName,
                customerAddress: saleOrderAction.node.data.customerAddress,
                customerNumber: saleOrderAction.node.data.customerNumber,
                so_Status: saleOrderAction.node.data.so_Status
            })
            setTreeListData([...saleOrderAction.node.data.children])
        }
    }, [])

    const handleOnAddRow = () => {
        const newClientID = treeListData.length > 0 ? Math.max(...treeListData.map(item => item.clientId)) + 1 : 1
        const newRow = getSaleOrderObj(newClientID)
        setTreeListData([...treeListData, newRow])
    }

    const handleOnRowRemove = (e) => {
        const deletedRow = treeListData.find(item => item.clientId === e.row.key)
        setDeletedRows(prevDeletedRows => [...prevDeletedRows, deletedRow])

        const updatedData = treeListData.filter(item => item.clientId !== e.row.key)
        setTreeListData(updatedData)
        
        saleOrderDataSource.store().remove(e.row.key).then(() => {
            saleOrderDataSource.reload()
        })
    }

    const handleOnItemValueChanged = (e) => {
        let value = e.value

        if (value === null) value = ""

        const instance = treelistRef.current.instance
        const selectRow = instance.getSelectedRowsData()[0]

        if (selectRow) {
            
            const selectedItem = itemMaster.find((item) => item.itemId === value)

            if (selectedItem) {
                const updatedData = { ...selectRow, itemId: selectedItem.itemId, itemName: selectedItem.itemName, uom: selectedItem.uom }
    
                saleOrderDataSource.store().update(selectRow.clientId, updatedData).then(() => {
                    saleOrderDataSource.reload()
                })
            }
        }
    }

    const onValueChanged = (e, name) => {
        let value = e.value
        if (value === null) value = ""

        if (name === "customerId") {
            if(value && typeof value === "object"){
                setFormData((prevState) => ({ 
                    ...prevState,
                    customerId: value.customerId,
                    customerName: value.customerName,
                    customerAddress: value.customerAddress,
                    customerNumber: value.customerNumber
                }))
            }
        }
        else if(name === "deliveryDate"){
            setFormData(prevState => ({ ...prevState, deliveryDate: value }))
            setInvalid(prevState => ({...prevState, deliveryDate: value === "" || !value ? true : false}))
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
        
        if(name === "customerId"){
            setInvalid((prevInvalid) => ({
                ...prevInvalid,
                [name]: formData[name].trim() === "" ? true : false
            }))
        }
    }

    const handleOnSubmit = (e) => {
        e.preventDefault()

        if (formData.deliveryDate === "" || formData.customerId === "") {
            return notify("Form fields cannot be empty", "error", 2000)
        }

        if (invalid.customerId === true || invalid.deliveryDate === true){
            return notify("Please correct the invalid fields", "error", 2000)
        }

        if(treeListData.length === 0){
            return notify("Please add atleast one item for creating sale order", "error", 2000)
        }

        for (const row of treeListData) {
            if (!row.itemId || !row.itemName || row.itemQuantity <= 0 || !row.uom || row.rate <= 0 || row.amount <= 0) {
                return notify("Some rows have incomplete or incorrect info please fix them before saving", "error", 2000)
            }
        }

        const saleOrder = {
            saleOrder_Id: "",
            creationDate: moment(formData.creationDate).format('YYYY-MM-DD'),
            deliveryDate: moment(formData.deliveryDate).format('YYYY-MM-DD'),
            customerId: formData.customerId,
            customerName: formData.customerName,
            customerAddress: formData.customerAddress,
            customerNumber: formData.customerNumber,
            total: calculateTotal(),
            so_Status: "Created",
            children: [...treeListData]
        }

        if (saleOrderAction.type === "CREATE") {
            dispatch(addSaleOrder(saleOrder)).then((res) => {
                const response = res.payload.data
                if (response.success) {
                    setFormData({
                        creationDate: Date.now(),
                        deliveryDate: "",
                        so_Status: "Pending"
                    })
                    setTreeListData([])
                    dispatch(getSaleOrder(0))
                    notify("Sale Order Created Successfully", "info", 2000)
                }
            })
        }
        else if (saleOrderAction.type === "UPDATE") {
            dispatch(updateSaleOrder(saleOrder, saleOrderAction.node.data.saleOrder_Id)).then((resX) => {
                const data = resX.payload.data
                if (data.success) {

                    const filteredChildren = saleOrder.children.filter(child => child.so_ItemId === "").map((item) => {
                        return {
                            ...item,
                            saleOrder_Id: saleOrderAction.node.data.saleOrder_Id
                        }
                    })

                    if (filteredChildren.length !== 0) {
                        dispatch(addSaleOrderItems(saleOrderAction.node.data.saleOrder_Id, filteredChildren)).then((res) => {
                            const data = res.payload.data
                            if (data.success) {
                                dispatch(getSaleOrder(0))
                            }
                        })
                    }

                    if(deletedRows.length !== 0) {
                        dispatch(deleteSaleOrderItems(deletedRows))
                    }

                    notify("Sale Order Updated Successfully", "info", 2000)
                }
            })
        }
    }

    const renderContent = () => {
        return(
            <Fragment>
                <Header>
                    <HeaderSpan>Create Sale Order</HeaderSpan>
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
                                        displayFormat={"dd/MM/yyyy"}
                                    />
                                </FormGroupItem>

                                <FormGroupItem>
                                    <FormLabel>Customer Id</FormLabel>
                                    {saleOrderAction.type === "CREATE" ? 
                                        <SelectBox
                                            elementAttr={{
                                                class: "form-selectbox"
                                            }}
                                            searchTimeout={200}
                                            accessKey={'customerId'}
                                            searchEnabled={true}
                                            displayExpr={'customerId'}
                                            searchMode={'contains'}
                                            searchExpr={'customerName'}
                                            dataSource={customerMaster.filter((customer) => customer.disable === false)}
                                            value={formData.customerId}
                                            openOnFieldClick={true}
                                            acceptCustomValue={true}
                                            onFocusIn={handleOnFocusIn}
                                            onFocusOut={handleOnFocusOut}
                                            itemRender={(e) => {
                                                return (
                                                    <div style={{ display: "flex", flexDirection: "row", whiteSpace: 'pre-line' }}>
                                                        <span>{e.customerId}</span>
                                                        <span style={{ marginLeft: "auto", }}>
                                                            {e.customerName}
                                                        </span>
                                                    </div>
                                                )
                                            }}
                                            placeholder={"Select Customer"}
                                            dropDownOptions={{ maxHeight: 300 }}
                                            onValueChanged={(e) => onValueChanged(e, 'customerId')}
                                            validationStatus={invalid.customerId === false ? "valid" : "invalid"}
                                        />
                                        :
                                        <TextBox
                                            elementAttr={{
                                                class: "form-textbox"
                                            }}
                                            readOnly={true}
                                            accessKey={'customerId'}
                                            value={formData.customerId}
                                        />
                                    }
                                </FormGroupItem>

                                <FormGroupItem>
                                    <FormLabel>Address</FormLabel>
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
                                        accessKey={'so_Status'}
                                        value={formData.so_Status}
                                        placeholder={'Status'}
                                    />
                                </FormGroupItem>
                            </div>
                            <div style={{width: 500, margin: "0 20px"}}>
                                <FormGroupItem>
                                    <FormLabel>Delivery Date</FormLabel>
                                    <DateBox
                                        elementAttr={{
                                            class: "form-datebox",
                                        }}
                                        type={"date"}
                                        min={new Date()}
                                        accessKey={'deliveryDate'}
                                        openOnFieldClick={true}
                                        value={formData.deliveryDate}
                                        placeholder={"DD/MM/YYYY"}
                                        readOnly={saleOrderAction.type === "VIEW" ? true : false}
                                        displayFormat={"dd/MM/yyyy"}
                                        validationMessagePosition={"bottom"}
                                        onValueChanged={(e) => onValueChanged(e, "deliveryDate")}
                                        validationStatus={invalid.deliveryDate === false ? "valid" : "invalid"}
                                    />
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
                                    <FormLabel>Contact</FormLabel>
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

                                {saleOrderAction.type !== "VIEW" && (
                                    <FormButtonContainer style={{ marginTop: 45 }}>
                                        <Button size="sm" className={"form-action-button"}>
                                            {saleOrderAction.type === "UPDATE" ? "Update" : "Save"} Sale Order
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

        data.amount = data.itemQuantity * data.rate

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
        const selectedIds = treeListData.map(item => item.itemId)
        return itemMaster.filter(item => item.itemType === "Finish Good" && item.disable === false && !selectedIds.includes(item.itemId))
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
    
    const renderActionColumn = (e) => {
        return (
            <ActionCellContainer>
                <button
                    title='Delete Item'
                    className='fal fa-trash treelist-delete-button'
                    onClick={() => handleOnRowRemove(e)} />
            </ActionCellContainer>
        )
    }

    const renderTreelist = () => {
        return (
            <Fragment>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Header>
                        <HeaderSpan>Items</HeaderSpan>
                    </Header>
                    {saleOrderAction.type !== "VIEW" && (
                        <AddButton onClick={() => handleOnAddRow()}><i className='fal fa-plus' style={{ marginRight: 5 }} />Add Row</AddButton>
                    )}
                </div>

                <TreeList
                    elementAttr={{
                        id: "create-sale-order-treelist",
                        class: "project-treelist"
                    }}
                    keyExpr={"clientId"}
                    ref={treelistRef}
                    showBorders={true}
                    showRowLines={true}
                    showColumnLines={true}
                    dataSource={saleOrderDataSource}
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
                        allowEditing={saleOrderAction.type === "VIEW" ? false : true}
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
                        allowEditing={saleOrderAction.type === "VIEW" ? false : true}
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
                        allowSorting={false}
                        allowEditing={saleOrderAction.type !== "VIEW" ? true : false}
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

                    {saleOrderAction.type !== "VIEW" && (
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
                    )}
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

export default CreateSaleOrder

const getSaleOrderObj = (clientId) => {
    return {
        so_ItemId: "",
        itemId: "",
        itemName: "",
        itemQuantity: 1,
        uom: "",
        rate: 0,
        amount: 0,
        saleOrder_Id: "",
        clientId: clientId
    }
}

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