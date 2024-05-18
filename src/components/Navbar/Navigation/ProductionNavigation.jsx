import React, { Fragment } from 'react'
import { DropIcon, Icon, ItemContainer, NavNavigationContainer, NavigationButton, SectionContainer, Title } from './StyledComponents'

const ProductionNavigation = (props) => {
    return (
        <Fragment>
            <SectionContainer>
                <DropIcon className={props.sectionsState.production ? 'fal fa-chevron-down' : 'fal fa-chevron-right'} marginTop={10} onClick={() => props.handleOnExpand('production')} /><Title marginTop={10} marginRight={78} onClick={() => props.handleOnSectionClick('production')}>Production</Title>
            </SectionContainer>
            <NavNavigationContainer height={props.sectionsState.production ? 150 : 0}>
                {props.navigations.map(item => {
                    return (
                        item.type === 'production' && (
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

export default ProductionNavigation
