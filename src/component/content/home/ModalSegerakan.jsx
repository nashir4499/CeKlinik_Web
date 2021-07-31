import React, { useState } from 'react'
import { Button, makeStyles, Modal, Typography } from '@material-ui/core';
import { Check, Close } from '@material-ui/icons';
import { useSelector } from 'react-redux';
import { selectKlinik } from '../../../features/orgaKlinik/orgaKlinikSilce';
import { dbRef } from '../../../config/firebase';
import { selectUser } from '../../../features/user/userSlice';

function getModalStyle() {
    const top = 50
    const left = 50

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    dokter: {
        display: 'flex',
        flexDirection: "column",
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        boxShadow: "0px 0px 2px 1px rgba(0,0,0,0.5)",
        margin: theme.spacing(2),
        padding: theme.spacing(2),
    },
    tombol: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-evenly',
    },
    button: {
        margin: theme.spacing(1),
    },
}));

function ModalSegerakan(props) {
    const classes = useStyles();
    const klinik = useSelector(selectKlinik)
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);
    const user = useSelector(selectUser)
    const [fbAntrian, setFbAntrian] = useState()

    const handleOpen = () => {
        setFbAntrian(dbRef.ref('antrian').child(klinik.id).child(user.userId))
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const masukkanPasien = () => {
        fbAntrian.child('statusDarurat').set(props.id).catch(err => alert(err))
        fbAntrian.child('pasien').child(props.id)
            .update({
                statusBaru: "Selesai"
            }).catch(err => alert(err))
        fbAntrian.child('pasienTerlewat').child(props.id).remove()
        setOpen(false);
    }

    const segerakanPasien = () => {
        // console.log(props.id)
        // db.collection("laporans").doc(klinik.id).collection(props.status).doc(props.data.id).delete().catch(err => alert(err))
        fbAntrian.child('statusDarurat').set(props.id).catch(err => alert(err))
        fbAntrian.child('pasien').child(props.id)
            .update({
                statusBaru: "Selesai"
            }).catch(err => alert(err))
        // dbRef.ref('antrian').child(klinik.id).child(user.userId).child('statusDarurat').update({
        //     statusDarurat: props.id
        // }).catch(err => alert(err))
        setOpen(false);
    }

    return (
        <div>
            <Button
                className="colSegera"
                onClick={handleOpen}
                style={props.status === "Segerakan" ? { backgroundColor: "rgb(200, 0, 0)" } : { backgroundColor: "rgb(250, 150, 0)" }}
            >
                {props.status}
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <div style={modalStyle} className={classes.paper}>
                    {props.status === "Segerakan" ?
                        <h2>Anda Yakin Ingin Segerakan Pasien Berikut?</h2>
                        :
                        <h2>Masukkan Pasien Terlewat?</h2>
                    }
                    <div className={classes.dokter}>
                        <h4 className={classes.textNama}>
                            {props.data.nama}
                        </h4>
                        <Typography className={classes.textNama} variant="caption" component="p">
                            {props.data.namaSuami}
                        </Typography>
                        <Typography className={classes.textNama} variant="caption" component="p">
                            {props.data.noHp}
                        </Typography>
                        <Typography className={classes.textNama} variant="caption" component="p">
                            {props.data.alamat}
                        </Typography>
                    </div>
                    <div className={classes.tombol}>
                        {props.status === "Segerakan" ?
                            <Button
                                variant="contained"
                                color="primary"
                                className={classes.button}
                                startIcon={<Check />}
                                onClick={segerakanPasien}
                            >
                                Segerakan
                            </Button>
                            :
                            <Button
                                variant="contained"
                                color="primary"
                                className={classes.button}
                                startIcon={<Check />}
                                onClick={masukkanPasien}
                            >
                                Masukkan
                            </Button>

                        }
                        <Button
                            variant="contained"
                            color="secondary"
                            className={classes.button}
                            startIcon={<Close />}
                            onClick={handleClose}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default ModalSegerakan
