import { useContext, useEffect, useReducer, useState } from 'react';
//import { Container, Form, FormControl, FormGroup, FormLabel } from 'react-bootstrap';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

import PlayerContext, { Player } from './Player';
import { Container, FormControl, FormGroup, FormLabel, Input, InputAdornment, InputLabel, TextField, Box, IconButton } from '@mui/material';
import { Form } from 'react-bootstrap';
import { AccountCircle } from '@mui/icons-material';
import { Availability } from './Availability';
import * as React from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import DateObject from "react-date-object";
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import AvailabilityDialog from './AvailabilityDialog';

export default function PlayerMain() {
    const navigate = useNavigate();
    const [availabilities, setAvailabilities] = useState<Availability[]>();
    const { player, setPlayer } = useContext(PlayerContext);
    const [isOpen, setIsOpen] = useState(false);
    const [currentAvailability, setCurrentAvailability] = useState<Availability>();

    useEffect(() => {
        console.log('PlayerMain playerId=', player?.id)
        if (player?.id) {
            fetch('/player/' + player.id)
                .then(response => response.json())
                .then(data => { console.log('useEffect=', data.player); setPlayer(data.player); setAvailabilities(data.availabilities) });
        }
    }, [])

    const setPlayerState = (p: Player) => {
        if (p) {
            setPlayer(p)
        } else {
            setPlayer({ id: 0 })
        }
    }

    const handleChange = (event: any) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        const p = { ...player, [name]: value } as Player
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
            .then(data => { setPlayerState(data.player); setAvailabilities(data.availabilities) });
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
            .then(data => { setPlayer(data.player); setAvailabilities(data.availabilities) });
    }

    const logout = (event: any) => {
        event.preventDefault();
        setPlayerState({} as Player)
    }

    const deleteAvailability = (id: number) => {
        fetch('/api/availability/' + id, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(player),
        })
            .then(response => response.json())
            .then(data => { setAvailabilities(data) });
    }

    const editAvailability = (id: number) => {
        const av = availabilities?.find(ava => ava.id === id);
        setCurrentAvailability(copy(av));
        setIsOpen(true);
    }

    const addAvailability = () => {
        const av = { playerId: player.id, range: {} } as Availability
        setCurrentAvailability(av);
        setIsOpen(true);
    }

    const handleCloseEditAvailability = (av: Availability) => {
        setIsOpen(false);
        console.log('handleCloseEditAvailability currentAvailability=', av)

        if (av?.playerId) {
            fetch('/api/availability', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(av),
            })
                .then(response => response.json())
                .then(data => { setAvailabilities(data) });
        }
    }

    function AvailabilitiesTable({ availabilities }: any) {
        return (
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell className='fw-bold'>Start</TableCell>
                            <TableCell className='fw-bold'>End</TableCell>
                            <TableCell className='fw-bold'></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {availabilities.map((av: Availability) => (
                            <TableRow
                                key={av.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell>{new DateObject(new Date(av.range.start)).format("HH:mm")}</TableCell>
                                <TableCell>{new DateObject(new Date(av.range.end)).format("HH:mm")}</TableCell>
                                <TableCell><IconButton onClick={() => editAvailability(av.id)}><EditIcon /></IconButton ><IconButton onClick={() => deleteAvailability(av.id)}><ClearIcon /></IconButton ></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }

    function copy(original: any) {
        return JSON.parse(JSON.stringify(original));
    }

    const render = () => {
        if (player?.id) {
            return (
                <div>
                    <Box sx={{ margin: '1rem' }}>
                        <Form onSubmit={handleSave} >
                            <FormGroup >
                                <TextField label="name" placeholder="name" name="name" id="name" value={player.name || ''} onChange={handleChange} autoComplete="name" className='mt-2'
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <AccountCircle />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <TextField label="email" placeholder="email" name="email" id="email" value={player.email || ''} onChange={handleChange} autoComplete="email" className='mt-2' />
                            </FormGroup>
                            <Button className="mt-2 me-2" variant="outlined" color="primary" type="submit">Save</Button>
                            <Button className="mt-2 me-2" variant="outlined" color="warning" onClick={logout}>Logout</Button>
                        </Form>
                    </Box>
                    <Box sx={{ margin: '1rem' }}>
                        <AvailabilitiesTable availabilities={availabilities} />
                        <Button className="mt-2 me-2" variant="outlined" color="primary" onClick={addAvailability}>Add</Button>
                    </Box>
                    <AvailabilityDialog
                        availability={currentAvailability}
                        isDialogOpened={isOpen}
                        handleCloseDialog={(av: Availability) => handleCloseEditAvailability(av)}
                    />
                </div>
            );
        } else {
            return (
                <div>
                    <Box sx={{ margin: '1rem' }}>
                        <Form onSubmit={handleLogin}>
                            <FormGroup>
                                <FormControl>
                                    <TextField placeholder="name" name="name" id="name" value={player.name || ''} onChange={handleChange} autoComplete="name" className='mt-2'
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <AccountCircle />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </FormControl>
                            </FormGroup>
                            <Button className="mt-2" variant="outlined" color="primary" type="submit">Login</Button>
                        </Form>
                    </Box>
                </div>
            );
        }
    }

    return render()
}
