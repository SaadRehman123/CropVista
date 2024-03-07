import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

import { hashSync } from 'bcryptjs'
import { addUser } from '../../actions/UserAction'

import './styles.css'
import styled from 'styled-components'

const SignUpForm = () => {
    
    const [ formData, setFormData ] = useState({ name: "", email: "", password: "" })

    const dispatch = useDispatch()

    const handleOnChange = (e) => {
        const { name, value } = e.target
        setFormData(prevState => ({ ...prevState, [name]: value }))
    }

    const handleOnSubmit = (e) => {
        e.preventDefault()
    
        const data = {
            name: formData.name,
            email: formData.email,
            password: hashSync(formData.password, 10)
        }

        dispatch(addUser(data))
    }

    return (
        <div className="form-container sign-up-container">
            <Form onSubmit={handleOnSubmit}>
                <h1 className='auth-heading'>Create Account</h1>
                <input name='name' className='auth-input' type="text" placeholder="Name" autoComplete='new-Name' onChange={handleOnChange} />
                <input name='email' className='auth-input' type="text" placeholder="Email" autoComplete='new-email' onChange={handleOnChange}/>
                <input name='password' className='auth-input' type="password" placeholder="Password" autoComplete='new-password' onChange={handleOnChange} />
                {/* <input className='auth-input' type="password" placeholder="Confirm Password" autoComplete='new-confirm-password' /> */}
                <button className='auth-button'>Sign Up</button>
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