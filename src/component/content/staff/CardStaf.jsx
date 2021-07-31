import { Avatar, Card, CardActions, CircularProgress, CardContent, makeStyles, Typography } from '@material-ui/core'
import React, { useEffect } from 'react'
import { db } from '../../../config/firebase';
import { useSelector } from 'react-redux';
import { selectOrgaId } from '../../../features/orgaKlinik/orgaKlinikSilce';
import { useState } from 'react';
import ModalDetail from './ModalDetail';
import ModalDelete from './ModalDelete';

const useStyles = makeStyles(theme => ({
    root: {
        // maxWidth: 275,
        width: 200,
        height: 210,
        borderRadius: 10,
        // height:230,
        // margin: 10,
        margin: theme.spacing(1),
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    root2: {
        // maxWidth: 275,
        width: 200,
        height: 190,
        borderRadius: 10,
        // height:230,
        // margin: 10,
        margin: theme.spacing(1),
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
    // bullet: {
    //     display: 'inline-block',
    //     margin: '0 2px',
    //     transform: 'scale(0.8)',
    // },
    // title: {
    //     fontSize: 14,
    // },
    // pos: {
    //     marginBottom: 12,
    // },
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

function CardStaf(props) {
    const classes = useStyles();
    const orgaKlinik = useSelector(selectOrgaId)
    const [dokter, setDokter] = useState({
        loading: true,
        status: "",
        id: "",
        nama: ""
    })

    useEffect(() => {
        db.collection("orga_kliniks").doc(orgaKlinik)
            .collection("dokter_staf").doc(props.id).get()
            .then((doc) => {
                if (doc.exists) {
                    // console.log(doc.id, doc.data())
                    let getData = doc.data()
                    getData.dokter.get().then(res => {
                        // console.log(res.id, res)
                        if (res.exists) {
                            setDokter({
                                status: "Dokter:",
                                id: res.id,
                                nama: res.data().nama,
                            })
                        }
                    })

                } else {
                    setDokter({
                        status: "",
                        id: "",
                        nama: ""
                    })
                }
            })
    }, [orgaKlinik, props.id])

    return (
        <Card className={props.bagian === "Admin" ? classes.root2 : classes.root}>
            <CardContent className={classes.content}>
                <Avatar alt={props.nama} src={props.foto} className={classes.large} />
                <h4 className={classes.textNama}>
                    {props.nama}
                </h4>
                {props.bagian === "Pendaftaran" &&
                    (dokter.loading ?
                        <CircularProgress size={14} />
                        :
                        <>
                            <Typography className={classes.textNama} variant="caption" component="p">
                                {dokter.status}
                            </Typography>
                            <Typography className={classes.textNama} variant="caption" component="p">
                                {dokter.nama}
                            </Typography>
                        </>)
                }
            </CardContent>
            <CardActions className={classes.actions} >
                {/* <Button size="small" style={{ flexGrow: 1 }} >Learn More</Button> */}
                <ModalDetail id={props.id} dokterId={dokter.id} dokterNama={dokter.nama} />
                <ModalDelete id={props.id} nama={props.nama} foto={props.foto} email={props.email} />
            </CardActions>
        </Card>
    )
}

export default CardStaf
