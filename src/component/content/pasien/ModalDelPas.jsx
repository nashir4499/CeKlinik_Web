import React from 'react'
import { Button, IconButton, makeStyles, Modal, Typography } from '@material-ui/core';
import { Close, Delete } from '@material-ui/icons';
import { useSelector } from 'react-redux';
import { selectKlinik } from '../../../features/orgaKlinik/orgaKlinikSilce';
import { db } from '../../../config/firebase';

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

function ModalDelPas(props) {
    const classes = useStyles();
    const klinik = useSelector(selectKlinik)
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        props.updatePas()
    };

    const hapusDokter = (e) => {
        db.collection("laporans").doc(klinik.id).collection(props.status).doc(props.data.id).delete().catch(err => alert(err))
        handleClose();
    }

    return (
        <div>
            <IconButton size="small" color="secondary" onClick={handleOpen}>
                <Delete />
            </IconButton>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <div style={modalStyle} className={classes.paper}>
                    <h2>Anda Yakin Ingin Menghapus Pasien Berikut?</h2>
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
                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            startIcon={<Close />}
                            onClick={handleClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            className={classes.button}
                            startIcon={<Delete />}
                            onClick={hapusDokter}
                        >
                            Delete
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default ModalDelPas
