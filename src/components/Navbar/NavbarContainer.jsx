import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Drawer from 'devextreme-react/drawer'
import AppRoutes from '../../routes/AppRoutes'

import NavigationContainer from './Navigation/NavigationContainer'

import { setNavToolbarTitle } from '../../actions/ViewActions'

import './styles.css'
import styled from 'styled-components'

const NavbarContainer = () => {

    const title = useSelector(state => state.view.setNavToolbarTitle)

    const dispatch = useDispatch()

    useEffect(() => {
        const url = window.location.href
        const index = url.indexOf('app/') + 4
        const name = url.slice(index)
        dispatch(setNavToolbarTitle(name))
    }, [window.location.href])

    const [open, setOpen] = useState(false)
    const [over, setOver] = useState(false)
    
    return (
        <div className="flex-container" style={{backgroundColor: '#F9FAFA'}}>
            <Container>
                <div id='side-nav' style={{ width: 32, cursor: "pointer" }} onMouseEnter={() => setOver(true)} onMouseLeave={() => setOver(false)} onClick={() => setOpen(!open)}>
                    <i className={`${setIcon(over, open)} nav-toggle-button`} />
                </div>
                <span className='nav-toolbar-title'>{title}</span>
            </Container>
            <div>
                <Drawer
                    opened={open}
                    height={"100%"}
                    position={"left"}
                    revealMode={"slide"}
                    openedStateMode={"shrink"}
                    closeOnOutsideClick={false}
                    className={'navbar-drawer-container'}
                    component={() => { return <NavigationContainer /> }}>
                    <div id="content">
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
    padding-top: 5px;
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