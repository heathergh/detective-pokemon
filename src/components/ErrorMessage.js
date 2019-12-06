import React from 'react';
const ErrorMessage = props => {
    return (
        <div role="alert" className="error" id={props.form_error_message}>
            <p>{props.children}</p>
        </div>
    )
}
export default ErrorMessage;