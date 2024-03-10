import { Button } from 'reactstrap'
import React from 'react'
import { useNavigate } from 'react-router'

const DashboardContainer = () => {
    const navigate = useNavigate()

    return (
        <div style={{padding: 10}}>
            <Button outline onClick={() => navigate('/app/crops-planning')}>Crops Planning</Button>
        </div>
    )
}

export default DashboardContainer