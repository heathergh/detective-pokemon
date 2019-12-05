import React from 'react';
import axios from 'axios';

import pIL from './pokemonImageArray';

class PokemonApi extends React.Component {
  constructor() {
    super();
    this.state = {
      currentPokemon: []
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
    


    for(let i = 0; i < 4; i++){
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
        console.log(listOfPokemon);

        listOfPokemon = listOfPokemon.filter((pokemon) => {
          const url = pokemon.pokemon.url;
          const index = url.slice(34);
          if(parseInt(index) > 719){
            return false;
          }
          
          return true;
        })

        const choice = this.getRandomNumber(listOfPokemon.length);

        console.log(listOfPokemon);


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
          // console.log(pokemon);
          // console.log(pokemon.name);
          // console.log(pokemon.types);
          // console.log(pokemon.id);
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

  getPokemonChoices = () => {
    //What do we need from the pokemon?
    //.name
    //.sprites.front_default
    //.sprites.back_default?
    //.types[#].type.name 
    //.weight?
    //.moves[#].move.name?
    //Get a pokemon with a correct type
    //https://pokeapi.co/api/v2/type/[type-that-works-well-with-the-crime]/
    //.pokemon[random-number].pokemon.url
    //Get more details
    //eg -> https://pokeapi.co/api/v2/pokemon/16/
    //Get 4 more random pokemon
    //https://pokeapi.co/api/v2/type/[random-number]
    //Get more details forEach of these pokemon
    //using the pokemon.url eg -> https://pokeapi.co/api/v2/pokemon/[same-random-number]/
  };

  render() {
    return(
      <>
        {
        this.state.currentPokemon.map((poke) => {
          return <img src={pIL[poke.id]} />
        })
        }
      </>
    );
  }
};

export default PokemonApi;