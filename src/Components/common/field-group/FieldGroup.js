import React from 'react';
import {FormGroup, FormControl, ControlLabel, HelpBlock, Col} from 'react-bootstrap';

export const FieldGroup = ({id, label, help, labelSize, ...props}) => (
    <FormGroup controlId={id}>
        <Col componentClass={ControlLabel} md={2}>
            {label || ''}
        </Col>
        <Col sm={10}>
            <FormControl {...props} />
        </Col>
        {help && <HelpBlock>{help}</HelpBlock>}
    </FormGroup>
);

export const SelectGroup = ({id, label, data, ...props}) => (
    <FormGroup controlId={id}>
        <Col componentClass={ControlLabel} md={2}>
            {label}
        </Col>
        <Col sm={10}>
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
        <Col componentClass={ControlLabel} md={2}>
            {label}
        </Col>
        <Col md={8}>
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
