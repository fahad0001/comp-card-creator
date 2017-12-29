import React, {Component} from 'react';
import './Wizard.css';
import {Pager} from 'react-bootstrap';
import Stepper from "../common/stepper/stepper";
import StepOne from "./step-one/StepOne";
import StepTwo from "./step-two/StepTwo";
import StepThree from "./step-three/StepThree";

class Wizard extends Component {
    render() {
        return (
            <div className="container-fluid">
                <div style={WizardStyle.stepperStyle}>
                    <Stepper currentState={2} isError={false}/>
                </div>
                <div className="steps">
                    <StepOne/>
                    <StepTwo/>
                    <StepThree/>
                </div>
                <hr />
                <Pager>
                    <Pager.Item previous href="#">&larr; Previous</Pager.Item>
                    <Pager.Item next href="#">Next &rarr;</Pager.Item>
                </Pager>
            </div>
        )
    }
}

const WizardStyle={
    stepperStyle: {
        marginLeft: '13%',
        marginTop: '5%',
        marginBottom: '5%'
    }
};

export default Wizard;