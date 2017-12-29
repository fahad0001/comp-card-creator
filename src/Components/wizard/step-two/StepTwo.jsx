import React, {Component} from 'react';
import {mapFrontSideData} from "../step-one/step-one.utils";
import {FieldGroup, SelectGroup, ColorGroup} from "../../common/field-group/FieldGroup";
import {Form} from "react-bootstrap";

import ImageCropper from "../../common/cropper/ImageCropper";

export default class StepTwo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fileCover: null,
            croppedImage: null,
            fileName: '',
            amountImages: '',
            selectedBGColor: '#ffffff',
            selectedFont: 'Arial',
            crop: false,
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
                                <legend>Design</legend>
                                <SelectGroup
                                    id="formControlsSelectTemplate"
                                    label="Images Amount"
                                    onChange={this.amountImagesChange}
                                    data={mapFrontSideData()}/>
                                <ColorGroup
                                    id="formControlsBGColor"
                                    onChange={this.selectedBGColorChange}
                                    onBlur={this.selectedBGColorBlur}
                                    value={this.state.selectedBGColor}
                                    label="Background Color"/>
                                <ColorGroup
                                    id="formControlsFCColor"
                                    onChange={this.selectedFCColorChange}
                                    onBlur={this.selectedFCColorBlur}
                                    value={this.state.textStyle.color}
                                    label="Font Color"/>
                                <FieldGroup
                                    id="formControlsFile"
                                    type="file"
                                    label="Cover File"
                                    required
                                    onChange={this.fileCoverChange}/>
                            </fieldset>
                            <fieldset>
                                <legend>Your Data</legend>
                                <SelectGroup
                                    id="formControlsSelectTemplate"
                                    label="Sex"
                                    onChange={this.amountImagesChange}
                                    data={[{
                                        key: 'M',
                                        value: 'Male'
                                    },{
                                        key: 'F',
                                        value: 'Female'
                                    }]}/>
                                <FieldGroup
                                    id="formControlsLast"
                                    type="number"
                                    label="Height"
                                    required
                                    placeholder="Enter Height"
                                    onChange={(event) => this.setState({lastName: event.target.value})}/>
                                <FieldGroup
                                    id="formControlsLast"
                                    type="number"
                                    label="Chest"
                                    required
                                    placeholder="Enter Chest"
                                    onChange={(event) => this.setState({lastName: event.target.value})}/>
                                <FieldGroup
                                    id="formControlsLast"
                                    type="number"
                                    label="Waist"
                                    required
                                    placeholder="Enter Waist"
                                    onChange={(event) => this.setState({lastName: event.target.value})}/>
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
                                <FieldGroup
                                    id="formControlsLast"
                                    type="text"
                                    label="Hair"
                                    required
                                    placeholder="Enter Hair Color"
                                    onChange={(event) => this.setState({lastName: event.target.value})}/>
                                <FieldGroup
                                    id="formControlsLast"
                                    type="text"
                                    label="Shoes"
                                    required
                                    placeholder="Enter Shoe size"
                                    onChange={(event) => this.setState({lastName: event.target.value})}/>
                            </fieldset>
                            <fieldset>
                                <legend>OTHER INFORMATION</legend>
                                <FieldGroup
                                    id="formControlsFirst"
                                    type="text"
                                    placeholder="Space for contact and additional Info"
                                    required
                                    onChange={(event) => this.setState({firstName: event.target.value})}/>
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
