import React from 'react';
import {Button, Card, CardActions, CardContent, Typography} from "@mui/material";

const Home = () => {
    return (
        <Card sx={{ minWidth: 275 }}>
            <CardContent>
                <Typography sx={{ fontSize: 14 ,display:{md:'inline',xs:'block'}}} color="text.secondary" gutterBottom>
                    Word of the Day
                </Typography>
                <Typography variant="h5" component="div" sx={{ fontSize: 14 ,display:{md:'inline',xs:'block'}}}>
                    conte
                </Typography>
                <Typography sx={{ mb: 1.5 , fontSize: 14 ,display:{md:'inline',xs:'block'}}} color="text.secondary">
                    adjective
                </Typography>
                <Typography variant="body2" sx={{ fontSize: 14 ,display:{md:'inline',xs:'block'}}}>
                    well meaning and kindly.
                    <br />
                    {'"a benevolent smile"'}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small">Learn More</Button>
            </CardActions>
        </Card>
    );
};

export default Home;