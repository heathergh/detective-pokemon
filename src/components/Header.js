import React, { Component } from 'react';


class Header extends Component {
  constructor() {
    super();
    this.state = {
      userName: '',
      nameChoosen: false
    }
  }

  handleInputChange = (e) => {
    this.setState({
      userName: e.target.value
    })
  }

  handleNameSubmit = (e) => {
    e.preventDefault();
    this.setState({
      nameChoosen: true
    })

  }

  render() {
    return (
      <header>
        <h1>Detective Pokemon</h1>


        {
          !this.state.nameChoosen ?
            <div>
              <p>Some intro text/ rules/description.</p>
              <form onSubmit={this.handleNameSubmit}>
                <label htmlFor="userName">Your name:</label>
                <input id="userName" type="text" name="userName" value={this.state.userName} onChange={this.handleInputChange} />
                <button>Choose the name</button>
              </form>
            </div>
            :
            <h2>Welcome {this.state.userName}!</h2>
        }

      </header>
    )


  }

}

export default Header;