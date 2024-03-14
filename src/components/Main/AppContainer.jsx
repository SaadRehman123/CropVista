import React from 'react'

import PopupContainer from '../Popups/PopupContainer'
import NavbarContainer from '../Navbar/NavbarContainer'
import ToolbarContainer from '../Toolbar/ToolbarContainer'

const AppContainer = () => {
    return (
        <>
            <ToolbarContainer />
            <NavbarContainer />
			<PopupContainer />
        </>
    )
}

export default AppContainer
