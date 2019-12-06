import React from 'react';

const Button = ({onClick, firstParam = '', secondParam = '', children}) => {
    return (
        <button type="submit" className="" onClick={ (e) => onClick(e, firstParam, secondParam)}
        >{children}</button>
    )
}

export default Button;