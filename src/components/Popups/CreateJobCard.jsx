import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import moment from 'moment'
import notify from 'devextreme/ui/notify'

import { Button, Modal, ModalBody, ModalHeader } from 'reactstrap'
import { CellContainer, CellContent } from '../SupportComponents/StyledComponents'
import TreeList, { Column, Editing, Scrolling, Selection } from 'devextreme-react/tree-list'

import { addStockEntries } from '../../actions/StockEntriesAction'
import { toggleCreateJobCardPopup } from '../../actions/PopupActions'
import { getInventory, updateInventory } from '../../actions/InventoryAction'
import { getProductionOrder, updatePoRouteStages } from '../../actions/ProductionOrderAction'

const CreateJobCard = (props) => {

    const inventory = useSelector(state => state.inventory.inventoryStatus)
    const productionOrder = useSelector(state => state.production.productionOrder)
    const createJobCard = useSelector(state => state.popup.toggleCreateJobCardPopup)

    const [dataSource, setDataSource] = useState([])

    const dispatch = useDispatch()

    const treelistRef = useRef(null)

    const toggle = () => dispatch(toggleCreateJobCardPopup(false))

    useEffect(() => {
        const excludedStatuses = ["Closed", "Completed", "Cancelled"]
        const dataSource = productionOrder.filter(item => item.productionNo === props.productionOrder && !excludedStatuses.includes(item.status))

        if (dataSource && dataSource.length > 0) {
            let minRouteSequence = Infinity

            dataSource[0].children.forEach(item => {
                if (item.pO_Status === "Pending" && item.pO_RouteStage < minRouteSequence) {
                    minRouteSequence = item.pO_RouteStage
                }
            })

            if (minRouteSequence !== Infinity) {
                const filteredData = dataSource[0].children.filter(item => item.pO_RouteStage === minRouteSequence && item.pO_Status === "Pending")
                setDataSource(filteredData)
            }
            else {
                setDataSource([])
            }
        }
    }, [productionOrder, props.productionOrder])

    const handleOnClick = () => {
        const instance = treelistRef.current.instance
        const selectedRow = instance.getSelectedRowsData().sort((a, b) => a.pO_RouteStageId - b.pO_RouteStageId)

        let isAllowed = true
        const unavailableItems = []
    
        selectedRow.forEach(row => {
            if(row.pO_Type === "Item"){
                const inventoryItem = inventory.find(item => item.inventoryItem === row.pO_ItemDescription && item.inventoryWarehouse === row.pO_WarehouseId)
                if (!inventoryItem || inventoryItem.inventoryQuantity < row.pO_Quantity) {
                    isAllowed = false
                    unavailableItems.push(row.pO_ItemDescription)
                }
            }
        })

        if (selectedRow && selectedRow.length > 0) {
            if(!isAllowed){
                return notify(`The following items are not available in inventory - ${unavailableItems.join(" || ")}`, "info", 4000)
            }
            else {
                selectedRow.forEach((item) => {
                    delete item.clientId
                    item.pO_Status = "Completed"
    
                    const stockEntries = {
                        StockEntryId: "",
                        StockEntryName: item.pO_ItemDescription,
                        StockEntryWarehouse: item.pO_WarehouseId,
                        StockEntryQuantity: item.pO_Quantity,
                        StockEntryTo: "Production",
                        StockEntryDate: moment(Date.now()).format('YYYY-MM-DD'),
                        productionOrderId: ""
                    }
    
                    dispatch(updatePoRouteStages(item, item.pO_RouteStageId)).then((res) => {
                        const data = res.payload.data
                        if (data.success) {
                            if (item.pO_WarehouseId !== "") {
                                dispatch(addStockEntries(stockEntries))
                            }

                            if(inventory.some((inve) => inve.inventoryItem === item.pO_ItemDescription)){
                                const itemX = inventory.find((invent) => invent.inventoryItem === item.pO_ItemDescription)
                                if(itemX){
                                    dispatch(updateInventory(itemX.inventoryId, {
                                        ...itemX,
                                        inventoryQuantity: itemX.inventoryQuantity - item.pO_Quantity
                                    }))
                                }
                            }
                        }
                    })
                })

                dispatch(getProductionOrder(0)).then((resX) => {
                    if (resX.payload.data.success) {
                        dispatch(getInventory())
                        notify("Route Stage Completed", "info", 2000)
                    }
                })
                toggle()
            }
        }
    }

    const handleOnCellPrepared = (e) => {
        if (e.rowType === "data" && e.column.dataField === "pO_Quantity") {
            if(dataSource[e.rowIndex]){
                const item = dataSource[e.rowIndex].pO_ItemDescription
                const warehouse = dataSource[e.rowIndex].pO_WarehouseId
                const requiredQuantity = dataSource[e.rowIndex].pO_Quantity

                const inventoryItem = inventory.find(inv => inv.inventoryItem === item && inv.inventoryWarehouse === warehouse)

                if (inventoryItem && inventoryItem.inventoryQuantity < requiredQuantity) {
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

    const renderRouteStageHeaderCell = (e) => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 8, paddingTop: 8 }}>
                <span style={{ color: "#444", fontSize: "14px", fontWeight: "700" }}>
                    {e.column.caption}
                </span>
            </div>
        )
    }

    const renderRouteStageCell = ({ data }) => {
        return (
            <CellContainer>
                <CellContent>
                    {data.pO_RouteStage}
                </CellContent>
            </CellContainer>
        )
    }

    const renderTypeCell = ({ data }) => {
        return (
            <CellContainer>
                <CellContent>
                    {data.pO_Type}
                </CellContent>
            </CellContainer>
        )
    }

    const renderItemNumberCell = ({ data }) => {
        return (
            <CellContainer>
                <CellContent>
                    {data.pO_ItemNo}
                </CellContent>
            </CellContainer>
        )
    }

    const renderNameCell = ({ data }) => {
        return (
            <CellContainer>
                <CellContent>
                    {data.pO_ItemDescription}
                </CellContent>
            </CellContainer>
        )
    }

    const renderQuantityColumn = ({ data }) => {
        return (
            <CellContainer>
                <CellContent>
                    {data.pO_Quantity}
                </CellContent>
            </CellContainer>
        )
    }

    const renderUomCell = ({ data }) => {
        return (
            <CellContainer>
                <CellContent>
                    {data.pO_Uom}
                </CellContent>
            </CellContainer>
        )
    }

    const renderWarehouseCell = ({ data }) => {
        return (
            <CellContainer>
                <CellContent>
                    {data.pO_WarehouseId}
                </CellContent>
            </CellContainer>
        )
    }

    const renderUnitPriceCell = ({ data }) => {
        return (
            <CellContainer>
                <CellContent>
                    {data.pO_UnitPrice.toLocaleString("en", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
                </CellContent>
            </CellContainer>
        )
    }

    const renderTotalCell = ({ data }) => {
        const value = data.pO_Quantity * data.pO_UnitPrice
        return (
            <CellContainer>
                <CellContent>
                    {value.toLocaleString("en", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
                </CellContent>
            </CellContainer>
        )
    }

    const renderBody = () => {
        return (
            <>
                <TreeList
                    elementAttr={{
                        id: "production-order-route-treelist",
                        class: "project-treelist"
                    }}
                    ref={treelistRef}
                    keyExpr={"pO_RouteStageId"}
                    showBorders={true}
                    showRowLines={true}
                    showColumnLines={true}
                    dataSource={dataSource}
                    allowColumnResizing={true}
                    rowAlternationEnabled={true}
                    noDataText={'No Route Stage Pending'}
                    className={'dev-form-treelist'}
                    columnResizingMode={"nextColumn"}
                    onCellPrepared={handleOnCellPrepared}>

                    <Selection
                        mode="multiple"
                        showCheckBoxesMode={'none'} />

                    <Scrolling mode={"standard"} />

                    <Editing
                        mode='cell'
                        allowUpdating={true}
                        startEditAction='dblClick'
                        selectTextOnEditStart={true}
                        texts={{ confirmDeleteMessage: '' }}
                    />

                    <Column
                        caption={"Route Stage"}
                        dataField={"pO_RouteStage"}
                        alignment={"left"}
                        allowSorting={false}
                        allowEditing={false}
                        cellRender={renderRouteStageCell}
                        headerCellRender={renderRouteStageHeaderCell}
                        cssClass={"project-treelist-item-column"}
                    />

                    <Column
                        caption={"Type"}
                        dataField={"pO_Type"}
                        alignment={"left"}
                        allowSorting={false}
                        allowEditing={false}
                        cellRender={renderTypeCell}
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-item-column"}
                    />

                    <Column
                        caption={"Item No"}
                        dataField={"pO_ItemNo"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderItemNumberCell}
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-item-column"}
                    />

                    <Column
                        width={140}
                        caption={"Item Description"}
                        dataField={"pO_ItemDescription"}
                        alignment={"left"}
                        allowEditing={false}
                        allowSorting={false}
                        cellRender={renderNameCell}
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-column"}
                    />

                    <Column
                        caption={"Quantity"}
                        dataField={"pO_Quantity"}
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
                        dataField={"pO_Uom"}
                        alignment={"left"}
                        allowEditing={false}
                        allowSorting={false}
                        cellRender={renderUomCell}
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-item-column"}
                    />

                    <Column
                        caption={"Warehouse"}
                        dataField={"pO_WarehouseId"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderWarehouseCell}
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-column"}
                    />

                    <Column
                        caption={"Unit Price"}
                        dataField={"pO_UnitPrice"}
                        alignment={"left"}
                        allowSorting={false}
                        editorOptions={"dxNumberBox"}
                        allowEditing={false}
                        cellRender={renderUnitPriceCell}
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-column"}
                    />

                    <Column
                        caption={"Total"}
                        dataField={"pO_Total"}
                        alignment={"left"}
                        allowSorting={false}
                        allowEditing={false}
                        cellRender={renderTotalCell}
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-column"}
                    />
                </TreeList>

                <Button id={"complete"} size="sm" className={"form-action-button"} style={{ marginTop: 10, float: "right" }} onClick={() => handleOnClick()}>
                    Complete
                </Button>
            </>
        )
    }

    return (
        <Modal size={"xl"} centered={false} backdrop={"static"} isOpen={createJobCard} toggle={toggle}>
            <ModalHeader className={"popup-header"} toggle={toggle}>Job Card</ModalHeader>
            <ModalBody>{renderBody()}</ModalBody>
        </Modal>
    )
}

export default CreateJobCard
