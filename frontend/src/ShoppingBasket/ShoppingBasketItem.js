import React, { Component } from 'react';
import { Button, Card } from 'react-bootstrap';
import PropTypes from 'prop-types';


class ShoppingBasketItem extends Component {
    render() {
        let { obj, removeItemFromBasket } = this.props;
        return (
            <Card className='mb-3 w-100'>
                <Card.Header className='d-flex '>
                    <div>
                        <Card.Title>
                            {obj.name}
                        </Card.Title>
                        <Card.Text>
                            {`${obj.price} $`}
                        </Card.Text>
                    </div>
                    <Button
                        variant='light ml-auto'
                        onClick={() => {
                            removeItemFromBasket(obj.idgoods);

                        }}>
                        <i className="fas fa-trash-alt"></i>
                    </Button>
                </Card.Header>
                <Card.Body className=''>
                    <Card.Text >
                        {obj.description}
                    </Card.Text>

                </Card.Body>
            </Card>
        );
    }
}

ShoppingBasketItem.propTypes = {
    obj: PropTypes.object,
    removeItemFromBasket: PropTypes.func
};

export default ShoppingBasketItem;