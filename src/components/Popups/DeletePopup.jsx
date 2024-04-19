import React, { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Modal, ModalBody, ModalHeader } from 'reactstrap'

import moment from 'moment'
import notify from 'devextreme/ui/notify'

import { toggleDeletePopup } from '../../actions/ViewActions'
import { deleteResource, getResource } from '../../actions/ResourceAction'
import { deleteCropsPlan, getPlannedCrops } from '../../actions/CropsActions'
import { deleteWarehouse, getWarehouse } from '../../actions/WarehouseAction'

import styled from 'styled-components'

const DeletePopup = () => {
    
    const resourceRef = useSelector(state => state.view.resourceRef)
    const cropPlanRef = useSelector((state) => state.view.cropPlanRef)
    const deletePopup = useSelector((state) => state.view.deletePopup)
    const warehouseRef = useSelector((state) => state.view.warehouseRef)

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