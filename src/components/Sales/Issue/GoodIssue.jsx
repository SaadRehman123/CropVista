import React, { Fragment, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { saveAs } from 'file-saver'
import { pdf } from '@react-pdf/renderer'

import moment from 'moment'
import GoodIssueReport from '../../Reports/GoodIssueReport'
import FormBackground from '../../SupportComponents/FormBackground'

import { Badge, Button } from 'reactstrap'
import { TreeList } from 'devextreme-react'
import { Column, HeaderFilter, Scrolling, Selection } from 'devextreme-react/tree-list'
import { CellContainer, CellContent, Header, HeaderSpan } from '../../SupportComponents/StyledComponents'

import { getGoodIssue, goodIssueActionType } from '../../../actions/SalesActions'
import { setGoodIssueRef, toggleDeletePopup } from '../../../actions/ViewActions'

import styled from 'styled-components'

const GoodIssue = () => {
    
    const user = useSelector(state => state.user.loginUser)
    const goodIssue = useSelector(state => state.sales.goodIssue)

    const navigate = useNavigate()
    const dispatch = useDispatch()
    
    const treeListRef = useRef()

    useEffect(() => {
        dispatch(setGoodIssueRef(treeListRef))
    }, [])

    useEffect(() => {
        dispatch(getGoodIssue(0))
    }, [])

    const handlePdfGenrating = async () => {
        const blob = await pdf(
            <GoodIssueReport
                user={user}
                reportGridRef={treeListRef}
            />
        ).toBlob()
        saveAs(blob, `Good Issue Report.pdf`)
    }

    const handleOnClick = () => {
        navigate('/app/Create_Good_Issue')
        dispatch(goodIssueActionType({ node: null, type: "CREATE" }))
    }

    const handleOnViewClick = (e) => {
        dispatch(goodIssueActionType({ node: e, type: "VIEW" }))
        navigate('/app/Create_Good_Issue')
    }

    const renderIdColumn = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.gi_Id}
                </CellContent>
            </CellContainer>
        )
    }

    const renderSaleOrderColumn = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.saleOrder_Id}
                </CellContent>
            </CellContainer>
        )
    }

    const renderNameColumn = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.customerName}
                </CellContent>
            </CellContainer>
        )
    }

    const renderContactColumn = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.customerNumber}
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

    const renderStatusColumn = (e) => {
        return (
             <CellContainer style={{ alignItems: 'center' }}>
                <Badge className={"status-badge"} color={setColor(e)}>
                    <span className='fad fa-circle' style={{ fontSize: 8, marginRight: 5, left: -3 }} />
                    <span>{e.data.gi_Status}</span>
                </Badge>
            </CellContainer>
        )
    }

    const renderActionColumn = (e) => {
        return (
            <ActionCellContainer>
                <button
                    title='View Good Issue'
                    className='fal fa-eye treelist-edit-button'
                    onClick={() => handleOnViewClick(e)} />

                {e.data.gi_Status === "Created" && (
                    <button
                        title='Cancel Good Issue'
                        className='fal fa-trash treelist-delete-button'
                        onClick={() => dispatch(toggleDeletePopup({ active: true, type:"GOOD_ISSUE" }))} />
                )}
            </ActionCellContainer>
        )
    }

    const renderTreelist = () => {
        return (
            <Fragment>
                <Header>
                    <HeaderSpan>Good Issue History</HeaderSpan>
                    <div>
                        <Button size="sm" className={"form-action-button"} onClick={() => handleOnClick()}>
                            <i style={{marginRight: 10}} className='fal fa-plus' />
                            Create Good Issue
                        </Button>

                        <Button style={{ marginLeft: 10 }} size="sm" className={"form-action-button"} onClick={() => handlePdfGenrating()}>
                            <i style={{marginRight: 10}} className='fal fa-file-pdf' />
                            Generate Pdf
                        </Button>
                    </div>
                </Header>

                <TreeList
                    elementAttr={{
                        id: "good-issue-treelist",
                        class: "project-treelist"
                    }}
                    ref={treeListRef}
                    showBorders={true}
                    showRowLines={true}
                    showColumnLines={true}
                    allowColumnResizing={true}
                    rowAlternationEnabled={true}
                    dataSource={goodIssue}
                    keyExpr={"gi_Id"}
                    height={"calc(100vh - 195px)"}
                    className={'dev-form-treelist'}
                    columnResizingMode={"nextColumn"}
                    noDataText={'No Good Issue'}>

                    <Selection mode={"single"} />

                    <Scrolling mode={"standard"} />

                    <HeaderFilter visible={true} allowSearch={true} />

                    <Column
                        caption={"GI-Id"}
                        dataField={"gi_Id"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderIdColumn}
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-item-column"}
                    />

                    <Column
                        caption={"SO-Id"}
                        dataField={"saleOrder_Id"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderSaleOrderColumn}
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-item-column"}
                    />

                    <Column
                        caption={"Customer Name"}
                        dataField={"customerName"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderNameColumn}
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-item-column"}
                    />

                    <Column
                        caption={"Contact"}
                        dataField={"customerNumber"}
                        alignment={"left"}
                        allowSorting={false}
                        cellRender={renderContactColumn}
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-item-column"}
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
                        width={123}
                        minWidth={123}
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

export default GoodIssue

const ActionCellContainer = styled.div`
    display: flex;
    font-size: 16px;
    align-items: center;
    justify-content: space-evenly;
`

const setColor = (e) => {
    let color

    if(e.data.gi_Status === "Created"){
        color = 'secondary'
    }
    if(e.data.gi_Status === "Paid"){
        color = 'success'
    }
    if(e.data.gi_Status === "Un-Paid"){
        color = 'warning'
    }
    else if(e.data.gi_Status === "SI Created"){
        color = 'info'
    }
    else if(e.data.gi_Status === "Cancelled"){
        color = 'danger'
    }
    else if(e.data.gi_Status === "Over-Due"){
        color = 'danger'
    }

    return color
}