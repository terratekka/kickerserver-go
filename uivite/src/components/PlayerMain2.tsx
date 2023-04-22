import { useContext, useEffect, useReducer, useState } from 'react';
import { Button,  Container, Form, FormControl, FormGroup, FormLabel } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AppNavbar from './AppNavbar';
import PlayerContext, { Player } from './Player';

type Availability = {
}

export default function PlayerMain2() {
    const navigate = useNavigate();
    const [availabilities, setAvailabilities] = useState<Availability>();

    const {player, setPlayer} = useContext(PlayerContext)

    useEffect(() => {
        console.log('PlayerMain2 playerId=', player?.id)
        if (player?.id) {
            fetch('/player/'+player.id)
                .then(response => response.json())
                .then(data => {console.log('useEffect=',data.player); setPlayer(data.player); setAvailabilities(data.availabilities)});
        }
    }, [])
    
    const setPlayerState = (p: Player)  => {
        if (p) {
            setPlayer(p)
        } else {
            setPlayer({id: 0})
        }
    }  

    const handleChange = (event: any) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        const p = {...player, [name]: value} as Player
        setPlayer(p)
    }

    const handleLogin = (event: any) => {
        event.preventDefault();
    
        fetch('/api/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(player),
        })
        .then(response => response.json())
        .then(data => {setPlayerState(data.player); setAvailabilities(data.availabilities)});
    }

    const handleSave = (event: any) => {
        event.preventDefault();
    
        fetch('/api/player', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(player),
        })
        .then(response => response.json())
        .then(data => {setPlayer(data.player); setAvailabilities(data.availabilities)});
    }

    const logout = (event: any) => {
        event.preventDefault();
        setPlayerState({} as Player)
    }
        
    const navigateOtherMain = (event: any) => {
        event.preventDefault();
        navigate('/main')
    }

    const render = () => {
        if (player?.id) {
            return (
                <div>
                    <AppNavbar/>

                    <Container>
                        <h3>Player 2 {player.name}</h3>
                        <Form onSubmit={handleSave}>
                            <FormGroup>
                                <FormLabel htmlFor="name">Name</FormLabel>
                                <FormControl type="text" placeholder="name" name="name" id="name" value={player.name || ''} onChange={handleChange} autoComplete="name"/>
                                <FormLabel htmlFor="email">Email</FormLabel>
                                <FormControl type="text" name="email" id="email" value={player.email || ''} onChange={handleChange} autoComplete="email"/>
                                <Button className="mt-2" variant="primary" type="submit">Save</Button>{' '}
                                <Button className="mt-2" variant="danger" onClick={logout}>Logout</Button>{' '}
                                <Button className="mt-2" variant="danger" onClick={navigateOtherMain}>Navigate othe Main</Button>{' '}
                            </FormGroup>
                        </Form>
                    </Container>
                </div>
            );
        } else {
            return (
                <div>
                    <AppNavbar/>

                    <Container>
                        <h3>Login</h3>
                        <Form onSubmit={handleLogin}>
                            <FormGroup>
                                <FormLabel htmlFor="name">Name</FormLabel>
                                <FormControl type="text" name="name" id="name" value={player?.name || ''}
                                       onChange={handleChange} autoComplete="name"/>
                                <Button className="mt-2" variant="primary" type="submit">Login</Button>{' '}
                            </FormGroup>
                        </Form>
                    </Container>
                </div>
            );
        }
    }

    return render()
}
