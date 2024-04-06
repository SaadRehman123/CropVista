import React from 'react'

import CreatePlan from './CreatePlan'
import DeletePopup from './DeletePopup'
import CreateWarehouse from './CreateWarehouse'
import GeneralSettingPopup from './GeneralSettingPopup'

const PopupContainer = () => {
    return (
        <>
            <CreatePlan />
            <DeletePopup />
            <CreateWarehouse />
            <GeneralSettingPopup />
        </>
    )
}

export default PopupContainer
