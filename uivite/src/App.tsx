import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import PlayerMain from './components/PlayerMain';
import { useReducer } from 'react';
import PlayerContext, { defaultPlayer, playerReducer } from './components/Player';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@mui/material'
import AppNavbar from './components/AppNavbar';

export default function App() {
  const [player, setPlayer] = useReducer(playerReducer, defaultPlayer);

  return (
    <PlayerContext.Provider value={{ player, setPlayer }}>
      <AppNavbar />

      <Routes>
        <Route path='/' Component={Home} />
        <Route path='/main' Component={PlayerMain} />
      </Routes>
    </PlayerContext.Provider>
  );
}