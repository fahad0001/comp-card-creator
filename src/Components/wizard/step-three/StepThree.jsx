import React, {Component} from 'react';
import {mapFrontSideData} from "../step-one/step-one.utils";
import {CountrySelect, FieldGroup, SelectGroup, SwitchToggle} from "../../common/field-group/FieldGroup";
import {Form, Pager} from "react-bootstrap";
import StripePayment from '../../common/stripe-wrapper/StripePayment';

import {mapCardPrintQty} from "./step-three.utils";

export default class StepThree extends Component {
    constructor(props) {
        super(props);
        this.state = {
            onlineCardComp: true,
            printQuantity: 0,
            roundCorner: false,
            envelope: false,
            paperWeight: '',
            paperQuality: '',
            production: '',
            branding: false,
            individualChanges: false,
            emailAddress: '',
            firstAddress: {
                company: '',
                firstName: '',
                lastName: '',
                street: '',
                additional: '',
                zip: '',
                city: '',
                country: 'United States'
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
            price: {
              amountQty: 0,
              amountPDF: 20,
              amountIndividual: 0,
              amountBrand: 0
            },
            imgCheck: {},
            selectedQtyOpt: {},
            nextEventEnable: false,
            countryError: false,
            enablePayment: false,
            uploadStart: false,
            uploadError: false
        };

        this.fileCoverChange = this.fileCoverChange.bind(this);
        this.amountImagesChange = this.amountImagesChange.bind(this);

        this.selectedFCColorChange = this.selectedFCColorChange.bind(this);
        this.selectedFCColorBlur = this.selectedFCColorBlur.bind(this);

        this.cropImage = this.cropImage.bind(this);
        this.onToggle = this.onToggle.bind(this);

        this.printQuantityChange = this.printQuantityChange.bind(this);
        this.enableBranding = this.enableBranding.bind(this);

        this.formSubmit = this.formSubmit.bind(this);
        this.submitUserInfo = this.submitUserInfo.bind(this);
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

        imageObjOne.src = this.props.stepOneState.imageData;
        imageObjTwo.src = this.props.stepTwoState.imageData;
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

    enableBranding(event) {
        const value = event.target.value === 'true';
        let tempPrice = Object.assign({}, this.state.price);
        tempPrice.amountBrand = value ? -3 : 0;
        this.setState({branding: value, price: tempPrice});
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

    printQuantityChange(event) {
        const selectedQty = mapCardPrintQty().filter(obj => obj.key === +event.target.value)[0];
        if(+event.target.value === 0) {
            this.setState({roundCorner: false, envelope: false, printQuantity: 0});
            Object.assign(this.state.price, {amountQty: selectedQty.price});
        } else {
            this.setState({selectedQtyOpt: selectedQty});
            this.setState({printQuantity: +event.target.value});
            this.calculatePrice(selectedQty, this.state.envelope, this.state.roundCorner);
        }
    }

    calculatePrice(selectedQty, envelope, roundCorner) {
        let temp = Object.assign({}, this.state.price);
        switch(this.checkOptionStatus(envelope, roundCorner)) {
            case 0:
                temp.amountQty = selectedQty.price;
                break;
            case 1:
                temp.amountQty = selectedQty.priceE;
                break;
            case 2:
                temp.amountQty = selectedQty.priceRC;
                break;
            case 3:
                temp.amountQty = selectedQty.priceRCE;
                break;
            default: break;
        }
        this.setState({price: temp});
    }

    checkOptionStatus(envelope, roundCorner) {
        if( envelope && roundCorner) {
            return 3;
        } else if(roundCorner) {
            return 2;
        } else if(envelope) {
            return 1
        } return 0;
    }

    calculatePriceWithTax() {
        let sumObj = Object.values(this.state.price).reduce((prev, curr) => prev + curr);
        return sumObj + sumObj * 0.15;
    }

    onToggle(cornerOrEnvelope, status) {
        if(cornerOrEnvelope === 'corner') {
            this.setState({roundCorner: status});
            this.calculatePrice(this.state.selectedQtyOpt, this.state.envelope, status);
        } else {
            this.setState({envelope: status});
            this.calculatePrice(this.state.selectedQtyOpt, this.state.envelope, status);
        }
    }

    onNextClick() {
        this.props.onNextClick(3, JSON.parse(JSON.stringify(this.state)));
    }
    onPrevClick() {
        this.props.onPrevClick(3);
    }

    formSubmit(event) {
        event.preventDefault();
        if(!this.state.firstAddress.country) {
            this.setState({countryError: true})
        } else {
            this.setState({enablePayment: true});
            this.props.onNextClick(3, JSON.parse(JSON.stringify(this.state)));
        }
    }

    submitUserInfo(tokenData) {
        let personalData = {
            tokenData,
            PersonalDetail : {
                firstName: this.props.stepOneState.state.firstName,
                lastName: this.props.stepOneState.state.lastName,
                selectedTemplate: this.props.stepOneState.state.selectedTemplate,
                selectedBGColor: this.props.stepOneState.state.selectedBGColor,
                selectedFont: this.props.stepOneState.state.selectedFont,
                fontSize: this.props.stepOneState.state.fontSize,
                branding: this.props.stepOneState.state.branding !== '0'
            },
            personalProperties: {
                totalImages: this.props.stepTwoState.state.amountImages,
                selectedBGColor: this.props.stepTwoState.state.selectedBGColor,
                personalInfo: {
                    sex: this.props.stepTwoState.state.sex,
                    height: this.props.stepTwoState.state.height,
                    chest: this.props.stepTwoState.state.chest,
                    waist: this.props.stepTwoState.state.waist,
                    hip: this.props.stepTwoState.state.hip,
                    eyes: this.props.stepTwoState.state.eyes,
                    hair: this.props.stepTwoState.state.hair,
                    shoes: this.props.stepTwoState.state.shoes
                },
                other: this.props.stepTwoState.state.otherInfo,
            },
            OrderDetail: {
                onlineCardComp: this.state.onlineCardComp,
                roundCorner: this.state.roundCorner,
                envelope: this.state.envelope,
                branding: this.state.branding,
                individualChanges: this.state.individualChanges,
                emailAddress: this.state.emailAddress,
                firstAddress: this.state.firstAddress,
                differentShipping: this.state.differentShipping,
                secondAddress: this.state.secondAddress,
                totalAmount: this.calculatePriceWithTax()
            }
        };
        let ImagesStepOne = {
            step: 1,
            originalImage: this.props.stepOneState.state.fileCover,
            croppedImage: this.props.stepOneState.state.croppedImage,
            finalImage: this.props.stepOneState.imageData,
            finalImageWB: this.props.stepOneState.imageWithBranding
        };

        let ImagesStepTwo = {
            step: 2,
            originalImage: this.props.stepTwoState.state.fileCover,
            croppedImage: this.props.stepTwoState.state.croppedImage,
            finalImage: this.props.stepTwoState.imageData
        };
        this.props.uploadData(personalData);
        this.props.uploadImages(ImagesStepOne);
        this.props.uploadImages(ImagesStepTwo);

    }

    render(){
        const {dataUploadInfo, imageUploadInfo} = this.props;
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
            },
            nextButtonStyle: {
                pointerEvents: this.state.nextEventEnable ? 'auto' : 'none'
            }
        };
        return(
            (dataUploadInfo.isFetching && imageUploadInfo.isFetching) ?
                <div style={{width: '100%', height: '100%', backgroundColor: 'black', color: 'white'}}>Uploading</div>
                :
                dataUploadInfo.error ?
                    <div style={{width: '100%', height: '100%', backgroundColor: 'red', color: 'white'}}>Error</div>
                    :
                    <div>
                    <div className="row">
                        <div className="col-md-6">
                            <Form horizontal onSubmit={this.formSubmit}>
                                <fieldset>
                                    <legend>Product Section</legend>
                                    <SwitchToggle
                                        label="Online Comp Card"
                                        onText="Yes"
                                        offText="No"
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
                                        onChange={this.printQuantityChange}
                                        data={mapCardPrintQty()}/>
                                    <SwitchToggle
                                        label="Rounded Corner"
                                        onText="Yes"
                                        offText="No"
                                        onChange={(el, state) => this.onToggle('corner', state)}
                                        disabled={!this.state.printQuantity}
                                        value={this.state.roundCorner}
                                        bsSize="mini"
                                        name="roundCorner"/>
                                    <SwitchToggle
                                        label="Envelope"
                                        onText="Yes"
                                        offText="No"
                                        disabled={!this.state.printQuantity}
                                        onChange={(el, state) => this.onToggle('envelope', state)}
                                        value={this.state.envelope}
                                        bsSize="mini"
                                        name="envelope"/>
                                    <SelectGroup
                                        id="formControlsSelectBranding"
                                        label="Branding"
                                        onChange={this.enableBranding}
                                        data={[{key: false, value: "Without Branding"},
                                            {key: true, value: "Model Platform Logo (-3$)"}]}/>
                                    <SwitchToggle
                                        label="Individual Changes"
                                        onText="Yes"
                                        offText="No"
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
                                        required
                                        value={this.state.firstAddress.country}
                                        onChange={(val) => this.setState({
                                            firstAddress: Object.assign(this.state.firstAddress, {country: val}),
                                            countryError: false
                                        })}/>
                                </fieldset>
                                <fieldset>
                                    <legend>Address II</legend>
                                    <SwitchToggle
                                        label="Different Shipping Address"
                                        onText="Yes"
                                        offText="No"
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
                                            required
                                            value={this.state.secondAddress.country}
                                            onChange={(val) => this.setState({secondAddress: Object.assign(this.state.secondAddress, {country: val})})}/>
                                    </div>
                                    }
                                </fieldset>
                                <br/>
                                {!this.state.enablePayment && <FieldGroup
                                    type="submit"
                                    labelSize={6}
                                    componentSize={4}
                                    value="Validate"
                                    style={{backgroundColor: "#363636", color: "white"}}
                                    className="btn btn-outline-success waves-effect"
                                    required/>
                                }
                            </Form>
                            {this.state.enablePayment && !this.state.countryError && <div className="col-md-offset-4">
                                <div className="row">
                                    <div className="col-md-6">
                                        <StripePayment
                                            email={this.state.emailAddress}
                                            payment={this.calculatePriceWithTax()}
                                            returnedToken={token => this.submitUserInfo(token)}/>
                                    </div>
                                    <div className="col-md-6">
                                        <button
                                            style={{
                                                width: '170px',
                                                marginBottom: '15px',
                                                color: 'white',
                                                fontSize: '15px',
                                                backgroundColor: 'red'
                                            }}
                                            onClick={() => this.setState({enablePayment: false})}
                                            className="btn btn-outline-default">Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>}
                            {this.state.countryError && <div className="col-md-offset-4">
                                <h5 style={{color: 'red'}}>*Please Select Country</h5>
                            </div>}
                        </div>
                        <div className="col-md-6">
                            <fieldset>
                                <legend>Preview</legend>
                                <div style={style.canvasSize} className="row">
                                    <div style={style.canvasStyle} className="col-md-6">
                                        <canvas style={{width: '260px', height: '370px'}} id="preview-one"/>
                                    </div>
                                    <div style={style.canvasStyle} className="col-md-6">
                                        <canvas style={{width: '260px', height: '370px'}} id="preview-two"/>
                                    </div>
                                </div>
                            </fieldset>
                            <p><strong>Notice:</strong> In this preview you see a rendered version of your Comp Card.
                                Please check, if all your information are shown correctly</p><br/>
                            <fieldset>
                                <legend>OVERVIEW</legend>
                                <div className="container-fluid row">
                                    <div className="col-md-8">
                                        <div style={{textAlign: 'left'}}>PDF & JPG</div>
                                    </div>
                                    <div className="col-md-4">
                                        <div style={{textAlign: 'Right'}}>{this.state.price.amountPDF} $</div>
                                    </div>
                                </div>
                                {this.state.printQuantity > 0 &&
                                <div className="container-fluid row">
                                    <div className="col-md-8">
                                        <div style={{textAlign: 'left'}}>
                                            <span>{this.state.printQuantity} Pieces</span>&nbsp;
                                            <span
                                                style={{fontSize: '9px'}}>{this.state.roundCorner ? 'Round Corner' : ''}</span>&nbsp;
                                            <span
                                                style={{fontSize: '9px'}}>{this.state.envelope ? 'Envelope' : ''}</span>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div style={{textAlign: 'Right'}}>{this.state.price.amountQty} $</div>
                                    </div>
                                </div>
                                }
                                {this.state.onlineCardComp &&
                                <div className="container-fluid row">
                                    <div className="col-md-8">
                                        <div style={{textAlign: 'left'}}>Online Comp Card</div>
                                    </div>
                                    <div className="col-md-4">
                                        <div style={{textAlign: 'Right'}}>0.00 $</div>
                                    </div>
                                </div>
                                }
                                {this.state.branding &&
                                <div className="container-fluid row">
                                    <div className="col-md-8">
                                        <div style={{textAlign: 'left'}}>Model Platform Logo (-3 $)</div>
                                    </div>
                                    <div className="col-md-4">
                                        <div style={{textAlign: 'Right'}}>{this.state.price.amountBrand} $</div>
                                    </div>
                                </div>
                                }
                                <hr/>
                                <div className="container-fluid row">
                                    <div className="col-md-8">
                                        <div style={{textAlign: 'left'}}><strong>Subtotal (incl. 15% tax)</strong></div>
                                    </div>
                                    <div className="col-md-4">
                                        <div style={{textAlign: 'Right'}}>
                                            <strong>{this.calculatePriceWithTax()} $</strong></div>
                                    </div>
                                </div>
                            </fieldset>
                        </div>
                    </div>
                    <hr/>
                    <div style={{marginTop: '-25px'}} className="container-fluid">
                        <Pager>
                            <Pager.Item previous onClick={() => this.onPrevClick()}>&larr; Previous</Pager.Item>
                            <Pager.Item next style={style.nextButtonStyle}
                                        onClick={() => this.onNextClick()}>Next &rarr;</Pager.Item>
                        </Pager>
                    </div>
                </div>
        );
    }
}
