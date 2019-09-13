import React, { Component } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import './Specify.css';
import API_URL from '../../constants';
import Alert from 'react-bootstrap/Alert'
import Stage1 from './Stage1';
import Stage2 from './Stage2';
import Stage3 from './Stage3';
import Stage4 from './Stage4';
import Stage5 from './Stage5';
import Stage6 from './Stage6';
import { thisTypeAnnotation } from '@babel/types';

class Specify extends Component {
    state = {
        property_name: '',
        address_line_1: '',
        address_line_2: '', 
        city: '',
        zipcode: '',
        customer_class: 'residential',
        utilities: [],
        utility: '',
        tariff: 'E1',
        month_1_usage: '',
        month_2_usage: '',
        month_3_usage: '',
        solar_system_kw: '3',
        solar_system_dir: 'SOUTH',
        solar_system_tilt: '200',
        battery_system: '1',
        errors: [],
        stage: 1
    };

    stages = ['Site', 'Utility', 'Tariff', 'Electricity Usage', 'Solar System Specification', 'Battery System Specification']

    handleChange = (event) => {
            this.setState({
            [event.target.name]: event.target.value,
            });
        };

    handleChangeStage = (event) => {
        if (this.state.stage === 6) {
            return
        }
        return this.setState({ stage: this.state.stage + 1})
    }

    handleSubmit1 = () => {
        const currentUser = JSON.parse(this.props.currentUser);
        const new_property = {
            property_name: this.state.property_name,
            address_line_1: this.state.address_line_1,
            address_line_2: this.state.address_line_2,
            city: this.state.city,
            zipcode: this.state.zipcode,
            customer_class: this.state.customer_class,
            user_id: currentUser.id
        }
        axios.post(
            `${API_URL}/specify/1`, 
            new_property,
            { withCredentials: true },
            { headers: {
                "Access-Control-Allow-Origin": "*"
                } 
            })
            .then(res => {
                console.log(res)
                this.setState({
                    stage: this.state.stage + 1,
                    utilities: res.data.results
                });
            })
            .catch(err => console.log(err));
    }

    handleSubmit = (event) => {
        const currentUser = JSON.parse(this.props.currentUser);
        const new_property = {
            property_name: this.state.property_name,
            address_line_1: this.state.address_line_1,
            address_line_2: this.state.address_line_2,
            city: this.state.city,
            zipcode: this.state.zipcode,
            utility: this.state.utility,
            tariff: this.state.tariff,
            month_1_usage: this.state.month_1_usage,
            month_2_usage: this.state.month_2_usage,
            month_3_usage: this.state.month_3_usage,
            solar_system_kw: this.state.solar_system_kw,
            solar_system_dir: this.state.solar_system_dir,
            solar_system_tilt: this.state.solar_system_tilt,
            battery_system: this.state.battery_system,
            monthly_savings: 145.32,
            payback_period: 5.67,
            user_id: currentUser.id,
        }
        axios.post(
            `${API_URL}/specify`, 
            new_property,
            { withCredentials: true },
            { headers: {
                "Access-Control-Allow-Origin": "*"
                } 
            })
            .then(() => this.props.history.push('/home'))
            .catch(err => this.setState({ errors:err.response.data.errors }));
    };

    render() {
        return (
            <div className="specify">
                <h1>New Property</h1>
                <h2>{this.stages[this.state.stage-1]}</h2>
                <p>Step {this.state.stage} / 6</p>
                <div>
                    {this.state.errors && this.state.errors.map((error, i) => (
                        <Alert 
                            key={i}
                            variant="danger"
                            onClose={() => {
                            let errors = this.state.errors;
                            errors.splice(i);
                            this.setState({ errors: errors })
                            }}
                            dismissible>
                            {error}
                        </Alert>
                    ))}
                    <form>
                        { this.state.stage===1 && <Stage1 handleChange={this.handleChange} handleSubmit1={this.handleSubmit1}/> }
                        { this.state.stage===2 && <Stage2 handleChange={this.handleChange} handleChangeStage={this.handleChangeStage} utility={this.state.utility} utilities={this.state.utilities} /> }
                        { this.state.stage===3 && <Stage3 handleChange={this.handleChange} handleChangeStage={this.handleChangeStage} /> }
                        { this.state.stage===4 && <Stage4 handleChange={this.handleChange} handleChangeStage={this.handleChangeStage} /> }
                        { this.state.stage===5 && <Stage5 handleChange={this.handleChange} handleChangeStage={this.handleChangeStage} /> }
                        { this.state.stage===6 && <Stage6 handleChange={this.handleChange} handleChangeStage={this.handleChangeStage} /> }
                    </form>
                </div>
            </div>
        )
    }
}

export default withRouter(Specify);