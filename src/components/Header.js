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
    if (this.state.userName !== '') {
      this.setState({
        nameChoosen: true
      });
      this.props.nameSubmit();
    } else {
      alert("Please enter a name!");
    }
  }

  render() {
    return (
      <header className="wrapper">
        <h1>Detective Pokemon</h1>


        {
          !this.state.nameChoosen ?
            <div>
              <p>It is dark times out there. In this new world, Pokemon come to rescue and support the UK law enforcement. As a detective you will help support the UK police officers with your Pokemon partner! </p>
              <p>Pick a location and a crime, and then decide which Pokemon partner you'll bring with you to the solve the crime.</p>
              <p>Each type of crime requires a different type of Pokemon. What crime will you help solve today?</p>

              <form onSubmit={this.handleNameSubmit}>

                <label htmlFor="userName">Your name:</label>
                <input id="userName" type="text" name="userName" value={this.state.userName} onChange={this.handleInputChange} />

                <button>Submit</button>
              </form>
            </div>
            :
            <h2>Welcome Detective {this.state.userName}!</h2>
        }

      </header>
    )


  }

}

export default Header;