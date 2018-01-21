import React, {Component} from 'react';
import {mapAmountImages} from "./step-two.utils";
import {FieldGroup, SelectGroup, ColorGroup} from "../../common/field-group/FieldGroup";
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
            personalInfo: {
                sex: 'Male',
                height: 0,
                chest: 0,
                waist: 0,
                hip: 0,
                eyes: '',
                hair: '',
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
        return (
            <ul style={textStyle}>
                <li>Height: {this.state.personalInfo.height}</li>
                <li>Chest: {this.state.personalInfo.chest}</li>
                <li>Waist: {this.state.personalInfo.waist}</li>
                <li>Hip: {this.state.personalInfo.hip}</li>
                <li>Eyes: {this.state.personalInfo.eyes}</li>
                <li>Hair: {this.state.personalInfo.hair}</li>
                <li>Shoes: {this.state.personalInfo.shoes}</li>
            </ul>
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
                                <legend>Your Data</legend>
                                <SelectGroup
                                    id="formControlsSelectTemplate"
                                    label="Sex"
                                    onChange={(event) => this.setState({personalInfo: Object.assign(this.state.personalInfo, {sex: event.target.value})})}
                                    data={[{
                                        key: 'Male',
                                        value: 'Male'
                                    },{
                                        key: 'Female',
                                        value: 'Female'
                                    }]}/>
                                <FieldGroup
                                    id="formControlsLast"
                                    type="number"
                                    label="Height"
                                    required
                                    placeholder="Enter Height"
                                    onChange={(event) => this.setState({personalInfo: Object.assign(this.state.personalInfo, {height: event.target.value})})}/>
                                <FieldGroup
                                    id="formControlsLast"
                                    type="number"
                                    label="Chest"
                                    required
                                    placeholder="Enter Chest"
                                    onChange={(event) => this.setState({personalInfo: Object.assign(this.state.personalInfo, {chest: event.target.value})})}/>
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
                                    label="Hip"
                                    required
                                    placeholder="Enter Hip"
                                    onChange={(event) => this.setState({personalInfo: Object.assign(this.state.personalInfo, {hip: event.target.value})})}/>
                                <FieldGroup
                                    id="formControlsLast"
                                    type="text"
                                    label="Eyes"
                                    required
                                    placeholder="Enter Eye Color"
                                    onChange={(event) => this.setState({personalInfo: Object.assign(this.state.personalInfo, {eyes: event.target.value})})}/>
                                <FieldGroup
                                    id="formControlsLast"
                                    type="text"
                                    label="Hair"
                                    required
                                    placeholder="Enter Hair Color"
                                    onChange={(event) => this.setState({personalInfo: Object.assign(this.state.personalInfo, {hair: event.target.value})})}/>
                                <FieldGroup
                                    id="formControlsLast"
                                    type="text"
                                    label="Shoes"
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
                                    required
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
