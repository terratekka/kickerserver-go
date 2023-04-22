import './App.css';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './Home';
import PlayerMain from './PlayerMain';
import { useReducer } from 'react';
import PlayerContext, { defaultPlayer, playerReducer } from './Player';
import PlayerMain2 from './PlayerMain2';

export default function App() {
  const [player, setPlayer] = useReducer(playerReducer, defaultPlayer);

  return (
    <PlayerContext.Provider value={{player, setPlayer}}>
      <Router>
        <Routes>
          <Route path='/' Component={Home}/>
          <Route path='/main' Component={PlayerMain}/>
          <Route path='/main2' Component={PlayerMain2}/>
        </Routes>
      </Router>
    </PlayerContext.Provider>
  );
}
