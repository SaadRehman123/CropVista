import React, { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Modal, ModalBody, ModalHeader } from 'reactstrap'

import moment from 'moment'
import notify from 'devextreme/ui/notify'

import { toggleDeletePopup } from '../../actions/ViewActions'
import { deleteResource, getResource } from '../../actions/ResourceAction'
import { updateProductionOrder } from '../../actions/ProductionOrderAction'
import { getInventory, updateInventory } from '../../actions/InventoryAction'
import { deleteBom, deleteBomItemResource, getBom } from '../../actions/BomActions'
import { deleteCropsPlan, getPlannedCrops, updateCropsPlan } from '../../actions/CropsActions'
import { getGoodIssue, getSaleOrder, updateGoodIssue, updateSaleOrder } from '../../actions/SalesActions'
import { deleteVendorQuotation, getGoodReceipt, getPurchaseOrder, getPurchaseRequest, getRequestForQuotation, getVendorQuotation, updateGoodReceipt, updatePurchaseOrder, updatePurchaseRequest, updateRequestForQuotation, updateVendorQuotation } from '../../actions/PurchaseAction'

import styled from 'styled-components'

const DeletePopup = () => {
    
    const bomRef = useSelector((state) => state.view.bomRef)
    const saleOrder = useSelector(state => state.sales.saleOrder)
    const resourceRef = useSelector(state => state.view.resourceRef)
    const cropPlanRef = useSelector((state) => state.view.cropPlanRef)
    const deletePopup = useSelector((state) => state.view.deletePopup)
    const plannedCrops = useSelector(state => state.crops.plannedCrops)
    const saleOrderRef = useSelector((state) => state.view.saleOrderRef)
    const goodIssueRef = useSelector((state) => state.view.goodIssueRef)
    const inventory = useSelector(state => state.inventory.inventoryStatus)
    const purchaseOrder = useSelector(state => state.purchase.purchaseOrder)
    const goodReceiptRef = useSelector((state) => state.view.goodReceiptRef)
    const purchaseOrderRef = useSelector((state) => state.view.purchaseOrderRef)
    const purchaseRequest = useSelector(state => state.purchase.purchaseRequest)
    const vendorQuotation = useSelector(state => state.purchase.vendorQuotation)
    const vendorQuotationRef = useSelector((state) => state.view.vendorQuotationRef)
    const productionOrderRef = useSelector((state) => state.view.productionOrderRef)
    const purchaseRequestRef = useSelector((state) => state.view.purchaseRequestRef)
    const requestForQuotation = useSelector(state => state.purchase.requestForQuotation)
    const requestForQuotationRef = useSelector((state) => state.view.requestForQuotationRef)

    const dispatch = useDispatch()

    const handleOnToggle = (PopupType) => dispatch(toggleDeletePopup({ active: false, type: PopupType }))

    const renderTitle = useMemo(() => {
        if (deletePopup.type === 'CROP_PLAN') {
            return 'Delete Crop Plan'
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
        else if (deletePopup.type === 'PURCHASE_REQUEST') {
            return 'Cancel Purchase Request'
        }
        else if (deletePopup.type === 'REQUEST_FOR_QUOTATION') {
            return 'Cancel Request For Quotation'
        }
        else if (deletePopup.type === 'VENDOR_QUOTATION') {
            return 'Delete Vendor Quotation'
        }
        else if (deletePopup.type === 'PURCHASE_ORDER') {
            return 'Cancel Purchase Order'
        }
        else if (deletePopup.type === 'GOOD_RECEIPT') {
            return 'Cancel Good Receipt'
        }
        else if (deletePopup.type === 'SALE_ORDER') {
            return 'Cancel Sale Order'
        }
        else if (deletePopup.type === 'GOOD_ISSUE') {
            return 'Cancel Good Issue'
        }
    }, [deletePopup])

    const renderText = () => {
        if (deletePopup.type === 'CROP_PLAN') {
            return 'Are you sure you want to delete selected Crop Plan?'
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
        else if (deletePopup.type === 'PURCHASE_REQUEST') {
            return 'Are you sure you want to cancel purchase request?'
        }
        else if (deletePopup.type === 'REQUEST_FOR_QUOTATION') {
            return 'Are you sure you want to cancel request for quotation?'
        }
        else if (deletePopup.type === 'VENDOR_QUOTATION') {
            return 'Are you sure you want to delete selected Vendor Quotation?'
        }
        else if (deletePopup.type === 'PURCHASE_ORDER') {
            return 'Are you sure you want to cancel Purchase Order?'
        }
        else if (deletePopup.type === 'GOOD_RECEIPT') {
            return 'Are you sure you want to cancel Good Receipt?'
        }
        else if (deletePopup.type === 'SALE_ORDER') {
            return 'Are you sure you want to cancel Sale Order?'
        }
        else if (deletePopup.type === 'GOOD_ISSUE') {
            return 'Are you sure you want to cancel Good Issue?'
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
        else if(deletePopup.type === 'PURCHASE_REQUEST') {
            const instance = purchaseRequestRef.current.instance
            const selectedRow = instance.getSelectedRowsData()

            const obj = {
                pR_CreationDate: selectedRow[0].pR_CreationDate,
                pR_RequiredBy: selectedRow[0].pR_RequiredBy,
                pR_Status: "Cancelled",
                purchaseRequestId: selectedRow[0].purchaseRequestId,
                children: selectedRow[0].children
            }

            dispatch(updatePurchaseRequest(obj, obj.purchaseRequestId)).then(res => {
                const data = res.payload.data
                if(data.success){
                    dispatch(getPurchaseRequest(0))
                    instance.refresh()
                }
            })
            handleOnToggle(deletePopup.type)
        }
        else if(deletePopup.type === 'REQUEST_FOR_QUOTATION'){
            const instance = requestForQuotationRef.current.instance
            const selectedRow = instance.getSelectedRowsData()
        
            const obj = {
                rfq_Id: selectedRow[0].rfq_Id,
                pr_Id: selectedRow[0].pr_Id,
                rfq_RequiredBy: selectedRow[0].rfq_RequiredBy,
                rfq_CreationDate: selectedRow[0].rfq_CreationDate,
                rfq_Status: "Cancelled",
                childrenVendors: selectedRow[0].childrenVendors,
                childrenItems: selectedRow[0].childrenItems
            }

            dispatch(updateRequestForQuotation(obj, obj.rfq_Id)).then((res) => {
                const data = res.payload.data
                if(data.success){
                    const pr = purchaseRequest.find((item) => item.purchaseRequestId === obj.pr_Id && item.pR_Status === "RFQ Created")
                    if(pr){
                        dispatch(updatePurchaseRequest({ ...pr, pR_Status: "Created" }, pr.purchaseRequestId)).then((resX) => {
                            const data = resX.payload.data
                            if(data.success){
                                dispatch(getPurchaseRequest(0))
                                dispatch(getRequestForQuotation(0))
                            }
                        })
                    }                   
                }
            })
            handleOnToggle(deletePopup.type)
        }
        else if(deletePopup.type === 'VENDOR_QUOTATION'){
            const instance = vendorQuotationRef.current.instance
            const selectedRow = instance.getSelectedRowsData()

            const obj = {
                vq_Id: selectedRow[0].vq_Id,
                rfq_Id: selectedRow[0].rfq_Id,
                vendorId: selectedRow[0].vendorId,
                vendorName: selectedRow[0].vendorName,
                vendorNumber: selectedRow[0].vendorNumber,
                vendorAddress: selectedRow[0].vendorAddress,
                vq_Status: selectedRow[0].vq_Status,
                vq_CreationDate: selectedRow[0].vq_CreationDate,
                total: selectedRow[0].total,
                children: selectedRow[0].children
            }

            dispatch(deleteVendorQuotation(obj, obj.vq_Id)).then(res => {
                const data = res.payload.data
                if(data.success){
                    dispatch(getVendorQuotation(0)).then((resX) => {
                        const response = resX.payload.data 
                        if(response.success){
                            const vq = response.result.find((vq) => vq.rfq_Id === obj.rfq_Id && vq.vq_Status === "Created")
                            if(!vq){
                                const rfq = requestForQuotation.find((rfq) => rfq.rfq_Id === obj.rfq_Id && rfq.rfq_Status === "VQ Created")                            
                                if (rfq) {
                                    dispatch(updateRequestForQuotation({ ...rfq, rfq_Status: "Created" }, rfq.rfq_Id)).then((x) => {
                                        if(x.payload.data.success){
                                            dispatch(getRequestForQuotation(0))
                                        }
                                    })
                                }
                            }
                        }
                    })
                }
            })
            handleOnToggle(deletePopup.type)
        }
        else if(deletePopup.type === 'PURCHASE_ORDER'){
            const instance = purchaseOrderRef.current.instance
            const selectedRow = instance.getSelectedRowsData()
        
            const obj = {
                pro_Id: selectedRow[0].pro_Id, 
                pr_Id: selectedRow[0].pr_Id,
                creationDate: selectedRow[0].creationDate,
                requiredBy: selectedRow[0].requiredBy,
                purchaseOrderStatus: "Cancelled",
                vendorId: selectedRow[0].vendorId,
                vendorName: selectedRow[0].vendorName,
                vendorAddress: selectedRow[0].vendorAddress,
                vendorNumber: selectedRow[0].vendorNumber,
                total: selectedRow[0].total,
                children: selectedRow[0].children
            }

            dispatch(updatePurchaseOrder(obj, obj.pro_Id)).then(res => {
                if(res.payload.data.success){
                    const rfq = requestForQuotation.find(item => item.pr_Id === obj.pr_Id && item.rfq_Status === "Closed")
                    const vq = vendorQuotation.filter(item => item.rfq_Id === rfq.rfq_Id)
                    const pr = purchaseRequest.find((item) => item.purchaseRequestId === obj.pr_Id && item.pR_Status === "Ordered")

                    if(pr) dispatch(updatePurchaseRequest({ ...pr, pR_Status: "RFQ Created" }, pr.purchaseRequestId))
                    if(vq){
                        vq.forEach((item) => {
                            dispatch(updateVendorQuotation( { ...item, vq_Status: "Created" } , item.vq_Id))
                        })
                    }
                    if(rfq) dispatch(updateRequestForQuotation({ ...rfq, rfq_Status: "VQ Created" }, rfq.rfq_Id))
                 
                    dispatch(getPurchaseOrder(0))
                    dispatch(getPurchaseRequest(0))
                    dispatch(getVendorQuotation(0))
                    dispatch(getRequestForQuotation(0))
                }
            })
            handleOnToggle(deletePopup.type)
        }
        else if(deletePopup.type === 'GOOD_RECEIPT'){
            const instance = goodReceiptRef.current.instance
            const selectedRow = instance.getSelectedRowsData()
        
            const obj = {
                gr_Id: selectedRow[0].gr_Id,
                pro_Id: selectedRow[0].pro_Id,
                creationDate: selectedRow[0].creationDate,
                vendorId: selectedRow[0].vendorId,
                vendorName: selectedRow[0].vendorName,
                vendorAddress: selectedRow[0].vendorAddress,
                vendorNumber: selectedRow[0].vendorNumber,
                gr_Status: "Cancelled",
                total: selectedRow[0].total,
                children: selectedRow[0].children
            }

            dispatch(updateGoodReceipt(obj, obj.gr_Id)).then((res) => {
                if(res.payload.data.success){
                    const pro = purchaseOrder.find(item => item.pro_Id === obj.pro_Id && item.purchaseOrderStatus === "GR Created")
                   
                    if(pro) dispatch(updatePurchaseOrder({ ...pro, purchaseOrderStatus: "Created" }, pro.pro_Id))
                        
                    obj.children.forEach((child) => {
                        if(inventory.some((item) => item.inventoryItem === child.itemName)){
                            const item = inventory.find((item) => item.inventoryItem === child.itemName)
                            if(item){
                                dispatch(updateInventory(item.inventoryId, {
                                    ...item,
                                    inventoryQuantity: item.inventoryQuantity - child.itemQuantity
                                }))
                            }
                        }
                    })

                    dispatch(getInventory())
                    dispatch(getGoodReceipt(0))
                    dispatch(getPurchaseOrder(0))
                }
            })
            handleOnToggle(deletePopup.type)
        }
        else if(deletePopup.type === 'SALE_ORDER'){
            const instance = saleOrderRef.current.instance
            const selectedRow = instance.getSelectedRowsData()
        
            const obj = {
                saleOrder_Id: selectedRow[0].saleOrder_Id, 
                creationDate: selectedRow[0].creationDate, 
                deliveryDate: selectedRow[0].deliveryDate, 
                customerId: selectedRow[0].customerId, 
                customerName: selectedRow[0].customerName, 
                customerAddress: selectedRow[0].customerAddress, 
                customerNumber: selectedRow[0].customerNumber, 
                total: selectedRow[0].total, 
                so_Status: "Cancelled",
                children: selectedRow[0].children, 
            }

            dispatch(updateSaleOrder(obj, obj.saleOrder_Id)).then((res) => {
                if(res.payload.data.success){
                    dispatch(getSaleOrder(0))
                }
            })
            handleOnToggle(deletePopup.type)
        }
        else if(deletePopup.type === 'GOOD_ISSUE'){
            const instance = goodIssueRef.current.instance
            const selectedRow = instance.getSelectedRowsData()
        
            const obj = {
                gi_Id: selectedRow[0].gi_Id, 
                creationDate: selectedRow[0].creationDate, 
                saleOrder_Id: selectedRow[0].saleOrder_Id, 
                customerId: selectedRow[0].customerId, 
                customerName: selectedRow[0].customerName, 
                customerAddress: selectedRow[0].customerAddress, 
                customerNumber: selectedRow[0].customerNumber,
                total: selectedRow[0].total, 
                gi_Status: "Cancelled",
                children: selectedRow[0].children,
            }

            dispatch(updateGoodIssue(obj, obj.gi_Id)).then((res) => {
                const response = res.payload.data
                if(response.success){
                    const SO = saleOrder.find(item => item.saleOrder_Id === obj.saleOrder_Id)
                    if(SO){
                        dispatch(updateSaleOrder({ ...SO, so_Status: "Created" }, SO.saleOrder_Id)).then((resX) => {
                            if(resX.payload.data.success){
                                dispatch(getSaleOrder(0))
                            }
                        })
                    }

                    response.result.children.forEach((child) => {
                        if(inventory.some((item) => item.inventoryItem === child.itemName)){
                            const item = inventory.find((item) => item.inventoryItem === child.itemName)
                            if(item){
                                dispatch(updateInventory(item.inventoryId, {
                                    ...item,
                                    inventoryQuantity: item.inventoryQuantity + child.itemQuantity
                                }))
                            }
                        }
                    })

                    dispatch(getInventory())
                    dispatch(getGoodIssue(0))
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
                        {setComponent(deletePopup.type) ? (
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

const setComponent = (type) => {
    if(type === "PRODUCTION_ORDER"){
        return true
    }
    else if(type === "PURCHASE_REQUEST"){
        return true
    }
    else if(type === "REQUEST_FOR_QUOTATION"){
        return true
    }
    else if(type === "PURCHASE_ORDER"){
        return true
    }
    else if(type === "GOOD_RECEIPT"){
        return true
    }
    else if(type === "SALE_ORDER"){
        return true
    }
    else if(type === "GOOD_ISSUE"){
        return true
    }

    return false
}