import React, { Component } from 'react';
import {
    Container,
    Row,
    Col,
    Button,
    Tooltip,
    Overlay,
    Alert
} from 'react-bootstrap';
import ShoppingBasketItem from './ShoppingBasketItem';
import PropsTypes from 'prop-types';
import './ShoppingBasket.css';
import md5 from 'md5';

//Redux use
import { connect } from 'react-redux';
//import store from '../REDUX/store';
import {
    showGoodsInBasketSuccess,
    deleteGoodsFromBasket
} from '../REDUX/actions/actionsShoppingBasket';
import {
    addErrorToState,
} from '../REDUX/actions/actionsErrors';
import {
    askLogin
} from '../REDUX/actions/actionsUser';


// For Requests to server
import rest from 'rest';
import pathPrefix from 'rest/interceptor/pathPrefix';
import errorCode from 'rest/interceptor/errorCode';
import mime from 'rest/interceptor/mime';

const client = rest.wrap(mime, { mime: 'application/json' })
    .wrap(errorCode, { code: 500 })
    .wrap(pathPrefix, { prefix: `${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}`});

export class ShoppingBasket extends Component {
    constructor(props) {
        super(props);
        this.getTargetTooltip = targetTooltip => { this.setState({ targetTooltip }); };
        this.arrItems = [];
        this.sumTotal = 0;
        this.sendBasketToWork = this.sendBasketToWork.bind(this);
        this.state = {
            successfulTransaction: false,
            targetTooltip: null,
            messageTooltip: '',
            show: false,
            askLogin: false
        };
    }

    requestGoodsItem(id) {
        let query = `?id=${id}`;
        return client({
            method: 'GET',
            path: 'goods' + query,
        }).then((data) => {
            return data.entity[0];
        });
    }

    sendBasketToWork() {
        let token = window.localStorage.getItem('Authorization');
        let self = this;
        if (this.props.goodsData.length === 0) {
            const d = new Date();
            this.props.addErrorToState({
                id: md5(`Notification from ShoppingBasket ${d.valueOf()}`),
                level: 'Warning',
                message: 'There is nothing in a basket.'
            });
        } else {
            client({
                method: "POST",
                path: '/basket/',
                entity: {
                    cont: JSON.stringify(this.props.goodsData)
                },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(data => {
                if (data.entity.id) {
                    window.localStorage.removeItem('ShoppingBasket');
                    self.setState({
                        successfulTransaction: true
                    });
                } else if (data.entity === 'Unauthorized') {
                    this.setState({
                        askLogin: true
                    });
                    this.props.askLogin();
                    const d = new Date();
                    this.props.addErrorToState({
                        id: md5(`Notification from ShoppingBasket ${d.valueOf()}`),
                        level: 'Warning',
                        message: 'You are not unauthorized.'
                    });
                }
            }).catch(err => {
                const d = new Date();
                this.props.addErrorToState({
                    id: md5(`Notification from ShoppingBasket ${d.valueOf()}`),
                    level: 'Error',
                    message: err
                });
            });
        }
    }

    componentDidMount() {
        let { goods } = this.props;
        let arr = [];
        goods.forEach(val => {
            arr.push(this.requestGoodsItem(val));
        });
        Promise.all(arr).then((data) => {
            this.props.showGoodsInBasketSuccess(data);
        });
    }

    render() {
        let target = this.state.targetTooltip;
        let show = this.state.show;
        let messageTooltip = this.state.messageTooltip;
        this.sumTotal = 0;
        let message = '';
        if (this.state.successfulTransaction) {
            message = (
                <Container className='mt-3'>
                    <Alert variant='success'>
                        Transaction is success.
                    </Alert>
                </Container>
            );
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        } else {
            message = (
                <Container  className='mt-3'>
                    <Row>
                        <h3>Your Basket:</h3>
                    </Row>
                    <Row>
                        {this.props.goodsData.length && this.props.goodsData.map((el) => {
                            if (el) {
                                this.sumTotal += el.price;
                            }
                            return (
                                <ShoppingBasketItem
                                    key={el.idgoods}
                                    obj={el}
                                    removeItemFromBasket={() => { this.props.deleteGoodsFromBasket(el.idgoods); }}
                                />
                            );
                        })}
                    </Row>
                    <Row>
                        <Col className='col-10'>
                            Total price:
                        </Col>
                        <Col className='shopping-basket__total-price'>
                            {`${this.sumTotal} $`}
                        </Col>
                    </Row>
                    <Row>
                        <Button
                            ref={this.getTargetTooltip}
                            variant='secondary'
                            onClick={() => this.sendBasketToWork()}
                        >
                            Buy
                        </Button>
                        <Overlay target={target} show={show} placement="right">
                            {props => (
                                <Tooltip id="overlay-example" {...props} show={show.toString()}>
                                    {messageTooltip}
                                </Tooltip>
                            )}
                        </Overlay>
                    </Row>
                </Container>
            );
        }

        return message;
    }
}

const mapStoreToProps = function (state) {
    return (
        {
            goods: state.shoppingBasketReducers.goodsInBasket,
            goodsData: state.shoppingBasketReducers.goodsInBasketData,
            userInfo: state.userHeaderReducers.userInfo
        }
    );
};

ShoppingBasket.propTypes = {
    goods: PropsTypes.object,
    goodsData: PropsTypes.array,
    showGoodsInBasketSuccess: PropsTypes.func,
    deleteGoodsFromBasket: PropsTypes.func,
    addErrorToState: PropsTypes.func,
    askLogin: PropsTypes.func
};

export default connect(mapStoreToProps, {
    showGoodsInBasketSuccess,
    deleteGoodsFromBasket,
    addErrorToState,
    askLogin
})(ShoppingBasket);