import React, { Component } from 'react';
import { Button,  ButtonGroup,  Container, Form, FormGroup, Input, Label, Table } from 'reactstrap';

class PlayerMain extends Component {

    emptyPlayer = {
        id: null,
        name: '',
        email: '',
    };

    constructor(props) {
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
                .then(data => this.setState({logon : true, player: data.player, availabilities: data.availabilities}));
        }
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        let player = {...this.state.player};
        let availabilities = {...this.state.availabilities};
        player[name] = value;
        this.setState({player: player, availabilities: availabilities});
    }

    async handleLogin(event) {
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
        const {player, availabilities, isLoading} = this.state;

        if (isLoading) {
            return <p>Loading...</p>;
        }

        if (player.id) {
            return (
                <div>
                    <Container>
                        <h3>Player {player.name}</h3>
                        <Form onSubmit={this.handleLogin}>
                            <FormGroup>
                                <Label for="name">Name</Label>
                                <Input type="text" name="name" id="name" value={player.name || ''}
                                       onChange={this.handleChange} autoComplete="name"/>
                                <Label for="email">Email</Label>
                                <Input type="text" name="email" id="email" value={player.email || ''}
                                       onChange={this.handleChange} autoComplete="email"/>
                                <Button className="mt-2" color="primary" type="submit">Save</Button>{' '}
                                <Button className="mt-2" color="danger" onClick={() => this.logout()}>Logout</Button>{' '}
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
                                <Label for="name">Name</Label>
                                <Input type="text" name="name" id="name" value={player.name || ''}
                                       onChange={this.handleChange} autoComplete="name"/>
                                <Button className="mt-2" color="primary" type="submit">Login</Button>{' '}
                            </FormGroup>
                        </Form>
                    </Container>
                </div>
            );
        }
    }
}
export default PlayerMain;