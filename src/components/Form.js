import React, { Component } from 'react';
import axios from 'axios';
import locations from '../crimeHotSpots.json';
import Select from './Select';
import Button from './Button';
import Loader from './Loader';
import ErrorMessage from './ErrorMessage';
import PokemonList from './PokemonList';

class Form extends Component {
  constructor() {
      super();
      this.state = {
        apiLocation: '',
        apiCategory: '',
        crime: {},
        crimeCategories: [],
        crimeLocations: locations,
        categoryValid: true,
        errorMessage: '',
        legibleCategory: '',
        legibleLocation: '',
        locationValid: true,
        showPokemon: false
      }
  }

  // call UK Police API to get crime categories to dynamically populate crime categories dropdown menu
  componentDidMount() {
    this.callUkPoliceApi('crime-categories');
  }

  // API call to UK Police API and get crime categories to update the crime category dropdown select element
  callUkPoliceApi = slug => {
    axios({
      url: `https://data.police.uk/api/${slug}`,
    }).then(response =>  {
      // if crime categories is an empty array, filter the crime categories from the response
      if (this.state.crimeCategories.length === 0) {
        this.filterCrimeCategories(response);
      // if location and crime category are in a format the api can use, set the chosen crime in state
      } else {
        this.setChosenCrime(response);
      }
    }).catch(() => {
      // if a chosen crime isn't saved in state, let user know that crime wasn't committed in that location
      if (Object.keys(this.state.crime).length === 0) {
        this.setState({
          errorMessage: 'Error: that type of crime has not been committed in that location. Please choose another location and/or type of crime',
        });
      } else {
          this.setState({
            errorMessage: 'Error: there are no crimes available to investigate. Please try again later.',
          });
        }
    });
  }

  filterCrimeCategories = categories => {
    const filteredCrimeCategories = categories.data.filter(
      crimeCategory => crimeCategory.url !== 'all-crime' &&
      crimeCategory.url !== 'other-crime' &&
      crimeCategory.url !== 'other-theft'
    );

    this.setState({
        crimeCategories: filteredCrimeCategories
    })
  }

  setChosenCrime = data => {
    if (Object.keys(data.data)[0].length !== 0) {
      //get the first crime in the array, so we know a crime of that type was committed at the chosen location
      const chosenCrime = data.data[0];

      this.setState({
          crime: chosenCrime,
          showPokemon: true
      });
    }
  }

  // event handler to populate state with user's chosen location and category
  setUserInputs = (e, ...states) => {
      e.preventDefault();

      const statesToUpdate = [...states];
      const index = e.nativeEvent.target.selectedIndex;

      // if an option is chosen, update the specified pieces of state
      if (index !== 0) {
        this.setState({
          [statesToUpdate[0]]: e.target.value,
          [statesToUpdate[1]]: e.nativeEvent.target[index].text,
          [statesToUpdate[2]]: true,
          errorMessage: ''
        });
      } else {
        this.setState({
          [statesToUpdate[0]]: e.target.value,
          [statesToUpdate[2]]: false,
          errorMessage: 'Please choose an option'
        })
      }
  }

  // click handler that checks if a category and/or location has been selected by the user
  // if form is valid, call API
  handleSubmit = (e, location, category) => {
    e.preventDefault();

    this.callUkPoliceApi(`crimes-street/${category}?poly=${location}`);
  }


  render() {
    return (
      <>
        {
          // this.state.showPokemon is set to true when the crime data is returned from API call
          this.state.showPokemon
        ?
          <>
            <p className="crime-reminder">You're in <span className="crime-reminder-accent">{this.state.legibleLocation}</span> solving a case about <span className="normalize-text crime-reminder-accent">{this.state.legibleCategory}</span>.</p>
            <PokemonList checkResultCallback={this.props.checkResultCallback} crimeProp={this.state.crime} niceCrimeName={this.state.chosenCrimeCategory} />
          </>
        :
          <div className="form-wrapper">
            <form>
              <div className="selects-wrapper">
                <div className="select-wrapper">
                  <Select
                    handleChange={e => {
                      this.setUserInputs(e, 'apiLocation', 'legibleLocation', 'locationValid')
                    }}
                    label={'Crime Locations'}
                    selectName={'crime-locations'}
                    selectOptions={this.state.crimeLocations}
                    optionValue={'poly'}
                    optionText={'name'}
                    isValid={this.state.locationValid}
                  />
                </div>

                {
                  this.state.apiLocation
                ?
                  <div className="select-wrapper">
                    <Select
                      handleChange={e => {
                        this.setUserInputs(e, 'apiCategory', 'legibleCategory', 'categoryValid')
                      }}
                      label={'Crime Categories'}
                      selectName={'crime-categories'}
                      selectOptions={this.state.crimeCategories}
                      optionValue={'url'}
                      optionText={'name'}
                      isValid={this.state.categoryValid}
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
                this.state.apiLocation && this.state.apiCategory
              ?
                <Button onClick={e => { this.handleSubmit(e, this.state.apiLocation, this.state.apiCategory)}}>
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
