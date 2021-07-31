import React, { useState } from 'react'
import { Button, CircularProgress, IconButton, makeStyles, Modal, TextField } from '@material-ui/core'
import { Close, Edit, Search } from '@material-ui/icons';
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

function ModalEditPas(props) {
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
    const [idPasienAndro, setIdPasienAndro] = useState()
    const klinik = useSelector(selectKlinik)
    const [loading, setLoading] = useState(false)
    const [edit, setEdit] = useState(false)

    const handleOpen = () => {
        setOpen(true)
        setLoading(true)
        db.collection("laporans").doc(klinik.id).collection(props.status).doc(props.id).get()
            .then(res => {
                if (res.exists) {
                    setData({
                        nama: res.data().nama,
                        alamat: res.data().alamat,
                        namaSuami: res.data().namaSuami,
                        noHp: res.data().noHp,
                        ttl: res.data().ttl,
                    })
                    if (res.data().pasienId) {
                        setIdPasien(res.data().pasienId)
                    }
                    if (res.data().id) {
                        setIdPasienAndro(res.data().id)
                    }
                    setLoading(false)
                }
            }).catch(err => alert(err))
    };

    const handleClose = () => {
        setOpen(false);
        setEdit(false)
        setIdPasien()
        props.updatePas()
        // props.updatePas("Perubahan Berhasil")
    };

    const handleChange = (nama, value) => {
        setData({
            ...data,
            [nama]: value,
        });
    }

    const ubahPasien = (e) => {
        e.preventDefault()
        if (props.status === "pasienBelumTerdaftar" && idPasien) {
            db.collection("laporans").doc(klinik.id).collection("pasienTerdaftar").doc(idPasien)
                .get()
                .then((res) => {
                    if (res.exists !== true) {
                        db.collection("laporans").doc(klinik.id).collection("pasienTerdaftar").doc(idPasien)
                            .set(idPasienAndro ?
                                {
                                    'pasienId': idPasien,
                                    'nama': data.nama,
                                    'alamat': data.alamat,
                                    'namaSuami': data.namaSuami,
                                    'noHp': data.noHp,
                                    'ttl': data.ttl,
                                    'id': idPasienAndro
                                } :
                                {
                                    'pasienId': idPasien,
                                    'nama': data.nama,
                                    'alamat': data.alamat,
                                    'namaSuami': data.namaSuami,
                                    'noHp': data.noHp,
                                    'ttl': data.ttl,
                                }
                            ).catch(err => alert(err))
                        db.collection("laporans").doc(klinik.id).collection("pasienBelumTerdaftar").doc(props.id).delete().catch(err => alert(err))
                        handleClose()
                    } else {
                        alert("Nomor Pasien Telah Digunakan")
                    }
                }).catch(err => alert(err))
            // window.location.reload();

        } else {
            db.collection("laporans").doc(klinik.id).collection(props.status).doc(props.id)
                .update({
                    'nama': data.nama,
                    'alamat': data.alamat,
                    'namaSuami': data.namaSuami,
                    'noHp': data.noHp,
                    'ttl': data.ttl,
                })
            handleClose()
            // window.location.reload();
        }

    }

    return (
        <div>
            <IconButton size="small" color="primary" onClick={handleOpen}>
                <Search />
            </IconButton>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <div style={modalStyle} className={classes.paper}>
                    <div className={classes.header}>
                        <h2 style={{ marginLeft: 10 }} id="simple-modal-title">Detail Pasien</h2>
                        <div className={classes.headerOpsi}>
                            <IconButton className={classes.headerOpsiEdit} size="small" color="primary" onClick={() => setEdit(!edit)}>
                                <h6>Edit</h6>
                                <Edit />
                            </IconButton>
                            <IconButton size="small" color="secondary" style={{ marginLeft: 10 }} onClick={handleClose}>
                                <Close />
                            </IconButton>
                        </div>
                    </div>
                    {loading ?
                        <CircularProgress />
                        :
                        <form className={classes.root} noValidate autoComplete="off" onSubmit={ubahPasien}>
                            <div className={classes.form} >
                                <div className={classes.formControl}>
                                    <input value={props.id} hidden disabled label="userId" />
                                    <TextField id="standard-basic" className={props.status === "pasienBelumTerdaftar" ? (edit ? classes.formInputTrue : classes.formInput) : classes.formInput} value={idPasien} label="ID Pasien" onChange={(e) => setIdPasien(e.target.value)} />
                                    <TextField id="standard-basic" className={edit ? classes.formInputTrue : classes.formInput} value={data.nama} label="Nama" onChange={(e) => handleChange("nama", e.target.value)} />
                                    <TextField id="standard-basic" className={edit ? classes.formInputTrue : classes.formInput} value={data.alamat} label="Alamat" onChange={(e) => handleChange("alamat", e.target.value)} />
                                    <TextField id="standard-basic" className={edit ? classes.formInputTrue : classes.formInput} value={data.namaSuami} label="Nama Suami" onChange={(e) => handleChange("namaSuami", e.target.value)} />
                                    <TextField id="standard-basic" className={edit ? classes.formInputTrue : classes.formInput} value={data.noHp} label="Nomor HP" onChange={(e) => handleChange("noHp", e.target.value)} />
                                    <TextField
                                        id="date"
                                        className={edit ? classes.formInputTrue : classes.formInput}
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
                            {edit &&
                                (props.status === "pasienBelumTerdaftar" && idPasien ?
                                    <Button className={classes.tombol} variant="contained" color="primary" fullWidth type="submit">Masukkan Ke Daftar Pasien Klinik</Button>
                                    :
                                    <Button style={{ marginTop: 10, }} variant="contained" color="primary" fullWidth type="submit">Simpan Perubahan</Button>
                                )
                            }
                        </form>
                    }
                </div>
            </Modal>
        </div>
    )
}

export default ModalEditPas
