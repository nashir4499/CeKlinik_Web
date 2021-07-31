import { Avatar, Button, CircularProgress, Checkbox, FormControl, FormControlLabel, InputLabel, makeStyles, Modal, Select, TextField, IconButton } from '@material-ui/core';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { firebase, auth, db, storageRef } from '../../../config/firebase';
import { getStafs, selectDokters, selectOrgaId } from '../../../features/orgaKlinik/orgaKlinikSilce';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import { Edit, Search } from '@material-ui/icons';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
// import './staff.css'

function getModalStyle() {
    //   const top = 50 + rand();
    //   const left = 50 + rand();
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
        // marginBottom: theme.spacing(1),
    },
    // textField: {
    //     marginLeft: theme.spacing(1),
    //     marginRight: theme.spacing(1),
    //     width: 200,
    // },
    // content: {
    //     display: "flex",
    //     flexDirection: "column",

    // }
}));

export default function ModalTambahStaff(props) {
    const orgaId = useSelector(selectOrgaId)
    const classes = useStyles();
    // getModalStyle is not a pure function, we roll the style only on the first render
    const [modalStyle] = useState(getModalStyle)
    const dispatch = useDispatch()
    const dokters = useSelector(selectDokters)
    const [open, setOpen] = useState(false)
    const [loadingImg, setLoadingImg] = useState(false)
    const [progresLoad, setProgresLoad] = useState(0)
    const [gambarSementara, setGambarSementara] = useState()
    const [errorPassword, setErrorPassword] = useState(false)
    const [doktersBisa, setDokterBisa] = useState([])
    const [data, setData] = useState({
        userId: "",
        nama: "",
        email: "",
        password: "",
        noHp: "",
        alamat: "",
        jk: "",
        tgl_lahir: "",
        bagian: "",
        foto: "",
        dokter: "",
    })
    const [dataAda, setDataAda] = useState(false)

    const handleOpen = () => {
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false)
        setGambarSementara()
        setDokterBisa([])
        setData({
            userId: "",
            nama: "",
            email: "",
            password: "",
            noHp: "",
            alamat: "",
            jk: "",
            tgl_lahir: "",
            bagian: "",
            foto: "",
            dokter: "",
        })
    }

    const handleChange = (nama, value) => {
        setData({
            ...data,
            [nama]: value,
        });
    };

    const handleChangeBagian = (nama, value) => {
        setData({
            ...data,
            [nama]: value,
        });
        if (value === "Pendaftaran") {
            dokters.forEach(dokter => {
                const dokterRef = db.collection('dokters').doc(dokter.id)
                db.collection("orga_kliniks").doc(orgaId)
                    .collection("dokter_staf")
                    .where("dokter", "==", dokterRef)
                    .get()
                    .then((querySnapshot) => {
                        if (querySnapshot.empty) {
                            setDokterBisa(doktersBisa => [...doktersBisa, {
                                id: dokter.id,
                                nama: dokter.data.nama,
                            }])
                        }
                    })
                    .catch(err => alert(err))
            })
        } else {
            setDokterBisa([])
        }
    };

    const cekRePassword = (e) => {
        if (e !== data.password) {
            setErrorPassword(true)
        } else {
            setErrorPassword(false)
        }
    }

    const cariData = () => {
        db.collection('stafs').where("email", "==", data.email).get()
            .then((querySnapshot) => {
                if (querySnapshot.empty) {
                    alert("Data Tidak Tersedia")
                    setData({
                        email: data.email,
                        userId: "",
                        nama: "",
                        jk: "",
                        alamat: "",
                        noHp: "",
                        tgl_lahir: "",
                        bagian: "",
                        foto: "",
                    })
                } else {
                    querySnapshot.forEach((doc) => {
                        setData({
                            email: data.email,
                            userId: doc.data().userId,
                            nama: doc.data().nama,
                            jk: doc.data().jk,
                            alamat: doc.data().alamat,
                            noHp: doc.data().noHp,
                            tgl_lahir: doc.data().tgl_lahir,
                            bagian: doc.data().bagian,
                            foto: doc.data().foto,
                        })
                    });
                }
            }).catch((err) => alert(err))
    }

    const onChangePhoto = (dataFile) => {
        setLoadingImg(true)
        // console.log(dataFile.target.files[0])
        if (dataFile.target.files[0].type === "image/jpeg" || dataFile.target.files[0].type === "image/png") {
            setGambarSementara(dataFile.target.files[0])
            const uploadTask = storageRef.child('profile/stafs/' + props.user + 'coba').put(dataFile.target.files[0])
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

    const tambahStaff = (e) => {
        e.preventDefault()
        if (dataAda) {
            const stafref = db.collection('stafs').doc(data.id)
            db.collection("orga_kliniks").where("stafs", "array-contains", stafref).get()
                .then((querySnapshot) => {
                    // console.log(querySnapshot)
                    if (querySnapshot.empty) {
                        db.collection('orga_kliniks').doc(orgaId).update({
                            stafs: firebase.firestore.FieldValue.arrayUnion(db.doc('/stafs/' + data.userId))
                        }).catch(err => alert(err))
                        db.collection('stafs').doc(data.userId).get()
                            .then(res => {
                                const orgaStafs = res.data()
                                const idStaf = res.id
                                const dataStaf = { id: idStaf, data: orgaStafs }
                                dispatch(getStafs(dataStaf))
                                handleClose()
                            })
                            .catch(err => alert(err))
                    } else {
                        alert("Staf Telah Atau Masih Terdaftar Di Suatu Klinik")
                    }
                })
                .catch(err => alert(err))
        } else {
            if (errorPassword !== true) {
                auth.createUserWithEmailAndPassword(data.email, data.password)
                    .then((userAuth) => {
                        if (gambarSementara === undefined) {
                            db.collection('stafs').doc(userAuth.user.uid).set({
                                'userId': userAuth.user.uid,
                                'email': data.email,
                                'nama': data.nama,
                                'jk': data.jk,
                                'alamat': data.alamat,
                                'noHp': data.noHp,
                                'tgl_lahir': data.tgl_lahir,
                                'bagian': data.bagian,
                                'foto': 'Belum'
                            }).catch(err => alert(err))
                            dispatch(getStafs({
                                id: userAuth.user.uid, data: {
                                    userId: userAuth.user.uid,
                                    email: data.email,
                                    nama: data.nama,
                                    jk: data.jk,
                                    alamat: data.alamat,
                                    noHp: data.noHp,
                                    tgl_lahir: data.tgl_lahir,
                                    bagian: data.bagian,
                                    foto: 'Belum'
                                }
                            }))
                        } else {
                            const uploadTask = storageRef.child('profile/stafs/' + userAuth.user.uid).put(gambarSementara)
                            uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED.length,
                                ((snapshot) => {
                                    setProgresLoad((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                                }), ((error) => {
                                    console.log(error.code)
                                }), (() => {
                                    uploadTask.snapshot.ref.getDownloadURL()
                                        .then((downloadURL) => {
                                            db.collection('stafs').doc(userAuth.user.uid).set({
                                                'userId': userAuth.user.uid,
                                                'email': data.email,
                                                'nama': data.nama,
                                                'jk': data.jk,
                                                'alamat': data.alamat,
                                                'noHp': data.noHp,
                                                'tgl_lahir': data.tgl_lahir,
                                                'bagian': data.bagian,
                                                'foto': downloadURL
                                            }).catch(err => alert(err))
                                            dispatch(getStafs({
                                                id: userAuth.user.uid, data: {
                                                    userId: userAuth.user.uid,
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
                                        });
                                })
                            );
                        }
                        db.collection('orga_kliniks').doc(orgaId).update({
                            stafs: firebase.firestore.FieldValue.arrayUnion(db.doc('/stafs/' + userAuth.user.uid))
                        })
                        db.collection('orga_kliniks').doc(orgaId)
                            .collection("dokter_staf").doc(userAuth.user.uid)
                            .set({
                                'staf': db.doc('/stafs/' + userAuth.user.uid),
                                'dokter': db.doc('/dokters/' + data.dokter),
                            }).catch(err => alert(err))
                        // db.collection('orga_klinik').doc()
                        // console.log(userAuth)
                        handleClose()
                    }).catch(error => {
                        alert(error)
                    })
            } else {
                alert("Re-Password Tidak Sesuai")
            }
        }

    }

    return (
        <div className="">
            <Button
                size="medium"
                className="staff_tombol"
                style={{ borderRadius: 50, }}
                variant="contained"
                color="primary"
                onClick={handleOpen}
                endIcon={<PersonAddIcon />}
            >
                Tambah Staf
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <div style={modalStyle} className={classes.paper}>
                    <div className="modal__tambah__staf">
                        <h2 id="simple-modal-title">Tambah Staf</h2>
                        <form className="add__form" onSubmit={tambahStaff}>
                            <div className={classes.formControlGambar}>
                                {loadingImg ?
                                    <CircularProgress variant="determinate" value={progresLoad} />
                                    :
                                    <>
                                        <Avatar alt="Remy Sharp" src={data.foto} className={classes.large} />

                                        <div className="input_gambar_tambah">
                                            <Edit className="input_gambar_icon" />
                                            <input className="input_gambar_file" type="file" name="profile" id="profile" onChange={onChangePhoto} />
                                        </div>
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
                                label={<p style={{ fontSize: 12, marginLeft: -5 }}>Staf Pernah Terdaftar Di Aplikasi</p>}
                            />
                            <div className="form__control">
                                <TextField className={classes.formControl} label="Nama" variant="outlined" type="text" size="small" value={data.nama} onChange={(e) => handleChange("nama", e.target.value)} required fullWidth disabled={dataAda ? true : false} />
                                {dataAda ? (
                                    <div className="dataAda_on">
                                        <div className="dataAda_on_kiri">
                                            <TextField className={classes.formControl} label="Email" variant="outlined" type="email" size="small" value={data.email} onChange={(e) => handleChange("email", e.target.value)} required fullWidth />
                                        </div>
                                        <div className="dataAda_on_kanan">
                                            <IconButton aria-label="delete" onClick={cariData}>
                                                <Search />
                                            </IconButton>
                                        </div>
                                    </div>
                                ) : (
                                    <TextField className={classes.formControl} label="Email" variant="outlined" type="email" size="small" value={data.email} onChange={(e) => handleChange("email", e.target.value)} required fullWidth />
                                )}
                            </div>
                            <div className="form__control">
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
                                {/* <div className="dropdown">
                            <Button variant="contained" color="primary" className="dropbtn">{data.jk ? data.jk : "Jenis Kelamin"}</Button>
                            <div className="dropdown-content">
                                <Button color="primary" fullWidth value="Laki-Laki" onClick={(e) => handleChange("jk", e.currentTarget.value)} >Laki-Laki</Button>
                                <Button color="primary" fullWidth value="Perempuan" onClick={(e) => handleChange("jk", e.currentTarget.value)}>Perempuan</Button>
                            </div>
                        </div> */}

                                <TextField
                                    id="date"
                                    label="Tanggal tgl_lahir"
                                    type="date"
                                    defaultValue="1999-01-01"
                                    onChange={(e) => handleChange("tgl_lahir", e.target.value)}
                                    // className={classes.textField}
                                    className={classes.formControl}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    required
                                    disabled={dataAda ? true : false}
                                />
                                <FormControl className={classes.formControl}>
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
                                        disabled={dataAda ? true : false}
                                    >
                                        <option aria-label="None" value="" />
                                        <option value="Admin">Admin</option>
                                        <option value="Pendaftaran">Pendaftaran</option>
                                    </Select>
                                </FormControl>
                                {/* <div className="dropdown">
                            <Button variant="contained" color="primary" className="dropbtn">{data.bagian ? data.bagian : "Staff Bagian"}</Button>
                            <div className="dropdown-content">
                                <Button color="primary" fullWidth value="Admin" onClick={(e) => handleChange("bagian", e.currentTarget.value)} >Admin</Button>
                                <Button color="primary" fullWidth value="Staff" onClick={(e) => handleChange("bagian", e.currentTarget.value)} >Staff</Button>
                            </div>
                        </div> */}
                            </div>
                            <div className="form__control">
                                <TextField className={classes.formControl} label="Password" variant="outlined" type="password" autoComplete="on" size="small" value={data.password} onChange={(e) => handleChange("password", e.target.value)} required={!dataAda ? true : false} fullWidth disabled={dataAda ? true : false} />
                                <TextField className={classes.formControl} label="Re-Password" error={errorPassword} variant="outlined" type="password" autoComplete="on" onBlur={(e) => cekRePassword(e.target.value)} size="small" required={!dataAda ? true : false} fullWidth helperText={errorPassword && "Re-Password tidak sesuai"} disabled={dataAda ? true : false} />
                            </div>
                            <div className="form__control__plus">
                                <TextField className={classes.formControl} label="noHp" variant="outlined" type="text" size="small" value={data.noHp} onChange={(e) => handleChange("noHp", e.target.value)} required disabled={dataAda ? true : false} fullWidth />
                                {data.bagian === "Pendaftaran" && (
                                    <FormControl className={classes.formControl}>
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
                                            required={!dataAda ? true : false}
                                            disabled={dataAda ? true : false}
                                        >
                                            <option aria-label="None" value="BelumAda" />
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
                            <TextField className={classes.formControl} label="alamat" variant="outlined" type="text" size="small" value={data.alamat} onChange={(e) => handleChange("alamat", e.target.value)} required disabled={dataAda ? true : false} />

                            <Button variant="contained" color="primary" fullWidth type="submit">Tambah Staff</Button>
                        </form>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
