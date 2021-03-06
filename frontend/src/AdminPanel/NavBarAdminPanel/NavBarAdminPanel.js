import React, { Component } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

export class NavBarAdminPanel extends Component {
    render() {
        let { match } = this.props;
        return (

            <Navbar style={{
                backgroundColor: 'var(--primary)'
            }}>
                <Container>
                    <Nav>
                        <Nav.Item>
                            <NavLink className='p-3' exact to={`${match.url}/goods`}>Goods</NavLink>
                        </Nav.Item>
                        <Nav.Item>
                            <NavLink className='p-3' to={`${match.url}/users`}>Users</NavLink>
                        </Nav.Item>
                        <Nav.Item>
                            <NavLink className='p-3' to={`${match.url}/catalogue`}>Catalogue</NavLink>
                        </Nav.Item>
                        <Nav.Item>
                            <NavLink className='p-3' to={`${match.url}/images`}>Images</NavLink>
                        </Nav.Item>
                    </Nav>
                    <Button
                        onClick={() => {
                            window.localStorage.removeItem('Authorization');
                            window.location.href = `${match.url}`;
                        }}>
                        Logout
                    </Button>
                </Container>
            </Navbar>

        );
    }
}

NavBarAdminPanel.propTypes = {
    match: PropTypes.object
};

export default NavBarAdminPanel;