import { Button } from 'reactstrap'
import React from 'react'
import { useNavigate } from 'react-router'

const DashboardContainer = () => {
    const navigate = useNavigate()

    return (
        <>
            <h1>Dashboard</h1>
            <Button outline onClick={() => navigate('/app/crops-planning')}>Crops Planning</Button>
        </>
    )
}

export default DashboardContainer