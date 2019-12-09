import React from 'react';
import axios from 'axios';

import pokemonImages from '../pokemonImageArray';
import ErrorMessage from './ErrorMessage';
import crimes from '../crimes.json';

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
    let correctTypeNumber = 1;
    for (let key in crimes) {
      if (key === this.props.crimeProp.category) {
        correctTypeNumber = crimes[key].successfulType;
        this.setState({
          correctCrimeInfo: crimes[key]
        })
      }
    }

    const pokemonTypePromises = [];
    const correctType = axios({
      method: 'GET',
      url: `https://pokeapi.co/api/v2/type/${correctTypeNumber}`,
      dataResponse: 'json',
    });
    pokemonTypePromises.push(correctType);

    for (let i = 0; i < 4; i++) {
      const otherChoice = axios({
        method: 'GET',
        url: `https://pokeapi.co/api/v2/type/${this.getRandomNumber(18)}`,
        dataResponse: 'json',
      });
      pokemonTypePromises.push(otherChoice);
    }

    axios.all(pokemonTypePromises).then((response) => {
      const specificPokemonPromises = [];
      response.forEach((data) => {
        let listOfPokemon = data.data.pokemon;
        listOfPokemon = listOfPokemon.filter((pokemon) => {
          const url = pokemon.pokemon.url;
          const index = url.slice(34);
          if (parseInt(index) > 718) {
            return false;
          }

          return true;
        })
        const choice = this.getRandomNumber(listOfPokemon.length - 1);
        const chosenPokemon = listOfPokemon[choice].pokemon;
        const specificCall = axios({
          method: 'GET',
          url: chosenPokemon.url,
          dataResponse: 'json',
        });
        specificPokemonPromises.push(specificCall);
      });

      axios.all(specificPokemonPromises).then((response) => {
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
        for (let i = 0; i < newPokemonList.length; i++) {
          const a = newPokemonList[i];
          const bIndex = Math.floor(Math.random() * newPokemonList.length);
          newPokemonList[i] = newPokemonList[bIndex];
          newPokemonList[bIndex] = a;
        }
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
    this.setState({
      userSelection: event.target.value
    });
  }

  returnedSelection = (e) => {
    e.preventDefault();
    if (this.state.userSelection !== '') {
      this.props.checkResultCallback(this.props.crimeProp, this.props.niceCrimeName, this.state.currentPokemon[this.state.userSelection], this.state.correctCrimeInfo);
    } else {
      this.setState({
        errorMessage: "Please select a pokemon!"
      })
    }
  }

  render() {
    return (
      <div className="pokemonList">
        <form className="pokemonList" id="pokemonList">
          <legend> Select a pokemon to help you with this case:</legend>
          <div className="pokemonFlex">
            {
              this.state.currentPokemon.length > 0
              ? this.state.currentPokemon.map((poke, i) => {
                  return (
                    <div key={i}>
                      <input type="radio" name="pokemon" id={poke.id} value={i} checked={parseInt(this.state.userSelection) === i} onChange={this.handleOptionChange} />
                      <label htmlFor={poke.id}>
                        <img src={pokemonImages[poke.id - 1]} alt={`here is${poke.name}`} />
                        <h2>{poke.name}</h2>
                        <div className="pokemonTypes">
                          {
                            poke.types.map((type, i) => {
                              return (
                                <div key={type.type.name}><span className={`pokemonTypeSpan ${type.type.name}`}>{type.type.name}</span></div>
                              )
                            })
                          }
                        </div>
                      </label>
                    </div>
                  )
                })
              : <img className="pokeballLoader" src={pokemonImages[Math.floor(Math.random() * pokemonImages.length)]} />
            }
          </div>
          <button id="submit" onClick={this.returnedSelection}>Start investigation!</button>
          {this.state.errorMessage !== '' ? <ErrorMessage id={'error-description'}>{this.state.errorMessage}</ErrorMessage> : null}
        </form>
      </div>
    );
  }
};

export default PokemonList;