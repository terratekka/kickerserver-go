import './App.css';
import { Route, Routes } from 'react-router-dom';
import PlayerMain from './components/PlayerMain';
import { useReducer } from 'react';
import PlayerContext, { defaultPlayer, playerReducer } from './components/Player';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@mui/material'
import AppNavbar from './components/AppNavbar';
import Plays from './components/Plays';

export default function App() {
  const [player, setPlayer] = useReducer(playerReducer, defaultPlayer);

  return (
    <PlayerContext.Provider value={{ player, setPlayer }}>
      <AppNavbar />

      <Routes>
        <Route path='/' Component={PlayerMain} />
        <Route path='/plays' Component={Plays} />
      </Routes>
    </PlayerContext.Provider>
  );
}