import React from 'react';

// get object from parent
// get out two dynamic properties: paramName, clientSideName)
const Select = ({arrayProp, optionValue, optionName, labelFor, label, selectName, changeHandler, isValid}) => {
    const elements = arrayProp.map((element, index) => {
        return (
            <option key={index} value={element[optionValue]}>{element[optionName]}</option>
        )
    })

    // check if a category and/or location has been chosen
    // if not, change the aria-describedby to error-description (which matches the error message id) and change the aria-valid attribute to true
    let errorMessageId = '';
    let ariaValidator = false;

    if (!isValid) {
        errorMessageId = 'error-description';
        ariaValidator = true;
    } else {
        errorMessageId = '';
        ariaValidator = false;
    }

    return (
        <>
            <label htmlFor={labelFor} className="instructions">{label}</label>

            <select 
                name={selectName}
                id={labelFor}
                onChange={changeHandler}
                required={true}
                aria-required="true"
                aria-label={`select one of the ${label}`}
                aria-invalid={ariaValidator}
                aria-describedby={errorMessageId}
            >
                <option value="">--Please choose an option--</option>
                {elements}
            </select> 

        </>
    )
}
export default Select;