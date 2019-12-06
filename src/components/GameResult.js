import React from 'react';

const GameResult = ({
  resultOfGame = true,
  pokemonName = 'Charmeleon',
  crimeSolved = 'Arson',
  reasonForSuccess = 'Fire pokemon can handle fires.',
  playAgain
}) => (
  <div>
    <h2>
      {resultOfGame
        ? 'Great job, you solved the crime!'
        : 'Better luck next time!'}
    </h2>
    <div>
      { 
        resultOfGame
          ? <p>
              {pokemonName} solved the crime of {crimeSolved}!
            </p>
          : <p>
            The criminal got away!
          </p>
      }
      
      <p>{reasonForSuccess}</p>
    </div>
    <button onClick={playAgain}>Solve another crime</button>
  </div>
);

export default GameResult;
