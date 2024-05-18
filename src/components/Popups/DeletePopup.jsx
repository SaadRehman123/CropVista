import React, { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Modal, ModalBody, ModalHeader } from 'reactstrap'

import moment from 'moment'
import notify from 'devextreme/ui/notify'

import { getItemMaster } from '../../actions/ItemActions'
import { toggleDeletePopup } from '../../actions/ViewActions'
import { deleteResource, getResource } from '../../actions/ResourceAction'
import { deleteCropsPlan, getPlannedCrops } from '../../actions/CropsActions'
import { deleteWarehouse, getWarehouse } from '../../actions/WarehouseAction'
import { deleteBom, deleteBomItemResource, getBom } from '../../actions/BomActions'

import styled from 'styled-components'
import { deletePoRouteStages, deleteProductionOrder, getProductionOrder } from '../../actions/ProductionOrderAction'

const DeletePopup = () => {
    
    const bomRef = useSelector((state) => state.view.bomRef)
    const resourceRef = useSelector(state => state.view.resourceRef)
    const cropPlanRef = useSelector((state) => state.view.cropPlanRef)
    const deletePopup = useSelector((state) => state.view.deletePopup)
    const warehouseRef = useSelector((state) => state.view.warehouseRef)
    const itemMasterRef = useSelector((state) => state.view.itemMasterRef)
    const productionOrderRef = useSelector((state) => state.view.productionOrderRef)

    const dispatch = useDispatch()

    const handleOnToggle = (PopupType) => dispatch(toggleDeletePopup({ active: false, type: PopupType }))

    const renderTitle = useMemo(() => {
        if (deletePopup.type === 'CROP_PLAN') {
            return 'Delete Crop Plan'
        }
        else if (deletePopup.type === 'WAREHOUSE') {
            return 'Delete Warehouse'
        }
        else if (deletePopup.type === 'RESOURCE') {
            return 'Delete Resource'
        }
        else if (deletePopup.type === 'BOM') {
            return 'Delete BOM'
        }
        else if (deletePopup.type === 'ITEM_MASTER') {
            return 'Delete Item'
        }
        else if (deletePopup.type === 'PRODUCTION_ORDER') {
            return 'Delete Production Order'
        }
    }, [deletePopup])

    const renderText = () => {
        if (deletePopup.type === 'CROP_PLAN') {
            return 'Are you sure you want to delete selected Crop Plan?'
        }
        else if (deletePopup.type === 'WAREHOUSE') {
            return 'Are you sure you want to delete selected Warehouse?'
        }
        else if (deletePopup.type === 'RESOURCE') {
            return 'Are you sure you want to delete selected Resource?'
        }
        else if (deletePopup.type === 'BOM') {
            return 'Are you sure you want to delete selected BOM?'
        }
        else if (deletePopup.type === 'ITEM_MASTER') {
            return 'Are you sure you want to delete selected Item?'
        }
        else if (deletePopup.type === 'PRODUCTION_ORDER') {
            return 'Are you sure you want to delete selected Production Order?'
        }
    }

    const handleOnSubmit = (e) => {
        e.preventDefault()
        if(deletePopup.type === "CROP_PLAN") {
            const instance = cropPlanRef.current.instance
            const selectedRow = instance.getSelectedRowsData()
            
            const obj = {
                id: selectedRow[0].id,
                season: selectedRow[0].season,
                crop: selectedRow[0].crop,
                acre: parseInt(selectedRow[0].acre),
                startdate: moment(selectedRow[0].startdate).format("YYYY-MM-DD"),
                enddate: moment(selectedRow[0].enddate).format("YYYY-MM-DD"),
                status: selectedRow[0].status,
            }

            dispatch(deleteCropsPlan(selectedRow[0].id, obj)).then(res => {
                const data = res.payload.data
                if(data.success){
                    instance.getDataSource().store().remove(data.result.id)
                    instance.refresh()
                }
                else {
                    notify(data.message + " ...Refreshing", "info", 2000)
                    setTimeout(() => dispatch(getPlannedCrops()), 1000)
                }
            })
            handleOnToggle(deletePopup.type)
        }
        else if(deletePopup.type === "WAREHOUSE") {
            const instance = warehouseRef.current.instance
            const selectedRow = instance.getSelectedRowsData()
            
            const obj = {
                wrId: selectedRow[0].wrId,
                name: selectedRow[0].name,
                wrType: selectedRow[0].wrType,
                location: selectedRow[0].location,
                active: selectedRow[0].active
            }

            dispatch(deleteWarehouse(selectedRow[0].wrId, obj)).then(res => {
                const data = res.payload.data
                if(data.success){
                    instance.getDataSource().store().remove(data.result.wrId)
                    instance.refresh()
                }
                else {
                    notify(data.message + " ...Refreshing", "info", 2000)
                    setTimeout(() => dispatch(getWarehouse()), 1000)
                }
            })
            handleOnToggle(deletePopup.type)
        }
        else if(deletePopup.type === "RESOURCE") {
            const instance = resourceRef.current.instance
            const selectedRow = instance.getSelectedRowsData()
            
            const obj = {
                rId: selectedRow[0].rId,
                name: selectedRow[0].name,
                rType: selectedRow[0].rType
            }

            dispatch(deleteResource(selectedRow[0].rId, obj)).then(res => {
                const data = res.payload.data
                if(data.success){
                    instance.getDataSource().store().remove(data.result.rId)
                    instance.refresh()
                }
                else {
                    notify(data.message + " ...Refreshing", "info", 2000)
                    setTimeout(() => dispatch(getResource()), 1000)
                }
            })
            handleOnToggle(deletePopup.type)
        }
        else if(deletePopup.type === "BOM") {
            const instance = bomRef.current.instance
            const selectedRow = instance.getSelectedRowsData()
            
            const obj = {
                BID : selectedRow[0].bid,
                productId : selectedRow[0].productId,
                productDescription : selectedRow[0].productDescription,
                productionStdCost : selectedRow[0].productionStdCost,
                quantity : selectedRow[0].quantity,
                wrId : selectedRow[0].wrId,
                priceList : selectedRow[0].priceList,
                total : selectedRow[0].total,
                productPrice : selectedRow[0].productPrice,
                creationDate : selectedRow[0].creationDate,
                itemBID : ""
            }

            selectedRow[0].children.map((item) => {
                dispatch(deleteBomItemResource(item, item.itemResourceId)).then((res) => {
                    if(res.payload.data.success){
                        dispatch(deleteBom(obj, selectedRow[0].bid)).then((resX) => {
                            if(resX.payload.data.success){
                                instance.getDataSource().store().remove(selectedRow[0].bid)
                                instance.refresh()
                            }
                            else {
                                notify(res.payload.data.message + " ...Refreshing", "info", 2000)
                                setTimeout(() => dispatch(getBom(0)), 1000)
                            }
                        })
                    }
                })
            })

            handleOnToggle(deletePopup.type)
        }
        else if(deletePopup.type === "ITEM_MASTER") {
            const instance = itemMasterRef.current.instance
            const selectedRow = instance.getSelectedRowsData()
            
            const obj = {
                itemId: selectedRow[0].itemId,
                disable: selectedRow[0].disable,
                itemName: selectedRow[0].itemName,
                itemType: selectedRow[0].itemType,
                sellingRate: selectedRow[0].sellingRate,
                valuationRate: selectedRow[0].valuationRate,
                UOM: selectedRow[0].UOM
            }

            dispatch(deleteResource(selectedRow[0].itemId, obj)).then(res => {
                const data = res.payload.data
                if(data.success){
                    instance.getDataSource().store().remove(data.result.itemId)
                    instance.refresh()
                }
                else {
                    notify(data.message + " ...Refreshing", "info", 2000)
                    setTimeout(() => dispatch(getItemMaster()), 1000)
                }
            })
            handleOnToggle(deletePopup.type)
        }
        else if(deletePopup.type === "PRODUCTION_ORDER") {
            const instance = productionOrderRef.current.instance
            const selectedRow = instance.getSelectedRowsData()
            
            const obj = {
                "productionOrderId": selectedRow[0].productionOrderId,
                "productionNo": selectedRow[0].productionNo,
                "productDescription": selectedRow[0].productDescription,
                "productionStdCost": selectedRow[0].productionStdCost,
                "quantity": selectedRow[0].quantity,
                "status": selectedRow[0].status,
                "currentDate": selectedRow[0].currentDate,
                "startDate": selectedRow[0].startDate,
                "endDate": selectedRow[0].endDate,
                "warehouse": selectedRow[0].warehouse,
            }
            
            dispatch(deleteProductionOrder(obj, selectedRow[0].productionOrderId)).then((res) => {
                if (res.payload.data.success) {
                    instance.getDataSource().store().remove(res.payload.data.result.productionOrderId)
                    instance.refresh()
                    selectedRow[0].children.map((item) => {
                        dispatch(deletePoRouteStages(item, item.pO_RouteStageId))
                    })
                }
                else {
                    notify(res.payload.data.message + " ...Refreshing", "info", 2000)
                    setTimeout(() => dispatch(getProductionOrder(0)), 1000)
                }
            })
            handleOnToggle(deletePopup.type)
        }
    }

    return (
        <Modal centered={true} isOpen={deletePopup.active} backdrop={"static"} size="sm" toggle={handleOnToggle}>
            <ModalHeader toggle={handleOnToggle}>{renderTitle}</ModalHeader>
            <ModalBody>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <form onSubmit={handleOnSubmit}>
                        <span style={{ fontSize:14 }}>{renderText()}</span>
                    </form>
                    <div style={{ display: "flex", flexDirection: "row-reverse", marginTop: 10 }}>
                        <ConfirmButton onClick={handleOnSubmit}>Delete</ConfirmButton>
                        <CancelButton onClick={handleOnToggle}>Cancel</CancelButton>
                    </div>
                </div>
            </ModalBody>
        </Modal>
    )
}

export default DeletePopup

const ConfirmButton = styled.button`
    font-size: 13px;
        
    color: #DC3545;
    background-color: #FFFFFF;

    border: 1px solid #eeeeee; 
    cursor: pointer;

    width: auto;
    height: 30px;
    border-radius: 5px;
    margin-left: 4px;

    transition: 0.2s background-color, color;
    &:hover,
    &:focus,
    &:focus-within {
        background-color: #DC3545;
        color: #FFFFFF;
    }
`

const CancelButton = styled.button`
    font-size: 13px;
        
    color: #0A1A1E;
    background-color: #ffffff;

    border: 1px solid #eeeeee; 
    cursor: pointer;

    width: auto;
    height: 30px;
    border-radius: 5px;

    transition: 0.2s border-color;
    &:hover,
    &:focus,
    &:focus-within {
        border-color: #0A1A1E;
    }
`