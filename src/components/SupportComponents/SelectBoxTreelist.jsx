import { SelectBox } from 'devextreme-react'
import React, { useRef } from 'react'

const SelectBoxTreelist = (props) => {

    const selectBoxRef = useRef(null)

    const handleOnDoubleClick = () => {
        if (selectBoxRef.current && selectBoxRef.current.instance._$element[0]) {
            selectBoxRef.current.instance.open()
        }
    }

    return (
        <>
            {props.event.isEditing ?
                <div onDoubleClick={handleOnDoubleClick}>
                    <SelectBox
                        ref={selectBoxRef}
                        searchTimeout={200}
                        searchEnabled={true}
                        searchMode={'contains'}
                        openOnFieldClick={false}
                        useItemTextAsTitle={true}
                        valueExpr={props.valueExpr}
                        noDataText={props.noDataText}
                        searchExpr={props.searchExpr}
                        itemRender={props.itemRender}
                        dataSource={props.dataSource}
                        displayExpr={props.displayExpr}
                        dropDownOptions={{ maxHeight: 300 }}
                        onValueChanged={props.handleOnValueChanged}
                        onFocusOut={(e) => e.component.instance().close()}
                        id={props.event.isEditing ? 'edit-data' : 'select-data'}
                        defaultValue={props.event.value ? props.event.value : ''}
                        showDropDownButton={props.event.isEditing ? true : false}
                        placeholder={props.event.isEditing ? props.placeholder : ''}
                        onFocusIn={(e) => props.event.isEditing && e.component.instance().open()}
                        disabled={props.disabled}
                    />
                </div>
                :
                <>
                    {props.renderContent()}
                </>
            }
        </>    
    )
}

export default SelectBoxTreelist