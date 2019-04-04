import React, { Component } from 'react';
import { Breadcrumb } from 'react-bootstrap';

class BreadCrumbs extends Component {
    render() {
        const { obj, handleClick } = this.props;
        let arrItems = obj.map((element, i) => {
            let elem = null;
            if (i === (obj.length-1)) {
                elem = (
                    <Breadcrumb.Item href="#" onClick={() => handleClick(element.id)} key={element.id} active>
                        {element.name}
                    </Breadcrumb.Item>
                );
            } else {
                elem = (
                    <Breadcrumb.Item href="#" onClick={() => handleClick(element.id)} key={element.id} >
                        {element.name}
                    </Breadcrumb.Item>
                );
            }
            return elem;
        });

        return (
            <Breadcrumb variant="secondary" > 
                {arrItems}
            </Breadcrumb>
        );
    }
}

export default BreadCrumbs;