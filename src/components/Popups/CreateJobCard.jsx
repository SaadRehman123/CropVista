import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import notify from 'devextreme/ui/notify'

import { Button, Modal, ModalBody, ModalHeader } from 'reactstrap'
import { CellContainer, CellContent } from '../SupportComponents/StyledComponents'
import TreeList, { Column, Editing, Scrolling, Selection } from 'devextreme-react/tree-list'

import { toggleCreateJobCardPopup } from '../../actions/PopupActions'
import { getProductionOrder, updatePoRouteStages } from '../../actions/ProductionOrderAction'

const CreateJobCard = (props) => {
    
    const productionOrder = useSelector(state => state.production.productionOrder)
    const createJobCard = useSelector(state => state.popup.toggleCreateJobCardPopup)

    const [dataSource, setDataSource] = useState([])
    
    const dispatch = useDispatch()
    
    const treelistRef = useRef(null)

    useEffect(() => {
        const dataSource = productionOrder.filter((item) => item.productionNo === props.productionOrder)
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

        if (selectedRow && selectedRow.length > 0) {
            selectedRow.forEach((item) => {
                delete item.clientId
                item.pO_Status = "Completed"
    
                dispatch(updatePoRouteStages(item, item.pO_RouteStageId)).then((res) => {
                    const data = res.payload.data
                    if (data.success) {
                        dispatch(getProductionOrder(0)).then((resX) => {
                            if (resX.payload.data.success) {
                                notify("Route Stage Completed", "info", 2000)
                            }
                        })
                        toggle()
                    }
                })
            })
        }
    }

    const toggle = () => {
        dispatch(toggleCreateJobCardPopup(false))
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
                    columnResizingMode={"nextColumn"}>
                    
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
                
                <Button size="sm" className={"form-action-button"} style={{ marginTop: 10, float: "right" }} onClick={() => handleOnClick()}>
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