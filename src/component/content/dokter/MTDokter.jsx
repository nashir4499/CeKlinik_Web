import React, { useState } from 'react'
import { Checkbox, FormControlLabel, Avatar, Button, CircularProgress, FormControl, InputLabel, makeStyles, Modal, Select, TextField, IconButton } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { firebase, db, storageRef } from '../../../config/firebase';
import { getDokters, selectOrgaId } from '../../../features/orgaKlinik/orgaKlinikSilce';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import { Edit, Search } from '@material-ui/icons';

function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const useStyles = makeStyles((theme) => ({
    paper: {
        position: "absolute",
        width: 500,
        backgroundColor: theme.palette.background.paper,
        borderRadius: "15px",
        boxShadow: "2px 2px 10px #000000",
        padding: theme.spacing(2, 4, 3),
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 150,
    },
    formControlGambar: {
        margin: "10px 0px 10px 0px",
        position: "relative",
        display: 'flex',
        justifyContent: "center",
        alignItems: "center",
    },
    large: {
        width: theme.spacing(15),
        height: theme.spacing(15),
    },
    checkBox: {
        margin: "5px 5px 0px 5px",

    }
}));

function MTDokter(props) {
    const orgaId = useSelector(selectOrgaId)
    const classes = useStyles();
    const dispatch = useDispatch()
    const [modalStyle] = useState(getModalStyle)
    const [open, setOpen] = useState(false)
    const [loadingImg, setLoadingImg] = useState(false)
    const [progresLoad, setProgresLoad] = useState(0)
    const [gambarSementara, setGambarSementara] = useState()
    const [dataAda, setDataAda] = useState(false)
    const [data, setData] = useState({
        noSTR: "",
        nama: "",
        jk: "",
        kd_spesialis: "",
        kualifikasi: "",
        foto: "",
    })

    const handleOpen = () => {
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false)
        setGambarSementara()
        setData({
            noSTR: "",
            nama: "",
            jk: "",
            kd_spesialis: "",
            kualifikasi: "",
            foto: "",
        })
    }

    const handleChange = (nama, value) => {
        setData({
            ...data,
            [nama]: value,
        });
    };

    const onChangePhoto = (dataFile) => {
        setLoadingImg(true)
        if (dataFile.target.files[0].type === "image/jpeg" || dataFile.target.files[0].type === "image/png") {
            setGambarSementara(dataFile.target.files[0])
            const uploadTask = storageRef.child('dokters/' + props.user + 'coba').put(dataFile.target.files[0])
            uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED.length,
                ((snapshot) => {
                    setProgresLoad((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                }), ((error) => {
                    console.log(error.code)
                }), (() => {
                    uploadTask.snapshot.ref.getDownloadURL()
                        .then((downloadURL) => {
                            setData({ ...data, foto: downloadURL })
                            setLoadingImg(false)
                        });
                })
            );
        } else {
            alert("File harus berupa JPEG atau PNG")
        }
    }

    const cariData = () => {
        db.collection('dokters').doc(data.noSTR).get()
            .then((res) => {
                if (res.exists !== true) {
                    alert("Data Tidak Tersedia")
                    setData({
                        noSTR: data.noSTR,
                        nama: "",
                        jk: "",
                        kd_spesialis: "",
                        kualifikasi: "",
                        foto: "",
                    })
                } else {
                    setData({
                        noSTR: data.noSTR,
                        nama: res.data().nama,
                        jk: res.data().jk,
                        kd_spesialis: res.data().kd_spesialis,
                        kualifikasi: res.data().kualifikasi,
                        foto: res.data().foto,
                    })
                }
            }).catch((err) => alert(err))
    }

    const tambahDokter = (e) => {
        e.preventDefault()

        db.collection('dokters').doc(data.noSTR).get()
            .then((res) => {
                if (res.exists !== true) {
                    if (!dataAda) {
                        if (gambarSementara === undefined) {
                            db.collection('dokters').doc(data.noSTR).set({
                                'noSTR': data.noSTR,
                                'nama': data.nama,
                                'jk': data.jk,
                                'kd_spesialis': data.kd_spesialis,
                                'kualifikasi': data.kualifikasi,
                                'foto': 'Belum'
                            })
                            dispatch(getDokters({
                                id: data.noSTR, data:
                                {
                                    noSTR: data.noSTR,
                                    nama: data.nama,
                                    jk: data.jk,
                                    kd_spesialis: data.kd_spesialis,
                                    kualifikasi: data.kualifikasi,
                                    foto: 'Belum'
                                }
                            }))
                        } else {
                            const uploadTask = storageRef.child('dokters/' + data.noSTR).put(gambarSementara)
                            uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED.length,
                                ((snapshot) => {
                                    setProgresLoad((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                                }), ((error) => {
                                    console.log(error.code)
                                }), (() => {
                                    uploadTask.snapshot.ref.getDownloadURL()
                                        .then((downloadURL) => {
                                            db.collection('dokters').doc(data.noSTR).set({
                                                'nama': data.nama,
                                                'jk': data.jk,
                                                'kd_spesialis': data.kd_spesialis,
                                                'kualifikasi': data.kualifikasi,
                                                'foto': downloadURL
                                            })
                                            dispatch(getDokters({
                                                id: data.noSTR, data:
                                                {
                                                    noSTR: data.noSTR,
                                                    nama: data.nama,
                                                    jk: data.jk,
                                                    kd_spesialis: data.kd_spesialis,
                                                    kualifikasi: data.kualifikasi,
                                                    foto: downloadURL
                                                }
                                            }))
                                        });
                                })
                            );
                        }

                        db.collection('orga_kliniks').doc(orgaId).update({
                            dokters: firebase.firestore.FieldValue.arrayUnion(db.doc('/dokters/' + data.noSTR))
                        })
                        handleClose()
                    } else {
                        alert("Data Belum Tersedia, Harapa Hilangkan Ceklis Pada 'Data Dokter Sudah Tersedia'")
                    }
                } else {
                    if (dataAda) {
                        db.collection('orga_kliniks').doc(orgaId).update({
                            dokters: firebase.firestore.FieldValue.arrayUnion(db.doc('/dokters/' + data.noSTR))
                        })
                        db.collection('dokters').doc(data.noSTR).get()
                            .then(res => {
                                const orgaDokters = res.data()
                                const idDokter = res.id
                                const dataDokter = { id: idDokter, data: orgaDokters }
                                dispatch(getDokters(dataDokter))
                            })
                            .catch(err => alert(err))
                        handleClose()
                    } else {
                        alert("Data Sudah Tersedia, Harapa Ceklis 'Data Dokter Sudah Tersedia'")
                    }
                }
            })
            .catch((err) => alert(err))
    }

    return (
        <div className="">
            <Button
                size="medium"
                className="dokter_tombol"
                style={{ borderRadius: 50, }}
                variant="contained"
                color="primary"
                onClick={handleOpen}
                endIcon={<PersonAddIcon />}
            >
                Tambah Dokter
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <div style={modalStyle} className={classes.paper}>
                    <div className="modal__tambah__dokter">
                        <h2 id="simple-modal-title">Tambah Dokter</h2>
                        <form className="add__form__dokter" onSubmit={tambahDokter}>
                            <div className={classes.formControlGambar}>
                                {loadingImg ?
                                    <CircularProgress variant="determinate" value={progresLoad} />
                                    :
                                    <>
                                        <Avatar alt={data.nama} src={data.foto} className={classes.large} />
                                        {!dataAda && (
                                            <div className="input_gambar_tambah__dokter">
                                                <Edit className="input_gambar_icon__dokter" />
                                                <input className="input_gambar_file__dokter" type="file" name="profile" id="profile" onChange={onChangePhoto} />
                                            </div>
                                        )}
                                    </>
                                }
                            </div>
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
                                label={<p style={{ fontSize: 12, marginLeft: -5 }}>Data Dokter Sudah Tersedia</p>}
                            />
                            {
                                dataAda ? (
                                    <div className="dataAda_on">
                                        <div className="dataAda_on_kiri">
                                            <TextField className={classes.formControl} label="Nomor STR" variant="outlined" type="text" size="small" value={data.noSTR} onChange={(e) => handleChange("noSTR", e.target.value)} required fullWidth />
                                        </div>
                                        <div className="dataAda_on_kanan">
                                            <IconButton aria-label="delete" onClick={cariData}>
                                                <Search />
                                            </IconButton>
                                        </div>
                                    </div>
                                ) : (
                                    <TextField className={classes.formControl} label="Nomor STR" variant="outlined" type="text" size="small" value={data.noSTR} onChange={(e) => handleChange("noSTR", e.target.value)} required />
                                )
                            }
                            <TextField className={classes.formControl} label="Nama" variant="outlined" type="text" size="small" value={data.nama} onChange={(e) => handleChange("nama", e.target.value)} required disabled={dataAda ? true : false} />
                            <div className="form__control__dokter">
                                <FormControl className={classes.formControl}>
                                    <InputLabel htmlFor="age-native-simple">Jenis Kelamin</InputLabel>
                                    <Select
                                        native
                                        value={data.jk}
                                        onChange={(e) => handleChange("jk", e.target.value)}
                                        label="Jenis Kelamin"
                                        inputProps={{
                                            name: 'Jenis Kelamin',
                                            id: 'Jenis_Kelamin-native-simple',
                                        }}
                                        required
                                        disabled={dataAda ? true : false}
                                    >
                                        <option aria-label="None" value="" />
                                        <option value="Laki-Laki">Laki-Laki</option>
                                        <option value="Perempuan">Perempuan</option>
                                    </Select>
                                </FormControl>
                                <TextField className={classes.formControl} label="Kode Spesialis" variant="outlined" type="text" size="small" value={data.kd_spesialis} onChange={(e) => handleChange("kd_spesialis", e.target.value)} required disabled={dataAda ? true : false} />
                            </div>
                            <TextField className={classes.formControl} label="Kualisifikasi" variant="outlined" type="text" size="small" value={data.kualifikasi} onChange={(e) => handleChange("kualifikasi", e.target.value)} required disabled={dataAda ? true : false} />

                            <Button style={{ marginTop: "15px" }} variant="contained" color="primary" fullWidth type="submit">Tambah dokter</Button>
                        </form>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default MTDokter
