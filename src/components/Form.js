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
            userCrimeLocation: '',
            userNiceLocationName: '',
            userCrimeCategory: '',
            userNiceCategoryName: '',
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

    // get random index from length of array
    getRandomIndex = arrayLength => { 
        return Math.floor(Math.random() * arrayLength);
    }

    // API call to UK Police API and get crime categories to update state
    callUkApiEndPoint = endPoint => {
        axios({
            url: `https://data.police.uk/api/${endPoint}`,
            method: 'get'
        }).then(response =>  {
            const filteredCrimeCategories = response.data.filter(crime => crime.url !== 'all-crime' && crime.url !== 'other-crime' && crime.url !== 'other-theft');
            
            this.setState({
                crimeCategories: filteredCrimeCategories
            })
        })
    }

    // event handler to get option selected by user made with params to populate state passed as argument to make it reusable
    getUserInput = (e, firstStateToUpdate, secondStateToUpdate) => {
        e.preventDefault();

        const index = e.nativeEvent.target.selectedIndex;
        
        this.setState({
            [firstStateToUpdate]: e.target.value,
            [secondStateToUpdate]: e.nativeEvent.target[index].text

        });
    }

    // click handler that checks if a category and/or location has been selected by the user
    // if form is valid, call API
    clickHandler = (e, category, location) => {
        e.preventDefault();

        // if a category and location is not selected, display an error
        if (!this.state.userCrimeCategory && !this.state.userCrimeLocation ) {
            this.setState({
                errorMessage: "Error: Please select a category and a location"
            })
        } else if (!this.state.userCrimeCategory && this.state.userCrimeLocation) {
            // if location is selected, display error message for category select, and change locationValid to true
            this.setState({
                locationValid: true,
                errorMessage: "Error: Please select a category"
            })
        } else if (this.state.userCrimeCategory && !this.state.userCrimeLocation) {
            // if category is selected, display error message for location select, and change categoryValid to true
            this.setState({
                categoryValid: true,
                errorMessage: "Error: Please select a location"
            })
        } else {
            // if the form is valid, set locationValid and categoryValid to valid, clear error message, and invoke api call as a callback after setting state
            this.setState({
                locationValid: true,
                categoryValid: true,
                errorMessage: ''
            }, () => {
                this.ukPoliceApiCall(category, location);
            })
        }
    }

    // axios call UK Police API to get user selected crimes in user selected location
    ukPoliceApiCall = (category, location) => {
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
                }, () => {
                    // we got crime data back, so show the pokemonlist component
                    this.setState({
                        showPokemon: true
                    })
                });
            } else {
                this.setState({
                    errorMessage: 'Error: there are no results for that type of crime at the location you selected.',
                })
            }
        }).catch(error => {
            console.log(`uh-oh, something went wrong. Here's the error message: ${error}`);
        })
    }


    render() {
        return (
            <>
            {
                // this.state.showPokemon is set to true when the crime data has come back
                this.state.showPokemon
                ?   <> 
                        <p className="crime-reminder">You're in <span className="crime-reminder-accent">{this.state.userNiceLocationName}</span> solving a case about <span className="normalize-text crime-reminder-accent">{this.state.userNiceCategoryName}</span>.</p>
                        <PokemonList checkResultCallback={this.props.checkResultCallback} crimeProp={this.state.crime} niceCrimeName={this.state.userNiceCategoryName} />
                    </>
                :   <div className="form-wrapper">
                        <form>
                            <div className="selects-wrapper">
                                <div className="select-wrapper">
                                    <Select
                                        changeHandler={e => {
                                            this.getUserInput(e, 'userCrimeLocation', 'userNiceLocationName')
                                        }}
                                        label={'Crime Locations'}
                                        labelFor={'crime-location'}
                                        arrayProp={this.state.crimeLocations}
                                        optionValue={'poly'}
                                        optionName={'name'}
                                        selectName={'crime-locations'}
                                        isValid={this.state.locationValid}
                                    />
                                </div>
                                        
                                <div className="select-wrapper">
                                    <Select
                                        changeHandler={e => {
                                            this.getUserInput(e, 'userCrimeCategory', 'userNiceCategoryName')
                                        }}
                                        onChange={this.getUserInput}
                                        label={'Crime Categories'}
                                        labelFor={'crime-category'}
                                        arrayProp={this.state.crimeCategories}
                                        optionValue={'url'}
                                        optionName={'name'}
                                        selectName={'crime-categories'}
                                        isValid={this.state.categoryValid}
                                    />
                                </div>
                            </div>

                            { this.state.errorMessage !== '' ? <ErrorMessage formErrorId={'error-description'}>{this.state.errorMessage}</ErrorMessage> : null }

                            <Button onClick={e => { this.clickHandler(e, this.state.userCrimeCategory, this.state.userCrimeLocation)}}>
                                Get Pokemon
                            </Button>
                        </form>
                    </div>
                }
            </>
        )
    }
}

export default Form;