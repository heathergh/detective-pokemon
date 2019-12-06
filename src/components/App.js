import React from 'react';

import '../App.css';


import Form from './Form';
import PokemonList from './PokemonList';

import GameResult from './GameResult';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      //State
      //user's name : 'string'
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
<<<<<<< HEAD
  getCrimeAtLocation = () => {
    //axios call
    //url: https://data.police.uk/api/crimes-street/all-crime
    //params
    //poly: crimeHotSpots[0].poly
    //date: "yyyy-mm"
  };
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
=======
>>>>>>> rc-1.0.0

  render() {
    return (
      <div>
        {/* Header & Static Infomation */}

        {/* Form For User Choices */}
        <Form />
        <PokemonList />
        {/* Name Text Input */}
        {/* Location Select */}
        {/* Crime Type Select -> map over possible crimes */}
        {/* Map over the possible pokemon */}
        {/* Submit Button */}
        <GameResult />
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
