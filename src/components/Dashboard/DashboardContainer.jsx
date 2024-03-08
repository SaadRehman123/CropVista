import React from 'react'
import useSignOut from 'react-auth-kit/hooks/useSignOut'
import { useNavigate } from 'react-router-dom'

const DashboardContainer = () => {

    const signOut = useSignOut()
    const navigate = useNavigate()

    const logout = () => {
        signOut()
        navigate('/auth/login')
    }

    return (
        <div>
            <h1>Dashboard</h1>
            <button className='auth-button' onClick={() => logout()}>logout</button>
        </div>
    )
}

export default DashboardContainer