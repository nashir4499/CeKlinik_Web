import React from 'react'
import { BottomNavigation, BottomNavigationAction, Button, IconButton, makeStyles, Modal } from '@material-ui/core'
import { Check, Close, ExitToApp } from '@material-ui/icons';
import { logout } from '../../features/user/userSlice';
import { clearOrga } from '../../features/orgaKlinik/orgaKlinikSilce';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { auth } from '../../config/firebase';


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
        width: 300,
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(2, 3, 3),
        borderRadius: theme.spacing(2),
        display: 'flex',
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: "center",
        marginBottom: "30px"
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

function ModalLogout(props) {
    const classes = useStyles();
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);
    const dispatch = useDispatch()
    let history = useHistory()

    const handleOpen = () => {
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false);

    };

    const logoutApp = () => {
        auth.signOut();
        dispatch(logout())
        dispatch(clearOrga())
        history.push("/login")
    }
    return (
        <div>
            {!props.sidebar ?
                <Button className="dropdown-button" onClick={handleOpen}>
                    <div className="home__header__text">
                        <h4>Logout</h4>
                    </div>
                </Button>
                :
                <BottomNavigation
                    className="sidebar__nav sidebar__nav__logout"
                    showLabels
                >
                    <BottomNavigationAction label="Logout" onClick={handleOpen} icon={<ExitToApp />} />
                </BottomNavigation>

            }
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <div style={modalStyle} className={classes.paper}>
                    <div className={classes.header}>
                        <h3 id="simple-modal-title">Anda Yakin Ingin Keluar?</h3>
                    </div>
                    <div className="">
                        <IconButton color="primary" style={{ marginLeft: 10 }} onClick={logoutApp}>
                            <Check />Ya
                        </IconButton>
                        <IconButton color="secondary" style={{ marginLeft: 10 }} onClick={handleClose}>
                            <Close />Tidak
                        </IconButton>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default ModalLogout
