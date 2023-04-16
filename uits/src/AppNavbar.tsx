import React from 'react';
import {Nav, Navbar} from 'react-bootstrap';
import {RouteProps} from 'react-router';

type AppNavbarState = {
    isOpen: boolean
}

class AppNavbar extends React.Component<{}, AppNavbarState>  {
    constructor(props: any) {
        super(props);
        this.state = {isOpen: false};
        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    render() {
        return (
            <Navbar color="dark" className="navbar-dark bg-dark" expand="md">
                <Nav>
                    <Nav.Link className ="navbar-brand" href="/">Home</Nav.Link>
                </Nav>    
            </Navbar>
        );
    }
}

export default AppNavbar;