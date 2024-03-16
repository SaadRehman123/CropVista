import styled from "styled-components"

export const Form = styled.form`
    padding: 20px;
`

export const FormGroupContainer = styled.div`
    display: grid;
    grid-template-columns: 50% 50%;
`

export const FormGroupItem = styled.div`
    display: grid;
    position: relative;
`

export const FormLabel = styled.label`
    font-size: 14px;
    font-weight: 600;
    font-family: Roboto;

    margin-top: 10px;
    margin-bottom: 8px;
`

export const FormButtonContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
`

export const FormButton = styled.button`
    width: 95px;
    height: 32px;

    font-size: 14px;
    font-family: Roboto;

    color: #0A1A1E;
    background-color: #ffffff;
    
    cursor: pointer;
    border: 1px solid #eeeeee;
    
    font-weight: 500;
    margin-top: 15px;
    
    border-radius: 5px;
    transition: 0.2s background-color, color;
    
    &:hover {
        color: #FFFFFF;
        background-color: #0A1A1E;
    }
`

export const Option = styled.option`
`