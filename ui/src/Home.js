import React, { Component } from 'react';
import './App.css';
import AppNavbar from './AppNavbar';
import PlayerMain from './PlayerMain';

class Home extends Component {
    render() {
        return (
            <div>
                <AppNavbar/>
                <PlayerMain/>
            </div>
        );
    }
}
export default Home;