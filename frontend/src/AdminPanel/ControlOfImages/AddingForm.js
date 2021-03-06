import React, { Component } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import md5 from 'md5';

//Redux 
import { connect } from 'react-redux';
import {
    addingFormClose,
    addingFormSuccess,
    addingFormFailed
} from '../../REDUX/adminPanel/actions/actionsImagesControl';
import {
    addErrorToState,
} from '../../REDUX/actions/actionsErrors';


export class AddingFormOfImage extends Component {
    constructor(props) {
        super(props);
        this.nameRef = React.createRef();
        this.typeRef = React.createRef();
        this.imgRef = React.createRef();
        this.sendDataToServer = this.sendDataToServer.bind(this);
    }

    sendDataToServer() {
        const formData = new FormData();
        formData.append('name', this.nameRef.current.value);
        formData.append('type', this.typeRef.current.value);
        formData.append('img', this.imgRef.current.files[0]);
        if (fetch) {
            let myInit = {
                method: 'POST',
                body: formData,
                cache: 'default'
            };

            fetch(`${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/images/`, myInit)
                .then((res) => {
                    if (res.status === 201) {
                        res.json().then(data => {
                            this.props.openPage(1);
                            this.props.addingFormClose();
                            this.props.addingFormSuccess({
                                name: '',
                                type: '',
                                url: ''
                            });
                            const d = new Date();
                            this.props.addErrorToState({
                                id: md5(`${'Notification from AddingImage'}${d.valueOf()}`),
                                level: 'Success',
                                message: data.message
                            });
                        });
                    }
                    if (res.status === 401) {
                        res.text().then(data => {
                            this.props.addingFormFailed();
                            const d = new Date();
                            this.props.addErrorToState({
                                id: md5(`${'Notification from AddingImage'}${d.valueOf()}`),
                                level: 'Error',
                                message: data
                            });
                        });
                    }
                    if (res.status === 400) {
                        res.json().then(data => {
                            this.props.addingFormFailed();
                            console.error(data);
                        });
                    }
                });
        }
    }

    render() {
        return (
            <Modal
                show={this.props.show}
                onHide={this.props.onHide}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Adding Image to DB
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form id='adding-image'>
                        <Form.Group

                        >
                            <Form.Label
                                htmlFor='adding-image-name'
                            >
                                Name
                            </Form.Label>
                            <Form.Control
                                ref={this.nameRef}
                                id='adding-image-name'
                            />
                        </Form.Group>
                        <Form.Group

                        >
                            <Form.Label
                                htmlFor='adding-image-type'
                            >
                                Type
                            </Form.Label>
                            <Form.Control
                                ref={this.typeRef}
                                id='adding-image-type'
                            />
                        </Form.Group>
                        <Form.Group

                        >
                            <Form.Label
                                htmlFor='adding-image-file'
                            >
                                Name
                            </Form.Label>
                            <Form.Control
                                ref={this.imgRef}
                                type='file'
                                id='adding-image-file'
                            />
                        </Form.Group>

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant='primary'
                        onClick={this.sendDataToServer}
                    >
                        Add
                    </Button>
                    <Button
                        variant='light'
                        className='ml-3'
                        onClick={this.props.onHide}
                    >
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

AddingFormOfImage.propTypes= {
    addingFormClose: PropTypes.func,
    addingFormSuccess: PropTypes.func,
    addingFormFailed: PropTypes.func,
    addErrorToState: PropTypes.func,
    openPage: PropTypes.func
};

export default connect(null, {
    addingFormClose,
    addingFormSuccess,
    addingFormFailed,
    addErrorToState
})(AddingFormOfImage);
