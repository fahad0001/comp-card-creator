import React, {Component} from 'react';
import {mapFrontSideData} from "../step-one/step-one.utils";
import {FieldGroup, SelectGroup, SwitchToggle} from "../../common/field-group/FieldGroup";
import {Form} from "react-bootstrap";

import ImageCropper from "../../common/cropper/ImageCropper";
import {mapCardPrintQty} from "./step-three.utils";

export default class StepThree extends Component {
    constructor(props) {
        super(props);
        this.state = {
            onlineCardComp: true,
            individualChanges: true,
            fileCover: null,
            croppedImage: null,
            fileName: '',
            amountImages: '',
            selectedBGColor: '#ffffff',
            selectedFont: 'Arial',
            crop: false,
            toggleActive: false,
            personalInfo: {
                sex: '',
                Height: 0,
                Chest: 0,
                Waist: 0,
                Hip: 0,
                Eyes: '',
                Hair: '',
                Shoes: 0
            },
            imageStyle: {},
            textStyle: {}
        };

        this.fileCoverChange = this.fileCoverChange.bind(this);
        this.amountImagesChange = this.amountImagesChange.bind(this);

        this.selectedBGColorChange = this.selectedBGColorChange.bind(this);
        this.selectedBGColorBlur = this.selectedBGColorBlur.bind(this);

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

    selectedBGColorChange(event) {
        this.setState({selectedBGColor: event.target.value});
    }
    selectedBGColorBlur(event) {
        let colorVal = event.target.value;
        if(!colorVal.startsWith('#', 0)) {
            colorVal = this.getHexColor(event.target.value)
        }
        this.setState({selectedBGColor: colorVal});

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

    render(){
        let style = {
            canvasStyle: {
                backgroundColor: this.state.selectedBGColor
            },
            canvasTextStyle: {
                position:'absolute',
                zIndex: '1000',
                fontFamily: this.state.selectedFont,
                ...this.state.textStyle,
            },
            brandingStyle: {
                position: 'relative',
                float: 'right',
                margin: '20px'
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
                                    onChange={this.amountImagesChange}
                                    data={[{key: true, value: 'PDF & JPG'}]}/>
                                <SelectGroup
                                    id="formControlsSelectTemplate"
                                    label="Comp Card print"
                                    onChange={this.amountImagesChange}
                                    data={mapCardPrintQty()}/>
                                <div className="row">
                                    <div className="col-md-8">
                                        <SelectGroup
                                            id="formControlsSelectTemplate"
                                            label="Paper"
                                            labelSize={6}
                                            componentSize={6}
                                            onChange={(event) => console.log(event.target.value)}
                                            data={[{key: 'standard', value: '300 gsm (Standard)'},
                                                    {key: 'premium', value: '350 gsm (Premium)'}]}/>
                                    </div>
                                    <div className="col-md-4">
                                        <SelectGroup
                                            noLabel={true}
                                            componentSize={12}
                                            id="formControlsSelectTemplate"
                                            onChange={this.amountImagesChange}
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
                                    label="Online Comp Card"
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
                                    onChange={(event) => this.setState({lastName: event.target.value})}/>

                            </fieldset>
                            <fieldset>
                                <legend>Address I</legend>
                                <FieldGroup
                                    id="formControlsLast"
                                    type="text"
                                    label="Company"
                                    required
                                    placeholder="Enter Company"
                                    onChange={(event) => this.setState({lastName: event.target.value})}/>
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
                                            onChange={(event) => this.setState({lastName: event.target.value})}/>
                                    </div>
                                    <div className="col-md-4">
                                        <FieldGroup
                                            id="formControlsLast"
                                            type="text"
                                            noLabel={true}
                                            componentSize={12}
                                            required
                                            placeholder="Lastname"
                                            onChange={(event) => this.setState({lastName: event.target.value})}/>
                                    </div>
                                </div>
                                <FieldGroup
                                    id="formControlsLast"
                                    type="text"
                                    label="Street & Number"
                                    required
                                    placeholder="Street & Number"
                                    onChange={(event) => this.setState({lastName: event.target.value})}/>
                                <FieldGroup
                                    id="formControlsLast"
                                    type="text"
                                    label="Additional"
                                    required
                                    placeholder="Enter Address (Optional)"
                                    onChange={(event) => this.setState({lastName: event.target.value})}/>
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
                                            onChange={(event) => this.setState({lastName: event.target.value})}/>
                                    </div>
                                    <div className="col-md-4">
                                        <FieldGroup
                                            id="formControlsLast"
                                            type="text"
                                            noLabel={true}
                                            componentSize={12}
                                            required
                                            placeholder="City"
                                            onChange={(event) => this.setState({lastName: event.target.value})}/>
                                    </div>
                                </div>
                                <SelectGroup
                                    id="formControlsSelectTemplate"
                                    label="Country"
                                    type="country"
                                    onChange={this.amountImagesChange}
                                    data={mapFrontSideData()}/>
                            </fieldset>
                            <fieldset>
                                <legend>Address II</legend>
                                <SwitchToggle
                                    label="Different Shipping Address"
                                    onChange={(el, state) => this.setState({onlineCardComp: state})}
                                    value={this.state.onlineCardComp}
                                    bsSize="mini"
                                    name="cardComp"/>
                                <FieldGroup
                                    id="formControlsLast"
                                    type="text"
                                    label="Company"
                                    required
                                    placeholder="Enter Company"
                                    onChange={(event) => this.setState({lastName: event.target.value})}/>
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
                                            onChange={(event) => this.setState({lastName: event.target.value})}/>
                                    </div>
                                    <div className="col-md-4">
                                        <FieldGroup
                                            id="formControlsLast"
                                            type="text"
                                            noLabel={true}
                                            componentSize={12}
                                            required
                                            placeholder="Lastname"
                                            onChange={(event) => this.setState({lastName: event.target.value})}/>
                                    </div>
                                </div>
                                <FieldGroup
                                    id="formControlsLast"
                                    type="text"
                                    label="Street & Number"
                                    required
                                    placeholder="Street & Number"
                                    onChange={(event) => this.setState({lastName: event.target.value})}/>
                                <FieldGroup
                                    id="formControlsLast"
                                    type="text"
                                    label="Additional"
                                    required
                                    placeholder="Enter Address (Optional)"
                                    onChange={(event) => this.setState({lastName: event.target.value})}/>
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
                                            onChange={(event) => this.setState({lastName: event.target.value})}/>
                                    </div>
                                    <div className="col-md-4">
                                        <FieldGroup
                                            id="formControlsLast"
                                            type="text"
                                            noLabel={true}
                                            componentSize={12}
                                            required
                                            placeholder="City"
                                            onChange={(event) => this.setState({lastName: event.target.value})}/>
                                    </div>
                                </div>
                                <SelectGroup
                                    id="formControlsSelectTemplate"
                                    label="Country"
                                    type="country"
                                    onChange={this.amountImagesChange}
                                    data={mapFrontSideData()}/>
                            </fieldset>
                        </Form>
                    </div>
                    <div className="col-md-6">
                        <fieldset>
                            <legend>Preview</legend>
                            <div className="canvas-size">
                                {this.state.fileCover && !this.state.crop ?
                                    <ImageCropper
                                        image={this.state.fileCover}
                                        cropImage={this.cropImage}/>
                                    :
                                    <div style={style.canvasStyle} className="canvas-style">
                                        <div>
                                            <div style={{position: "absolute"}}>{this.state.croppedImage ? this.renderImage(this.state.imageStyle) : ''}</div>
                                            <div style={style.canvasTextStyle}>
                                                {this.state.firstName + ' '}
                                                <span style={{fontSize: this.state.isLast ? (this.state.fontSize * 2): this.state.fontSize + 'px'}}>
                                                    {this.state.lastName}
                                                </span>
                                            </div>
                                            {this.state.branding &&
                                            <div style={style.brandingStyle}>
                                                <img width={"100px"} src={"image/branding-logo.png"} alt="not-found"/>
                                            </div>
                                            }
                                        </div>
                                    </div>
                                }
                            </div>
                        </fieldset>
                    </div>
                </div>
            </div>
        );
    }
}
