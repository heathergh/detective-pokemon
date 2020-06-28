import React from 'react';
import pokeball from '../assets/pokeball.svg';

const Loader = () => {
  return(
    <div class="pokemon-flex">
      <div className="pokeball-loader ">
        <div className="pokeball">
          <img src={pokeball} alt="Loading the pokemon api!" />
        </div>
      </div>
    </div>
  )
}

export default Loader;