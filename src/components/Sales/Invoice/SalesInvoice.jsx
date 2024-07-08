import React, { Fragment, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import moment from 'moment'
import FormBackground from '../../SupportComponents/FormBackground'

import { Badge, Button } from 'reactstrap'
import { TreeList } from 'devextreme-react'
import { Column, Scrolling, Selection } from 'devextreme-react/tree-list'
import { CellContainer, CellContent, Header, HeaderSpan } from '../../SupportComponents/StyledComponents'

import { setSaleInvoiceRef } from '../../../actions/ViewActions'
import { getGoodIssue, getSaleInvoice, saleInvoiceActionType, updateGoodIssue, updateSaleInvoice } from '../../../actions/SalesActions'

import styled from 'styled-components'

const SalesInvoice = () => {
    
    const goodIssue = useSelector((state) => state.sales.goodIssue)
    const saleInvoice = useSelector(state => state.sales.saleInvoice)

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const treeListRef = useRef()

    useEffect(() => {
        dispatch(setSaleInvoiceRef(treeListRef))
    }, [])

    useEffect(() => {
        dispatch(getSaleInvoice(0))
    }, [])

    useEffect(() => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const pastDueDateInvoices = saleInvoice.filter(item => {
            const dueDate = new Date(item.dueDate)
            dueDate.setHours(0, 0, 0, 0)
            return dueDate < today
        }).filter((si) => si.si_Status === "Un-Paid")
        
        if(pastDueDateInvoices.length !== 0){
            pastDueDateInvoices.forEach((item) => {
                item.si_Status = "Over-Due"
                dispatch(updateSaleInvoice(item, item.saleInvoice_Id)).then((res) => {
                    if(res.payload.data.success){
                        const gi = goodIssue.find(item => item.gi_Id === res.payload.data.result.gi_Id)
                        dispatch(updateGoodIssue({ ...gi, gi_Status: "Over-Due" }, gi.gi_Id)).then((resX) => {
                            if(resX.payload.data.success){
                                dispatch(getGoodIssue(0))
                            }
                        })
                    }
                })
            })
        }
        
    }, [])

    const handleOnEditClick = (e) => {
        dispatch(saleInvoiceActionType({ node: e, type: "UPDATE" }))
        navigate('/app/Create_Sale_Invoice')
    }
    
    const handleOnCreate = (e) => {
        dispatch(saleInvoiceActionType({ node: null, type: "CREATE" }))
        navigate('/app/Create_Sale_Invoice')
    }

    const renderSaleInvoice = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.si_Id}
                </CellContent>
            </CellContainer>
        )
    }

    const renderGoodIssue = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.gi_Id}
                </CellContent>
            </CellContainer>
        )
    }

    const renderCustomerName = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.customerName}
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
                    <span>{e.data.si_Status}</span>
                </Badge>
            </CellContainer>
        )
    }

    
    const renderActionColumn = (e) => {
        return (
            <ActionCellContainer>
                <button
                    title='Edit Sale Invoice'
                    className='fal fa-pen treelist-edit-button'
                    onClick={() => handleOnEditClick(e)} />
            </ActionCellContainer>
        )
    }

    const renderTreelist = () => {
        return (
            <Fragment>
                <Header>
                    <HeaderSpan>Sale Invoice History</HeaderSpan>
                    <Button size="sm" className={"form-action-button"} onClick={() => handleOnCreate()}>
                        <i style={{ marginRight: 10 }} className='fal fa-plus' />
                        Create Sale Invoice
                    </Button>
                </Header>

                <TreeList
                    elementAttr={{
                        id: "Sale-invoice-treelist",
                        class: "project-treelist"
                    }}
                    ref={treeListRef}
                    showBorders={true}
                    showRowLines={true}
                    showColumnLines={true}
                    allowColumnResizing={true}
                    rowAlternationEnabled={true}
                    dataSource={saleInvoice}
                    keyExpr={"pi_Id"}
                    height={"calc(100vh - 195px)"}
                    className={'dev-form-treelist'}
                    columnResizingMode={"nextColumn"}
                    noDataText={'No Sale Invoice'}>

                    <Selection mode={"single"} />

                    <Scrolling mode={"standard"} />

                    <Column
                        caption={"SI-Id"}
                        dataField={"si_Id"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderSaleInvoice}
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-item-column"}
                    />

                    <Column
                        caption={"GI-Id"}
                        dataField={"gi_Id"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderSaleInvoice}
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-item-column"}
                    />

                    <Column
                        caption={"Customer Name"}
                        dataField={"customerName"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderCustomerName}
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
                        dataField={"gi_Status"}
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

export default SalesInvoice

const ActionCellContainer = styled.div`
    display: flex;
    font-size: 16px;
    align-items: center;
    justify-content: space-evenly;
`

const setColor = (e) => {
    let color

    if(e.data.si_Status === "Un-Paid"){
        color = 'warning'
    }
    else if(e.data.si_Status === "Paid"){
        color = 'success'
    }
    else if(e.data.si_Status === "Over-Due"){
        color = 'danger'
    }
    else if(e.data.si_Status === "Cancelled"){
        color = 'danger'
    }

    return color
}