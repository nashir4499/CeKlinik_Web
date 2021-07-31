import { Card, CardContent, makeStyles, Typography } from '@material-ui/core';
import React from 'react'

const useStyles = makeStyles({
    root: {
        margin: 5,
        borderRadius: 20,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
    },
    content: {
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
    },
    icon: {
        borderRadius: 10,
        marginTop: 10,
        width: "8vh",
        height: "8vh",
        lineHeight: 2,
        alignSelf: "center",
        textAlign: "center",
        justifyContent: "center",
        fontSize: "2vw",
        color: "#ffff",
    },
    title: {
        fontSize: "1vw",
        textAlign: "center",
    },
    nomor: {
        width: "100%",
        textAlign: "center",
        fontWeight: "bold",
        color: "white",
    },
});

function CardLaporan(props) {
    const classes = useStyles();

    return (
        <Card className={classes.root} >
            <Typography className={classes.icon} variant="body2" component="p" style={{ backgroundColor: props.color }}>
                {props.icon}
            </Typography>
            <CardContent className={classes.content}>
                <Typography className={classes.title} gutterBottom>
                    {props.title}
                </Typography>
            </CardContent>
            <Typography className={classes.nomor} variant="h5" component="h2" style={{ backgroundColor: props.color }}>
                {props.nilai}
            </Typography>
        </Card>
    );
}

export default CardLaporan
