import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import notify from 'devextreme/ui/notify'
import FormBackground from '../../SupportComponents/FormBackground'

import { Button } from 'reactstrap'
import { CheckBox, TextBox } from 'devextreme-react'
import { FormButtonContainer, FormGroupContainer, FormGroupItem, FormLabel, Header, HeaderSpan } from '../../SupportComponents/StyledComponents'

import { addCustomerMaster, getCustomerMaster, updateCustomerMaster } from '../../../actions/CustomerActions'

const CreateCustomer = () => {
    
    const customerMasterAction = useSelector(state => state.customer.customerMasterAction)

    const [formData, setFormData] = useState({ customerName:"", customerAddress:"", customerNumber:"", customerEmail: "", disable: false })
    const [invalid, setInvalid] = useState({ customerName: false, customerAddress: false, customerNumber: false })

    const dispatch = useDispatch()

    useEffect(() => {
        if (customerMasterAction.type === "UPDATE" || customerMasterAction.type === "VIEW") {          
            
            const data = customerMasterAction.node.data
            
            setFormData({
                customerName:data.customerName,
                customerAddress:data.customerAddress,
                customerNumber:data.customerNumber,
                customerEmail: data.customerEmail, 
                disable:data.disable,
            })
        }
    }, [customerMasterAction.type])

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

        if (formData.customerName === "" || formData.customerAddress === "" || formData.customerNumber === "") {
            return notify("Form fields cannot be empty", "error", 2000)
        }

        if (invalid.customerName === true || invalid.customerAddress === true || invalid.customerNumber === true) {
            return notify("Please correct the invalid fields", "error", 2000)
        }

        const customer = {
            customerId: "",
            customerName: formData.customerName,
            customerAddress: formData.customerAddress,
            customerNumber: formData.customerNumber,
            customerEmail:  formData.customerEmail,
            disable: formData.disable
        }

        if (customerMasterAction.type === "CREATE") {
            dispatch(addCustomerMaster(customer)).then((res) => {
                const data = res.payload.data
                if(data.success){
                    notify("Customer Created Successfully", "info", 2000)
                    dispatch(getCustomerMaster())
                    
                    setFormData({ 
                        customerName:"", 
                        customerAddress:"",
                        customerEmail:"",
                        customerNumber:"",
                        disable: false
                    })
                }
                else {
                    notify(data.message, "info", 2000)
                }
            })
        }
        else if(customerMasterAction.type === "UPDATE"){
            dispatch(updateCustomerMaster(customerMasterAction.node.data.customerId, customer)).then(res => {
                const data = res.payload.data
                if(data.success){
                    notify("Customer Updated Successfully", "info", 2000)
                    dispatch(getCustomerMaster())
                }
            })
        }
    }

    const renderContent = () => {
        return(
            <Fragment>
                <Header>
                    <HeaderSpan>Create Customer</HeaderSpan>
                </Header>

                <form onSubmit={handleOnSubmit}>
                    <FormGroupContainer>
                        <div style={{ display: 'flex', marginTop: 5, marginBottom: 5 }}>
                            <div style={{width: 500, margin: "0 20px 20px 20px"}}>
                                <FormGroupItem>
                                    <FormLabel>Customer Name</FormLabel>
                                    <TextBox
                                        elementAttr={{
                                            class: "form-textbox"
                                        }}
                                        accessKey={'customerName'}
                                        placeholder='Enter Customer Name'
                                        onFocusIn={handleOnFocusIn}
                                        onFocusOut={handleOnFocusOut}
                                        value={formData.customerName}
                                        onValueChanged={(e) => onValueChanged(e, 'customerName')}
                                        readOnly={customerMasterAction.type === "VIEW" ? true : false}
                                        validationStatus={invalid.customerName === false ? "valid" : "invalid"}
                                    />
                                </FormGroupItem>
                            
                                <FormGroupItem>
                                    <FormLabel>Address</FormLabel>
                                    <TextBox
                                        elementAttr={{
                                            class: "form-textbox"
                                        }}
                                        accessKey={'customerAddress'}
                                        placeholder='Enter Address'
                                        onFocusIn={handleOnFocusIn}
                                        onFocusOut={handleOnFocusOut}
                                        value={formData.customerAddress}
                                        onValueChanged={(e) => onValueChanged(e, 'customerAddress')}
                                        readOnly={customerMasterAction.type === "VIEW" ? true : false}
                                        validationStatus={invalid.customerAddress === false ? "valid" : "invalid"}
                                    />
                                </FormGroupItem>
                                
                                <FormGroupItem>
                                    <FormLabel>Disable</FormLabel>
                                    <CheckBox
                                        style={{ marginTop: 7 }}
                                        value={formData.disable}
                                        onValueChanged={(e) => onValueChanged(e, 'disable')}
                                        disabled={customerMasterAction.type === "VIEW" ? true : false}
                                    />
                                </FormGroupItem>
                            </div>

                            <div style={{width: 500, margin: "0 20px"}}>
                                <FormGroupItem>
                                    <FormLabel>Contact Number</FormLabel>
                                    <TextBox
                                        elementAttr={{
                                            class: "form-numberbox"
                                        }}
                                        onFocusIn={handleOnFocusIn}
                                        onFocusOut={handleOnFocusOut}
                                        value={formData.customerNumber}
                                        accessKey={'customerNumber'}
                                        placeholder='Enter Contact Number'
                                        onValueChanged={(e) => onValueChanged(e, 'customerNumber')}
                                        readOnly={customerMasterAction.type === "VIEW" ? true : false}
                                        validationStatus={invalid.customerNumber === false ? "valid" : "invalid"}
                                    />
                                </FormGroupItem>

                                <FormGroupItem>
                                    <FormLabel>Email</FormLabel>
                                    <TextBox
                                        elementAttr={{
                                            class: "form-textbox"
                                        }}
                                        accessKey={'customerEmail'}
                                        placeholder='Enter Customer Email'
                                        onFocusIn={handleOnFocusIn}
                                        onFocusOut={handleOnFocusOut}
                                        value={formData.customerEmail}
                                        onValueChanged={(e) => onValueChanged(e, 'customerEmail')}
                                        readOnly={customerMasterAction.type === "VIEW" ? true : false}
                                    />
                                </FormGroupItem>

                                {customerMasterAction.type !== "VIEW" && (
                                    <FormButtonContainer style={{ marginTop: 45 }}>
                                        <Button size="sm" className={"form-action-button"}>
                                            {customerMasterAction.type === "UPDATE" ? "Update" : "Save"} Customer
                                        </Button>
                                    </FormButtonContainer>
                                )}
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

export default CreateCustomer
