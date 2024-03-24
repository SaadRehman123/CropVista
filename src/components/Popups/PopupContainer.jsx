import React from 'react'

import CreatePlan from './CreatePlan'
import DeletePopup from './DeletePopup'
import GeneralSettingPopup from './GeneralSettingPopup'

const PopupContainer = () => {
    return (
        <>
            <CreatePlan />
            <DeletePopup />
            <GeneralSettingPopup />
        </>
    )
}

export default PopupContainer
