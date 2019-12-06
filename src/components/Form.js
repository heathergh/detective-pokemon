import React, { Component } from 'react';
import axios from 'axios';
import locations from '../crimeHotSpots.json';
import Select from './Select';
import Button from './Button';


class Form extends Component {
    constructor() {
        super();
        this.state = {
            crimeLocations: locations,
            crimeCategories: [],
            userCrimeLocation: '',
            userCrimeCategory: '',
        }
    }

    // call UK Police API to get crime categories to dynamically populate crime categories select
    componentDidMount() {
        this.callUkApiEndPoint('crime-categories');
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
        console.log(e.target.value);
        
        this.setState({
            [stateToUpdate]: e.target.value
        });
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

                <Button>Get Crimes</Button>
            </>
        )
    }
}

export default Form;