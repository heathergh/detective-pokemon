import React from 'react';


// get object from parent
// get out two dynamic properties: paramName, clientSideName)
const Select = ({arrayProp, optionValue, optionName, labelFor, selectLabel, selectName}) => {
    const elements = arrayProp.map((element, index) => {
        return (
            <option key={index} value={element[optionValue]}>{element[optionName]}</option>
        )
    })

    return (
        <>
            <label htmlFor={labelFor}>{selectLabel}</label>

            <select name={selectName} id={labelFor}>
                <option value="">--Please choose an option--</option>
                {elements}
            </select> 

        </>
    )
}
export default Select;