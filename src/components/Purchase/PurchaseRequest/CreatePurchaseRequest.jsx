import React, { Fragment, useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import moment from 'moment'
import notify from 'devextreme/ui/notify'
import DataSource from 'devextreme/data/data_source'
import FormBackground from '../../SupportComponents/FormBackground'
import SelectBoxTreelist from '../../SupportComponents/SelectBoxTreelist'

import { Button } from 'reactstrap'
import { DateBox, TextBox, TreeList } from 'devextreme-react'
import { Column, Editing, Scrolling, Selection } from 'devextreme-react/tree-list'
import { CellContainer, CellContent, FormButtonContainer, FormGroupContainer, FormGroupItem, FormLabel } from '../../SupportComponents/StyledComponents'

import { assignClientId } from '../../../utilities/CommonUtilities'
import { addPurchaseRequest, addPurchaseRequestItems, deletePurchaseRequestItems, getPurchaseRequest, updatePurchaseRequest } from '../../../actions/PurchaseAction'

import styled from 'styled-components'

const CreatePurchaseRequest = () => {

    const itemMaster = useSelector(state => state.item.itemMaster)
    const purchaseRequestAction = useSelector(state => state.purchase.purchaseRequestAction)

    const [deletedRows, setDeletedRows] = useState([])
    const [treeListData, setTreeListData] = useState([])

    const [invalid, setInvalid] = useState({ requiredBy: false })
    const [formData, setFormData] = useState({ creationDate: "", requiredBy: "", purchaseReqStatus: "" })

    const dispatch = useDispatch()
    const treelistRef = useRef(null)

    const purchaseRequestDataSource = new DataSource({
        store: {
            data: assignClientId(treeListData),
            type: 'array',
            key: 'clientId',
        }
    })

    useEffect(() => {
        if (purchaseRequestAction.type === "CREATE") {
            setFormData(prevState => ({ ...prevState, creationDate: Date.now(), purchaseReqStatus: "Pending" }))            
        }
        else if (purchaseRequestAction.type === "UPDATE" || purchaseRequestAction.type === "VIEW") {
            setFormData({
                creationDate: purchaseRequestAction.node.data.pR_CreationDate,
                requiredBy: purchaseRequestAction.node.data.pR_RequiredBy,
                purchaseReqStatus: purchaseRequestAction.node.data.pR_Status
            })
            setTreeListData([...purchaseRequestAction.node.data.children])
        }
    }, [])

    const handleOnAddRow = () => {
        const newClientID = treeListData.length > 0 ? Math.max(...treeListData.map(item => item.clientId)) + 1 : 1
        const newRow = getPurchaseRequestObj(newClientID)
        setTreeListData([...treeListData, newRow])
    }

    const handleOnRowRemove = (e) => {
        const deletedRow = treeListData.find(item => item.clientId === e.row.key)
        setDeletedRows(prevDeletedRows => [...prevDeletedRows, deletedRow])

        const updatedData = treeListData.filter(item => item.clientId !== e.row.key)
        setTreeListData(updatedData)
        
        purchaseRequestDataSource.store().remove(e.row.key).then(() => {
            purchaseRequestDataSource.reload()
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
    
                purchaseRequestDataSource.store().update(selectRow.clientId, updatedData).then(() => {
                    purchaseRequestDataSource.reload()
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

        if (formData.creationDate === "" || formData.requiredBy === "" || formData.purchaseReqStatus === "") {
            return notify("Form fields cannot be empty", "error", 2000)
        }

        if (invalid.requiredBy === true){
            return notify("Please correct the invalid fields", "error", 2000)
        }

        if(treeListData.length === 0){
            return notify("Please add atleast one item for creating purchase request", "error", 2000)
        }

        for (const row of treeListData) {
            if (!row.itemId || !row.itemName || row.itemQuantity <= 0 || !row.uom) {
                return notify("Some rows have incomplete or incorrect info please fix them before saving", "error", 2000)
            }
        }

        const purchaseRequest = {
            purchaseRequestId: "",
            pR_CreationDate: moment(formData.creationDate).format('YYYY-MM-DD'),
            pR_RequiredBy: moment(formData.requiredBy).format('YYYY-MM-DD'),
            pR_Status: "Created",
            children: [...treeListData]
        }

        if (purchaseRequestAction.type === "CREATE") {
            dispatch(addPurchaseRequest(purchaseRequest)).then((res) => {
                const response = res.payload.data
                if (response.success) {
                    setFormData({
                        creationDate: Date.now(),
                        requiredBy: "",
                        purchaseReqStatus: "Pending"
                    })
                    setTreeListData([])
                    dispatch(getPurchaseRequest(0))
                    notify("Purhase Request Created Successfully", "info", 2000)
                }
            })
        }
        else if (purchaseRequestAction.type === "UPDATE") {
            dispatch(updatePurchaseRequest(purchaseRequest, purchaseRequestAction.node.data.purchaseRequestId)).then((resX) => {
                const data = resX.payload.data
                if (data.success) {

                    const filteredChildren = purchaseRequest.children.filter(child => child.pR_itemId === "").map((item) => {
                        return {
                            ...item,
                            pR_Id: purchaseRequestAction.node.data.purchaseRequestId
                        }
                    })

                    if (filteredChildren.length !== 0) {
                        dispatch(addPurchaseRequestItems(purchaseRequestAction.node.data.purchaseRequestId, filteredChildren)).then((res) => {
                            const data = res.payload.data
                            if (data.success) {
                                dispatch(getPurchaseRequest(0))
                            }
                        })
                    }

                    if(deletedRows.length !== 0) {
                        dispatch(deletePurchaseRequestItems(deletedRows))
                    }

                    notify("Purchase Request Updated Successfully", "info", 2000)
                }
            })
        }
    }

    const renderContent = () => {
        return(
            <Fragment>
                <Header>
                    <HeaderSpan>Create Purchase Request</HeaderSpan>
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
                                    <FormLabel>Status</FormLabel>
                                    <TextBox
                                        elementAttr={{
                                            class: "form-textbox"
                                        }}
                                        readOnly={true}
                                        accessKey={'purchaseReqStatus'}
                                        value={formData.purchaseReqStatus}
                                        placeholder={'Status'}
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
                                        readOnly={purchaseRequestAction.type === "VIEW" ? true : false}
                                        displayFormat={"dd/MM/yyyy"}
                                        validationMessagePosition={"bottom"}
                                        onValueChanged={(e) => onValueChanged(e)}
                                        validationStatus={invalid.requiredBy === false ? "valid" : "invalid"}
                                    />
                                </FormGroupItem>

                                {purchaseRequestAction.type !== "VIEW" && (
                                    <FormButtonContainer style={{ marginTop: 45 }}>
                                        <Button size="sm" className={"form-action-button"}>
                                            {purchaseRequestAction.type === "UPDATE" ? "Update" : "Save"} Purchase Request
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
                    {purchaseRequestAction.type !== "VIEW" && (
                        <AddButton onClick={() => handleOnAddRow()}><i className='fal fa-plus' style={{ marginRight: 5 }} />Add Row</AddButton>
                    )}
                </div>

                <TreeList
                    elementAttr={{
                        id: "create-purchase-request-treelist",
                        class: "project-treelist"
                    }}
                    keyExpr={"clientId"}
                    ref={treelistRef}
                    showBorders={true}
                    showRowLines={true}
                    showColumnLines={true}
                    dataSource={purchaseRequestDataSource}
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
                        allowEditing={purchaseRequestAction.type === "VIEW" ? false : true}
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
                        allowEditing={purchaseRequestAction.type === "VIEW" ? false : true}
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

                    {purchaseRequestAction.type !== "VIEW" && (
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
            </Fragment>
        )
    }

    return (
        <FormBackground Form={[renderContent(), renderTreelist()]} />
    )
}

export default CreatePurchaseRequest

const getPurchaseRequestObj = (clientId) => {
    return {
        pR_itemId: "",
        itemId: "",
        itemName: "",
        itemQuantity: 1,
        uom: "",
        pR_Id: "",
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