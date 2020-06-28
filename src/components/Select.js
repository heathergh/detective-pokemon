import React from 'react';

const Select = ({handleChange, label, selectName, selectOptions, optionValue, optionText, isValid}) => {
  return (
    <>
      <label htmlFor={selectName} className="instructions">{label}</label>

      <select
        name={selectName}
        id={selectName}
        onChange={handleChange}
        required={true}
        aria-live='polite'
        aria-invalid={ isValid ? false : true}
        aria-describedby={ isValid ? '' : 'error-description'}
      >
        <option value=''>--Please choose an option--</option>
        {
          selectOptions.map((element, index) => {
            return (
              <option key={index} value={element[optionValue]}>{element[optionText]}</option>
          )})
        }
      </select>
    </>
  )
}

export default Select;