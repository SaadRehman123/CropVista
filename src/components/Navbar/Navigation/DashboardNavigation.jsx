import React, { Fragment } from 'react'
import { DropIcon, Icon, ItemContainer, NavNavigationContainer, NavigationButton, SectionContainer, Title } from './StyledComponents'

const DashboardNavigation = (props) => {
    return (
        <Fragment>
            <SectionContainer>
                <DropIcon className={props.sectionsState.overview ? 'fal fa-chevron-down' : 'fal fa-chevron-right'} marginTop={13} onClick={() => props.handleOnExpand('overview')} /><Title marginTop={15} marginRight={95}>Overview</Title>
            </SectionContainer>
            <NavNavigationContainer height={props.sectionsState.overview ? 45 : 0}>
                {props.navigations.map(item => {
                    return (
                        item.type === 'overview' && (
                            <ItemContainer pad={item.pad} active={props.activeTab === item.name} onClick={() => props.handleOnClick(item)} key={item.id}>
                                <Icon className={item.icon} />
                                <NavigationButton>{item.name}</NavigationButton>
                            </ItemContainer>
                        )
                    )
                })}
            </NavNavigationContainer>
        </Fragment>
    )
}

export default DashboardNavigation
