import { Card, makeStyles, Typography } from '@material-ui/core';
import React from 'react'

const useStyles = makeStyles({
    root: {
        // margin: 5,
        borderRadius: 20,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
    },
    content: {
        margin: 2.5,
        // height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        fontSize: "1vw",
        textAlign: "center",
    },
    icon: {
        // marginTop: 5,
        width: "100%",
        lineHeight: 2,
        alignSelf: "center",
        textAlign: "center",
        justifyContent: "center",
        fontSize: "2vw",
        color: "#ffff",
    },
    nomor: {
        width: "100%",
        textAlign: "center",
        fontWeight: "bold",
        color: "white",
    },
});

function CardLAdmin(props) {
    const classes = useStyles();

    return (
        <Card className={classes.root} >
            <Typography className={classes.icon} variant="body2" component="p" style={{ backgroundColor: props.color }}>
                {props.icon}
            </Typography>
            <Typography className={classes.content} gutterBottom>
                {props.title}
            </Typography>
            <Typography className={classes.nomor} variant="h5" component="h2" style={{ backgroundColor: props.color }}>
                {props.nilai}
            </Typography>
        </Card>
    );
}

export default CardLAdmin
