import React from 'react'

import CreateItem from './CreateItem'
import CreatePlan from './CreatePlan'
import DeletePopup from './DeletePopup'
import CreateResource from './CreateResource'
import CreateWarehouse from './CreateWarehouse'
import GeneralSettingPopup from './GeneralSettingPopup'
import LowSupply from './LowSupply'

const PopupContainer = () => {
    return (
        <>
            <LowSupply />
            <CreatePlan />
            <CreateItem />
            <DeletePopup />
            <CreateResource />
            <CreateWarehouse />
            <GeneralSettingPopup />
        </>
    )
}

export default PopupContainer
