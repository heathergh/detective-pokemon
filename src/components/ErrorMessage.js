import React from 'react';
const ErrorMessage = props => {
    return (
        <div role="alert" className="error">
            <p>{props.children}</p>
        </div>
    )
}
export default ErrorMessage;