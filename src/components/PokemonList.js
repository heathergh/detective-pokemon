import React from 'react';
import axios from 'axios';

import pokemonImages from '../pokemonImageArray';
import ErrorMessage from './ErrorMessage';
import crimes from '../crimes.json';

import pokeball from '../assets/pokeball.svg';

class PokemonList extends React.Component {
  constructor() {
    super();
    this.state = {
      currentPokemon: [],
      userSelection: '',
      correctCrimeInfo: {},
      errorMessage: ''
    }
  }
  componentDidMount() {
    //Set a default correct crime type
    let correctTypeNumber = 1;
    //Find the pokemon type that matches with the passed crime information
    for (let key in crimes) {
      if (key === this.props.crimeProp.category) {
        correctTypeNumber = crimes[key].successfulType;
        this.setState({
          correctCrimeInfo: crimes[key]
        })
      }
    }

    //Create an array of pokemon type promises
    const pokemonTypePromises = [];
    //Create and push an axios call for the one known pokemon type
    const correctType = axios({
      method: 'GET',
      url: `https://pokeapi.co/api/v2/type/${correctTypeNumber}`,
      dataResponse: 'json',
    });
    pokemonTypePromises.push(correctType);

    //Create and push 4 more pokemon type calls -> random pokemon types
    for (let i = 0; i < 4; i++) {
      const otherChoice = axios({
        method: 'GET',
        url: `https://pokeapi.co/api/v2/type/${this.getRandomNumber(18)}`,
        dataResponse: 'json',
      });
      pokemonTypePromises.push(otherChoice);
    }

    //Once all the pokemon type calls are back:
    axios.all(pokemonTypePromises).then((response) => {
      //Go through every call
      const specificPokemonPromises = [];
      response.forEach((data) => {
        //Grab the pokemon data and filter them, so we only have pokemon with ids under 718
        let listOfPokemon = data.data.pokemon;
        listOfPokemon = listOfPokemon.filter((pokemon) => {
          const url = pokemon.pokemon.url;
          const index = url.slice(34);
          if (parseInt(index) > 718) {
            return false;
          }
          return true;
        })
        //Get a random number, and the pokemon associated with that number
        const choice = this.getRandomNumber(listOfPokemon.length - 1);
        const chosenPokemon = listOfPokemon[choice].pokemon;
        //Create and push a specific axios call for the pokemon chosen
        const specificCall = axios({
          method: 'GET',
          url: chosenPokemon.url,
          dataResponse: 'json',
        });
        specificPokemonPromises.push(specificCall);
      });

      //Once all 5 axios call are back:
      axios.all(specificPokemonPromises).then((response) => {
        //Create an array to hold these pokemon, and extract the data into new objects
        const newPokemonList = [];
        response.forEach((data) => {
          const pokemon = data.data;
          const newPoke = {
            name: this.capitalizeWord(pokemon.name),
            types: pokemon.types,
            id: pokemon.id,
          }
          newPokemonList.push(newPoke);
        });
        //Randomize our array of pokemon
        for (let i = 0; i < newPokemonList.length; i++) {
          const a = newPokemonList[i];
          const bIndex = Math.floor(Math.random() * newPokemonList.length);
          newPokemonList[i] = newPokemonList[bIndex];
          newPokemonList[bIndex] = a;
        }
        //Set the state to hold our new list of 5 pokemon!
        this.setState({
          currentPokemon: newPokemonList
        })
      })
    });
  }

  getRandomNumber = (max) => {
    return Math.floor(Math.random() * max) + 1;
  }
  capitalizeWord = (word) => {
    let newWord = word.substring(0, 1).toUpperCase() + word.substring(1, word.length);
    return newWord;
  }

  
  handleOptionChange = (event) => {
    //When a pokemon is chosen, and we're on desktop, scroll to the button
    if(window.innerWidth > 1080){
      this.scrollToBottom();
    }
    //Set the state to hold the value of the radio button selection
    this.setState({
      userSelection: event.target.value
    });
  }

  returnedSelection = (e) => {
    e.preventDefault();
    //If the user has chosen a pokemon,
    if (this.state.userSelection !== '') {
      //Send the data back up through our prop callback, all the way to app.js
      this.props.checkResultCallback(this.props.crimeProp, this.props.niceCrimeName, this.state.currentPokemon[this.state.userSelection], this.state.correctCrimeInfo);
    } else {
      //Otherwise display an error message
      this.setState({
        errorMessage: "Please select a pokemon!"
      })
    }
  }

  /* Scroll code found at: */
  /* https://stackoverflow.com/questions/37620694/how-to-scroll-to-bottom-in-react */
  investigationButton = React.createRef();
  scrollToBottom = () => {
    this.investigationButton.scrollIntoView({ behavior: 'smooth' })
  }

  render() {
    return (
      <div>
        <form className="pokemon-list" id="pokemonList">
          <legend> Select a pokemon to help you with this case:</legend>
          <div className="pokemon-flex">
            {
              this.state.currentPokemon.length > 0
              ? this.state.currentPokemon.map((poke, i) => {
                  return (
                    <div key={i}>
                      <input type="radio" name="pokemon" id={poke.id} value={i} checked={parseInt(this.state.userSelection) === i} onChange={this.handleOptionChange} />
                      <label htmlFor={poke.id}>
                        <img src={pokemonImages[poke.id - 1]} alt={`Here's the Pokemon ${poke.name}.`} />
                        <h2>{poke.name}</h2>
                        <div className="pokemon-types">
                          {
                            poke.types.map((type, i) => {
                              return (
                                <div key={type.type.name}><span className={`pokemon-type-span ${type.type.name}`}>{type.type.name}</span></div>
                              )
                            })
                          }
                        </div> {/* End of Type Div */}
                      </label>
                    </div> /* End of Pokemon radio button div */
                  )
                })
              : <div className="pokeball-loader">
                  <div className="pokeball">
                  	<img src={pokeball} alt="Loading the pokemon api!" />
                  </div>
                </div> /* End of Loader Div */
            }
          </div> {/* End of pokemon-flex div */}
          <button id="submit" onClick={this.returnedSelection} ref={(element) => { this.investigationButton = element; }}>Start investigation!</button>
          {this.state.errorMessage !== '' ? <ErrorMessage id={'error-description'}>{this.state.errorMessage}</ErrorMessage> : null}
        </form> {/* End of pokemon selection form */}
      </div> /* End of PokemonList render div */
    );
  }
};

export default PokemonList;