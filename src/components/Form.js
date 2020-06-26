import React, { Component } from 'react';
import axios from 'axios';
import locations from '../crimeHotSpots.json';
import Select from './Select';
import Button from './Button';
import ErrorMessage from './ErrorMessage';
import PokemonList from './PokemonList';

class Form extends Component {
  constructor() {
      super();
      this.state = {
          crimeLocations: locations,
          crimeCategories: [],
          chosenCrimeLocation: '',
          userInputs: [],
          chosenCrimeCategory: '',
          errorMessage: '',
          crime: {},
          categoryValid: false,
          locationValid: false,
          showPokemon: false
      }
  }

  // call UK Police API to get crime categories to dynamically populate crime categories select
  componentDidMount() {
      this.callUkApiEndPoint('crime-categories');
  }

  // API call to UK Police API and get crime categories to update the crime category dropdown select element
  // Written to accept an argument to make the API call reusable for stretch goal to get crime information based on persistent_id
  callUkApiEndPoint = endPoint => {
      axios({
          url: `https://data.police.uk/api/${endPoint}`,
          method: 'get'
      }).then(response =>  {
          const filteredCrimeCategories = response.data.filter(crime => crime.url !== 'all-crime' && crime.url !== 'other-crime' && crime.url !== 'other-theft');

          this.setState({
              crimeCategories: filteredCrimeCategories
          })
      }).catch(() => {
          // if API call fails, show message to user that crimes are unavailable
          this.setState({
              errorMessage: 'Error: there are no crimes currently available. Please try again later.',
          });
      });
  }

  // get random index from length of array
    getRandomIndex = arrayLength => {
      return Math.floor(Math.random() * arrayLength);
  }

  // event handler to get option selected by user made with params to populate state passed as argument to make it reusable
  getUserInput = (e, firstStateToUpdate, secondStateToUpdate, thirdStateToUpdate) => {
      e.preventDefault();

      const index = e.nativeEvent.target.selectedIndex;

      this.setState({
        [firstStateToUpdate]: [...this.state[firstStateToUpdate], e.target.value],
        [secondStateToUpdate]: e.nativeEvent.target[index].text,
        [thirdStateToUpdate]: true
      });
  }

  // click handler that checks if a category and/or location has been selected by the user
  // if form is valid, call API
  clickHandler = (e, userChoices) => {
      e.preventDefault();
      const location = userChoices[0];
      const category = userChoices[1];

      // clear the error message if present, and make api call as a callback after setting state
      this.setState({
          errorMessage: ''
      }, () => {
          this.ukPoliceApiCall(location, category);
      })
    }


  // axios call UK Police API to get user selected crimes in user selected location
  ukPoliceApiCall = (location, category) => {
      axios({
          url: `https://data.police.uk/api/crimes-street/${category}`,
          method: 'get',
          params: {
              poly: location,
          }
      }).then(response =>  {
          const randomIndex = this.getRandomIndex(response.data.length);

          if (response.data.length) {
              const chosenCrime = response.data[randomIndex];

              this.setState({
                  crime: chosenCrime,
                  errorMessage: '',
                  showPokemon: true
              });
          } else {
              this.setState({
                  errorMessage: 'Error: there are no results for that type of crime at the location you selected.',
              })
          }
      }).catch(() => {
          this.setState({
              errorMessage: 'Error: there are no crimes currently available. Please try again later.',
          });
      });
  }


  render() {
    return (
      <>
        {
          // this.state.showPokemon is set to true when the crime data is returned from API call
          this.state.showPokemon
        ?
          <>
            <p className="crime-reminder">You're in <span className="crime-reminder-accent">{this.state.chosenCrimeLocation}</span> solving a case about <span className="normalize-text crime-reminder-accent">{this.state.chosenCrimeCategory}</span>.</p>
            <PokemonList checkResultCallback={this.props.checkResultCallback} crimeProp={this.state.crime} niceCrimeName={this.state.chosenCrimeCategory} />
          </>
        :
          <div className="form-wrapper">
            <form>
              <div className="selects-wrapper">
                <div className="select-wrapper">
                  <Select
                    changeHandler={e => {
                      this.getUserInput(e, 'userInputs', 'chosenCrimeLocation', 'locationValid')
                    }}
                    label={'Crime Locations'}
                    labelFor={'crime-location'}
                    arrayProp={this.state.crimeLocations}
                    optionValue={'poly'}
                    optionName={'name'}
                    selectName={'crime-locations'}
                  />
                </div>

                {
                  this.state.locationValid
                ?
                  <div className="select-wrapper">
                    <Select
                      changeHandler={e => {
                        this.getUserInput(e, 'userInputs', 'chosenCrimeCategory', 'categoryValid')
                      }}
                      onChange={this.getUserInput}
                      label={'Crime Categories'}
                      labelFor={'crime-category'}
                      arrayProp={this.state.crimeCategories}
                      optionValue={'url'}
                      optionName={'name'}
                      selectName={'crime-categories'}
                    />
                  </div>
                :
                  null
                }
              </div>

              {
                this.state.errorMessage !== ''
              ?
                <ErrorMessage formErrorId={'error-description'}>{this.state.errorMessage}</ErrorMessage>
              :
                null
              }

              {
                this.state.locationValid && this.state.categoryValid
              ?
                <Button onClick={e => { this.clickHandler(e, this.state.userInputs)}}>
                    Get Pokemon
                </Button>
              :
                null
              }
            </form>
          </div>
        }
      </>
    )
  }
}

export default Form;
