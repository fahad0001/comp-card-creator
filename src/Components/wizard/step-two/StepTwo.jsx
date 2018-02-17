import React, {Component} from 'react';
import {mapAmountImages, mapUserSelection} from "./step-two.utils";
import {FieldGroup, SelectGroup, ColorGroup, RadioGroup} from "../../common/field-group/FieldGroup";
import {Form, Pager} from "react-bootstrap";

import ImageCropper from "../../common/cropper/ImageCropper";
import {ImageCanvas} from "../../common/image-canvas/ImageCanvas";
import html2canvas from "html2canvas";

export default class StepTwo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fileCover: [],
            croppedImage: [],
            fileName: [],
            amountImages: {},
            selectedBGColor: '#ffffff',
            crop: false,
            userType: '',
            personalInfo: {
                height: 0,
                chest: 0,
                waist: 0,
                hip: 0,
                eyes: '',
                hair: '',
                dressSize: 0,
                dob: '',
                inseam: 0,
                shoes: 0
            },
            otherInfo: '',
            selectedIndex: 0,
            imageStyle: [],
            textStyle: {},
            nextEventEnable: false,
            cropError: false,
            pictureError: false
        };


        this.fileCoverChange = this.fileCoverChange.bind(this);
        this.amountImagesChange = this.amountImagesChange.bind(this);

        this.selectedBGColorChange = this.selectedBGColorChange.bind(this);
        this.selectedBGColorBlur = this.selectedBGColorBlur.bind(this);

        this.selectedFCColorChange = this.selectedFCColorChange.bind(this);
        this.selectedFCColorBlur = this.selectedFCColorBlur.bind(this);

        this.onClickImage = this.onClickImage.bind(this);
        this.cropImage = this.cropImage.bind(this);

        this.textDataRender = this.textDataRender.bind(this);

        this.formSubmit = this.formSubmit.bind(this);
    }

    componentWillMount() {
        let coverInit = Array(2).fill('image/add-image.png');
        this.setState({fileCover: coverInit});
        this.setState({croppedImage: coverInit});

        const tempValue = JSON.parse(JSON.stringify(mapAmountImages()[0]));
        this.setState({amountImages: JSON.parse(JSON.stringify(tempValue))});

        //set height and width of picture to auto for first time load so that default picture should have a correct size
        //<Start>
        tempValue.imageDivStyle.forEach((img) => {
           img.imgStyle  = {height: 'auto', width: 'auto'};
        });
        this.setState({imageStyle: tempValue.imageDivStyle});
        //<End>

        this.setState({textStyle: tempValue.textStyle});
    }

    onClickImage(index) {
        this.refs.fileUploader.click();
        this.setState({selectedIndex: index, pictureError: false});
    }

    cropImage(image){
        let temp = Object.assign([], this.state.croppedImage);
        temp[this.state.selectedIndex] = image;
        this.setState({croppedImage: temp});
        this.setState({crop: false, cropError: false})
    }

    renderImage(imageStyle){
        return (
            <img style={imageStyle} alt="not found" src={this.state.croppedImage} />
        )
    }

    fileCoverChange(event) {
        if(event.target.files && event.target.files[0]) {
            let tempStyle = JSON.parse(JSON.stringify(this.state.imageStyle)); // this is to change the style of image from default to defined in util.
            tempStyle[this.state.selectedIndex] = JSON.parse(JSON.stringify(this.state.amountImages.imageDivStyle[this.state.selectedIndex]));
            this.setState({imageStyle: tempStyle}); //this will change the style from default to defined.

            // Saving image and file name in fileCover state also set crop on
            // <start>
            let temp = Object.assign([], this.state.fileCover); // to insert new image into fileCover array.
            let reader = new FileReader();
            reader.onload = (e) => {
                temp[this.state.selectedIndex] = e.target.result;
                this.setState({fileCover: temp});
            };
            reader.readAsDataURL(event.target.files[0]);
            this.setState({fileName: [...this.state.fileName, event.target.files[0].name], crop: true});
            // <end>
        }
    }

    amountImagesChange(event) {
        if(this.state.amountImages.key !== event.target.value){
            const amountImage = mapAmountImages().find(item => item.key === event.target.value);
            this.setState({amountImages: amountImage});

            let coverInit = Array(amountImage.imageQty).fill('image/add-image.png');
            const tempValue = JSON.parse(JSON.stringify(amountImage));

            //set style of image to default which will be shown 1st time
            // <start>
            tempValue.imageDivStyle.forEach((img) => {
                img.imgStyle  = {height: 'auto', width: 'auto'};
            });
            this.setState({imageStyle: tempValue.imageDivStyle});
            this.setState({textStyle: tempValue.textStyle});
            // <end>

            this.setState({fileCover: coverInit});
            this.setState({croppedImage: coverInit});
        }
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

    textDataRender(textStyle) {
        const styleList = {
          marginLeft: '10px',
        };
        const addition = {
          marginTop: '7px',
          display: 'flex',
          justifyContent: 'center'
        };
        return (
            <div>
                <div style={textStyle}>
                    <li style={styleList}>Height: {this.state.personalInfo.height}</li>
                    {this.state.userType === 'M' && <li style={styleList}>Shirt: {this.state.personalInfo.chest}</li>}
                    {this.state.userType === 'M' && <li style={styleList}>Suit: {this.state.personalInfo.waist}</li>}
                    {this.state.userType === 'M' && <li style={styleList}>Inseam: {this.state.personalInfo.eyes}</li>}
                    {this.state.userType === 'W' && <li style={styleList}>Bust: {this.state.personalInfo.chest}</li>}
                    {this.state.userType === 'W' && <li style={styleList}>Hips: {this.state.personalInfo.hip}</li>}
                    {this.state.userType === 'W' && <li style={styleList}>Dress Size: {this.state.personalInfo.dressSize}</li>}
                    {this.state.userType === 'K' && <li style={styleList}>DOB: {this.state.personalInfo.dob}</li>}
                    <li style={styleList}>Waist: {this.state.personalInfo.waist}</li>
                    <li style={styleList}>Eyes: {this.state.personalInfo.eyes}</li>
                    <li style={styleList}>Hair: {this.state.personalInfo.hair}</li>
                    <li style={styleList}>Shoes: {this.state.personalInfo.shoes}</li>
                </div>
                <div style={Object.assign({}, textStyle, addition)}>{this.state.otherInfo}</div>
            </div>
        );
    }

    onNextClick() {
        html2canvas(document.getElementById('previewCanvas')).then((canvas) => {
            // const pdf = new jsPDF();
            // pdf.addImage(imgData, 'JPEG', 0, 0, 500,700);
            // pdf.save("download.pdf");
            this.props.onNextClick(2, JSON.parse(JSON.stringify(this.state)), canvas.toDataURL('image/png'));
        });
    }
    onPrevClick() {
        this.props.onPrevClick(2);
    }

    formSubmit(event) {
        event.preventDefault();
        let pictureErrorCheck = this.state.croppedImage.some(item => item === 'image/add-image.png');
        if(!this.state.crop && !pictureErrorCheck) { // logic with stepOne and stepTwo is not persistant and has to be change
            this.setState({cropError: false, pictureError: false, nextEventEnable: true});
        } else if(this.state.crop) {
            this.setState({cropError: true});
        } else {
            this.setState({pictureError: true});
        }
    }

    womenFormFields() {
        return (
            <div>
                <FieldGroup
                    id="formControlsLast"
                    type="number"
                    label="Waist"
                    required
                    placeholder="Enter Waist"
                    onChange={(event) => this.setState({personalInfo: Object.assign(this.state.personalInfo, {waist: event.target.value})})}/>
                <FieldGroup
                    id="formControlsLast"
                    type="number"
                    label="Bust"
                    required
                    placeholder="Enter Chest"
                    onChange={(event) => this.setState({personalInfo: Object.assign(this.state.personalInfo, {chest: event.target.value})})}/>
                <FieldGroup
                    id="formControlsLast"
                    type="number"
                    label="Hips"
                    required
                    placeholder="Enter Hip"
                    onChange={(event) => this.setState({personalInfo: Object.assign(this.state.personalInfo, {hip: event.target.value})})}/>
                <FieldGroup
                    id="formControlsLast"
                    type="number"
                    label="Dress Size"
                    required
                    placeholder="Enter Dress Size"
                    onChange={(event) => this.setState({personalInfo: Object.assign(this.state.personalInfo, {dressSize: event.target.value})})}/>
            </div>
        );
    }

    menFormFields() {
        return (
            <div>
                <FieldGroup
                    id="formControlsLast"
                    type="number"
                    label="Shirt"
                    required
                    placeholder="Enter Shirt Measurement"
                    onChange={(event) => this.setState({personalInfo: Object.assign(this.state.personalInfo, {height: event.target.value})})}/>
                <FieldGroup
                    id="formControlsLast"
                    type="number"
                    label="Suit"
                    required
                    placeholder="Enter Suit Measurement"
                    onChange={(event) => this.setState({personalInfo: Object.assign(this.state.personalInfo, {height: event.target.value})})}/>
                <FieldGroup
                    id="formControlsLast"
                    type="number"
                    label="Waist"
                    required
                    placeholder="Enter Waist"
                    onChange={(event) => this.setState({personalInfo: Object.assign(this.state.personalInfo, {waist: event.target.value})})}/>
                <FieldGroup
                    id="formControlsLast"
                    type="number"
                    label="Inseam"
                    required
                    placeholder="Enter Inseam"
                    onChange={(event) => this.setState({personalInfo: Object.assign(this.state.personalInfo, {inseam: event.target.value})})}/>
            </div>
        );
    }

    render(){
        let style = {
            canvasStyle: {
                backgroundColor: this.state.selectedBGColor
            },
            canvasTextStyle: {
                fontFamily: 'arial',
                ...this.state.textStyle,
            },
            brandingStyle: {
                position: 'relative',
                float: 'right',
                margin: '20px'
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
                                <legend>Design</legend>
                                <SelectGroup
                                    id="formControlsSelectTemplate"
                                    label="Images Amount"
                                    onChange={this.amountImagesChange}
                                    data={mapAmountImages()}/>
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
                            </fieldset>
                            <fieldset>
                                <legend>Stats/Measurements</legend>
                                {!this.state.userType &&
                                    <RadioGroup
                                        id="formControlsRadio"
                                        label="User Type"
                                        onChange={(event) => this.setState({userType: event.target.value})}
                                        data={mapUserSelection()}/>
                                }
                                <FieldGroup
                                    id="formControlsLast"
                                    type="number"
                                    label="Height"
                                    required
                                    placeholder="Enter Height"
                                    onChange={(event) => this.setState({personalInfo: Object.assign(this.state.personalInfo, {height: event.target.value})})}/>
                                {this.state.userType === 'M' ?
                                    this.menFormFields()
                                    :
                                    this.state.userType === 'W' ?
                                        this.womenFormFields()
                                        :
                                        this.state.userType === 'K' ?
                                            <FieldGroup
                                            id="formControlsLast"
                                            type="date"
                                            label="DOB"
                                            required
                                            placeholder="Enter Date of Birth"
                                            onChange={(event) => this.setState({personalInfo: Object.assign(this.state.personalInfo, {dob: event.target.value})})}/> : ''
                                }
                                <FieldGroup
                                    id="formControlsLast"
                                    type="text"
                                    label="Eye Color"
                                    required
                                    placeholder="Enter Eye Color"
                                    onChange={(event) => this.setState({personalInfo: Object.assign(this.state.personalInfo, {eyes: event.target.value})})}/>
                                <FieldGroup
                                    id="formControlsLast"
                                    type="text"
                                    label="Hair Color"
                                    required
                                    placeholder="Enter Hair Color"
                                    onChange={(event) => this.setState({personalInfo: Object.assign(this.state.personalInfo, {hair: event.target.value})})}/>
                                <FieldGroup
                                    id="formControlsLast"
                                    type="text"
                                    label="Shoe Size"
                                    required
                                    placeholder="Enter Shoe size"
                                    onChange={(event) => this.setState({personalInfo: Object.assign(this.state.personalInfo, {shoes: event.target.value})})}/>
                            </fieldset>
                            <fieldset>
                                <legend>OTHER INFORMATION</legend>
                                <FieldGroup
                                    id="formControlsFirst"
                                    type="text"
                                    placeholder="Space for contact and additional Info"
                                    onChange={(event) => this.setState({otherInfo: event.target.value})}/>
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
                        {this.state.pictureError && <div className="col-md-offset-4">
                            <h5 style={{color: 'red'}}>*Please Upload Required Amount of Pictures</h5>
                        </div>}
                    </div>
                    <div className="col-md-6">
                        <fieldset>
                            <legend>Preview</legend>
                            <div className="canvas-size">
                                <input
                                    id="formControlsFile"
                                    type="file"
                                    ref="fileUploader"
                                    style={{display: 'none'}}
                                    required
                                    onChange={this.fileCoverChange}/>

                                {this.state.crop ?
                                    <ImageCropper
                                        image={this.state.fileCover[this.state.selectedIndex]}
                                        cropImage={this.cropImage}/>
                                    :
                                    <div id="previewCanvas" style={style.canvasStyle} className="canvas-style">
                                        <div>
                                            <ImageCanvas
                                                imageStore={this.state.croppedImage}
                                                onClickImage={this.onClickImage}
                                                containerStyle={this.state.amountImages.canvasContainer}
                                                imageStyleData={this.state.imageStyle}
                                                textDataRender={this.textDataRender(style.canvasTextStyle)}
                                            />
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
