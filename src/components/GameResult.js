import React from 'react';

const GameResult = ({
  resultOfGame = true,
  pokemonName = 'Charmeleon',
  crimeSolved = 'Arson',
  reasonForSuccess = 'Fire pokemon can handle fires.',
  playAgain
}) => (
    <div>
      <h2 className="header-for-result">
        {resultOfGame
          ? 'Great job, you solved the crime'
          : 'Better luck next time'}
      </h2>
      <div>
        {
          resultOfGame
            ? <p>
              {pokemonName} solved the case of <span className="normalize-text">{crimeSolved}</span>!
            </p>
            : <p>
              The criminal got away!
            </p>
        }

        <p>{reasonForSuccess}</p>
      </div>
      <button className="play-again" onClick={playAgain}>Solve another crime</button>
    </div>
  );

export default GameResult;
