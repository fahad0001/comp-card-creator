import React from 'react';
import {FormGroup, FormControl, ControlLabel, HelpBlock, Col} from 'react-bootstrap';
import Switch from 'react-bootstrap-switch';
import './FieldGroup.css';
import 'react-bootstrap-switch/dist/css/bootstrap3/react-bootstrap-switch.css';

export const FieldGroup = ({id, label, help, labelSize, componentSize, noLabel, ...props}) => (
    <FormGroup controlId={id}>
        {!noLabel && <Col componentClass={ControlLabel} md={labelSize || 4}>
            {label || ''}
        </Col>}
        <Col md={componentSize || 8}>
            <FormControl {...props} />
        </Col>
        {help && <HelpBlock>{help}</HelpBlock>}
    </FormGroup>
);

export const SelectGroup = ({id, label, data, labelSize, componentSize, noLabel, ...props}) => (
    <FormGroup controlId={id}>
        {!noLabel && <Col componentClass={ControlLabel} md={labelSize || 4}>
            {label}
        </Col>}
        <Col md={componentSize || 8}>
            <FormControl {...props} componentClass="select">
                {
                    data.map((val, index) => {
                      return (
                          <option key={index} value={val.key}>{val.value}</option>
                      )
                    })
                }
            </FormControl>
        </Col>
    </FormGroup>
);

export const ColorGroup = ({id, label, ...props}) => (
    <FormGroup controlId={id}>
        <Col componentClass={ControlLabel} md={4}>
            {label}
        </Col>
        <Col md={6}>
            <FormControl
                type={"text"}
                {...props}/>
        </Col>
        <Col md={2}>
            <FormControl
                type={"color"}
                {...props} />
        </Col>
    </FormGroup>
);

export const SwitchToggle = ({label, ...props}) => (
    <FormGroup>
        <Col componentClass={ControlLabel} md={4}>
            {label || ''}
        </Col>
        <Col md={8}>
            <Switch {...props} />
        </Col>
    </FormGroup>
);
