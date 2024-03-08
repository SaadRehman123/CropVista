import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'

import './styles.css'

const OverLayForm = () => {

    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        const params = location.pathname.split('/')
        const container = document.getElementById('toggle-form')

        if (params[2] === 'signup') container.classList.add('right-panel-active')
        else if (params[2] === 'login') container.classList.remove('right-panel-active')
    }, [location.pathname])

    useEffect(() => {
        const signUpButton = document.getElementById('signUp')
        const signInButton = document.getElementById('login')
        const container = document.getElementById('toggle-form')

        const handleSignUpClick = () => {
            container.classList.add("right-panel-active")
            navigate('signup')
        }

        const handleSignInClick = () => {
            container.classList.remove("right-panel-active")
            navigate('login')
        }

        signInButton.addEventListener('click', handleSignInClick)
        signUpButton.addEventListener('click', handleSignUpClick)

        return () => {
            signUpButton.removeEventListener('click', handleSignUpClick)
            signInButton.removeEventListener('click', handleSignInClick)
        }
    }, [navigate])

    return (
        <div className="overlay-container">
            <div className="overlay">
                <div className="overlay-panel overlay-left">
                    <h1 className='auth-heading'>Welcome Back!</h1>
                    <p className='auth-paragraph'>To keep connected with us please login with your personal info</p>
                    <button className="auth-button ghost" id="login">Login</button>
                </div>
                <div className="overlay-panel overlay-right">
                    <h1 className='auth-heading'>Hello, Friend!</h1>
                    <p className='auth-paragraph'>Enter your personal details and begin your agricultural journey with us</p>
                    <button className="auth-button ghost" id="signUp">Sign Up</button>
                </div>
            </div>
        </div>
    )
}

export default OverLayForm