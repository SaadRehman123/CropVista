import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import Mark from '../SupportComponents/Mark'
import useSignIn from 'react-auth-kit/hooks/useSignIn'

import { useNavigate } from 'react-router-dom'
import { loginUser } from '../../actions/UserActions'
import { getCookie } from '../../utilities/CommonUtilities'
import { renderLoadingView, setLogin } from '../../actions/ViewActions'

import './styles.css'
import styled from 'styled-components'

const LoginForm = () => {

    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({ email: "", password: "" })
    const [indicator, setIndicator] = useState({ email: false, password: false })

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
        
        if (formData.email.trim() === "" || formData.password.trim() === "") {
            setIndicator({ 
                email: formData.email.trim() === "" ? true : false,
                password: formData.password.trim() === "" ? true : false
            })
        }
        else {
            dispatch(loginUser(formData.email, formData.password)).then(res => {
                if(res.payload.data.success && res.payload.data.result.isAuthorized){
                    dispatch(renderLoadingView(true))
                    login({
                        auth: {
                            token: res.payload.data.result.token,
                            tokenType: "Bearer"
                        },
                        userState:{
                            userId: res.payload.data.result.userId,
                            email: res.payload.data.result.email
                        }
                    })

                    dispatch(setLogin(true))
                    navigate('/app/dashboard')

                    setTimeout(() => { // remove this later
                        dispatch(renderLoadingView(false))
                    }, 1000)
                }
                else{
                    setIndicator({ email: true, password: true })
                }
            })
        }
    }

    return (
        <div className="form-container sign-in-container">
            <Form onSubmit={handleOnSubmit}>
                <h1 className='auth-heading'>Login</h1>
                <Mark top={201} condition={indicator.email} title={"Invalid Email"} />
                <input name='email' className='auth-input' type="text" placeholder="Email" autoComplete='new-email' onChange={handleOnChange} />
                <Mark top={259} condition={formData.password.trim() === "" && indicator.password} title={'Invalid Password'} />
                <TogglePassword
                    top={257}
                    display={formData.password.trim() === "" ? "none" : "block"}
                    className={showPassword ? 'fal fa-eye' : 'fal fa-eye-slash'}
                    onClick={() => setShowPassword(!showPassword)} 
                />
                <input name='password' className='auth-input' type={showPassword ? "text" : "password"} placeholder="Password" autoComplete='new-password' onChange={handleOnChange} />
                <button style={{ backgroundColor: "#FF4B2B" }} className='auth-button'>Login</button>
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
const TogglePassword = styled.i`
    left: 308px;
    font-weight: 600;
    position: absolute;
    top: ${(props) => props.top}px;
    display: ${(props) => props.display};
`