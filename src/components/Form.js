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
            crimeCategories: []
        }
    }

    componentDidMount() {
        this.callUkApiEndPoint('crime-categories');
    }

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

    selectChangeHandler = (event) => {
        
    }

    render() {
        return (
            <>
                <div>Form Page</div>
                
                <Select 
                    label={'Crime Locations'}
                    labelFor={'crime-location'}
                    arrayProp={this.state.crimeLocations} optionValue={'poly'}
                    optionName={'name'}
                    selectName={'crime-locations'}
                />

                <Select
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