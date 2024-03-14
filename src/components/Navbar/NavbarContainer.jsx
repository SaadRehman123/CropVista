import React, { useCallback, useState } from 'react'
import { useSelector } from 'react-redux'

import Drawer from 'devextreme-react/drawer'
import AppRoutes from '../../routes/AppRoutes'

import NavigationContainer from './Navigation/NavigationContainer'

import './styles.css'
import styled from 'styled-components'

const NavbarContainer = () => {

    const title = useSelector(state => state.view.setNavToolbarTitle)

    const [open, setOpen] = useState(false)
    const [over, setOver] = useState(false)
    
    const handleOnOutSideClick = useCallback(() => {
        setOpen(false)
        return false
    }, [setOpen])
    
    return (
        <div className="flex-container" style={{backgroundColor: '#F9FAFA'}}>
            <Container>
                <div id='side-nav' style={{ width: 32, cursor: "pointer" }} onMouseEnter={() => setOver(true)} onMouseLeave={() => setOver(false)} onClick={() => setOpen(!open)}>
                    <i className={`${setIcon(over, open)} nav-toggle-button`} />
                </div>
                <h3 className='nav-toolbar-title'>{title}</h3>
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
    display: flex;
    margin-top: 2px;
    margin-bottom: 5px;
    align-items: center;
`

const setIcon = (over, open) => {
    if(over && open) {
        return "fal fa-chevron-left"
    }
    else if(over && !open) {
        return "fal fa-chevron-right"
    }
    else {
        return "fal fa-bars"
    }
}