import React, { useState } from 'react'
import { Button, IconButton, makeStyles, Modal, TextField } from '@material-ui/core'
import { Close } from '@material-ui/icons';
import { db } from '../../../config/firebase';
import { useSelector } from 'react-redux';
import { selectKlinik } from '../../../features/orgaKlinik/orgaKlinikSilce';

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
        width: 600,
        backgroundColor: theme.palette.background.paper,
        // border: '2px solid #000',
        // boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 3, 3),
        borderRadius: theme.spacing(2),
        display: 'flex',
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    root: {
        display: 'flex',
        flexDirection: "column",
        width: '100%',
    },
    header: {
        width: '100%',
        display: 'flex',
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        // backgroundColor: "rgb(200,200,200)",
    },
    // headerOpsi: {

    // },
    headerOpsiEdit: {
        padding: "0px 10px 0px 10px",
        '& h6': {
            marginRight: 5,
            opacity: 0,
            transition: "0.5s",
        },
        '&:hover': {
            '& h6': {
                marginRight: 5,
                opacity: 1,
            },
        },
    },
    form: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 5,
        boxShadow: theme.shadows[2],
        borderRadius: theme.spacing(2),
        padding: 10,
    },
    formControl: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        // border: '1px solid #000',
        boxShadow: theme.shadows[2],
        borderRadius: theme.spacing(2),
        padding: 10,
    },
    formInput: {
        margin: 5,
        pointerEvents: 'none',
    },
    formInputTrue: {
        margin: 5,
    },
    formControlGambar: {
        flex: 0.4,
        position: "relative",
        display: 'flex',
        justifyContent: "center",
        alignItems: "center",

    },
    large: {
        width: theme.spacing(20),
        height: theme.spacing(20),
        // marginBottom: theme.spacing(1),
    },
    tombol: {
        marginTop: 10,
        background: "rgb(0,150,0)",
        '&:hover': {
            background: "rgb(0,200,0)",
        }
    },
}));

function ModalTamPasien(props) {
    const classes = useStyles();
    // getModalStyle is not a pure function, we roll the style only on the first render
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);
    const [data, setData] = useState({
        nama: "",
        alamat: "",
        namaSuami: "",
        noHp: "",
        ttl: "",
    })
    const [idPasien, setIdPasien] = useState('')
    const klinik = useSelector(selectKlinik)

    const handleOpen = () => {
        setOpen(true)
    };

    const handleClose = () => {
        setOpen(false)
        setIdPasien()
        setData({
            nama: "",
            alamat: "",
            namaSuami: "",
            noHp: "",
            ttl: "",
        })
        props.updatePas()
    };

    const handleChange = (nama, value) => {
        setData({
            ...data,
            [nama]: value,
        });
    }

    const tambahPasien = (e) => {
        e.preventDefault()
        db.collection("laporans").doc(klinik.id).collection("pasienTerdaftar").doc(idPasien)
            .get()
            .then((res) => {
                if (res.exists !== true) {
                    db.collection("laporans").doc(klinik.id).collection("pasienTerdaftar").doc(idPasien)
                        .set({
                            'pasienId': idPasien,
                            'nama': data.nama,
                            'alamat': data.alamat,
                            'namaSuami': data.namaSuami,
                            'noHp': data.noHp,
                            'ttl': data.ttl,
                        }).catch(err => alert(err))
                    handleClose()
                } else {
                    alert("Nomor Pasien Telah Digunakan")
                }
            }).catch(err => alert(err))

    }

    return (
        <div>
            <Button className="tombol" variant="contained" style={{ backgroundColor: "green", color: "white" }}
                onClick={handleOpen}
            >
                Tambah
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <div style={modalStyle} className={classes.paper}>
                    <div className={classes.header}>
                        <h2 style={{ marginLeft: 10 }} id="simple-modal-title">Tambah Pasien</h2>
                        <div className={classes.headerOpsi}>
                            <IconButton size="small" color="secondary" style={{ marginLeft: 10 }} onClick={handleClose}>
                                <Close />
                            </IconButton>
                        </div>
                    </div>
                    <form className={classes.root} noValidate autoComplete="off" onSubmit={tambahPasien}>
                        <div className={classes.form} >
                            <div className={classes.formControl}>
                                {/* <input value={props.id} hidden disabled label="userId" /> */}
                                <TextField id="standard-basic" className={classes.formInputTrue} value={idPasien} label="ID Pasien" onChange={(e) => setIdPasien(e.target.value)} required />
                                <TextField id="standard-basic" className={classes.formInputTrue} value={data.nama} label="Nama" onChange={(e) => handleChange("nama", e.target.value)} required />
                                <TextField id="standard-basic" className={classes.formInputTrue} value={data.alamat} label="Alamat" onChange={(e) => handleChange("alamat", e.target.value)} required />
                                <TextField id="standard-basic" className={classes.formInputTrue} value={data.namaSuami} label="Nama Suami" onChange={(e) => handleChange("namaSuami", e.target.value)} required />
                                <TextField id="standard-basic" className={classes.formInputTrue} value={data.noHp} label="Nomor HP" onChange={(e) => handleChange("noHp", e.target.value)} required />
                                <TextField
                                    id="date"
                                    className={classes.formInputTrue}
                                    label="Tanggal Lahir"
                                    type="date"
                                    defaultValue={data.ttl}
                                    onChange={(e) => handleChange("ttl", e.target.value)}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    required
                                />
                            </div>
                        </div>
                        <Button className={classes.tombol} variant="contained" color="primary" fullWidth type="submit">Tambah Daftar Pasien Klinik</Button>
                    </form>
                </div>
            </Modal>
        </div>
    )
}

export default ModalTamPasien
