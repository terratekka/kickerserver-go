import './App.css';
import {Route, Routes} from 'react-router-dom';
import Home from './components/Home';
import PlayerMain from './components/PlayerMain';
import { useReducer } from 'react';
import PlayerContext, { defaultPlayer, playerReducer } from './components/Player';
import PlayerMain2 from './components/PlayerMain2';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {
  const [player, setPlayer] = useReducer(playerReducer, defaultPlayer);

  return (
    <PlayerContext.Provider value={{player, setPlayer}}>
        <Routes>
          <Route path='/' Component={Home}/>
          <Route path='/main' Component={PlayerMain}/>
          <Route path='/main2' Component={PlayerMain2}/>
        </Routes>
    </PlayerContext.Provider>
  );
}