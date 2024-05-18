import React, { Fragment, useEffect, useRef, useState } from 'react'
import { CellContainer, CellContent, FormButtonContainer, FormGroupContainer, FormGroupItem, FormLabel } from '../../SupportComponents/StyledComponents'
import FormBackground from '../../SupportComponents/FormBackground'
import { NumberBox, SelectBox, TextBox, TreeList,CheckBox } from 'devextreme-react'
import DataSource from 'devextreme/data/data_source'
import styled from 'styled-components'
import { Column, Editing, Scrolling, Selection } from 'devextreme-react/tree-list'
import { useDispatch, useSelector } from 'react-redux'
import SelectBoxTreelist from '../../SupportComponents/SelectBoxTreelist'
import { Button } from 'reactstrap'
import notify from 'devextreme/ui/notify'
import { setItemResourceTreeRef } from '../../../actions/ViewActions'
import moment from 'moment'
import { assignClientId } from '../../../utilities/CommonUtilities'
import { Margin } from 'devextreme-react/bullet'

const CreateItem = () => {


    const [treeListData, setTreeListData] = useState([])
    const [invalid, setInvalid] = useState({ itemId: false, itemName: false, itemType: false, sellingRate: false, valuationRate: false, UOM: false })
    const [formData,setFormData]= useState ({active: false, itemName:"", itemType:"",valuationRate:"",sellingRate:"",UOM:""})
    const treeListRef = useRef(null)

    const itemResourceDatasource = new DataSource({
        store: {
            data: assignClientId(treeListData),
            type: 'array',
            key: 'clientId',
        }
    })

   
    const handleOnAddRow = () => {
        const newClientID = treeListData.length > 0 ? Math.max(...treeListData.map(item => item.clientId)) + 1 : 1
        const newRow = getItemResourceObj(newClientID)
        setTreeListData([...treeListData, newRow])
    }
    const handleOnFocusIn = (e) => {
        const name = e.event.target.accessKey
        setInvalid((prevInvalid) => ({
            ...prevInvalid,
            [name]: false,
        }))
    }
 
    const onValueChanged = (e, name) => {

        const value = e.value
        setFormData((prevState) => ({ ...prevState, [name]: value }))
    
     }

    const handleOnFocusOut = (e) => {
        const name = e.event.target.accessKey
       
         console.log(name)
            setInvalid((prevInvalid) => ({
                ...prevInvalid,
                [name]: formData[name] === "" ? true : false,
            }))
        
    }
    const handleOnRowRemove = (e) => {
        const updatedData = treeListData.filter(item => item.clientId !== e.row.key)
        setTreeListData(updatedData)
        
        itemResourceDatasource.store().remove(e.row.key).then(() => {
            itemResourceDatasource.reload()
        })
    }


    
    const renderContent = () => {
        return(
            <Fragment>
                
                <Header>
                    <HeaderSpan>Create Items</HeaderSpan>
                </Header>

                <form /*onSubmit={handleOnSubmit}*/>
                    <FormGroupContainer>
                        <div style={{ display: 'flex', justifyContent: "", marginTop: 5, marginBottom: 5 }}>
                            <div style={{width: 500, margin: "0 20px 20px 20px"}}>
                                <FormGroupItem>
                                    <FormLabel>Item Name</FormLabel>
                                    <TextBox
                                        elementAttr={{
                                            class: "form-textbox"
                                        }}
                                        accessKey={'itemName'}
                                       placeholder='Item Name'
                                       validationStatus={invalid.itemName === false ? "valid" : "invalid"}
                                       onFocusOut={handleOnFocusOut}
                                       onFocusIn={handleOnFocusIn}
                                      
                                    />
                                </FormGroupItem>
                            
                                <FormGroupItem>
                                    <FormLabel>Item Type</FormLabel>
                                    <TextBox
                                        elementAttr={{
                                            class: "form-textbox"
                                        }}
                                        accessKey={'itemType'}
                                        placeholder={'Item Type'}
                                        validationStatus={invalid.itemType === false ? "valid" : "invalid"}
                                        onFocusOut={handleOnFocusOut}
                                        onFocusIn={handleOnFocusIn}
                                    />
                                </FormGroupItem>

                                <FormGroupItem>
                                    <FormLabel>Selling Rate</FormLabel>
                                    <TextBox
                                        elementAttr={{
                                            class: "form-textbox"
                                        }}
                                        accessKey={'sellingRate'}
                                        placeholder='Selling Rate'
                                        validationStatus={invalid.sellingRate === false ? "valid" : "invalid"}
                                        onFocusOut={handleOnFocusOut}
                                        onFocusIn={handleOnFocusIn}
                                    />
                                </FormGroupItem>

                               
                            </div>
                            <div style={{width: 500, margin: "0 20px"}}>
                            <FormGroupItem>
                                    <FormLabel>Valuation Rate</FormLabel>
                                    <TextBox
                                        elementAttr={{
                                            class: "form-textbox"
                                        }}
                                        accessKey={'valuationRate'}
                                        placeholder={"Valuation Rate"}
                                        validationStatus={invalid.valuationRate === false ? "valid" : "invalid"}
                                        onFocusOut={handleOnFocusOut}
                                        onFocusIn={handleOnFocusIn}
                                        
                                    />
                                </FormGroupItem>
                                <FormGroupItem>
                                    <FormLabel>UOM</FormLabel>
                                    <TextBox
                                        elementAttr={{
                                            class: "form-textbox"
                                        }}
                                        accessKey={'UOM'}
                                        placeholder={"UOM"}
                                        validationStatus={invalid.UOM === false ? "valid" : "invalid"}
                                        onFocusOut={handleOnFocusOut}
                                        onFocusIn={handleOnFocusIn}
                                    />
                                </FormGroupItem>

                                <FormGroupItem>
                                    <FormLabel>Disable</FormLabel>  
                                    <CheckBox
                                    style={{
                                        marginBottom: 8
                                    }}
                                    
                                    value={formData.active}
                                    onValueChanged={(e) => onValueChanged(e, 'active')}
                                    />
                                </FormGroupItem>
                                <FormButtonContainer style={{ marginTop: 45 }}>
                                    <Button size="sm" className={"form-action-button"}>
                                        Save Item
                                    </Button>
                                </FormButtonContainer>
                            </div>
                        </div>
                    </FormGroupContainer>
                </form>
             </Fragment>
        )
    }
    // const renderHeaderCell = (e) => {
    //     return (
    //         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 8 }}>
    //             <span style={{ color: "#444", fontSize: "14px", fontWeight: "700" }}>
    //                 {e.column.caption}
    //             </span>
    //         </div>
    //     )
    // }

    const renderWarehouseID =(e)=>{
        return(
            <CellContainer>
            <CellContent>
                {e.data.warehouseId}
            </CellContent>
        </CellContainer>
        )

    }
    const handleOnSaved = (e) => {
        const data = e.changes[0].data
        if (!data.quantity) data.quantity = 0 
        if (!data.unitPrice) data.unitPrice = 0
        data.total = data.quantity * data.unitPrice
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
   

    const renderTypeContent = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.type}
                </CellContent>
            </CellContainer>
        )
    }

    const renderItemContent = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.id}
                </CellContent>
            </CellContainer>
        )
    }

    const renderWarehouseContent = (e) => {
        return (
            <CellContainer>
                <CellContent>
                    {e.data.warehouseId}
                </CellContent>
            </CellContainer>
        )
    }

    

    
    const renderNameCell = ({ data }) => {
        return (
            <CellContainer>
                <CellContent>
                    {data.name}
                </CellContent>
            </CellContainer>
        )
    }

    const renderQuantityColumn = ({ data }) => {
        return (
            <CellContainer>
                <CellContent>
                    {data.quantity}
                </CellContent>
            </CellContainer>
        )
    }

    const renderUomCell = ({ data }) => {
        return (
            <CellContainer>
                <CellContent>
                    {data.uom}
                </CellContent>
            </CellContainer>
        )
    }

   

    const renderPriceListCell = ({ data }) => {
        return (
            <CellContainer>
                <CellContent>
                    {data.priceList}
                </CellContent>
            </CellContainer>
        )
    }

    const renderUnitPriceCell = ({ data }) => {
        return (
            <CellContainer>
                <CellContent>
                    {data.unitPrice.toLocaleString("en", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
                </CellContent>
            </CellContainer>
        )
    }

    const renderTotalCell = ({ data }) => {
        const value = data.quantity * data.unitPrice 
        return (
            <CellContainer>
                <CellContent>
                    {value.toLocaleString("en", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
                </CellContent>
            </CellContainer>
        )
    }
    const renderAlertColumn = ({data})=>{
        return(

            <CheckBox style={ {alignItems: 'center', marginLeft:10}  }/>
        )
    }

    const renderActionColumn = (e) => {
        return (
            <ActionCellContainer>
                <button
                    title='Delete'
                    className='fal fa-trash treelist-delete-button'
                    onClick={() => handleOnRowRemove(e)} 
                    />

            </ActionCellContainer>
        )
    }
    
    const renderTreelist = () => {
        return (
            <Fragment>
                <div style={{ display: "flex", flexFlow: "row-reverse" }}>
                    <AddButton onClick={() => handleOnAddRow()}><i className='fal fa-plus' style={{ marginRight: 5 }} />Add Row</AddButton>
                </div>
                <TreeList
                    elementAttr={{
                        id: "createitem-treelist",
                        class: "project-treelist"
                    }}
                    keyExpr={"clientId"}
                    
                    showBorders={true}
                    showRowLines={true}
                    showColumnLines={true}
                    dataSource={itemResourceDatasource}
                    allowColumnResizing={true}
                    rowAlternationEnabled={true}
                    noDataText={'No Data'}
                    className={'dev-form-treelist'}
                    columnResizingMode={"nextColumn"}
                    onSaved={handleOnSaved}>
                    
                    
                    <Selection mode={"single"} />

                    <Scrolling mode={"standard"} />

                    <Editing
                        mode='cell'
                        allowUpdating={true}
                        startEditAction='dblClick'
                        selectTextOnEditStart={true} 
                        texts={{ confirmDeleteMessage: '' }}
                    />

                    <Column
                        caption={"Warehouse ID"}
                        dataField={"wrID"}
                        alignment={"left"}
                        allowSorting={false}
                        
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-item-column"}
                    />

                    <Column
                        
                        caption={"Warehouse Name"}
                        dataField={"name"}
                        alignment={"left"}
                        allowEditing={true}
                        allowSorting={false}
                        cellRender={renderNameCell} 
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-column"}
                    />
                    <Column
                        width={140} 
                        caption={"Available Qty "}
                        dataField={""}
                        alignment={"left"}
                        allowSorting={false}
                        allowEditing={true}
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-item-column"}
                    />
                        
                    <Column
                        caption={"Ordered Qty"}
                        dataField={""}
                        alignment={"left"}
                        allowSorting={false}
                        allowEditing={true}
                        editorOptions={"dxNumberBox"}
                        cellRender={renderQuantityColumn}
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-column"}
                    />

                    <Column
                        caption={"In Production"}
                        dataField={""}
                        alignment={"left"}
                        allowEditing={true}
                        allowSorting={false}
                        cellRender={renderUomCell} 
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-item-column"}
                    />

                    <Column
                        caption={"Alert"}
                        dataField={""}
                        alignment={"left"}
                        allowSorting={false}
                        CheckBox={true}
                        cellRender={renderAlertColumn}
                        headerCellRender={renderHeaderCell}
                        cssClass={"project-treelist-column"}
                    />
                     <Column
                        width={75}
                        minWidth={75}
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
        <FormBackground Form={[renderContent(), renderTreelist()]} />
    )
}

export default CreateItem


const setFormDataNumber = (formData) => {
    let result = ''
    if (formData.quantity !== null && formData.quantity !== undefined) {
        result = formData.quantity.toString()
    } 
    else if (formData.productionStdCost !== null && formData.productionStdCost !== undefined) {
        result = formData.productionStdCost.toString()
    }
    return result
}
const getItemResourceObj = (clientId) => {
    return {
        warehouseId: "",
        warehouseName: "",
        avaiableQty: "",
        orderedQty: 0,
        inProduction: "",
        alert:"",
        clientId: clientId
    }
}
const AddButton = styled.button`
    font-size: 13px;
        
    color: #4285f4b5;
    background-color: #FFFFFF;

    border: 1px solid #eeeeee; 
    cursor: pointer;

    width: auto;
    height: 30px;
    margin: 10px;
    border-radius: 5px;

    transition: 0.2s background-color, color;
    &:hover,
    &:focus,
    &:focus-within {
        background-color: #4285f4b5;
        color: #FFFFFF;
    }
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

const ActionCellContainer = styled.div`
    display: flex;
    font-size: 16px;
    align-items: center;
    justify-content: space-evenly;
`