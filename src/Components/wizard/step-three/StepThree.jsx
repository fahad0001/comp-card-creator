import React, {Component} from 'react';
import {mapFrontSideData} from "../step-one/step-one.utils";
import {CountrySelect, FieldGroup, SelectGroup, SwitchToggle} from "../../common/field-group/FieldGroup";
import {Form, Pager} from "react-bootstrap";

import {mapCardPrintQty} from "./step-three.utils";

export default class StepThree extends Component {
    constructor(props) {
        super(props);
        this.state = {
            onlineCardComp: true,
            printQuantity: 0,
            paperWeight: '',
            paperQuality: '',
            production: '',
            branding: false,
            individualChanges: true,
            emailAddress: '',
            firstAddress: {
                company: '',
                firstName: '',
                lastName: '',
                street: '',
                additional: '',
                zip: '',
                city: '',
                country: ''
            },
            differentShipping: false,
            secondAddress: {
                company: '',
                firstName: '',
                lastName: '',
                street: '',
                additional: '',
                zip: '',
                city: '',
                country: ''
            },
            imgCheck: {}
        };

        this.fileCoverChange = this.fileCoverChange.bind(this);
        this.amountImagesChange = this.amountImagesChange.bind(this);

        this.selectedFCColorChange = this.selectedFCColorChange.bind(this);
        this.selectedFCColorBlur = this.selectedFCColorBlur.bind(this);

        this.cropImage = this.cropImage.bind(this);
        this.onToggle = this.onToggle.bind(this);
    }

    componentWillMount() {
        const tempValue = mapFrontSideData()[0];
        this.setState({imageStyle: tempValue.imageStyle});
        this.setState({textStyle: tempValue.textStyle});
    }

    componentDidMount() {
        let canvas1 = document.getElementById('preview-one');
        const canvas2 = document.getElementById('preview-two');

        let imageObjOne = new Image();
        let imageObjTwo = new Image();

        imageObjOne.onload = function() {
            canvas1.getContext("2d").drawImage(imageObjOne, 0, 0, 500, 700, -5, 0, 305, 150);
        };


        imageObjTwo.onload = function() {
            canvas2.getContext("2d").drawImage(imageObjTwo, 0, 0, 500, 700, -5, 0, 305, 150);
        };

        imageObjOne.src = this.props.stepOneImage;
        imageObjTwo.src = this.props.stepTwoImage;

        //canvas1.getContext("2d").drawImage(this.props.stepOneImage, 0, 0, 250, 250);
        //canvas2.getContext("2d").drawImage(this.props.stepTwoState.imageData, 0, 0, 250, 250);
    }

    cropImage(image){
        this.setState({croppedImage: image});
        this.setState({crop: true})
    }

    renderImage(imageStyle){
        return (
            <img style={imageStyle} alt="not found" src={this.state.croppedImage} />
        )
    }

    fileCoverChange(event) {
        if(event.target.files && event.target.files[0]) {
            this.setState({crop: false});
            let reader = new FileReader();
            reader.onload = (e) => {
                this.setState({fileCover: e.target.result});
            };
            reader.readAsDataURL(event.target.files[0]);
            this.setState({fileName: event.target.files[0].name});
        }
    }

    amountImagesChange(event) {
        const tempValue = mapFrontSideData().find(item => item.key === event.target.value);
        this.setState({imageStyle: tempValue.imageStyle});
        this.setState({textStyle: tempValue.textStyle});
        this.setState({fontSize: tempValue.textStyle.fontSize});
        this.setState({isLast: tempValue.isLastChange});
    }

    getHexColor(colorStr) {
        let a = document.createElement('div');
        a.style.color = colorStr;
        let colors = window.getComputedStyle( document.body.appendChild(a) ).color.match(/\d+/g).map((a) => { return parseInt(a,10); });
        document.body.removeChild(a);
        return (colors.length >= 3) ? '#' + (((1 << 24) + (colors[0] << 16) + (colors[1] << 8) + colors[2]).toString(16).substr(1)) : false;
    }

    selectedFCColorChange(event) {
        let temp = Object.assign({}, this.state.textStyle);
        temp.color = event.target.value;

        this.setState({textStyle: temp});
    }
    selectedFCColorBlur(event) {
        let temp = Object.assign({}, this.state.textStyle);

        let colorVal = event.target.value;
        if(!colorVal.startsWith('#', 0)) {
            colorVal = this.getHexColor(event.target.value)
        }
        temp.color = colorVal;

        this.setState({textStyle: temp});

    }

    onToggle() {
        this.setState({ toggleActive: !this.state.toggleActive });
    }

    onNextClick() {
        this.props.onNextClick(3, JSON.parse(JSON.stringify(this.state)));
    }
    onPrevClick() {
        this.props.onPrevClick(3);
    }

    render(){
        let style={
            canvasSize: {
                marginLeft: '10%',
                width: '600px',
                height: '410px',
            },
            canvasStyle: {
                width: '260px',
                height: '370px',
                margin: '10px',
                padding: '0px',
                boxShadow: '0px 0px 22px 3px rgba(0, 0, 0, 0.35)'
            },
            brandingStyle: {
                position: 'relative',
                zIndex: '1000',
                float: 'right',
                margin: '20px',
                display: this.state.branding ? 'block' : 'none'
            }
        };
        return(
            <div>
                <div className="row">
                    <div className="col-md-6">
                        <Form horizontal>
                            <fieldset>
                                <legend>Product Section</legend>
                                <SwitchToggle
                                    label="Online Comp Card"
                                    onChange={(el, state) => this.setState({onlineCardComp: state})}
                                    value={this.state.onlineCardComp}
                                    bsSize="mini"
                                    name="cardComp"/>
                                <SelectGroup
                                    id="formControlsSelectTemplate"
                                    label="Comp Card file"
                                    data={[{key: true, value: 'PDF & JPG'}]}/>
                                <SelectGroup
                                    id="formControlsSelectTemplate"
                                    label="Comp Card print"
                                    onChange={(event) => this.setState({printQuantity: event.target.value})}
                                    data={mapCardPrintQty()}/>
                                <div className="row">
                                    <div className="col-md-8">
                                        <SelectGroup
                                            id="formControlsSelectTemplate"
                                            label="Paper"
                                            labelSize={6}
                                            componentSize={6}
                                            onChange={(event) => this.setState({paperWeight: event.target.value})}
                                            data={[{key: 'standard', value: '300 gsm (Standard)'},
                                                    {key: 'premium', value: '350 gsm (Premium)'}]}/>
                                    </div>
                                    <div className="col-md-4">
                                        <SelectGroup
                                            noLabel={true}
                                            componentSize={12}
                                            id="formControlsSelectTemplate"
                                            onChange={(event) => this.setState({paperQuality: event.target.value})}
                                            data={[{key: 'without', value: 'without refinement'},
                                                    {key: 'lGlossy', value: 'Lamination Glossy'},
                                                    {key:'lMap', value: 'Lamination Matt'}]}/>
                                    </div>
                                </div>
                                <SelectGroup
                                    id="formControlsSelectTemplate"
                                    label="Production"
                                    onChange={(event) => console.log(event.target.value)}
                                    data={[{key:'standard', value: 'Standard (5 Wektage)'},
                                            {key: 'silber', value: 'Express Silber (3 Wektage)'},
                                            {key: 'gold', value: 'Express Gold (1 Wektage)'}]}/>
                                <SelectGroup
                                    id="formControlsSelectBranding"
                                    label="Branding"
                                    onChange={(event) => this.setState({branding: event.target.value})}
                                    data={[{key: false, value: "Without Branding"},
                                            {key: true, value: "Model Platform Logo (-3$)"}]}/>
                                <SwitchToggle
                                    label="Individual Changes"
                                    onChange={(el, state) => this.setState({individualChanges: state})}
                                    value={this.state.individualChanges}
                                    bsSize="mini"
                                    name="cardComp"/>
                            </fieldset>
                            <fieldset>
                                <legend>ORDER CONFIRMATION TO</legend>
                                <FieldGroup
                                    id="formControlsLast"
                                    type="email"
                                    label="E-Mail address"
                                    required
                                    placeholder="Enter E-Mail"
                                    onChange={(event) => this.setState({emailAddress: event.target.value})}/>

                            </fieldset>
                            <fieldset>
                                <legend>Address I</legend>
                                <FieldGroup
                                    id="formControlsLast"
                                    type="text"
                                    label="Company"
                                    required
                                    placeholder="Enter Company"
                                    onChange={(event) => Object.assign(this.state.firstAddress, {company: event.target.value})}/>
                                <div className="row">
                                    <div className="col-md-8">
                                        <FieldGroup
                                            id="formControlsLast"
                                            type="text"
                                            label="Name"
                                            labelSize={6}
                                            componentSize={6}
                                            required
                                            placeholder="Firstname"
                                            onChange={(event) => Object.assign(this.state.firstAddress, {firstName: event.target.value})}/>
                                    </div>
                                    <div className="col-md-4">
                                        <FieldGroup
                                            id="formControlsLast"
                                            type="text"
                                            noLabel={true}
                                            componentSize={12}
                                            required
                                            placeholder="Lastname"
                                            onChange={(event) => Object.assign(this.state.firstAddress, {lastName: event.target.value})}/>
                                    </div>
                                </div>
                                <FieldGroup
                                    id="formControlsLast"
                                    type="text"
                                    label="Street & Number"
                                    required
                                    placeholder="Street & Number"
                                    onChange={(event) => Object.assign(this.state.firstAddress, {street: event.target.value})}/>
                                <FieldGroup
                                    id="formControlsLast"
                                    type="text"
                                    label="Additional"
                                    required
                                    placeholder="Enter Address (Optional)"
                                    onChange={(event) => Object.assign(this.state.firstAddress, {additional: event.target.value})}/>
                                <div className="row">
                                    <div className="col-md-8">
                                        <FieldGroup
                                            id="formControlsLast"
                                            type="text"
                                            label="Zip & City"
                                            labelSize={6}
                                            componentSize={6}
                                            required
                                            placeholder="Zip"
                                            onChange={(event) => Object.assign(this.state.firstAddress, {zip: event.target.value})}/>
                                    </div>
                                    <div className="col-md-4">
                                        <FieldGroup
                                            id="formControlsLast"
                                            type="text"
                                            noLabel={true}
                                            componentSize={12}
                                            required
                                            placeholder="City"
                                            onChange={(event) => Object.assign(this.state.firstAddress, {city: event.target.value})}/>
                                    </div>
                                </div>
                                <CountrySelect
                                    label="Country"
                                    value={this.state.country}
                                    onChange={(val) => Object.assign(this.state.firstAddress, {country: val})} />
                            </fieldset>
                            <fieldset>
                                <legend>Address II</legend>
                                <SwitchToggle
                                    label="Different Shipping Address"
                                    onChange={(el, state) => this.setState({differentShipping: state})}
                                    value={this.state.differentShipping}
                                    bsSize="mini"
                                    name="cardComp"/>
                                {this.state.differentShipping &&
                                    <div>
                                        <FieldGroup
                                            id="formControlsLast"
                                            type="text"
                                            label="Company"
                                            required
                                            placeholder="Enter Company"
                                            onChange={(event) => Object.assign(this.state.secondAddress, {company: event.target.value})}/>
                                        <div className="row">
                                            <div className="col-md-8">
                                                <FieldGroup
                                                    id="formControlsLast"
                                                    type="text"
                                                    label="Name"
                                                    labelSize={6}
                                                    componentSize={6}
                                                    required
                                                    placeholder="Firstname"
                                                    onChange={(event) => Object.assign(this.state.secondAddress, {firstName: event.target.value})}/>
                                            </div>
                                            <div className="col-md-4">
                                                <FieldGroup
                                                    id="formControlsLast"
                                                    type="text"
                                                    noLabel={true}
                                                    componentSize={12}
                                                    required
                                                    placeholder="Lastname"
                                                    onChange={(event) => Object.assign(this.state.secondAddress, {lastName: event.target.value})}/>
                                            </div>
                                        </div>
                                        <FieldGroup
                                            id="formControlsLast"
                                            type="text"
                                            label="Street & Number"
                                            required
                                            placeholder="Street & Number"
                                            onChange={(event) => Object.assign(this.state.secondAddress, {street: event.target.value})}/>
                                        <FieldGroup
                                            id="formControlsLast"
                                            type="text"
                                            label="Additional"
                                            required
                                            placeholder="Enter Address (Optional)"
                                            onChange={(event) => Object.assign(this.state.secondAddress, {additional: event.target.value})}/>
                                        <div className="row">
                                            <div className="col-md-8">
                                                <FieldGroup
                                                    id="formControlsLast"
                                                    type="text"
                                                    label="Zip & City"
                                                    labelSize={6}
                                                    componentSize={6}
                                                    required
                                                    placeholder="Zip"
                                                    onChange={(event) => Object.assign(this.state.secondAddress, {zip: event.target.value})}/>
                                            </div>
                                            <div className="col-md-4">
                                                <FieldGroup
                                                    id="formControlsLast"
                                                    type="text"
                                                    noLabel={true}
                                                    componentSize={12}
                                                    required
                                                    placeholder="City"
                                                    onChange={(event) => Object.assign(this.state.secondAddress, {city: event.target.value})}/>
                                            </div>
                                        </div>
                                        <CountrySelect
                                            label="Country"
                                            value={this.state.country}
                                            onChange={(val) => Object.assign(this.state.secondAddress, {country: val})} />
                                    </div>
                                }
                            </fieldset>
                        </Form>
                    </div>
                    <div className="col-md-6">
                        <fieldset>
                            <legend>Preview</legend>
                            <div style={style.canvasSize} className="row">
                                <div style={style.canvasStyle} className="col-md-6">
                                    <canvas style={{width: '260px', height: '370px'}} id="preview-one" />
                                </div>
                                <div style={style.canvasStyle} className="col-md-6">
                                    <canvas style={{width: '260px', height: '370px'}} id="preview-two" />
                                </div>
                            </div>
                        </fieldset>
                        <p><strong>Notice:</strong> In this preview you see a rendered version of your Comp Card. Please check, if all your information are shown correctly</p><br/>
                        <fieldset>
                            <legend>OVERVIEW</legend>
                            <div>Fahad</div>
                        </fieldset>
                    </div>
                </div>
                <hr/>
                <div style={{marginTop: '-25px'}} className="container-fluid">
                    <Pager>
                        <Pager.Item previous onClick={() => this.onPrevClick()}>&larr; Previous</Pager.Item>
                        <Pager.Item next onClick={() => this.onNextClick()}>Next &rarr;</Pager.Item>
                    </Pager>
                </div>
            </div>
        );
    }
}
