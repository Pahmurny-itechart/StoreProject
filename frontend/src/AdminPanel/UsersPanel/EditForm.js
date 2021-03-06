import React, { Component } from 'react';
import { Modal, Button, Form, Overlay, Tooltip } from 'react-bootstrap';
import md5 from 'md5';
import PropTypes from 'prop-types';

//Redux
import { connect } from 'react-redux';
import {
    addErrorToState,
} from '../../REDUX/actions/actionsErrors';

export class EditForm extends Component {
    constructor(props) {
        super(props);
        this.attachRef = target => this.setState((state) => ({
            tooltip: {
                ...state.tooltip,
                target
            }
        }));
        this.nameRef = React.createRef();
        this.emailRef = React.createRef();
        this.passwordRef = React.createRef();
        this.roleRef = React.createRef();
        this.sendUserToEdit = this.sendUserToEdit.bind(this);
        this.state = {
            username: this.props.userToEdit.username,
            password: this.props.userToEdit.password,
            email: this.props.userToEdit.email,
            role: this.props.userToEdit.role,
            tooltip: {
                target: null,
                message: '',
                show: false
            },
            passwordValid: {
                valid: false,
                noValid: false
            },
            emailValid: {
                valid: false,
                noValid: false
            }
        };
    }

    preValid() {
        let answ = true;
        let regEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/i;
        if (regEmail.test(this.state.email)) {
            this.setState({
                emailValid: {
                    valid: true,
                    noValid: false
                }
            });
        } else {
            answ = false;
            this.setState({
                emailValid: {
                    valid: false,
                    noValid: true
                }
            });
        }
        return answ;
    }


    sendUserToEdit() {
        const storage = window.localStorage;
        if (this.preValid()) {
            if (fetch) {
                let myHeaders = new Headers();
                myHeaders.append('Authorization', `Bearer ${storage.getItem('Authorization')}`);
                myHeaders.append("Content-type", 'application/json');
                let body = {
                    username: this.state.username,
                    password: this.state.password,
                    email: this.state.email,
                    role: this.state.role
                };

                let myInit = {
                    method: 'PUT',
                    headers: myHeaders,
                    body: JSON.stringify(body)
                };
                fetch(
                    `${
                        process.env.REACT_APP_API_HOST
                    }:${
                        process.env.REACT_APP_API_PORT
                    }/users/${
                        this.props.userToEdit.id
                    }`,
                    myInit)
                    .then(res => {
                        return res.text();
                    })
                    .then(data => {
                        if (data) {
                            this.setState({
                                username: '',
                                password: '',
                                email: '',
                                role: ''
                            });
                            this.props.onHide();
                            const d = new Date();
                            this.props.openPage(1);
                            this.props.addErrorToState({
                                id: md5(`${'Notification from AddingUser'}${d.valueOf()}`),
                                level: 'Success',
                                message: 'User is updated'
                            });
                        }
                    })
                    .catch((e) => {
                        this.setState((state) => ({
                            tooltip: {
                                ...state.tooltip,
                                message: e,
                                show: true
                            }
                        }));
                    });
            }
        }
    }

    render() {
        let { target, show, message } = this.state.tooltip;
        return (
            <Modal
                show={
                    true
                }
                onHide={
                    this.props.onHide
                }
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Adding User</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>
                                UserName
                            </Form.Label>
                            <Form.Control
                                ref={this.nameRef}
                                type='text'
                                defaultValue={this.props.userToEdit.username}
                                onChange={() => {
                                    this.setState({
                                        username: this.nameRef.current.value
                                    });
                                }}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>
                                Email
                            </Form.Label>
                            <Form.Control
                                ref={this.emailRef}
                                type='text'
                                defaultValue={this.props.userToEdit.email}
                                isValid={this.state.emailValid.valid}
                                isInvalid={this.state.emailValid.noValid}
                                onChange={() => {
                                    this.setState({
                                        email: this.emailRef.current.value
                                    });
                                }}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>
                                Password
                            </Form.Label>
                            <Form.Control
                                ref={this.passwordRef}
                                type='text'
                                defaultValue={this.props.userToEdit.password}
                                onChange={() => {
                                    this.setState({
                                        password: this.passwordRef.current.value
                                    });
                                }}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>
                                Role
                            </Form.Label>
                            <Form.Control
                                as='select'
                                defaultValue={this.props.userToEdit.role}
                                ref={this.roleRef}
                                onChange={() => {
                                    this.setState({
                                        role: this.roleRef.current.value
                                    });
                                }}
                            >
                                <option value='SuperAdmin'>SuperAdmin</option>
                                <option value='Admin'>Admin</option>
                                <option value='User'>User</option>
                                <option value='Customer'>Customer</option>
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="light" onClick={() => {
                        this.setState({
                            username: this.props.userToEdit.username,
                            password: this.props.userToEdit.password,
                            email: this.props.userToEdit.email,
                            role: this.props.userToEdit.role
                        });

                    }}
                    >
                        Default
                    </Button>
                    <Button variant="primary"
                        onClick={() => {
                            this.sendUserToEdit();
                        }}
                        ref={this.attachRef}
                    >
                        Save changes
                    </Button>
                    <Overlay target={target} show={show} placement="right">
                        {props => (
                            <Tooltip id="overlay-example" {...props} show={show.toString()}>
                                {message}
                            </Tooltip>
                        )}
                    </Overlay>
                </Modal.Footer>
            </Modal>
        );
    }
}

EditForm.propTypes = {
    userToEdit: PropTypes.object,
    onHide: PropTypes.func,
    addErrorToState: PropTypes.func,
    openPage: PropTypes.func
};

const mapStateToProps = (state) => {
    return {
        userToEdit: state.adminPanel_usersPanel.userToEdit
    };
};

export default connect(mapStateToProps, {
    addErrorToState
})(EditForm);