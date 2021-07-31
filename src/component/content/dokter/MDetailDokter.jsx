import React, { useState } from 'react'
import { Avatar, Button, CircularProgress, FormControl, IconButton, InputLabel, makeStyles, Modal, Select, TextField } from '@material-ui/core'
import { Close, Edit, Search } from '@material-ui/icons';
import { db, storageRef, firebase } from '../../../config/firebase';
import { useDispatch, useSelector } from 'react-redux';
import { selectOrgaId, updateDokter } from '../../../features/orgaKlinik/orgaKlinikSilce';

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
        flex: 0.6,
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

function MDetailDokter(props) {
    const classes = useStyles();
    // getModalStyle is not a pure function, we roll the style only on the first render
    const [modalStyle] = React.useState(getModalStyle);
    const dispatch = useDispatch()
    const [open, setOpen] = React.useState(false);
    const [data, setData] = useState({
        noSTR: "",
        nama: "",
        jk: "",
        kd_spesialis: "",
        kualifikasi: "",
        foto: "",
    })
    const [jadMas, setJadMas] = useState("")
    const [stafId, setStafId] = useState(null)
    const orgaId = useSelector(selectOrgaId)
    const [loading, setLoading] = useState(false)
    const [loadingImg, setLoadingImg] = useState(false)
    const [progresLoad, setProgresLoad] = useState(0)
    const [edit, setEdit] = useState(false)
    const [gambarSementara, setGambarSementara] = useState()
    const dokRef = db.collection('dokters').doc(props.id)

    const handleOpen = () => {
        setOpen(true)
        setLoading(true)
        dokRef.get()
            .then(res => {
                if (res.exists) {
                    setData({
                        noSTR: res.data().noSTR,
                        nama: res.data().nama,
                        jk: res.data().jk,
                        kd_spesialis: res.data().kd_spesialis,
                        kualifikasi: res.data().kualifikasi,
                        foto: res.data().foto,
                    })
                    setLoading(false)
                }
            })
            .catch(err => alert(err))
        db.collection('orga_kliniks').doc(orgaId)
            .collection("dokter_staf").where("dokter", "==", dokRef)
            .get().then((querySnapshot) => {
                if (querySnapshot.empty === false) {
                    querySnapshot.forEach((doc) => {
                        setStafId(doc.id)
                        if (doc.data().jadMas) {
                            setJadMas(doc.data().jadMas)
                        } else {
                            setJadMas("Belum Memiliki Jadwal Masuk")
                        }
                    })
                } else {
                    setJadMas("Dokter Belum Memiliki Staf Pendaftaran")
                }
            }).catch(err => alert(err))
    };

    const handleClose = () => {
        setOpen(false);
        setEdit(false)
        setGambarSementara()
    };

    const handleChange = (nama, value) => {
        setData({
            ...data,
            [nama]: value,
        });
    }

    const onChangePhoto = (dataFile) => {
        setLoadingImg(true)
        // console.log(dataFile.target.files[0])
        if (dataFile.target.files[0].type === "image/jpeg" || dataFile.target.files[0].type === "image/png") {
            setGambarSementara(dataFile.target.files[0])
            const uploadTask = storageRef.child('dokters/' + props.id + 'coba').put(dataFile.target.files[0])
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

    const ubahdokter = (e) => {
        e.preventDefault()
        if (gambarSementara !== undefined) {
            const uploadTask = storageRef.child('dokters/' + props.id).put(gambarSementara)
            uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED.length,
                ((snapshot) => {
                    setProgresLoad((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                }), ((error) => {
                    console.log(error.code)
                }), (() => {
                    uploadTask.snapshot.ref.getDownloadURL()
                        .then((downloadURL) => {
                            db.collection('dokters').doc(props.id).update({
                                'noSTR': props.id,
                                'nama': data.nama,
                                'jk': data.jk,
                                'kd_spesialis': data.kd_spesialis,
                                'kualifikasi': data.kualifikasi,
                                'foto': downloadURL
                            })
                            const idDokter = props.id
                            const dataDokter = {
                                id: idDokter, data: {
                                    noSTR: props.id,
                                    nama: data.nama,
                                    jk: data.jk,
                                    kd_spesialis: data.kd_spesialis,
                                    kualifikasi: data.kualifikasi,
                                    foto: downloadURL
                                }
                            }
                            dispatch(updateDokter(dataDokter))
                            // handleClose()
                        });
                })
            );
        } else {
            db.collection('dokters').doc(props.id).update({
                'noSTR': props.id,
                'nama': data.nama,
                'jk': data.jk,
                'kd_spesialis': data.kd_spesialis,
                'kualifikasi': data.kualifikasi,
                'foto': data.foto,
            })
            const idDokter = props.id
            const dataDokter = {
                id: idDokter, data: {
                    noSTR: props.id,
                    nama: data.nama,
                    jk: data.jk,
                    kd_spesialis: data.kd_spesialis,
                    kualifikasi: data.kualifikasi,
                    foto: data.foto
                }
            }
            dispatch(updateDokter(dataDokter))
        }
        if (stafId) {
            db.collection('orga_kliniks').doc(orgaId)
                .collection("dokter_staf").doc(stafId)
                .update({
                    'jadMas': jadMas,
                })
        }
        handleClose()

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
                        <h2 style={{ marginLeft: 10 }} id="simple-modal-title">Detail dokter</h2>
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
                        <form className={classes.root} noValidate autoComplete="off" onSubmit={ubahdokter}>
                            <div className={classes.form} >
                                <div className={classes.formControl}>
                                    <input value={props.id} hidden disabled label="userId" />
                                    <TextField id="standard-basic" className={edit ? classes.formInputTrue : classes.formInput} value={data.nama} label="Nama" onChange={(e) => handleChange("nama", e.target.value)} />
                                    <FormControl className={edit ? classes.formInputTrue : classes.formInput}>
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
                                        >
                                            <option aria-label="None" value="" />
                                            <option value="Laki-Laki">Laki-Laki</option>
                                            <option value="Perempuan">Perempuan</option>
                                        </Select>
                                    </FormControl>
                                    <TextField id="standard-basic" className={edit ? classes.formInputTrue : classes.formInput} value={data.kd_spesialis} label="Kode Spesialis" onChange={(e) => handleChange("kd_spesialis", e.target.value)} />
                                    <TextField id="standard-basic" className={edit ? classes.formInputTrue : classes.formInput} value={data.kualifikasi} label="Kualifikasi" onChange={(e) => handleChange("kualifikasi", e.target.value)} />
                                    {stafId ?
                                        <TextField id="standard-basic" className={edit ? classes.formInputTrue : classes.formInput} value={jadMas} label="Jadwal Masuk" onChange={(e) => setJadMas(e.target.value)} />
                                        :
                                        <TextField id="standard-basic" className={classes.formInput} value={jadMas} label="Jadwal Masuk" onChange={(e) => setJadMas(e.target.value)} />
                                    }
                                </div>
                                <div className={classes.formControlGambar}>
                                    {loadingImg ?
                                        <CircularProgress variant="determinate" value={progresLoad} />
                                        :
                                        <>
                                            <Avatar alt={data.nama} src={data.foto} className={classes.large} />
                                            {edit &&
                                                <div className="input_gambar">
                                                    <Edit className="input_gambar_icon" />
                                                    <input className="input_gambar_file" type="file" name="profile" id="profile" onChange={onChangePhoto} />
                                                </div>
                                            }
                                        </>
                                    }
                                </div>
                            </div>
                            {edit &&
                                <Button className={classes.tombol} variant="contained" color="primary" fullWidth type="submit">Simpan Perubahan</Button>
                            }
                        </form>
                    }
                </div>
            </Modal>
        </div>
    )
}

export default MDetailDokter
