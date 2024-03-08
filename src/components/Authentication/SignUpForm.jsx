import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Mark from '../SupportComponents/Mark'

import { hashSync } from 'bcryptjs'
import { addUser, getAllUsers } from '../../actions/UserActions'

import './styles.css'
import styled from 'styled-components'

const SignUpForm = () => {

    const user = useSelector(state => state.user.users)
    
    const [disable, setDisable] = useState(false)
    const [success, setSuccess] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const [formData, setFormData] = useState({ name: "", email: "", password: "" })
    const [indicator, setIndicator] = useState({ name: false, email: false, password: false, isEmail: false })

    const dispatch = useDispatch()

    useEffect(() => {
        setTimeout(() => setSuccess(false), 1000)
    }, [success])

    const handleOnChange = (e) => {
        const { name, value } = e.target
        setFormData(prevState => ({ ...prevState, [name]: value }))
    }

    const handleOnSubmit = (e) => {
        e.preventDefault()

        const isEmailPresent = user.some(item => item.email === formData.email);

        if (formData.name.trim() === "" || formData.email.trim() === "" || formData.password.trim() === "" || isEmailPresent === true) {
            setIndicator({ 
                name: formData.name.trim() === "" ? true : false,
                email: formData.email.trim() === "" ? true : false,
                password: formData.password.trim() === "" ? true : false,
                isEmail: isEmailPresent ? true : false
            })
            setDisable(false)
        } 
        else {
            setDisable(true)
            dispatch(addUser({
                name: formData.name,
                email: formData.email,
                password: hashSync(formData.password, 10)
            })).then(res => {
                if(res.payload.data.success) {
                    setTimeout(() => {
                        dispatch(getAllUsers())
                        setFormData({ name:"", email:"", password:"" })
                        setSuccess(true)
                        setDisable(false)
                        setIndicator({
                            name: false,
                            email: false,
                            password: false,
                            isEmail: false
                        })
                    }, 1000)
                }
            })
        }
    }

    return (
        <div className="form-container sign-up-container">
            <Form onSubmit={handleOnSubmit}>
                <h1 className='auth-heading'>Create Account</h1>
                <Mark top={176} condition={indicator.name} title={"Invalid Name"} />
                <input value={formData.name} name='name' className='auth-input' type="text" placeholder="Name" autoComplete='new-Name' onChange={handleOnChange} />
                <Mark top={231} condition={indicator.email || indicator.isEmail} title={indicator.isEmail ? "Email Already Exists" : "Invalid Email"} />
                <input value={formData.email} name='email' className='auth-input' type="text" placeholder="Email" autoComplete='new-email' onChange={handleOnChange} />
                <TogglePassword
                    top={286}
                    display={formData.password.trim() === "" ? "none" : "block"}
                    className={showPassword ? 'fal fa-eye' : 'fal fa-eye-slash'}
                    onClick={() => setShowPassword(!showPassword)} 
                />
                <Mark top={286} condition={formData.password.trim() === "" && indicator.password} title={"Invalid Password"} />
                <input value={formData.password} name='password' className='auth-input' type={showPassword ? "text" : "password"} placeholder="Password" autoComplete='new-password' onChange={handleOnChange} />
                <button disabled={disable} style={{ backgroundColor: disable ? "#FFAFA0" : "#FF4B2B" }} className='auth-button'>{disable ? "Signing Up" : "Sign Up"}</button>
                <p style={{ fontSize: 14, marginTop: 10, display: success ? "block" : "none" }}>Account Created Successfully!</p>
            </Form>
        </div>
    )
}

export default SignUpForm

const Form = styled.form`
    background-color: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 0 50px;
    height: 100%;
    text-align: center;
`
const TogglePassword = styled.i`
    left: 308px;
    font-weight: 600;
    position: absolute;
    top: ${(props) => props.top}px;
    display: ${(props) => props.display};
`