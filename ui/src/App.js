import React, { Component } from 'react';
import './App.css';
import Home from './Home';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import PlayerMain from './PlayerMain';

class App extends Component {
  render() {
    return (
        <Router>
          <Switch>
            <Route path='/' exact={true} component={Home}/>
            <Route path='/main' exact={true} component={PlayerMain}/>
          </Switch>
        </Router>
    )
  }
}

export default App;