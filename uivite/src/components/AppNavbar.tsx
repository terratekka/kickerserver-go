import {Nav, Navbar} from 'react-bootstrap';
import { useContext, useEffect } from 'react';
import PlayerContext from './Player';

export default function AppNavbar()  {
    const {player} = useContext(PlayerContext)

    useEffect(() => {
        console.log('AppNavbar playerId=', player?.id)
    }, [])

    return (
        <Navbar color="dark" className="navbar-dark bg-dark" expand="md">
            <Nav>
                <Nav.Link className ="navbar-brand" href="/">Home</Nav.Link>
            </Nav>    
        </Navbar>
    );

}
