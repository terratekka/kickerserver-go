import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './Home';
import PlayerMain from './PlayerMain';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' Component={Home}/>
        <Route path='/main' Component={PlayerMain}/>
      </Routes>
    </Router>
  );
}

export default App;
