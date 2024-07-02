import React, { Fragment } from 'react'
import { DropIcon, Icon, ItemContainer, NavNavigationContainer, NavigationButton, SectionContainer, Title } from './StyledComponents'

const SalesNavigation = (props) => {
    return (
        <Fragment>
            <SectionContainer>
                <DropIcon className={props.sectionsState.sales ? 'fal fa-chevron-down' : 'fal fa-chevron-right'} marginTop={10} onClick={() => props.handleOnExpand('sales')} /><Title marginTop={10} marginRight={116} onClick={() => props.handleOnSectionClick('sales')}>Sales</Title>
            </SectionContainer>
            <NavNavigationContainer height={props.sectionsState.sales ? 200 : 0}>
                {props.navigations.map(item => {
                    return (
                        item.type === 'sales' && (
                            <ItemContainer pad={item.pad} active={props.activeTab === item.name} onClick={() => props.handleOnClick(item)} key={item.id}>
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

export default SalesNavigation
