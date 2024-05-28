import React, { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Modal, ModalBody, ModalHeader } from 'reactstrap'

import moment from 'moment'
import notify from 'devextreme/ui/notify'

import { getItemMaster } from '../../actions/ItemActions'
import { toggleDeletePopup } from '../../actions/ViewActions'
import { deleteResource, getResource } from '../../actions/ResourceAction'
import { updateProductionOrder } from '../../actions/ProductionOrderAction'
import { deleteWarehouse, getWarehouse } from '../../actions/WarehouseAction'
import { deleteBom, deleteBomItemResource, getBom } from '../../actions/BomActions'
import { deleteCropsPlan, getPlannedCrops, updateCropsPlan } from '../../actions/CropsActions'

import styled from 'styled-components'

const DeletePopup = () => {
    
    const bomRef = useSelector((state) => state.view.bomRef)
    const resourceRef = useSelector(state => state.view.resourceRef)
    const cropPlanRef = useSelector((state) => state.view.cropPlanRef)
    const deletePopup = useSelector((state) => state.view.deletePopup)
    const plannedCrops = useSelector(state => state.crops.plannedCrops)
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
        else if (deletePopup.type === 'PRODUCTION_ORDER') {
            return 'Cancel Production Order'
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
        else if (deletePopup.type === 'PRODUCTION_ORDER') {
            return 'Are you sure you want to cancel selected Production Order?'
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
                itemId: selectedRow[0].itemId,
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
        else if(deletePopup.type === "PRODUCTION_ORDER") {
            const instance = productionOrderRef.current.instance
            const selectedRow = instance.getSelectedRowsData()
            
            const obj = {
                "productionOrderId": selectedRow[0].productionOrderId,
                "productionNo": selectedRow[0].productionNo,
                "productDescription": selectedRow[0].productDescription,
                "productionStdCost": selectedRow[0].productionStdCost,
                "quantity": selectedRow[0].quantity,
                "status": "Cancelled",
                "currentDate": selectedRow[0].currentDate,
                "startDate": selectedRow[0].startDate,
                "endDate": selectedRow[0].endDate,
                "warehouse": selectedRow[0].warehouse,
            }
            
            dispatch(updateProductionOrder(obj, obj.productionOrderId)).then((res) => {
                const data = res.payload.data
                if(data.success){
                    const result = data.result
                    if (plannedCrops.some(plannedCrop => plannedCrop.itemId === result.productionNo)) {
                        const crop = plannedCrops.filter(plannedCrop => plannedCrop.itemId === result.productionNo && plannedCrop.status !== "Closed" && plannedCrop.status !== "Completed" && plannedCrop.status !== "Cancelled")
                        if(crop && crop.length > 0){
                            crop.forEach((crop) => {
                                let dataX = {
                                    "id": crop.id,
                                    "season": crop.season,
                                    "crop": crop.crop,
                                    "acre": crop.acre,
                                    "startdate": crop.startdate,
                                    "enddate": crop.enddate,
                                    "status": "Cancelled",
                                    "itemId": crop.itemId
                                }

                                dispatch(updateCropsPlan(dataX.id, dataX))
                            })

                            instance.getDataSource().store().update(result.productionOrderId, result).then(() => instance.refresh())
                            dispatch(getPlannedCrops())
                        }
                    }

                    notify("Production Order Cancelled", "info", 2000)
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
                        {deletePopup.type === "PRODUCTION_ORDER" ? (
                            <>
                                <ConfirmButton onClick={handleOnSubmit}>Cancel</ConfirmButton>
                            </>
                        ) : 
                        <>
                            <ConfirmButton onClick={handleOnSubmit}>Delete</ConfirmButton>
                            <CancelButton onClick={handleOnToggle}>Cancel</CancelButton>
                        </>}
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