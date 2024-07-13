import React, { Fragment, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { saveAs } from 'file-saver'
import { pdf } from '@react-pdf/renderer'

import moment from 'moment'
import FormBackground from '../../SupportComponents/FormBackground'
import PurchaseInvoiceReport from '../../Reports/PurchaseInvoiceReport'

import { Badge, Button } from 'reactstrap'
import { TreeList } from 'devextreme-react'
import { Column, HeaderFilter, Scrolling, Selection } from 'devextreme-react/tree-list'
import { CellContainer, CellContent, Header, HeaderSpan } from '../../SupportComponents/StyledComponents'

import { setPurchaseInvoiceRef } from '../../../actions/ViewActions'
import { getGoodReceipt, getPurchaseInvoice, purchaseInvoiceActionType, updateGoodReceipt, updatePurchaseInvoice } from '../../../actions/PurchaseAction'

import styled from 'styled-components'

const PurchaseInvoice = () => {

    const user = useSelector(state => state.user.loginUser)
    const goodReceipt = useSelector((state) => state.purchase.goodReceipt)
    const purchaseInvoice = useSelector(state => state.purchase.purchaseInvoice)

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const treeListRef = useRef()

    useEffect(() => {
        dispatch(setPurchaseInvoiceRef(treeListRef))
    }, [])

    useEffect(() => {
        dispatch(getPurchaseInvoice(0))
    }, [])

    const handlePdfGenrating = async () => {
        const blob = await pdf(
            <PurchaseInvoiceReport
                user={user}
                reportGridRef={treeListRef}
            />
        ).toBlob()
        saveAs(blob, `Purchase Invoice Report.pdf`)
    }

    useEffect(() => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const pastDueDateInvoices = purchaseInvoice.filter(item => {
            const dueDate = new Date(item.dueDate)
            dueDate.setHours(0, 0, 0, 0)
            return dueDate < today
        }).filter((pi) => pi.pi_Status === "Un-Paid")
        
        if(pastDueDateInvoices.length !== 0){
            pastDueDateInvoices.forEach((item) => {
                item.pi_Status = "Over-Due"
                dispatch(updatePurchaseInvoice(item, item.pi_Id)).then((res) => {
                    if(res.payload.data.success){
                        const gr = goodReceipt.find(item => item.gr_Id === res.payload.data.result.gr_Id)
                        dispatch(updateGoodReceipt({ ...gr, gr_Status: "Over-Due" }, gr.gr_Id)).then((resX) => {
                            if(resX.payload.data.success){
                                dispatch(getGoodReceipt(0))
                            }
                        })
                    }
                })
            })
        }
        
    }, [])

    const handleOnCreate = (e) => {
        dispatch(purchaseInvoiceActionType({ node: null, type: "CREATE" }))
        navigate('/app/Create_Purchase_Invoice')
    }
    
    const handleOnEditClick = (e) => {
        dispatch(purchaseInvoiceActionType({ node: e, type: "UPDATE" }))
        navigate('/app/Create_Purchase_Invoice')
    }

    const handleOnViewClick = (e) => {
        dispatch(purchaseInvoiceActionType({ node: e, type: "VIEW" }))
        navigate('/app/Create_Purchase_Invoice')
    }

    const renderPurchaseInvoice = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.pi_Id}
                </CellContent>
            </CellContainer>
        )
    }

    const renderGoodReceipt = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.gr_Id}
                </CellContent>
            </CellContainer>
        )
    }

    const renderVendorName = (e) => {
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

    const renderCreationDateColumn = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {moment(e.data.creationDate).format("DD/MM/YYYY")}
                </CellContent>
            </CellContainer>
        )
    }

    const renderDueDateColumn = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {moment(e.data.dueDate).format("DD/MM/YYYY")}
                </CellContent>
            </CellContainer>
        )
    }

    const renderStatusColumn = (e) => {
        return (
            <CellContainer style={{ alignItems: 'center' }}>
                <Badge className={"status-badge"} color={setColor(e)}>
                    <span className='fad fa-circle' style={{ fontSize: 8, marginRight: 5, left: -3 }} />
                    <span>{e.data.pi_Status}</span>
                </Badge>
            </CellContainer>
        )
    }

    const renderActionColumn = (e) => {
        return (
            <ActionCellContainer>
                <button
                    title='Edit Purchase Invoice'
                    className='fal fa-pen treelist-edit-button'
                    onClick={() => handleOnEditClick(e)} />
                <button
                    title='View Purchase Invoice'
                    className='fal fa-eye treelist-edit-button'
                    onClick={() => handleOnViewClick(e)} />
            </ActionCellContainer>
        )
    }

    const renderTreelist = () => {
        return (
            <Fragment>
                <Header>
                    <HeaderSpan>Purchase Invoice History</HeaderSpan>
                    <div>
                        <Button size="sm" className={"form-action-button"} onClick={() => handleOnCreate()}>
                            <i style={{ marginRight: 10 }} className='fal fa-plus' />
                            Create Purchase Invoice
                        </Button>
                        
                        <Button style={{ marginLeft: 10 }} size="sm" className={"form-action-button"} onClick={() => handlePdfGenrating()}>
                            <i style={{marginRight: 10}} className='fal fa-file-pdf' />
                            Generate Pdf
                        </Button>
                    </div>
                </Header>

                <TreeList
                    elementAttr={{
                        id: "purchase-invoice-treelist",
                        class: "project-treelist"
                    }}
                    ref={treeListRef}
                    showBorders={true}
                    showRowLines={true}
                    showColumnLines={true}
                    allowColumnResizing={true}
                    rowAlternationEnabled={true}
                    dataSource={purchaseInvoice}
                    keyExpr={"pi_Id"}
                    height={"calc(100vh - 195px)"}
                    className={'dev-form-treelist'}
                    columnResizingMode={"nextColumn"}
                    noDataText={'No Purchase Invoice'}>

                    <Selection mode={"single"} />

                    <Scrolling mode={"standard"} />

                    <HeaderFilter visible={true} allowSearch={true} />

                    <Column
                        caption={"PI-Id"}
                        dataField={"pi_Id"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderPurchaseInvoice}
                        headerCellRender={renderHeaderCell}
                        sortOrder={"asc"}
                        cssClass={"project-treelist-item-column"}
                    />

                    <Column
                        caption={"GR-Id"}
                        dataField={"gr_Id"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderGoodReceipt}
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-item-column"}
                    />

                    <Column
                        caption={"Vendor Name"}
                        dataField={"vendorName"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderVendorName}
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-column"}
                    />

                    <Column
                        caption={"Contact"}
                        dataField={"vendorNumber"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderVendorContact}
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-column"}
                    />

                    <Column
                        caption={"Creation Date"}
                        dataField={"creationDate"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderCreationDateColumn}
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-column"}
                    />

                    <Column
                        caption={"Due Date"}
                        dataField={"dueDate"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderDueDateColumn}
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-column"}
                    />

                    <Column
                        width={115}
                        minWidth={115}
                        caption={"Status"}
                        dataField={"pi_Status"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderStatusColumn}
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
                        allowFiltering={false}
                        cellRender={renderActionColumn}
                        headerCellRender={renderActionHeaderCell}
                        cssClass={"project-treelist-column"}
                    />
                </TreeList>
            </Fragment>
        )
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

    return (
        <FormBackground Form={[renderTreelist()]} />
    )
}

export default PurchaseInvoice

const ActionCellContainer = styled.div`
    display: flex;
    font-size: 16px;
    align-items: center;
    justify-content: space-evenly;
`

const setColor = (e) => {
    let color

    if(e.data.pi_Status === "Un-Paid"){
        color = 'warning'
    }
    else if(e.data.pi_Status === "Paid"){
        color = 'success'
    }
    else if(e.data.pi_Status === "Over-Due"){
        color = 'danger'
    }

    return color
}