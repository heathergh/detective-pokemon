import React from 'react';

import '../styles/App.css';

import Header from './Header.js';
import Form from './Form';

import GameResult from './GameResult';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      sceneNumber: 0,
      resultInfo: {}
    };
  }

  changeScene = (newSceneNumber) => {
    this.setState({
      sceneNumber: newSceneNumber
    })
  }

  checkResult = (crimeInfo, crimeCategory, pokemonChoice, correctCrimeChoice) => {
    const newResult = {};

    // the default information for the result
    newResult.resultOfGame = false;
    newResult.reasonForSuccess = pokemonChoice.name + " couldn't handle the pressure.";
    newResult.pokemonName = pokemonChoice.name;
    newResult.crimeSolved = crimeCategory;

    // check each pokemon type, and if it matches the required type for the crime, change information to reflect that
    for(let i = 0; i < pokemonChoice.types.length; i++){
      if(pokemonChoice.types[i].type.name === correctCrimeChoice.typeName){
        newResult.resultOfGame = true;
        newResult.reasonForSuccess = correctCrimeChoice.reason;
      }
    }

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
        <Header nameSubmit={() => this.changeScene(1)} />
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
      </div>
    );
  }
}
export default App;