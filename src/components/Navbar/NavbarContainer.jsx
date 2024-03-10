import React, { useCallback, useState } from 'react'

import Drawer from 'devextreme-react/drawer'
import AppRoutes from '../../routes/AppRoutes'

import NavigationContainer from '../Navigation/NavigationContainer'

import './styles.css'
import styled from 'styled-components'

const NavbarContainer = () => {

    const [open, setOpen] = useState(false)
    
    const handleOnOutSideClick = useCallback(() => {
        setOpen(false)
        return false
    }, [setOpen])
    
    return (
        <div className="flex-container" style={{backgroundColor: '#F9FAFA'}}>
            <Container>
                <span onClick={() => setOpen(!open)} className={`${!open ? 'fas fa-chevron-double-right' : 'fas fa-chevron-double-left'} nav-toggle-button`} />
                <span className='nav-title'>Dashboard</span>
            </Container>
            <div>
                <Drawer
                    opened={open}
                    height={"100%"}
                    position={"left"}
                    revealMode={"slide"}
                    openedStateMode={"shrink"}
                    className={'navbar-drawer-container'}
                    closeOnOutsideClick={handleOnOutSideClick}
                    component={() => { return <NavigationContainer /> }}>
                    <div id="content" className="dx-theme-background-color">
                        <AppRoutes />
                    </div>
                </Drawer>
            </div>
        </div>
    )
}

export default NavbarContainer

const Container = styled.div`
    margin-top: 2px;
    margin-bottom: 5px;
    display: flex;
    align-items: center;
`