import React, { Fragment, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import FormBackground from '../../SupportComponents/FormBackground'

import { Badge, Button } from 'reactstrap'
import TreeList, { Column, Scrolling, Selection } from 'devextreme-react/tree-list'
import { CellContainer, CellContent } from '../../SupportComponents/StyledComponents'

import { setVendorMasterRef, toggleDeletePopup } from '../../../actions/ViewActions'
import { getVendorMaster, vendorMasterActionType } from '../../../actions/VendorActions'

import styled from 'styled-components'

const VendorMaster = () => {

    const venderMaster = useSelector(state => state.vendor.vendorMaster)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const treeListRef = useRef(null)

    useEffect(() => {
        dispatch(setVendorMasterRef(treeListRef))
    }, [])

    useEffect(() => {
        dispatch(getVendorMaster())
    }, [])

    const handleOnCreateVendor = () => {
        dispatch(vendorMasterActionType({ node: null, type: "CREATE" }))
        navigate('/app/Create_Vendor')
    }

    const handleOnEditClick = (e) => {
        dispatch(vendorMasterActionType({ node: e, type: "UPDATE" }))
        navigate('/app/Create_Vendor')
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

    const renderVenderIdColumn = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.vendorId}
                </CellContent>
            </CellContainer>
        )
    }

    const renderVendorNameColumn = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.vendorName}
                </CellContent>
            </CellContainer>
        )
    }

    const renderVendorGroupColumn = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.vendorGroup}
                </CellContent>
            </CellContainer>
        )
    }

    const renderVendorTypeColumn = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.vendorType}
                </CellContent>
            </CellContainer>
        )
    }

    const renderVendorAddressColumn = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.vendorAddress}
                </CellContent>
            </CellContainer>
        )
    }

    const renderVendorContactColumn = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.vendorNumber}
                </CellContent>
            </CellContainer>
        )
    }
    
    const renderVendorEmailColumn = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.vendorEmail}
                </CellContent>
            </CellContainer>
        )
    }

    const renderVendorDisableColumn = (e) => {
        return (
            <CellContainer style={{ alignItems: 'center' }}>
                <Badge className={"active-badge"} color={!e.data.isDisabled ? "success" : "secondary"}>
                    <span className='fad fa-circle' style={{ fontSize: 8, marginRight: 5, left: -3 }} />
                    <span>{!e.data.isDisabled ? "Active" : "Disabled"}</span>
                </Badge>
            </CellContainer>
        )
    }

    const renderActionColumn = (e) => {
        return (
            <ActionCellContainer>
                <button
                    title='Edit Vendor'
                    className='fal fa-pen treelist-edit-button'
                    onClick={() => handleOnEditClick(e)}/>

                <button
                    title='Delete Vendor'
                    className='fal fa-trash treelist-delete-button'
                    onClick={() => dispatch(toggleDeletePopup({ active: true, type:"VENDOR_MASTER" }))} />
            </ActionCellContainer>
        )
    }

    const renderTreelist = () => {
        return (
            <Fragment>
                <Header>
                    <HeaderSpan>Vendor History</HeaderSpan>
                    <Button size="sm" className={"form-action-button"} onClick={() => handleOnCreateVendor()}>
                        <i style={{marginRight: 10}} className='fal fa-plus' />
                        Create Vendor
                    </Button>
                </Header>

                <TreeList
                    elementAttr={{
                        id: "vendor-master-treelist",
                        class: "project-treelist"
                    }}
                    keyExpr={"vendorId"}
                    ref={treeListRef}
                    showBorders={true}
                    showRowLines={true}
                    showColumnLines={true}
                    dataSource={venderMaster}
                    allowColumnResizing={true}
                    rowAlternationEnabled={true}
                    noDataText={'No Vendor'}
                    height={"calc(100vh - 195px)"}
                    className={'dev-form-treelist'}
                    columnResizingMode={"nextColumn"}>

                    <Selection mode={"single"} />

                    <Scrolling mode={"standard"} />

                    <Column
                        caption={"Vendor-Id"}
                        dataField={"vendorId"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderVenderIdColumn}
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-item-column"}
                    />

                    <Column
                        caption={"Vendor Name"}
                        dataField={"vendorName"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderVendorNameColumn}
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-item-column"}
                    />

                    <Column
                        caption={"Vendor Group"}
                        dataField={"vendorGroup"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderVendorGroupColumn} 
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-column"}
                    />
                        
                    <Column
                        caption={"Vendor Type"}
                        dataField={"vendorType"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderVendorTypeColumn} 
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-column"}
                    />

                    <Column
                        caption={"Address"}
                        dataField={"vendorAddress"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderVendorAddressColumn} 
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-column"}
                    />

                    <Column
                        caption={"Contact"}
                        dataField={"vendorNumber"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderVendorContactColumn} 
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-column"}
                    />

                    <Column
                        caption={"Email"}
                        dataField={"vendorEmail"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderVendorEmailColumn} 
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-column"}
                    />

                    <Column
                        caption={"Disable"}
                        dataField={"isDisabled"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderVendorDisableColumn} 
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-column"}
                    />

                    <Column
                        width={98}
                        minWidth={98}
                        caption={"Actions"}
                        dataField={"actions"}
                        alignment={"center"}
                        allowSorting={false}
                        cellRender={renderActionColumn}
                        headerCellRender={renderActionHeaderCell} 
                        cssClass={"project-treelist-column"}
                    />
                </TreeList>

            </Fragment>
        )
    }

    return (
        <FormBackground Form={[renderTreelist()]} />
    )
}

export default VendorMaster

const ActionCellContainer = styled.div`
    display: flex;
    font-size: 16px;
    align-items: center;
    justify-content: space-evenly;
`

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