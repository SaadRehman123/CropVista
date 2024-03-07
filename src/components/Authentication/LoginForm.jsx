import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

import './styles.css'
import styled from 'styled-components'
import { loginUser } from '../../actions/UserAction'

const LoginForm = () => {

    const [ formData, setFormData ] = useState({ email : "" , password : "" })
    
    const dispatch = useDispatch()
    
    const handleOnChange = (e) => {
        const { name, value } = e.target
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }))
    }

    const handleOnSubmit = (e) => {
        e.preventDefault()
        
        dispatch(loginUser(formData.email, formData.password)).then(res => {
            if(res.payload.data.success && res.payload.data.result.isAuthorized){
                alert("Login Success")
            }
            else{
                alert("Incorrect Credentials")
            }
        })
    }

    return (
        <div className="form-container sign-in-container">
            <Form onSubmit={handleOnSubmit}>
                <h1 className='auth-heading'>Login</h1>
                <input name='email' className='auth-input' type="text" placeholder="Email" autoComplete='new-email' onChange={handleOnChange} />
                <input name='password' className='auth-input' type="password" placeholder="Password" autoComplete='new-password' onChange={handleOnChange} />
                <button className='auth-button'>Login</button>
            </Form>
        </div>
    )
}

export default LoginForm

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