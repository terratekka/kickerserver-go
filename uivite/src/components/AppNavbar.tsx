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


    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
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
                        sx={{ mr: 2 }}
                        onClick={navigateHome}
                    >
                        Home
                    </Button>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, alignItems: 'center' }}>
                        {player.name}
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
        </Box>
    );

}
