import React, { Fragment } from 'react'
import { DropIcon, Icon, ItemContainer, NavNavigationContainer, NavigationButton, SectionContainer, Title } from './StyledComponents'

const InventoryNavigation = (props) => {
    return (
        <Fragment>
            <SectionContainer>
                <DropIcon className={props.sectionsState.inventory ? 'fal fa-chevron-down' : 'fal fa-chevron-right'} marginTop={10} onClick={() => props.handleOnExpand('inventory')} /><Title marginTop={10} marginRight={87} onClick={() => props.handleOnSectionClick('inventory')}>Inventory</Title>
            </SectionContainer>
            <NavNavigationContainer height={props.sectionsState.inventory ? 180 : 0}>
                {props.navigations.map(item => {
                    return (
                        item.type === 'inventory' && (
                            <ItemContainer pad={item.pad} active={props.activeTab === item.id} onClick={() => props.handleOnClick(item)} key={item.id}>
                                <Icon className={item.icon} />
                                <NavigationButton style={{ paddingTop: 2 }}>{item.name}</NavigationButton>
                            </ItemContainer>
                        )
                    )
                })}
            </NavNavigationContainer>
        </Fragment>
    )
}

export default InventoryNavigation
