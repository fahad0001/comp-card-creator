import React, {Component} from 'react';
import "./StepOne.css";
import WebFont from 'webfontloader';
import {FieldGroup, SelectGroup, ColorGroup} from "../../common/field-group/FieldGroup";
import {Form, Pager} from "react-bootstrap";

import ImageCropper from "../../common/cropper/ImageCropper";
import {mapFontData, mapFrontSideData} from "./step-one.utils";

import html2canvas from 'html2canvas';

class StepOne extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            fileCover: null,
            croppedImage: null,
            fileName: '',
            selectedTemplate: '',
            selectedBGColor: '#ffffff',
            selectedFont: 'Arial',
            fontSize: 12,
            isLast: false,
            // branding: '0',
            crop: false,
            imageStyle: {},
            textStyle: {},
            screenShot: {},
            nextEventEnable: false,
            cropError: false
        };

        this.fileCoverChange = this.fileCoverChange.bind(this);
        this.fontSizeChange = this.fontSizeChange.bind(this);
        this.fontSizeBlur = this.fontSizeBlur.bind(this);
        this.selectedTemplateChange = this.selectedTemplateChange.bind(this);

        this.selectedBGColorChange = this.selectedBGColorChange.bind(this);
        this.selectedBGColorBlur = this.selectedBGColorBlur.bind(this);

        this.selectedFCColorChange = this.selectedFCColorChange.bind(this);
        this.selectedFCColorBlur = this.selectedFCColorBlur.bind(this);

        this.cropImage = this.cropImage.bind(this);

        this.formSubmit = this.formSubmit.bind(this);
    }

    componentWillMount() {
        mapFontData().map((itm) => itm.uploadKey && this.loadFont((itm.uploadKey)));
        const tempValue = mapFrontSideData()[0];
        this.setState({imageStyle: tempValue.imageStyle});
        this.setState({textStyle: tempValue.textStyle});
        this.setState({fontSize: tempValue.textStyle.fontSize});
    }

    cropImage(image){
        this.setState({croppedImage: image});
        this.setState({crop: true, cropError: false})
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

    loadFont(font) {
        WebFont.load({
            google:{
                families: [font]
            }
        })
    }

    fontSizeChange(event) {
        let temp = Object.assign({}, this.state.textStyle);
        temp.fontSize = event.target.value + 'px';

        this.setState({fontSize: event.target.value, textStyle: temp});
    }

    fontSizeBlur(event) {
        let temp = Object.assign({}, this.state.textStyle);
        const fontValue = (event.target.value > 11 && event.target.value < 73 && event.target.value) || 12;
        temp.fontSize = fontValue + 'px';
        this.setState({fontSize: fontValue, textStyle: temp});
        event.target.value = fontValue;
    }

    selectedTemplateChange(event) {
        const tempValue = mapFrontSideData().find(item => item.key === event.target.value);
        this.setState({selectedTemplate: tempValue});
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

    onNextClick() {
        html2canvas(document.getElementById('previewCanvas')).then((canvas) => {
            this.props.onNextClick(1, JSON.parse(JSON.stringify(this.state)), canvas.toDataURL('image/jpg'));
        });
    }
    onPrevClick() {
        this.props.onPrevClick(1);
    }

    formSubmit(event) {
        event.preventDefault();
        if(this.state.crop) {
            this.setState({cropError: false, nextEventEnable: true})
        } else {
            this.setState({cropError: true})
        }
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
            nextButtonStyle: {
                pointerEvents: this.state.nextEventEnable ? 'auto' : 'none'
            }
        };
        return(
            <div>
                <div className="row">
                    <div className="col-md-6">
                        <Form horizontal onSubmit={this.formSubmit}>
                            <fieldset>
                                <legend>Talents Info</legend>
                                <FieldGroup
                                    id="formControlsFirst"
                                    type="text"
                                    label="Firstname"
                                    placeholder="Enter Firstname"
                                    required
                                    onChange={(event) => this.setState({firstName: event.target.value})}/>
                                <FieldGroup
                                    id="formControlsLast"
                                    type="text"
                                    label="Lastname"
                                    required
                                    placeholder="Enter Lastname"
                                    onChange={(event) => this.setState({lastName: event.target.value})}/>
                                <FieldGroup
                                    id="formControlsFile"
                                    type="file"
                                    label="Front Image"
                                    required
                                    onChange={this.fileCoverChange}/>
                            </fieldset>
                            <fieldset>
                                <legend>Design</legend>
                                <SelectGroup
                                    id="formControlsSelectTemplate"
                                    label="Front Layout"
                                    onChange={this.selectedTemplateChange}
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
                                <SelectGroup
                                    id="formControlsSelectFont"
                                    label="Font"
                                    onChange={(event) => this.setState({selectedFont: event.target.value})}
                                    data={mapFontData()}/>
                                <FieldGroup
                                    id="formControlsFSize"
                                    type="number"
                                    label="Font Size"
                                    value={this.state.fontSize}
                                    onChange={this.fontSizeChange}
                                    onBlur={this.fontSizeBlur}
                                    placeholder="Enter Font Size"/>
                            </fieldset>
                            <br/>
                            <FieldGroup
                                type="submit"
                                labelSize={6}
                                componentSize={4}
                                value="Validate"
                                className="btn-success"
                                required/>
                        </Form>
                        {this.state.nextEventEnable && !this.state.cropError && <div className="col-md-offset-4">
                            <h5 style={{color: 'red'}}>*Validation Successful Click on Next</h5>
                        </div>}
                        {this.state.cropError && <div className="col-md-offset-4">
                            <h5 style={{color: 'red'}}>*Please Complete Crop Operation First</h5>
                        </div>}
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
                                    <div id="previewCanvas" style={style.canvasStyle} className="canvas-style">
                                        <div style={{position: "absolute"}}>{this.state.croppedImage ? this.renderImage(this.state.imageStyle) : ''}</div>
                                        <div style={style.canvasTextStyle}>
                                            {this.state.firstName + ' '}
                                            <span style={{fontSize: this.state.isLast ? (this.state.fontSize * 2): this.state.fontSize + 'px'}}>
                                                {this.state.lastName}
                                            </span>
                                        </div>
                                    </div>
                                }
                            </div>
                        </fieldset>
                    </div>
                </div>
                <hr/>
                <div style={{marginTop: '-25px'}} className="container-fluid">
                    <Pager>
                        <Pager.Item previous onClick={() => this.onPrevClick()}>&larr; Previous</Pager.Item>
                        <Pager.Item next style={style.nextButtonStyle} onClick={() => this.onNextClick()}>Next &rarr;</Pager.Item>
                    </Pager>
                </div>
            </div>
        );
    }
}


export default StepOne;
