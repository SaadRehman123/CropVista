import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import useSignIn from 'react-auth-kit/hooks/useSignIn'

import { useNavigate } from 'react-router-dom'
import { loginUser } from '../../actions/UserActions'
import { getCookie } from '../../utilities/CommonUtilities'
import { renderLoadingView } from '../../actions/ViewActions'

import './styles.css'
import styled from 'styled-components'

const LoginForm = () => {

    const [ formData, setFormData ] = useState({ email: "", password: "" })

    const login = useSignIn()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        const cookie = getCookie("_auth")
        if (cookie !== null) navigate('/app/dashboard')
    }, [])

    const handleOnChange = (e) => {
        const { name, value } = e.target
        setFormData(prevState => ({ ...prevState, [name]: value }))
    }

    const handleOnSubmit = (e) => {
        e.preventDefault()
        
        dispatch(renderLoadingView(true))
        dispatch(loginUser(formData.email, formData.password)).then(res => {
            if(res.payload.data.success && res.payload.data.result.isAuthorized){
                login({
                    auth: {
                        token: res.payload.data.result.tokken,
                        tokenType: "Bearer"
                    },
                    userState:{
                        userId: res.payload.data.result.userId,
                        email: res.payload.data.result.email
                    }
                })
                
                navigate('/app/dashboard')

                setTimeout(() => { // remove this later 
                    dispatch(renderLoadingView(false))
                }, 1000)
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