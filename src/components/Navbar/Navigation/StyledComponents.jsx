import styled from "styled-components"

export const SectionContainer = styled.div`
    display: flex;
    cursor: pointer;
    align-items: center;
`

export const NavNavigationContainer = styled.div`
    overflow: hidden;
    height: ${(prop) => prop.height}px;
    transition: height 0.4s ease-in-out;
`

export const DropIcon = styled.i`
    color: #333C44;
    font-weight: 700;

    margin-right: 4px;
    margin-top: ${(prop) => prop.marginTop}px;
`

export const Title = styled.span`
    font-size: 13px;
    font-family: 'RobotoFallback';
    
    color: #333C44;
    font-weight: 600;
    text-transform: uppercase;

    margin-top: ${(prop) => prop.marginTop}px;
    margin-right: ${(prop) => prop.marginRight}px;
`

export const ItemContainer = styled.div`
    width: 165px;
    font-size: 14px;
    border-radius: 5px;
    
    margin-top: 5px;
    margin-bottom: 2px;

    cursor: pointer;
    overflow: hidden;

    color: #1F272E;
    padding: ${(prop) => `8px 12px 8px ${prop.pad}px`};
    background-color: ${prop => prop.active ? "#EBEEF0" : "transparent"};

    &:hover{
        background-color: #EBEEF0;
    }
`

export const Icon = styled.i`
    font-size: 18px;
    position: relative;
`

export const NavigationButton = styled.button`
    border: none;
    background-color: transparent;
`