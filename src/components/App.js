import React from 'react';

import '../styles/App.css';

import Header from './Header.js';
import Form from './Form';

import GameResult from './GameResult';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      //State
      sceneNumber: 0,
      resultInfo: {}
      //selected location : {}?
      //selected crime : {}?
      //pokemon choice : {}
      //location's possible crimes : [{}]
      //5 possible pokemon : [{}]
    };
  }
  componentDidMount() {
    // console.log(crimeHotSpots[0].name);
    // console.log(crimeHotSpots[0].poly);
  }

  changeScene = (newSceneNumber) => {
    this.setState({
      sceneNumber: newSceneNumber
    })
  }

  checkResult = (crimeInfo, crimeCategory, pokemonChoice, correctCrimeChoice) => {
    // console.log(crimeInfo, pokemonChoice, correctCrimeChoice);
    const newResult = {};

    newResult.resultOfGame = false;
    newResult.reasonForSuccess = pokemonChoice.name + " couldn't handle the pressure.";

    for(let i = 0; i < pokemonChoice.types.length; i++){
      if(pokemonChoice.types[i].type.name === correctCrimeChoice.typeName){
        newResult.resultOfGame = true;
        newResult.reasonForSuccess = correctCrimeChoice.reason;
      }
    }

    newResult.pokemonName = pokemonChoice.name;
    newResult.crimeSolved = crimeCategory;
    this.setState({
      sceneNumber: 2,
      resultInfo: newResult
    })
  }

  resetTheGame = () => {
    this.setState({
      sceneNumber: 1
    })
  }
  

  render() {
    return (
      <div>
        {/* Header & Static Infomation */}
        <Header nameSubmit={() => this.changeScene(1)} />
        {/* Form For User Choices */}
        <main>
          <div className="wrapper">
            {
              this.state.sceneNumber === 1 
              ? <Form checkResultCallback = {this.checkResult} />
              : null
            }
            {
              this.state.sceneNumber === 2
              ? <GameResult 
                  pokemonName={this.state.resultInfo.pokemonName}
                  resultOfGame={this.state.resultInfo.resultOfGame}
                  crimeSolved={this.state.resultInfo.crimeSolved}
                  reasonForSuccess={this.state.resultInfo.reasonForSuccess}
                  playAgain = {this.resetTheGame} 
                />
              :null
            }
          </div>
        </main>

        {/* {
          this.state.sceneNumber >= 2
          ?  <PokemonList />
          : null
        }

        {
          this.state.sceneNumber >= 3
          ?   <GameResult />
          : null
        } */}
        
       
        {/* Name Text Input */}
        {/* Location Select */}
        {/* Crime Type Select -> map over possible crimes */}
        {/* Map over the possible pokemon */}
        {/* Submit Button */}
       
        {/* Better Luck Next Time Screen */}
        {/* You Win Screen */}
      </div>
    );
  }
}
export default App;

// user enters name
// —> component re-renders to read “Welcome, Detective Name”
// User selects location from list of 10 cities
// - pull latitude and longitude from city object
// e.g. poly: {
//     polyBounday: [lat,long:lat,long:lat,long:lat,long]
// }
// ->Save value in state
// User selects crime from drop down list
// -> Save value in state
// use the two state values to make the API call to the UK Police API
// If there are no results (the response length is 0), show an error message and clear the form
// If results are present (check the length of the response array), Clear the error message, call function to get 5 random Pokemon
// Based on the crime, there will be one type of Pokemon that can solve it, and reason why they can solve
// Plus four random Pokemon that we get using a random number that we generate
// Save those in state in an array
// Pass it to the API call as a query param
// -> random number to pick a type
// e.g. type/{random_number}
// -> .pokemon use a random number to get a Pokemon
// e.g. /type/random_number/pokemon/random_number
// -> .pokemon.url
// -> that goes to their api end point, where we can get their name, type, and picture which we will save in an array of objects
// Display the five types of Pokemon on the page to the user
// They have a type saved to the image/card, and use that to compare with the correct type to solve the crime
// If wrong, show the “Better luck next time!”
// If right, show “You solved the crime!” Because of x reason
// Display a button a on each card “try again” which will bring them back to the homepage and the form is cleared so they can start again
