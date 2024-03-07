import React from 'react'

import { Route, Routes } from 'react-router'

import LoginForm from '../components/Authentication/LoginForm'
import SignUpForm from '../components/Authentication/SignUpForm'
import OverLayForm from '../components/Authentication/OverLayForm'

const AuthRoutes = () => {
    return (
        <div id="main-container">
            <div className="auth-main-container" id='toggle-form'>
                <Routes>
                    <Route          
                        index     
                        path="login"
                        element={<LoginForm />}>
                    </Route>
                    <Route               
                        path="signup"
                        element={<SignUpForm />}>
                    </Route>
                </Routes>
                <OverLayForm />
            </div>
        </div>
    )
}

export default AuthRoutes
