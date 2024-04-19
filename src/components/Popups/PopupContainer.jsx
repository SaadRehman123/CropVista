import React from 'react'

import CreatePlan from './CreatePlan'
import DeletePopup from './DeletePopup'
import CreateWarehouse from './CreateWarehouse'
import GeneralSettingPopup from './GeneralSettingPopup'
import CreateResource from './CreateResource'

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
