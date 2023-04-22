import { AvailabilityResult } from './Availability';
import PlayerContext, { Player } from './Player';
import { useContext, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DateObject from 'react-date-object';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

export default function Plays() {
    const { player } = useContext(PlayerContext);
    const [results, setResults] = useState<AvailabilityResult[]>();
    const [numberOfPlayers, setNumberOfPlayers] = useState<string>("2");

    let resultKey = 0;

    useEffect(() => {
        //if (player?.id) {
        fetch('/api/results?number=' + numberOfPlayers)
            .then(response => response.json())
            .then(data => { setResults(data) });
        //}
    }, [numberOfPlayers])

    function Play({ result }: any) {
        return (
            <Card sx={{ minWidth: 300, minHeight: 200, margin: 1 }}>
                <CardContent>
                    <Typography variant="h5" component="div" color="text.secondary" gutterBottom>
                        {new DateObject(new Date(result.range.start)).format("HH:mm")} - {new DateObject(new Date(result.range.end)).format("HH:mm")}
                    </Typography>
                    {result.players.map((p: Player) => (
                        <Typography key={p.id} variant="body1" component="div" sx={{ fontWeight: p.id == player?.id ? 'bold' : 'normal' }}>
                            {p.name}
                        </Typography>
                    ))}
                </CardContent>
                <CardActions>
                    <Button size="small">Start</Button>
                </CardActions>
            </Card>
        );
    }

    const handleNumberOfPlayers = (
        event: React.MouseEvent<HTMLElement>,
        newNumberOfPlayers: string,
    ) => {
        event.preventDefault();
        if (newNumberOfPlayers) {
            setNumberOfPlayers(newNumberOfPlayers)
        }
    };

    return (
        <>
            <Box
                component="div"
                sx={{ mx: 1, verticalAlign: "center" }}>
                <Typography component="h3" color="text.secondary">
                    Number of players
                </Typography>
                <ToggleButtonGroup value={numberOfPlayers} exclusive onChange={handleNumberOfPlayers} size="large">
                    <ToggleButton value="2">
                        {" 2 "}
                    </ToggleButton>
                    <ToggleButton value="3">
                        {" 3 "}
                    </ToggleButton>
                    <ToggleButton value="4">
                        {" 4 "}
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>

            <Box
                component="div"
                sx={{ display: 'flex', flexWrap: 'wrap', mx: '2px' }}>
                {results?.map((result: AvailabilityResult) => (
                    <Play result={result} key={resultKey++} />
                ))}
            </Box>
        </>

    );

}
