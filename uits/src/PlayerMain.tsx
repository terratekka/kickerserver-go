import React, { Component } from 'react';
import { Button,  Container, Form, FormControl, FormGroup, FormLabel } from 'react-bootstrap';

type Player = {
    id: number,
    name: string,
    email: string
}

type Availability = {
}

type PlayerMainState = {
    player: Player,
    availabilities: Array<Availability>
}

class PlayerMain extends Component<{}, PlayerMainState> {

    emptyPlayer = {
        id: 0,
        name: '',
        email: '',
    };

    constructor(props: any) {
        super(props);
        this.state = {player: this.emptyPlayer, availabilities: []};
        this.handleChange = this.handleChange.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.logout = this.logout.bind(this);
    }

    componentDidMount() {
        if (this.state.player.id) {
            fetch('/player/'+this.state.player.id)
                .then(response => response.json())
                .then(data => this.setState({player: data.player, availabilities: data.availabilities}));
        }
    }

    handleChange(event: any) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        let player = {...this.state.player};
        let availabilities = {...this.state.availabilities};
        player = {
            ...player,
            [name]: value
        }
        this.setState({player: player, availabilities: availabilities});
    }

    async handleLogin(event: any) {
        event.preventDefault();
        let player = {...this.state.player};
    
        await fetch('/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(player),
        })
        .then(response => response.json())
        .then(data => this.setState({player: data.player, availabilities: data.availabilities}));
    }

    logout() {
        this.setState({player: this.emptyPlayer, availabilities: []})
    }
    
    render() {
        const {player} = this.state;

        if (player.id) {
            return (
                <div>
                    <Container>
                        <h3>Player {player.name}</h3>
                        <Form onSubmit={this.handleLogin}>
                            <FormGroup>
                                <FormLabel htmlFor="name">Name</FormLabel>
                                <FormControl size="lg" type="text" placeholder="name" name="name" id="name" value={player.name || ''} onChange={this.handleChange} autoComplete="name"/>
                                <FormLabel htmlFor="email">Email</FormLabel>
                                <FormControl type="text" name="email" id="email" value={player.email || ''} onChange={this.handleChange} autoComplete="email"/>
                                <Button className="mt-2" variant="primary" type="submit">Save</Button>{' '}
                                <Button className="mt-2" variant="danger" onClick={() => this.logout()}>Logout</Button>{' '}
                            </FormGroup>
                        </Form>
                    </Container>
                </div>
            );
        } else {
            return (
                <div>
                    <Container>
                        <h3>Login</h3>
                        <Form onSubmit={this.handleLogin}>
                            <FormGroup>
                                <FormLabel htmlFor="name">Name</FormLabel>
                                <FormControl type="text" name="name" id="name" value={player.name || ''}
                                       onChange={this.handleChange} autoComplete="name"/>
                                <Button className="mt-2" variant="primary" type="submit">Login</Button>{' '}
                            </FormGroup>
                        </Form>
                    </Container>
                </div>
            );
        }
    }
}
export default PlayerMain;