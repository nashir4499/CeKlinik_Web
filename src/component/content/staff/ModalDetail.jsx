import { Avatar, Button, CircularProgress, FormControl, IconButton, InputLabel, makeStyles, Modal, Select, TextField } from '@material-ui/core'
import { Close, Edit, Search } from '@material-ui/icons';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { db, storageRef, firebase } from '../../../config/firebase';
import { selectDokters, selectOrgaId, updateStaf } from '../../../features/orgaKlinik/orgaKlinikSilce';

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
function ModalDetail(props) {
    const classes = useStyles();
    // getModalStyle is not a pure function, we roll the style only on the first render
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);
    const [data, setData] = useState({
        nama: "",
        alamat: "",
        tgl_lahir: "",
        jk: "",
        noHp: "",
        email: "",
        bagian: "",
        foto: "",
        dokter: "",
    })
    const [loading, setLoading] = useState(false)
    const [loadingImg, setLoadingImg] = useState(false)
    const [progresLoad, setProgresLoad] = useState(0)
    const [edit, setEdit] = useState(false)
    const [gambarSementara, setGambarSementara] = useState()
    const dokters = useSelector(selectDokters)
    const orgaId = useSelector(selectOrgaId)
    const dispatch = useDispatch()
    const [doktersBisa, setDokterBisa] = useState([])

    const handleOpen = () => {
        setOpen(true)
        setLoading(true)
        db.collection('stafs').doc(props.id).get()
            .then(res => {
                if (res.exists) {
                    setData({
                        nama: res.data().nama,
                        alamat: res.data().alamat,
                        tgl_lahir: res.data().tgl_lahir,
                        jk: res.data().jk,
                        noHp: res.data().noHp,
                        email: res.data().email,
                        bagian: res.data().bagian,
                        foto: res.data().foto,
                        dokter: props.dokterId,
                    })
                    if (res.data().bagian === "Pendaftaran") {
                        cekDokter()
                    } else {
                        setDokterBisa([])
                    }
                    setLoading(false)
                }
            })
            .catch(err => alert(err))
    };

    const handleClose = () => {
        setOpen(false);
        setEdit(false)
        setGambarSementara()
        setDokterBisa([])
    };

    const handleChange = (nama, value) => {
        setData({
            ...data,
            [nama]: value,
        });
    }

    const handleChangeBagian = (nama, value) => {
        setData({
            ...data,
            [nama]: value,
        });
        if (value === "Pendaftaran") {
            cekDokter()
        } else {
            setDokterBisa([])
        }
    };

    const cekDokter = () => {
        dokters.forEach(dokter => {
            const dokterRef = db.collection('dokters').doc(dokter.id)
            db.collection("orga_kliniks").doc(orgaId)
                .collection("dokter_staf")
                .where("dokter", "==", dokterRef)
                .get()
                .then((querySnapshot) => {
                    // console.log(querySnapshot)
                    if (querySnapshot.empty) {
                        // setDokterBisa([...doktersBisa, {
                        //     id: dokter.id,
                        //     nama: dokter.data.nama,
                        // }])
                        setDokterBisa(doktersBisa => [...doktersBisa, {
                            id: dokter.id,
                            nama: dokter.data.nama,
                        }])
                    }
                })
                .catch(err => alert(err))
        })
    }

    const onChangePhoto = (dataFile) => {
        setLoadingImg(true)
        // console.log(dataFile.target.files[0])
        if (dataFile.target.files[0].type === "image/jpeg" || dataFile.target.files[0].type === "image/png") {
            setGambarSementara(dataFile.target.files[0])
            const uploadTask = storageRef.child('profile/stafs/' + props.id + 'coba').put(dataFile.target.files[0])
            uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED.length,
                ((snapshot) => {
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    // var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setProgresLoad((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    // console.log('Upload is ' + progress + '% done');
                }), ((error) => {
                    console.log(error.code)
                }), (() => {
                    // Upload completed successfully, now we can get the download URL
                    uploadTask.snapshot.ref.getDownloadURL()
                        .then((downloadURL) => {
                            // console.log('File available at', downloadURL);
                            setData({ ...data, foto: downloadURL })
                            setLoadingImg(false)
                        });
                })
            );
        } else {
            alert("File harus berupa JPEG atau PNG")
        }
    }

    const ubahStaf = (e) => {
        e.preventDefault()
        // console.log(gambarSementara)
        if (gambarSementara !== undefined) {
            const uploadTask = storageRef.child('profile/stafs/' + props.id).put(gambarSementara)
            uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED.length,
                ((snapshot) => {
                    setProgresLoad((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                }), ((error) => {
                    console.log(error.code)
                }), (() => {
                    uploadTask.snapshot.ref.getDownloadURL()
                        .then((downloadURL) => {
                            db.collection('stafs').doc(props.id).update({
                                'userId': props.id,
                                'email': data.email,
                                'nama': data.nama,
                                'jk': data.jk,
                                'alamat': data.alamat,
                                'noHp': data.noHp,
                                'tgl_lahir': data.tgl_lahir,
                                'bagian': data.bagian,
                                'foto': downloadURL
                            })
                            dispatch(updateStaf({
                                id: props.id, data: {
                                    userId: props.id,
                                    email: data.email,
                                    nama: data.nama,
                                    jk: data.jk,
                                    alamat: data.alamat,
                                    noHp: data.noHp,
                                    tgl_lahir: data.tgl_lahir,
                                    bagian: data.bagian,
                                    foto: downloadURL
                                }
                            }))
                            // handleClose()
                        });
                })
            );
        } else {
            db.collection('stafs').doc(props.id).update({
                'userId': props.id,
                'email': data.email,
                'nama': data.nama,
                'jk': data.jk,
                'alamat': data.alamat,
                'noHp': data.noHp,
                'tgl_lahir': data.tgl_lahir,
                'bagian': data.bagian,
                'foto': data.foto,
            }).catch(err => alert(err))
            dispatch(updateStaf({
                id: props.id, data: {
                    userId: props.id,
                    email: data.email,
                    nama: data.nama,
                    jk: data.jk,
                    alamat: data.alamat,
                    noHp: data.noHp,
                    tgl_lahir: data.tgl_lahir,
                    bagian: data.bagian,
                    foto: data.foto,
                }
            }))
        }
        if (data.bagian === "Pendaftaran") {
            db.collection('orga_kliniks').doc(orgaId)
                .collection("dokter_staf").doc(props.id)
                .set({
                    'staf': db.doc('/stafs/' + props.id),
                    'dokter': db.doc('/dokters/' + data.dokter),
                }).catch(err => alert(err))
        } else {
            db.collection('orga_kliniks').doc(orgaId)
                .collection("dokter_staf").doc(props.id).delete()
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
                        <h2 style={{ marginLeft: 10 }} id="simple-modal-title">Detail Staf</h2>
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
                        <form className={classes.root} noValidate autoComplete="off" onSubmit={ubahStaf}>
                            <div className={classes.form} >
                                <div className={classes.formControl}>
                                    <input value={props.id} hidden disabled label="userId" />
                                    <TextField id="standard-basic" className={edit ? classes.formInputTrue : classes.formInput} value={data.nama} label="Nama" onChange={(e) => handleChange("nama", e.target.value)} />
                                    <TextField id="standard-basic" className={edit ? classes.formInputTrue : classes.formInput} value={data.alamat} label="Alamat" onChange={(e) => handleChange("alamat", e.target.value)} />
                                    {/* <TextField id="standard-basic" className={edit ? classes.formInputTrue : classes.formInput} value={data.tgl_lahir} label="Tanggal Lahir" onChange={(e) => handleChange("tgl_lahir", e.target.value)} /> */}
                                    <TextField
                                        id="date"
                                        className={edit ? classes.formInputTrue : classes.formInput}
                                        label="Tanggal tgl_lahir"
                                        type="date"
                                        defaultValue={data.tgl_lahir}
                                        onChange={(e) => handleChange("tgl_lahir", e.target.value)}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        required
                                    />
                                    {/* <TextField id="standard-basic" className={edit ? classes.formInputTrue : classes.formInput} value={data.jk} label="Jenis-Kelamin" onChange={(e) => handleChange("jk", e.target.value)} /> */}
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
                                    <TextField id="standard-basic" className={edit ? classes.formInputTrue : classes.formInput} value={data.noHp} label="No HP" onChange={(e) => handleChange("noHp", e.target.value)} />
                                    <TextField id="standard-basic" className={classes.formInput} value={data.email} label="Email" onChange={(e) => handleChange("email", e.target.value)} />
                                    {/* <TextField id="standard-basic" className={edit ? classes.formInputTrue : classes.formInput} value={data.bagian} label="Bagian" onChange={(e) => handleChange("bagian", e.target.value)} /> */}
                                    <FormControl className={edit ? classes.formInputTrue : classes.formInput}>
                                        <InputLabel htmlFor="age-native-simple">Staf Bagian</InputLabel>
                                        <Select
                                            native
                                            value={data.bagian}
                                            onChange={(e) => handleChangeBagian("bagian", e.target.value)}
                                            label="Staf Bagian"
                                            inputProps={{
                                                name: 'Staf Bagian',
                                                id: 'Staf_Bagian-native-simple',
                                            }}
                                            required
                                        >
                                            <option aria-label="None" value="" />
                                            <option value="Admin">Admin</option>
                                            <option value="Pendaftaran">Pendaftaran</option>
                                        </Select>
                                    </FormControl>
                                    {data.bagian === "Pendaftaran" && (
                                        <FormControl className={edit ? classes.formInputTrue : classes.formInput}>
                                            <InputLabel htmlFor="age-native-simple">Dokter</InputLabel>
                                            <Select
                                                native
                                                value={data.dokter}
                                                onChange={(e) => handleChange("dokter", e.target.value)}
                                                label="Staf dokter"
                                                inputProps={{
                                                    name: 'Staf dokter',
                                                    id: 'Staf_dokter-native-simple',
                                                }}
                                            >
                                                <option aria-label="None" value="belumAda" />
                                                <option value={props.dokterId} >{props.dokterNama}</option>
                                                {doktersBisa && (
                                                    doktersBisa.map((dokter) => (
                                                        <option key={dokter.id} value={dokter.id}>{dokter.nama}</option>
                                                    ))
                                                )}
                                                {/* <option value="Pendaftaran">Pendaftaran</option> */}
                                            </Select>
                                        </FormControl>
                                    )}
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

export default ModalDetail
