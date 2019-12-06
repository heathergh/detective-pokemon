import React from 'react';
import axios from 'axios';

import pokemonImages from '../pokemonImageArray';

class PokemonList extends React.Component {
  constructor() {
    super();
    this.state = {
      currentPokemon: [],
      userSelection: ''
    }
  }
  componentDidMount() {

    const pokemonTypePromises = [];

    const correctType = axios({
      method: 'GET',
      url: 'https://pokeapi.co/api/v2/type/1',
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
          if (parseInt(index) > 719) {
            return false;
          }

          return true;
        })

        const choice = this.getRandomNumber(listOfPokemon.length-1);



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
            name: pokemon.name,
            types: pokemon.types,
            id: pokemon.id,
          }
          newPokemonList.push(newPoke);
        });
        this.setState({
          currentPokemon: newPokemonList
        })
      })
    });

  }

  getRandomNumber = (max) => {
    return Math.floor(Math.random() * max) + 1;
  }


  handleOptionChange = (event) => {
    this.setState({
      userSelection: event.target.value
    })
    console.log(this.state.userSelection)
  }

  returnedSelection = (e) => {
  e.preventDefault();
   console.log(this.state.currentPokemon[this.state.userSelection])
  }

  render() {
    return (
      <div className="pokemonList">
        <form className="pokemonList" id="pokemonList">
          <legend> Select the pokemon to help you with the case:</legend>
          {this.state.currentPokemon.map((poke, i) => {
            return (
              <div key={poke.id+i}>
                <img src={pokemonImages[poke.id-1]} alt={`here is${poke.name}`} />
                <input type="radio" name="pokemon" id={poke.id} value={i} checked={parseInt(this.state.userSelection) === i} onChange={this.handleOptionChange} />
                <label htmlFor={poke.id}>{poke.name}</label>
                {poke.types.map((type, i) => {
                  return (
                   <p key={type.type.name+i}>{type.type.name}</p>
                  )
               
                })}
                
              </div>
            )
          })}
          <button id="submit" onClick={this.returnedSelection}>Start investigation!</button>  
        </form>
      </div>



    );
  }
};

export default PokemonList;