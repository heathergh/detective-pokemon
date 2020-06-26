import React, { Component } from 'react';
import ErrorMessage from './ErrorMessage';


class Header extends Component {
  constructor() {
    super();
    this.state = {
      userName: '',
      nameChosen: false,
      errorMessage: ''
    }
  }

  handleInputChange = (e) => {
    this.setState({
      userName: e.target.value
    })
  }

  handleNameSubmit = (e) => {
    e.preventDefault();
    const trimmedUserName = this.state.userName.trim();

    if (trimmedUserName) {
      this.setState({
        nameChosen: true
      }, () => {
        this.props.nameSubmit();
      });
    } else {
      this.setState({
        errorMessage: 'Error: please enter your name.',
      })
    }
  }

  render() {
    return (
      <header className="wrapper">
        <h1>Detective Pokemon</h1>

        {
          !this.state.nameChosen
        ?
          <>
            <p>It's a dark new world out there. As a detective with UK Law Enforcement, you will help solve crimes in the UK with a Pokemon partner of your choosing! </p>
            <p>Each type of crime requires a different type of Pokemon. What crime will you help solve today?</p>

            <form onSubmit={this.handleNameSubmit}>

              <label htmlFor="userName">Your name:</label>
              <input id="userName" type="text" name="userName" value={this.state.userName} onChange={this.handleInputChange} onBlur={this.handleInputChange}/>

              <button>Submit</button>
              {this.state.errorMessage !== '' ? <ErrorMessage id={'error-description'}>{this.state.errorMessage}</ErrorMessage> : null}
            </form>
          </>
        :
          <h2>Detective {this.state.userName} is on duty</h2>
        }

      </header>
    )
  }
}

export default Header;