import React, { Component } from 'react';
import axios from 'axios';
import locations from '../crimeHotSpots.json';
import Select from './Select';
import Button from './Button';
import ErrorMessage from './ErrorMessage';


class Form extends Component {
    constructor() {
        super();
        this.state = {
            crimeLocations: locations,
            crimeCategories: [],
            userCrimeLocation: '',
            userCrimeCategory: '',
            errorMessage: '',
            errorMessageCount: 0,
            crime: {}
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
    getUserChoice = (e, stateToUpdate) => {
        e.preventDefault();
        
        this.setState({
            [stateToUpdate]: e.target.value
        });
    }

    // onClick event handler to call UK Police API to get user selected crimes in user selected location
    clickHandler = (e, category, location) => {
        e.preventDefault();

        axios({
            url: `https://data.police.uk/api/crimes-street/${category}`,
            method: 'get',
            params: {
                poly: location,
                month: '2019-11'
            }
        }).then(response =>  {
            const randomIndex = this.getRandomIndex(response.data.length);

            if (response.data.length) {
                this.setState({
                    crime: response.data[randomIndex],
                    errorMessage: ''
                }, () => {
                    // placeholder for Pokemon function invocation
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

    render() {
        return (
            <>
                <div>Form Page</div>

                <Select
                    changeHandler={e => {
                        this.getUserChoice(e, 'userCrimeLocation')
                    }}
                    label={'Crime Locations'}
                    labelFor={'crime-location'}
                    arrayProp={this.state.crimeLocations} optionValue={'poly'}
                    optionName={'name'}
                    selectName={'crime-locations'}
                />

                <Select
                    changeHandler={e => {
                        this.getUserChoice(e, 'userCrimeCategory')
                    }}
                    onChange={this.getUserChoice}
                    label={'Crime Categories'}
                    labelFor={'crime-category'}
                    arrayProp={this.state.crimeCategories} optionValue={'url'}
                    optionName={'name'}
                    selectName={'crime-categories'}
                />

                <Button onClick={e => { this.clickHandler(e, this.state.userCrimeCategory, this.state.userCrimeLocation)}}>
                    Get Pokemon Helpers
                </Button>

                { this.state.errorMessage !== '' ? <ErrorMessage>{this.state.errorMessage}</ErrorMessage> : null}

                {/* <PokemonList /> */}

                {/* <Button onClick={() => {}}>
                    Solve the Crime
                </Button> */}
            </>
        )
    }
}

export default Form;