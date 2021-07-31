import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from '@material-ui/core/Modal';
import { useSpring, animated } from 'react-spring'
import { Button, Checkbox, FormControl, FormControlLabel, IconButton, InputLabel, makeStyles, Select, TextField } from '@material-ui/core';
import { db, dbRef } from '../../../config/firebase';
import { useSelector } from 'react-redux';
import { selectKlinik } from '../../../features/orgaKlinik/orgaKlinikSilce';
import { selectUser } from '../../../features/user/userSlice';
import { Add, Close, Search } from '@material-ui/icons';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';

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
    button: {
        margin: theme.spacing(1),
        backgroundColor: '#76ff03',
        '&:hover': {
            backgroundColor: '#52b202',
        }
    },
    formControlDouble: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 5,
        marginBottom: 10,
    }
}));
// const useStyles = makeStyles((theme) => ({
//     modal: {
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     paper: {
//         backgroundColor: theme.palette.background.paper,
//         border: '2px solid #000',
//         boxShadow: theme.shadows[5],
//         padding: theme.spacing(2, 4, 3),
//     },
//     button: {
//         margin: theme.spacing(1),
//         backgroundColor: '#76ff03',
//         '&:hover': {
//             backgroundColor: '#52b202',
//         }
//     },

//     root: {
//         '& > *': {
//             margin: theme.spacing(1),
//             width: '100%',
//         },
//     },
//     outlinedPrimary: {
//         color: "green",
//     },
//     textField: {
//         marginLeft: theme.spacing(1),
//         marginRight: theme.spacing(1),
//         width: 200,
//     },
//     formControl: {
//         margin: theme.spacing(1),
//         minWidth: 120,
//     },
// }));

const Fade = React.forwardRef(function Fade(props, ref) {
    const { in: open, children, onEnter, onExited, ...other } = props;
    const style = useSpring({
        from: { opacity: 0 },
        to: { opacity: open ? 1 : 0 },
        onStart: () => {
            if (open && onEnter) {
                onEnter();
            }
        },
        onRest: () => {
            if (!open && onExited) {
                onExited();
            }
        },
    });

    return (
        <animated.div ref={ref} style={style} {...other}>
            {children}
        </animated.div>
    );
});

Fade.propTypes = {
    children: PropTypes.element,
    in: PropTypes.bool.isRequired,
    onEnter: PropTypes.func,
    onExited: PropTypes.func,
};

export default function TambahAntrian(props) {
    const classes = useStyles();
    const klinik = useSelector(selectKlinik)
    const [modalStyle] = React.useState(getModalStyle);
    const user = useSelector(selectUser)
    const [open, setOpen] = React.useState(false);
    // const [selectedDate, handleDateChange] = useState(new Date());
    const [selectedDate, handleDateChange] = useState("1999-01-01");
    const [data, setData] = useState({
        nama: '',
        alamat: '',
        namaSuami: '',
        noHp: '',
        status: 'Menunggu'
    })
    const [idPasien, setIdPasien] = useState('')
    const [dataAda, setDataAda] = useState(false)
    const fbAntrian = dbRef.ref('antrian').child(klinik.id).child(user.userId)

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setData({
            nama: '',
            alamat: '',
            namaSuami: '',
            noHp: '',
            status: 'Menunggu'
        })
        setIdPasien()
        setDataAda(false)
        handleDateChange("1999-01-01")
    };

    const handleChange = (nama, value) => {
        setData({
            ...data,
            [nama]: value,
        });
    };

    const cariData = () => {
        db.collection('laporans').doc(klinik.id).collection("pasienTerdaftar").doc(idPasien).get()
            .then((querySnapshot) => {
                // console.log(querySnapshot)
                if (querySnapshot.exists) {
                    setData({
                        nama: querySnapshot.data().nama,
                        alamat: querySnapshot.data().alamat,
                        noHp: querySnapshot.data().noHp,
                        namaSuami: querySnapshot.data().namaSuami,
                        status: 'Menunggu',
                    })
                    handleDateChange(querySnapshot.data().ttl)
                } else {
                    alert("Data Tidak Tersedia")
                    setData({
                        nama: '',
                        alamat: '',
                        namaSuami: '',
                        noHp: '',
                        status: 'Menunggu'
                    })
                }
            }).catch((err) => alert(err))
    }

    const masukkanAntrian = (e) => {
        e.preventDefault()
        // console.log(new Date().toISOString().substring(0, 10))
        if (props.antrian.pasienTerdaftar + 1 <= props.antrian.jumlahAntrian) {
            if (!dataAda) {
                fbAntrian.child("pasien").child(props.antrian.pasienTerdaftar + 1).set({
                    nomor: props.antrian.pasienTerdaftar + 1,
                    nama: data.nama,
                    // ttl: selectedDate.toISOString().substring(0, 10),
                    ttl: selectedDate,
                    alamat: data.alamat,
                    namaSuami: data.namaSuami,
                    noHp: data.noHp,
                    status: data.status,
                    id: idPasien ? idPasien : "0",
                }).catch(err => alert(err))
                fbAntrian.update({
                    pasienTerdaftar: props.antrian.pasienTerdaftar + 1
                }).catch(err => alert(err))
            } else {
                db.collection('laporans').doc(klinik.id).collection("pasienTerdaftar").doc(idPasien).get()
                    .then((querySnapshot) => {
                        if (querySnapshot.exists) {
                            alert('ID telah terpakai harap centang "Pasien Sudah Terdaftar..." dan lakukan pengecekan user')
                        } else {
                            fbAntrian.child("pasien").child(props.antrian.pasienTerdaftar + 1).set({
                                nomor: props.antrian.pasienTerdaftar + 1,
                                nama: data.nama,
                                // ttl: selectedDate.toISOString().substring(0, 10),
                                ttl: selectedDate,
                                alamat: data.alamat,
                                namaSuami: data.namaSuami,
                                noHp: data.noHp,
                                status: data.status,
                                id: idPasien,
                            }).catch(err => alert(err))
                            fbAntrian.update({
                                pasienTerdaftar: props.antrian.pasienTerdaftar + 1
                            }).catch(err => alert(err))
                        }
                    }).catch((err) => alert(err))
            }
        } else {
            alert("Jumlah Antrian telah memenuhi kuota")
        }
        handleClose()

    }

    return (
        <div>
            <Button variant="contained" className={classes.button} endIcon={<Add />} onClick={handleOpen}>
                Tambah
            </Button>
            <Modal
                aria-labelledby="spring-modal-title"
                aria-describedby="spring-modal-description"
                className={classes.modal}
                open={open}
                onClose={handleClose}
                closeAfterTransition
            // BackdropComponent={Backdrop}
            // BackdropProps={{
            //     timeout: 500,
            // }}
            >
                <Fade in={open}>
                    <div style={modalStyle} className={classes.paper}>
                        <div className={classes.header}>
                            <h2 style={{ marginLeft: 10 }} id="simple-modal-title">Tambah Pasien</h2>
                            <div className={classes.headerOpsi}>
                                <IconButton size="small" color="secondary" style={{ marginLeft: 10 }} onClick={handleClose}>
                                    <Close />
                                </IconButton>
                            </div>
                        </div>
                        <form className={classes.root} noValidate autoComplete="off" onSubmit={masukkanAntrian}>
                            <div className={classes.form} >
                                <div className={classes.formControl}>
                                    <FormControlLabel
                                        className={classes.checkBox}
                                        control={
                                            <Checkbox
                                                icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                                                checkedIcon={<CheckBoxIcon fontSize="small" />}
                                                checked={dataAda}
                                                onChange={(e) => setDataAda(e.target.checked)}
                                                name="checkedB"
                                                color="primary"
                                            />
                                        }
                                        labelPlacement="end"
                                        label={<p style={{ fontSize: 12, marginLeft: -5 }}>Pasien Sudah Terdaftar Di Aplikasi</p>}
                                    />
                                    {dataAda ? (
                                        <div className="dataAda_on">
                                            <div className="dataAda_on_kiri">
                                                <TextField className={classes.formInputTrue} value={idPasien} required label="ID Pasien" onChange={(e) => setIdPasien(e.target.value)} fullWidth />
                                            </div>
                                            <div className="dataAda_on_kanan">
                                                <IconButton aria-label="delete" onClick={cariData}>
                                                    <Search />
                                                </IconButton>
                                            </div>
                                        </div>
                                    ) : (
                                        <TextField className={classes.formInputTrue} value={idPasien} label="ID Pasien" onChange={(e) => setIdPasien(e.target.value)} fullWidth />
                                    )}
                                    <TextField className={classes.formInputTrue} value={data.nama} label="Nama" onChange={(e) => handleChange("nama", e.target.value)} required disabled={dataAda ? true : false} />
                                    <TextField className={classes.formInputTrue} value={data.alamat} label="Alamat" onChange={(e) => handleChange("alamat", e.target.value)} required disabled={dataAda ? true : false} />
                                    <TextField className={classes.formInputTrue} value={data.namaSuami} label="Nama Suami" onChange={(e) => handleChange("namaSuami", e.target.value)} required disabled={dataAda ? true : false} />
                                    <TextField className={classes.formInputTrue} value={data.noHp} label="Nomor HP" onChange={(e) => handleChange("noHp", e.target.value)} required disabled={dataAda ? true : false} />
                                    <div className={classes.formControlDouble}>
                                        <TextField
                                            id="date"
                                            label="Tanggal Lahir"
                                            type="date"
                                            // defaultValue="1999-05-24"
                                            className={classes.formInputTrue}
                                            value={selectedDate}
                                            onChange={(e) => handleDateChange(e.target.value)}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            required
                                            fullWidth
                                            disabled={dataAda ? true : false}
                                        />
                                        <FormControl className={classes.formInputTrue} fullWidth>
                                            <InputLabel htmlFor="outlined-status-native-simple">Status</InputLabel>
                                            <Select
                                                native
                                                value={data.status}
                                                onChange={(e) => handleChange('status', e.target.value)}
                                                label="Status"
                                                inputProps={{
                                                    name: 'status',
                                                    id: 'outlined-status-native-simple',
                                                }}
                                                fullWidth
                                                disabled={dataAda ? true : false}
                                            >
                                                <option value="Menunggu">Menunggu</option>
                                                <option value="Segerakan">Segerakan</option>
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <Button variant="contained" color="primary" fullWidth type="submit">Tambah Pasien</Button>
                                </div>
                            </div>
                        </form>
                    </div>
                </Fade>
            </Modal>
        </div>
    );
}