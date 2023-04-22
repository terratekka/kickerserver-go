import { useContext, useEffect } from 'react';
import PlayerContext from './Player';
import { AppBar, Box, IconButton, Toolbar, Typography, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';

export default function AppNavbar() {
    const { player } = useContext(PlayerContext)
    const navigate = useNavigate();

    useEffect(() => {
        console.log('AppNavbar playerId=', player?.id)
    }, [])



    const navigateHome = (event: any) => {
        event.preventDefault();
        navigate('/')
    }
    const navigatePlays = (event: any) => {
        event.preventDefault();
        navigate('plays')
    }


    return (

        <AppBar position="sticky">
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                >
                    <MenuIcon />
                </IconButton>
                <Button
                    color="inherit"
                    onClick={navigateHome}
                >
                    Home
                </Button>
                <Button color="inherit" onClick={navigatePlays}>Plays</Button>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                </Typography>
                <Typography variant="h6" component="div" sx={{ flexGrow: 0 }}>
                    {player.id ? player.name : ""}
                </Typography>
            </Toolbar>
        </AppBar>

    );

}
