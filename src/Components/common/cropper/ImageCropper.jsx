import React, {Component} from 'react';
import AvatarEditor from 'react-avatar-editor';
import 'rc-slider/assets/index.css';
import Slider from 'rc-slider';
import {Button} from "react-bootstrap";

export default class ImageCropper extends Component {
    constructor(props) {
        super(props);
        this.state={
            radius: 0,
            scale: 0,
            rotate: 0

        }

    }

    componentWillMount() {
        this.setState({
            scale: 12
        });
    }

    cropImage() {
        if(this.editor) {
            const canvas = this.editor.getImage();

            this.props.cropImage(canvas.toDataURL('image/jpeg', 0.5), this.editor.getCroppingRect());
        }
    }

    setEditorRef = (editor) => this.editor = editor;

    render() {
        const {image} = this.props;

        return (
            <div>
                <div style={{width: '500px', height: '700px'}} className="row">
                    <AvatarEditor
                        ref={this.setEditorRef}
                        image={image}
                        width={350}
                        height={580}
                        border={60}
                        borderRadius={this.state.radius}
                        color={[255, 255, 255, 0.6]} // RGBA
                        scale={this.state.scale / 10}
                    />
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <h5>Radius</h5>
                        <Slider
                            value={this.state.radius}
                            onChange={(value) => {this.setState({radius: value * 2}); console.log(value)}}/>
                    </div>
                    <div className="col-md-6">
                        <h5>Scale</h5>
                        <Slider
                            value={this.state.scale}
                            onChange={(value) => {this.setState({scale: value < 12 ? 12: value}); console.log(value)}}/>
                    </div>
                </div>
                <br/>
                <Button onClick={() => this.cropImage()} className="btn-primary">Crop</Button>
            </div>
        );
    }
}
