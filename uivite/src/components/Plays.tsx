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

export default function Plays() {
    const { player, setPlayer } = useContext(PlayerContext);
    const [results, setResults] = useState<AvailabilityResult[]>();
    let resultKey = 0;

    useEffect(() => {
        //if (player?.id) {
        fetch('/api/results?number=2')
            .then(response => response.json())
            .then(data => { setResults(data) });
        //}
    }, [])

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

    return (
        <Box
            component="span"
            sx={{ display: 'flex', flexWrap: 'wrap', mx: '2px' }}>
            {results?.map((result: AvailabilityResult) => (
                <Play result={result} key={resultKey++} />
            ))}
        </Box>


    );

}
