import React from 'react'

import CreatePlan from './CreatePlan'
import DeletePopup from './DeletePopup'
import CreateResource from './CreateResource'
import CreateWarehouse from './CreateWarehouse'
import GeneralSettingPopup from './GeneralSettingPopup'

const PopupContainer = () => {
    return (
        <>
            <CreatePlan />
            <DeletePopup />
            <CreateResource />
            <CreateWarehouse />
            <GeneralSettingPopup />
        </>
    )
}

export default PopupContainer
