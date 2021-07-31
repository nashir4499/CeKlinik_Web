import React from 'react'
import { Avatar, Card, CardActions, CardContent, makeStyles, Typography } from '@material-ui/core'
import MDetailDokter from './MDetailDokter';
import MDeleteDokter from './MDeleteDokter';

const useStyles = makeStyles(theme => ({
    root: {
        // maxWidth: 275,
        width: 200,
        height: 230,
        borderRadius: 10,
        boxShadow: "0px 4px 5px 3px rgba(0,0,0,0.2)",
        // margin: 10,
        margin: theme.spacing(2.5),
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    content: {
        flex: 0.9,
        height: "50%",
        textAlign: 'center',
        display: 'grid',
        placeItems: 'center',
    },
    textNama: {
        whiteSpace: "nowrap",
        width: "100%",
        overflow: "hidden",
        textOverflow: "ellipsis",
    },
    textSp: {
        whiteSpace: "nowrap",
        width: "100%",
        overflow: "hidden",
        textOverflow: "ellipsis",
        backgroundColor: "rgba(50,100,255,0.6)",
        borderRadius: "30px",
        fontWeight: "bold",
    },
    large: {
        width: theme.spacing(10),
        height: theme.spacing(10),
        marginBottom: theme.spacing(1),
    },
    actions: {
        backgroundColor: 'rgba(173, 216, 230,0.3)',
        flex: 0.1,
        height: "15%",
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'stretch',
    }
}));

function CardDokter(props) {
    const classes = useStyles();

    return (
        <Card className={classes.root}>
            <CardContent className={classes.content}>
                <Avatar alt={props.nama} src={props.foto} className={classes.large} />
                <h4 className={classes.textNama}>
                    {props.nama}
                </h4>
                <Typography className={classes.textNama} variant="caption" component="p">
                    Sepesialis :
                </Typography>
                <Typography className={classes.textSp} variant="caption" component="p">
                    {props.kdSp}
                </Typography>
            </CardContent>
            <CardActions className={classes.actions} >
                {/* <Button size="small" style={{ flexGrow: 1 }} >Learn More</Button> */}
                <MDetailDokter id={props.id} />
                <MDeleteDokter id={props.id} nama={props.nama} kdSp={props.kdSp} foto={props.foto} />
            </CardActions>
        </Card>
    )
}

export default CardDokter
