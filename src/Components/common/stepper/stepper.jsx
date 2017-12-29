import React, {Component} from 'react';
import 'rc-steps/assets/index.css';
import 'rc-steps/assets/iconfont.css';
import './stepper.css';
import Steps, { Step } from 'rc-steps';

export default class Stepper extends Component{
    render (){
        const {currentState, isError} = this.props;

        return (
            <Steps size={"small"} labelPlacement="vertical" status={isError? 'error':''} current={currentState}>
                <Step title="Step 1"/>
                <Step title="Step 2"/>
                <Step title="Step 3"/>
            </Steps>
        )
    }
}