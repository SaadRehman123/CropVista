import React from 'react'

import LowSupply from './LowSupply'
import CreateItem from './CreateItem'
import CreatePlan from './CreatePlan'
import DeletePopup from './DeletePopup'
import LogoutPopup from './LogoutPopup'
import CreateResource from './CreateResource'
import CreateWarehouse from './CreateWarehouse'

const PopupContainer = () => {
    return (
        <>
            <LowSupply />
            <CreatePlan />
            <CreateItem />
            <DeletePopup />
            <LogoutPopup />
            <CreateResource />
            <CreateWarehouse />
        </>
    )
}

export default PopupContainer
