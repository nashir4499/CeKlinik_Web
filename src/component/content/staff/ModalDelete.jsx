import { Avatar, Button, IconButton, makeStyles, Modal, Typography } from '@material-ui/core';
import { Close, Delete } from '@material-ui/icons';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { firebase, db } from '../../../config/firebase';
import { deleteStaf, selectOrgaId } from '../../../features/orgaKlinik/orgaKlinikSilce';

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
        width: 500,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        borderRadius: 30,
        padding: theme.spacing(2, 4, 3),
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },
    staf: {
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

function ModalDelete(props) {
    const classes = useStyles();
    const orgaKlinik = useSelector(selectOrgaId)
    const dispatch = useDispatch()
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const hapusStaf = () => {
        db.collection("orga_kliniks").doc(orgaKlinik).update({
            stafs: firebase.firestore.FieldValue.arrayRemove(db.doc('/stafs/' + props.id))
        }).catch(err => alert(err))
        db.collection('orga_kliniks').doc(orgaKlinik)
            .collection("dokter_staf").doc(props.id).delete()
        // console.log(props.id)
        dispatch(deleteStaf({ id: props.id }))
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
                    <h2>Anda Yakin Ingin Menghapus Staf Berikut?</h2>
                    <div className={classes.staf}>
                        <Avatar alt={props.nama} src={props.foto} className={classes.large} />
                        <h4 className={classes.textNama}>
                            {props.nama}
                        </h4>
                        <Typography className={classes.textNama} variant="caption" component="p">
                            {props.email}
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
                            onClick={hapusStaf}
                        >
                            Delete
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default ModalDelete
