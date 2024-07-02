import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import notify from 'devextreme/ui/notify'
import FormBackground from '../../SupportComponents/FormBackground'

import { Button } from 'reactstrap'
import { NumberBox, SelectBox, TextBox, CheckBox } from 'devextreme-react'
import { FormButtonContainer, FormGroupContainer, FormGroupItem, FormLabel } from '../../SupportComponents/StyledComponents'

import { addVendorMaster, getVendorMaster, updateVendorMaster } from '../../../actions/VendorActions'

import styled from 'styled-components'

const CreateVendor = () => {

    const vendorMasterAction = useSelector(state => state.vendor.vendorMasterAction)

    const [formData, setFormData] = useState({ vendorName:"", vendorGroup:"", vendorType:"", isDisabled: false, vendorAddress:"", vendorNumber:"", vendorEmail: "" })
    const [invalid, setInvalid] = useState({ vendorName: false, vendorGroup: false, vendorType: false, vendorAddress: false, vendorNumber: false })

    const dispatch = useDispatch()

    useEffect(() => {
        if (vendorMasterAction.type === "UPDATE") {          
            
            const data = vendorMasterAction.node.data;
            
            setFormData({
                vendorName:data.vendorName,
                vendorGroup:data.vendorGroup,
                vendorType:data.vendorType,
                isDisabled:data.isDisabled,
                vendorAddress:data.vendorAddress,
                vendorNumber:data.vendorNumber.toString(),
                vendorEmail: data.vendorEmail 
            })
        }
    }, [vendorMasterAction.type])

    const onValueChanged = (e, name) => {
        const value = e.value
        setFormData((prevState) => ({ ...prevState, [name]: value }))
    }

    const handleOnFocusIn = (e) => {
        const name = e.event.target.accessKey
        setInvalid((prevInvalid) => ({
            ...prevInvalid,
            [name]: false,
        }))
    }

    const handleOnFocusOut = (e) => {
        const name = e.event.target.accessKey
        if (formData[name] === null) formData[name] = ""
        
        setInvalid((prevInvalid) => ({
            ...prevInvalid,
            [name]: formData[name].toString().trim() === "" ? true : false,
        }))
    }

    const handleOnSubmit = (e) => {
        e.preventDefault()

        if (formData.vendorName === "" || formData.vendorGroup === "" || formData.vendorType === "" || formData.vendorAddress === "" || formData.vendorNumber === "") {
            return notify("Form fields cannot be empty", "error", 2000)
        }

        if (invalid.vendorName === true || invalid.vendorGroup === true || invalid.vendorType === true || invalid.vendorAddress === true, invalid.vendorNumber === true) {
            return notify("Please correct the invalid fields", "error", 2000)
        }

        const vendor = {
            vendorId: "",
            vendorName: formData.vendorName,
            vendorGroup: formData.vendorGroup,
            vendorType: formData.vendorType,
            isDisabled: formData.isDisabled,
            vendorAddress: formData.vendorAddress,
            vendorNumber: formData.vendorNumber.toString(),
            vendorEmail:  formData.vendorEmail 
        }

        if (vendorMasterAction.type === "CREATE") {
            dispatch(addVendorMaster(vendor)).then((res) => {
                const data = res.payload.data
                if(data.success){
                    notify("Vendor Created Successfully", "info", 2000)
                    dispatch(getVendorMaster())
                    
                    setFormData({ 
                        vendorName:"", 
                        vendorGroup:"", 
                        vendorType:"",
                        isDisabled: false,
                        vendorAddress:"",
                        vendorNumber:"",
                        vendorEmail: ""
                    })
                }
                else {
                    notify(data.message, "info", 2000)
                }
            })
        }
        else if(vendorMasterAction.type === "UPDATE"){
            dispatch(updateVendorMaster(vendorMasterAction.node.data.vendorId, vendor)).then(res => {
                const data = res.payload.data
                if(data.success){
                    notify("Vendor Updated Successfully", "info", 2000)
                    dispatch(getVendorMaster())
                }
                else {
                    notify(data.message + " ...Refreshing", "info", 2000)
                    setTimeout(() => dispatch(getVendorMaster()), 1000)
                }
            })
        }
    }

    const renderContent = () => {
        return(
            <Fragment>
                <Header>
                    <HeaderSpan>Create Vendor</HeaderSpan>
                </Header>

                <form onSubmit={handleOnSubmit}>
                    <FormGroupContainer>
                        <div style={{ display: 'flex', marginTop: 5, marginBottom: 5 }}>
                            <div style={{width: 500, margin: "0 20px 20px 20px"}}>
                                <FormGroupItem>
                                    <FormLabel>Vendor Name</FormLabel>
                                    <TextBox
                                        elementAttr={{
                                            class: "form-textbox"
                                        }}
                                        accessKey={'vendorName'}
                                        placeholder='Enter Vendor Name'
                                        onFocusIn={handleOnFocusIn}
                                        onFocusOut={handleOnFocusOut}
                                        value={formData.vendorName}
                                        onValueChanged={(e) => onValueChanged(e, 'vendorName')}
                                        validationStatus={invalid.vendorName === false ? "valid" : "invalid"}
                                    />
                                </FormGroupItem>
                            
                                <FormGroupItem>
                                    <FormLabel>Vendor Type</FormLabel>
                                    <SelectBox
                                        elementAttr={{
                                            class: "form-selectbox"
                                        }}
                                        accessKey={'vendorType'}
                                        dataSource={["Individual", "Company" ]}
                                        openOnFieldClick={true}
                                        value={formData.vendorType}
                                        onFocusIn={handleOnFocusIn}
                                        onFocusOut={handleOnFocusOut}
                                        placeholder={"Select Vendor Type"}
                                        dropDownOptions={{ maxHeight: 300 }}
                                        onValueChanged={(e) => onValueChanged(e, 'vendorType')}
                                        validationStatus={invalid.vendorType === false ? "valid" : "invalid"}
                                    />
                                </FormGroupItem>

                                <FormGroupItem>
                                    <FormLabel>Address</FormLabel>
                                    <TextBox
                                        elementAttr={{
                                            class: "form-textbox"
                                        }}
                                        accessKey={'vendorAddress'}
                                        placeholder='Enter Address'
                                        onFocusIn={handleOnFocusIn}
                                        onFocusOut={handleOnFocusOut}
                                        value={formData.vendorAddress}
                                        onValueChanged={(e) => onValueChanged(e, 'vendorAddress')}
                                        validationStatus={invalid.vendorAddress === false ? "valid" : "invalid"}
                                    />
                                </FormGroupItem>
                                
                                <FormGroupItem>
                                    <FormLabel>Disable</FormLabel>
                                    <CheckBox
                                        style={{ marginTop: 7 }}
                                        value={formData.isDisabled}
                                        onValueChanged={(e) => onValueChanged(e, 'isDisabled')}
                                    />
                                </FormGroupItem>
                            </div>

                            <div style={{width: 500, margin: "0 20px"}}>
                                <FormGroupItem>
                                    <FormLabel>Vendor Group</FormLabel>
                                    <TextBox
                                        elementAttr={{
                                            class: "form-textbox"
                                        }}
                                        accessKey={'vendorGroup'}
                                        placeholder='Enter Vendor Group'
                                        onFocusIn={handleOnFocusIn}
                                        onFocusOut={handleOnFocusOut}
                                        value={formData.vendorGroup}
                                        onValueChanged={(e) => onValueChanged(e, 'vendorGroup')}
                                        validationStatus={invalid.vendorGroup === false ? "valid" : "invalid"}
                                    />
                                </FormGroupItem>

                                <FormGroupItem>
                                    <FormLabel>Email</FormLabel>
                                    <TextBox
                                        elementAttr={{
                                            class: "form-textbox"
                                        }}
                                        accessKey={'vendorEmail'}
                                        placeholder='Enter Vendor Email'
                                        onFocusIn={handleOnFocusIn}
                                        onFocusOut={handleOnFocusOut}
                                        value={formData.vendorEmail}
                                        onValueChanged={(e) => onValueChanged(e, 'vendorEmail')}
                                    />
                                </FormGroupItem>

                                <FormGroupItem>
                                    <FormLabel>Contact Number</FormLabel>
                                    <NumberBox
                                        elementAttr={{
                                            class: "form-numberbox"
                                        }}
                                        type={"number"}
                                        onFocusIn={handleOnFocusIn}
                                        onFocusOut={handleOnFocusOut}
                                        value={formData.vendorNumber}
                                        accessKey={'vendorNumber'}
                                        placeholder='Enter Contact Number'
                                        onValueChanged={(e) => onValueChanged(e, 'vendorNumber')}
                                        validationStatus={invalid.vendorNumber === false ? "valid" : "invalid"}
                                    />
                                </FormGroupItem>

                                <FormButtonContainer style={{ marginTop: 45 }}>
                                    <Button size="sm" className={"form-action-button"}>
                                        {vendorMasterAction.type === "UPDATE" ? "Update" : "Save"} Vendor
                                    </Button>
                                </FormButtonContainer>
                            </div>
                        </div>
                    </FormGroupContainer>
                </form>
            </Fragment>
        )
    }

    return (
        <FormBackground Form={[renderContent()]} />
    )
}

export default CreateVendor

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