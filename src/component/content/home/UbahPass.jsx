import React, { useState } from 'react'
import { Button, IconButton, makeStyles, Modal, TextField } from '@material-ui/core'
import { auth } from '../../../config/firebase';
import { Close } from '@material-ui/icons';


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
        padding: theme.spacing(2, 3, 3),
        borderRadius: theme.spacing(2),
        display: 'flex',
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    header: {
        width: "100%",
        display: 'flex',
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: "center",
        // backgroundColor: "rgb(200,200,200)",
    },
    root: {
        display: 'flex',
        flexDirection: "column",
        width: '100%',
    },
    formControl: {
        flex: 0.6,
        display: 'flex',
        flexDirection: 'column',
        margin: "30px 0px"
    },
    formInput: {
        margin: 5,
    },
    tombol: {
        background: "rgb(0,150,0)",
        '&:hover': {
            background: "rgb(0,200,0)",
        }
    },
}));

function UbahPass(props) {
    const classes = useStyles();
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);
    const [errorPassword, setErrorPassword] = useState(false)
    const [passwordLama, setPasswordLama] = useState("")
    const [password, setPassword] = useState("")

    const handleOpen = () => {
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false);
        setErrorPassword(false)
        setPasswordLama()
        setPassword()

    };

    const cekRePassword = (e) => {
        if (e !== password) {
            setErrorPassword(true)
        } else {
            setErrorPassword(false)
        }
    }

    const ubahPassword = (e) => {
        e.preventDefault()
        if (!errorPassword) {
            auth.signInWithEmailAndPassword(props.email, password)
                .then(() => {
                    auth.currentUser.updatePassword(password)
                        .then(() => {
                            alert(`Password Dengan Berhasil Di Ubah`)
                            handleClose()
                        }).catch((error) => {
                            alert(error)
                        });

                }).catch(error => alert(error))
        } else {
            alert("Re-Password Belum Sesuai")
        }
    }

    return (
        <div>
            <Button className="dropdown-button" onClick={handleOpen}>
                <div className="home__header__text">
                    <h4>Ubah Pass</h4>
                </div>
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <div style={modalStyle} className={classes.paper}>
                    <div className={classes.header}>
                        <h3 id="simple-modal-title">Ubah Password User</h3>
                        <IconButton size="small" color="secondary" style={{ marginLeft: 10 }} onClick={handleClose}>
                            <Close />
                        </IconButton>
                    </div>
                    <form className={classes.root} noValidate autoComplete="off" onSubmit={ubahPassword}>
                        <div className={classes.formControl}>
                            <input value={props.id} hidden disabled label="userId" />
                            <TextField className={classes.formInput} label="Password Lama" variant="outlined" type="password" autoComplete="on" size="small" value={passwordLama} onChange={(e) => setPasswordLama(e.target.value)} fullWidth />
                            <TextField className={classes.formInput} label="Password" variant="outlined" type="password" autoComplete="on" size="small" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth />
                            <TextField className={classes.formInput} label="Re-Password" variant="outlined" type="password" autoComplete="on" size="small" error={errorPassword} onBlur={(e) => cekRePassword(e.target.value)} helperText={errorPassword && "Re-Password tidak sesuai"} fullWidth />
                        </div>
                        <Button className={classes.tombol} variant="contained" color="primary" fullWidth type="submit">Ubah Password</Button>
                    </form>
                </div>
            </Modal>
        </div>
    )
}

export default UbahPass
