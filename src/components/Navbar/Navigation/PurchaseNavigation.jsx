import React, { Fragment } from 'react'
import { DropIcon, Icon, ItemContainer, NavNavigationContainer, NavigationButton, SectionContainer, Title } from './StyledComponents'

const PurchaseNavigation = (props) => {
    return (
        <Fragment>
            <SectionContainer>
                <DropIcon className={props.sectionsState.purchase ? 'fal fa-chevron-down' : 'fal fa-chevron-right'} marginTop={10} onClick={() => props.handleOnExpand('purchase')} /><Title marginTop={10} marginRight={90} onClick={() => props.handleOnSectionClick('purchase')}>Purchase</Title>
            </SectionContainer>
            <NavNavigationContainer height={props.sectionsState.purchase ? 310 : 0}>
                {props.navigations.map(item => {
                    return (
                        item.type === 'purchase' && (
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

export default PurchaseNavigation
