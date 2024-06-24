import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import DataSource from 'devextreme/data/data_source'
import FormBackground from '../../SupportComponents/FormBackground'
import SelectBoxTreelist from '../../SupportComponents/SelectBoxTreelist'

import { Button } from 'reactstrap'
import { DateBox, TreeList } from 'devextreme-react'
import { Column, Editing, Scrolling, Selection } from 'devextreme-react/tree-list'
import { CellContainer, CellContent, FormButtonContainer, FormGroupContainer, FormGroupItem, FormLabel } from '../../SupportComponents/StyledComponents'

import { assignClientId } from '../../../utilities/CommonUtilities'

import styled from 'styled-components'

const CreateRequestForQuotation = () => {

    const itemMaster = useSelector(state => state.item.itemMaster)
    const vendorMaster = useSelector(state => state.vendor.vendorMaster)
    const requestForQuotationAction = useSelector(state => state.purchase.requestForQuotationAction)
    
    const [itemDeletedRows, setItemDeletedRows] = useState([])
    const [itemTreeListData, setItemTreeListData] = useState([])
    
    const [vendorDeletedRows, setVendorDeletedRows] = useState([])
    const [vendorTreeListData, setVendorTreeListData] = useState([])

    const [invalid, setInvalid] = useState({ requiredBy: false })
    const [formData, setFormData] = useState({ creationDate: "", requiredBy: "" })

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
        if (requestForQuotationAction.type === "CREATE") {
            setFormData(prevState => ({ ...prevState, creationDate: Date.now() }))            
        }
        else if (requestForQuotationAction.type === "UPDATE") {
            setFormData({
                creationDate: "",
                requiredBy: ""
            })            
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
        setItemDeletedRows(prevDeletedRows => [...prevDeletedRows, deletedRow])

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

    const onValueChanged = (e) => {
        let value = e.value
        if (value === null) value = ""
        setFormData(prevState => ({ ...prevState, requiredBy: value }))
        setInvalid({ requiredBy: value === "" || !value ? true : false })
    }

    const handleOnSubmit = (e) => {
        e.preventDefault()
    
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
                                        min={new Date()}
                                        accessKey={'creationDate'}
                                        openOnFieldClick={true}
                                        readOnly={true}
                                        value={formData.creationDate}
                                        placeholder={"DD/MM/YYYY"}
                                        displayFormat={"dd/MM/yyyy"}
                                    />
                                </FormGroupItem>
                            </div>
                            <div style={{width: 500, margin: "0 20px"}}>
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
                                        placeholder={"DD/MM/YYYY"}
                                        displayFormat={"dd/MM/yyyy"}
                                        validationMessagePosition={"bottom"}
                                        onValueChanged={(e) => onValueChanged(e)}
                                        validationStatus={invalid.requiredBy === false ? "valid" : "invalid"}
                                    />
                                </FormGroupItem>

                                <FormButtonContainer style={{ marginTop: 30 }}>
                                    <Button size="sm" className={"form-action-button"}>
                                        {requestForQuotationAction.type === "UPDATE" ? "Update" : "Save"} Request For Quotation
                                    </Button>
                                </FormButtonContainer>
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

                    <AddButton onClick={() => handleOnItemAddRow()}><i className='fal fa-plus' style={{ marginRight: 5 }} />
                        Add Row
                    </AddButton>
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
                disabled={false}
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

                    <AddButton onClick={() => handleOnVendorAddRow()}><i className='fal fa-plus' style={{ marginRight: 5 }} />
                        Add Row
                    </AddButton>
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
                    dataSource={vendorDataSource}
                    allowColumnResizing={true}
                    rowAlternationEnabled={true}
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
                        allowEditing={true}
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
        vendorId: "",
        vendorName: "",
        vendorNumber: "",
        clientId: clientId
    }
}

const getItemObj = (clientId) => {
    return {
        uom: "",
        itemId: "",
        itemName: "",
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