import styled from "styled-components"

export const FormGroupContainer = styled.div`
    display: grid;
`

export const FormGroupItem = styled.div`
    display: grid;
    position: relative;
`

export const FormLabel = styled.label`
    font-size: 14px;
    font-weight: 600;
    font-family: 'RobotoFallback';

    margin-top: 10px;
    margin-bottom: 8px;
`

export const FormButtonContainer = styled.div`
    display: flex;
    align-items: center;
    flex-direction: row-reverse;
`

export const CellContainer = styled.div`
    display: flex;
    height: 100%;
`

export const CellContent = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding-left: 8px;
    padding-right: 8px;
`

export const Header = styled.div`
    padding: 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
`

export const HeaderSpan = styled.span`
    color: #495057;
    font-size: 16px;
    font-weight: 500;
    font-family: 'RobotoFallback';
`