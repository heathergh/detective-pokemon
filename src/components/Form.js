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
            userCrimeCategory: '',
            errorMessage: '',
            // TODO: Remove if we do not reach this stretch goal
            // errorMessageCount: 0,
            // TODO: Remove if we do not reach stretch goal to display more crime info
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
            this.setState({
                crimeCategories: response.data
            })
        })
    }

    // event handler to get option selected by user made with params to populate state passed as argument to make it reusable
    getUserInput = (e, stateToUpdate) => {
        e.preventDefault();
        
        this.setState({
            [stateToUpdate]: e.target.value
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
                month: '2019-11'
            }
        }).then(response =>  {
            // TODO: Remove this if we don't reach stretch goal
            const randomIndex = this.getRandomIndex(response.data.length);

            if (response.data.length) {
                const chosenCrime = response.data[randomIndex];
                let niceCatName = '';
                for(let key in this.state.crimeCategories){
                    if(this.state.crimeCategories[key].url === chosenCrime.category){
                        niceCatName = this.state.crimeCategories[key].name;
                    }
                }
                chosenCrime.nice_category_name = niceCatName;
                this.setState({
                    // TODO: Remove this if we don't reach stretch goal
                    crime: chosenCrime,
                    errorMessage: '',
                }, () => {
                    // placeholder for Pokemon function invocation
                    this.setState({
                        showPokemon: true
                    })
                });
            } else {
                this.setState({
                    errorMessage: 'Error: there are no results for that type of crime at the location you selected.',
                    // TODO: Remove if we do not reach this stretch goal
                    // adding errorMessageCount for stretch goal to display message to user if error message shows up three times
                    // errorMessageCount: this.state.errorMessageCount + 1
                })
            }
        }).catch(error => {
            console.log(`uh-oh, something went wrong. Here's the error message: ${error}`);
        })
    }

    getLocationName = (location) => {
        for(let key in this.state.crimeLocations){
            if(this.state.crimeLocations[key].poly === location){
                return this.state.crimeLocations[key].name;
            }
        }
    }

    render() {
        return (
            <>
            {
                this.state.showPokemon
                ?   <> 
                        <p>You're in {this.getLocationName(this.state.userCrimeLocation)} solving a case about {this.state.crime.nice_category_name}.</p>
                        <PokemonList checkResultCallback={this.props.checkResultCallback} crimeProp={this.state.crime} />
                    </>
                :   <div>
                        <div>Form Page</div>
                        <form
                            // onSubmit="placeholder for onSubmit function to get pokemon"
                        >
                            <Select
                                changeHandler={e => {
                                    this.getUserInput(e, 'userCrimeLocation')
                                }}
                                label={'Crime Locations'}
                                labelFor={'crime-location'}
                                arrayProp={this.state.crimeLocations}
                                optionValue={'poly'}
                                optionName={'name'}
                                selectName={'crime-locations'}
                                isValid={this.state.locationValid}
                            />

                            <Select
                                changeHandler={e => {
                                    this.getUserInput(e, 'userCrimeCategory')
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

                            <Button onClick={e => { this.clickHandler(e, this.state.userCrimeCategory, this.state.userCrimeLocation)}}>
                                Get Pokemon Helpers
                            </Button>

                            { this.state.errorMessage !== '' ? <ErrorMessage id={'error-description'}>{this.state.errorMessage}</ErrorMessage> : null }
                        </form>
                    </div>
                }
            </>
        )
    }
}

export default Form;