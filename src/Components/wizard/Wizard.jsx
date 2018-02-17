import React, {Component} from 'react';
import './Wizard.css';
import Stepper from "../common/stepper/stepper";
import StepOne from "./step-one/StepOne";
import StepTwo from "./step-two/StepTwo";
import StepThree from "./step-three/StepThree.container";

class Wizard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentState: 1,
            isStepError: false,
            stepOneState: {
                state: {},
                imageData: {},
                imageWithBranding: {}
            },
            stepTwoState: {
                state: {},
                imageData: {}
            },
            stepThreeState: {},
            stepFourState: {},
            stepFiveState: {},
            imgCheck: {}
        };
        this.onNextClick = this.onNextClick.bind(this);
        this.onPrevClick = this.onPrevClick.bind(this);
    }

    onNextClick(stepIndex, stateObj, imageData, imageWithBranding) {
        switch(stepIndex) {
            case 1:
                this.setState({currentState: stepIndex + 1, stepOneState: Object.assign(this.state.stepOneState, {state: stateObj, imageData})});
                break;
            case 2:
                this.setState({currentState: stepIndex + 1,  stepTwoState: Object.assign(this.state.stepTwoState, {state: stateObj, imageData})});
                break;
            case 3:
                this.setState({currentState: stepIndex + 1, stepThreeState: stateObj});
                break;
            case 4:
                this.setState({currentState: stepIndex + 1, stepFourState: stateObj});
                break;
            default: return;
        }
    }
    onPrevClick(stepIndex) {
        switch(stepIndex) {
            case 1:
                this.setState({currentState: 1, stepOneState: []});
                break;
            case 2:
                this.setState({currentState: stepIndex - 1, stepTwoState: []});
                break;
            case 3:
                this.setState({currentState: stepIndex - 1, stepThreeState: []});
                break;
            case 4:
                this.setState({currentState: stepIndex - 1, stepFourState: []});
                break;
            default:
                return;
        }
    }

    render() {
        return (
            <div className="container-fluid">
                <div style={WizardStyle.stepperStyle}>
                    <Stepper currentState={this.state.currentState - 1} isError={this.state.isStepError}/>
                </div>
                <div className="steps">
                    {this.state.currentState === 1 &&
                        <StepOne
                            onNextClick={this.onNextClick}
                            onPrevClick={this.onPrevClick}/>
                    }
                    {this.state.currentState === 2 &&
                        <StepTwo
                            onNextClick={this.onNextClick}
                            onPrevClick={this.onPrevClick}/>
                    }
                    {[3, 4 , 5].includes(this.state.currentState) &&
                        <StepThree
                            onNextClick={this.onNextClick}
                            onPrevClick={this.onPrevClick}
                            stepOneState={this.state.stepOneState}
                            stepTwoState={this.state.stepTwoState}/>
                    }
                </div>
            </div>
        )
    }
}
const WizardStyle = {
    stepperStyle: {
        marginLeft: '30%',
        marginTop: '10%',
        marginBottom: '5%'
    }
};
export default Wizard;
