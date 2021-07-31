import { Card, CardContent, makeStyles, Typography } from '@material-ui/core';
import React from 'react'

const useStyles = makeStyles({
    root: {
        // minWidth: 200,
        width: '100%',
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    nama: {
        marginBottom: 10,
        whiteSpace: "nowrap",
        width: "100%",
        overflow: "hidden",
        textOverflow: "ellipsis",
    },
    alamat: {
        whiteSpace: "nowrap",
        width: "100%",
        overflow: "hidden",
        textOverflow: "ellipsis",
    },
    peringatan: {
        color: "white",
        borderRadius: 5
    }
});

function NomorAntrian(props) {
    const classes = useStyles();

    return (
        <Card className={classes.root}>
            <CardContent>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                    Pasien Nomor
                </Typography>
                <Typography variant="h5" component="h2">
                    <b>{props.noAntrian}{props.statusDarurat && " D"}</b>
                </Typography>
                <Typography className={classes.nama} color="textSecondary">
                    {props.pasien && props.pasien.nama}
                </Typography>
                <Typography className={classes.alamat} variant="body2" component="p">
                    {props.pasien && props.pasien.alamat}
                </Typography>
                <Typography className={classes.peringatan}
                    style={props.pasien && props.pasien.status === "Menunggu" ? { backgroundColor: 'rgba(0, 200, 0, 1)' } : { backgroundColor: 'rgba(200, 0, 0, 1)' }}
                    variant="body2" component="p">
                    {props.pasien && props.pasien.status}
                </Typography>
            </CardContent>
            {/* <CardActions>
                <Button size="small">Learn More</Button>
            </CardActions> */}
        </Card>
    );
}

export default NomorAntrian
