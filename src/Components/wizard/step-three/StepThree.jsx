import React, {Component} from 'react';
import {mapFrontSideData} from "../step-one/step-one.utils";
import {FieldGroup, SelectGroup, SwitchToggle} from "../../common/field-group/FieldGroup";
import {Form} from "react-bootstrap";

import ImageCropper from "../../common/cropper/ImageCropper";

export default class StepThree extends Component {
    constructor(props) {
        super(props);
        this.state = {
            OnlineCardComp: true,
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
                                    onChange={(el, state) => this.setState({OnlineCardComp: state})}
                                    value={this.state.OnlineCardComp}
                                    bsSize="mini"
                                    name="cardComp"/>
                                <SelectGroup
                                    id="formControlsSelectTemplate"
                                    label="Comp Card file"
                                    onChange={this.amountImagesChange}
                                    data={mapFrontSideData()}/>
                                <SelectGroup
                                    id="formControlsSelectTemplate"
                                    label="Comp Card print"
                                    onChange={this.amountImagesChange}
                                    data={mapFrontSideData()}/>
                                <div className="row">
                                    <div className="col-md-8">
                                        <SelectGroup
                                            id="formControlsSelectTemplate"
                                            label="Paper"
                                            labelSize={6}
                                            componentSize={6}
                                            onChange={this.amountImagesChange}
                                            data={mapFrontSideData()}/>
                                    </div>
                                    <div className="col-md-4">
                                        <SelectGroup
                                            noLabel={true}
                                            componentSize={12}
                                            id="formControlsSelectTemplate"
                                            onChange={this.amountImagesChange}
                                            data={mapFrontSideData()}/>
                                    </div>
                                </div>
                                <SelectGroup
                                    id="formControlsSelectTemplate"
                                    label="Production"
                                    onChange={this.amountImagesChange}
                                    data={mapFrontSideData()}/>
                                <SelectGroup
                                    id="formControlsSelectTemplate"
                                    label="Branding"
                                    onChange={this.amountImagesChange}
                                    data={mapFrontSideData()}/>
                                <SwitchToggle
                                    label="Online Comp Card"
                                    onChange={(el, state) => this.setState({OnlineCardComp: state})}
                                    value={this.state.OnlineCardComp}
                                    bsSize="mini"
                                    name="cardComp"/>
                            </fieldset>
                            <fieldset>
                                <legend>ORDER CONFIRMATION TO</legend>
                                <FieldGroup
                                    id="formControlsLast"
                                    type="email"
                                    label="Height"
                                    required
                                    placeholder="Enter Height"
                                    onChange={(event) => this.setState({lastName: event.target.value})}/>

                            </fieldset>
                            <fieldset>
                                <legend>Address I</legend>
                                <FieldGroup
                                    id="formControlsLast"
                                    type="number"
                                    label="Height"
                                    required
                                    placeholder="Enter Height"
                                    onChange={(event) => this.setState({lastName: event.target.value})}/>
                                <div className="row">
                                    <div className="col-md-8">
                                        <SelectGroup
                                            id="formControlsSelectTemplate"
                                            label="Images Amount"
                                            labelSize={6}
                                            componentSize={6}
                                            onChange={this.amountImagesChange}
                                            data={mapFrontSideData()}/>
                                    </div>
                                    <div className="col-md-4">
                                        <SelectGroup
                                            noLabel={true}
                                            componentSize={12}
                                            id="formControlsSelectTemplate"
                                            onChange={this.amountImagesChange}
                                            data={mapFrontSideData()}/>
                                    </div>
                                </div>
                                <FieldGroup
                                    id="formControlsLast"
                                    type="number"
                                    label="Hip"
                                    required
                                    placeholder="Enter Hip"
                                    onChange={(event) => this.setState({lastName: event.target.value})}/>
                                <FieldGroup
                                    id="formControlsLast"
                                    type="text"
                                    label="Eyes"
                                    required
                                    placeholder="Enter Eye Color"
                                    onChange={(event) => this.setState({lastName: event.target.value})}/>
                                <div className="row">
                                    <div className="col-md-8">
                                        <SelectGroup
                                            id="formControlsSelectTemplate"
                                            label="Images Amount"
                                            labelSize={6}
                                            componentSize={6}
                                            onChange={this.amountImagesChange}
                                            data={mapFrontSideData()}/>
                                    </div>
                                    <div className="col-md-4">
                                        <SelectGroup
                                            noLabel={true}
                                            componentSize={12}
                                            id="formControlsSelectTemplate"
                                            onChange={this.amountImagesChange}
                                            data={mapFrontSideData()}/>
                                    </div>
                                </div>
                                <SelectGroup
                                    id="formControlsSelectTemplate"
                                    label="Images Amount"
                                    onChange={this.amountImagesChange}
                                    data={mapFrontSideData()}/>
                            </fieldset>
                            <fieldset>
                                <legend>Address II</legend>
                                <FieldGroup
                                    id="formControlsLast"
                                    type="number"
                                    label="Height"
                                    required
                                    placeholder="Enter Height"
                                    onChange={(event) => this.setState({lastName: event.target.value})}/>
                                <div className="row">
                                    <div className="col-md-8">
                                        <SelectGroup
                                            id="formControlsSelectTemplate"
                                            label="Images Amount"
                                            labelSize={6}
                                            componentSize={6}
                                            onChange={this.amountImagesChange}
                                            data={mapFrontSideData()}/>
                                    </div>
                                    <div className="col-md-4">
                                        <SelectGroup
                                            noLabel={true}
                                            componentSize={12}
                                            id="formControlsSelectTemplate"
                                            onChange={this.amountImagesChange}
                                            data={mapFrontSideData()}/>
                                    </div>
                                </div>
                                <FieldGroup
                                    id="formControlsLast"
                                    type="number"
                                    label="Hip"
                                    required
                                    placeholder="Enter Hip"
                                    onChange={(event) => this.setState({lastName: event.target.value})}/>
                                <FieldGroup
                                    id="formControlsLast"
                                    type="text"
                                    label="Eyes"
                                    required
                                    placeholder="Enter Eye Color"
                                    onChange={(event) => this.setState({lastName: event.target.value})}/>
                                <div className="row">
                                    <div className="col-md-8">
                                        <SelectGroup
                                            id="formControlsSelectTemplate"
                                            label="Images Amount"
                                            labelSize={6}
                                            componentSize={6}
                                            onChange={this.amountImagesChange}
                                            data={mapFrontSideData()}/>
                                    </div>
                                    <div className="col-md-4">
                                        <SelectGroup
                                            noLabel={true}
                                            componentSize={12}
                                            id="formControlsSelectTemplate"
                                            onChange={this.amountImagesChange}
                                            data={mapFrontSideData()}/>
                                    </div>
                                </div>
                                <SelectGroup
                                    id="formControlsSelectTemplate"
                                    label="Images Amount"
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
