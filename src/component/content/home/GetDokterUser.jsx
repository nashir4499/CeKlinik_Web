import React, { useEffect, useState } from 'react'
import { Avatar, Button, CircularProgress, FormControl, IconButton, InputLabel, makeStyles, Modal, Select, TextField } from '@material-ui/core'
import { Close } from '@material-ui/icons';
import { db } from '../../../config/firebase';
import { useSelector } from 'react-redux';
import { selectOrgaId } from '../../../features/orgaKlinik/orgaKlinikSilce';

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

function GetDokterUser(props) {
    const orgaKlinik = useSelector(selectOrgaId)
    const [dokter, setDokter] = useState({
        loading: true,
        foto: "",
        id: "",
        nama: ""
    })
    const classes = useStyles();
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);
    const [data, setData] = useState({
        noSTR: "",
        nama: "",
        jk: "",
        kd_spesialis: "",
        kualifikasi: "",
        foto: "",
    })
    const [loading, setLoading] = useState(false)

    const handleOpen = () => {
        setOpen(true)
        setLoading(true)
        db.collection('dokters').doc(dokter.id).get()
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
            .catch(err => {
                alert(err)
                setLoading(false)
            })


    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (nama, value) => {
        setData({
            ...data,
            [nama]: value,
        });
    }

    useEffect(() => {
        let mounted = true; //Agar Terhindar dari Warning: Can't perform a React state update on an unmounted component. This is a no-op,
        orgaKlinik &&
            db.collection("orga_kliniks").doc(orgaKlinik)
                .collection("dokter_staf").doc(props.id).get()
                .then((doc) => {
                    if (mounted) {
                        if (doc.exists) {
                            // console.log(doc.id, doc.data())
                            let getData = doc.data()
                            getData.dokter.get().then(res => {
                                // console.log(res.id, res)
                                if (res.exists) {
                                    props.getDok(res.data().nama)
                                    setDokter({
                                        foto: res.data().foto,
                                        id: res.id,
                                        nama: res.data().nama,
                                    })
                                }
                            })

                        } else {
                            setDokter({
                                foto: "",
                                id: "",
                                nama: ""
                            })
                        }
                    }
                }).catch(err => alert(err))

        return () => mounted = false;
    }, [orgaKlinik, props])

    return (
        <div className="">
            <Button className="homeH__dokter__content" onClick={handleOpen}>
                {dokter.loading ?
                    <CircularProgress size={14} /> :
                    <>
                        <Avatar src={dokter && dokter.foto} alt={dokter && dokter.nama} />
                        <div className="home__header__text">
                            <h4>{dokter && dokter.nama}</h4>
                            <p>Dokter</p>
                        </div>
                    </>
                }
            </Button>
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
                            <IconButton size="small" color="secondary" style={{ marginLeft: 10 }} onClick={handleClose}>
                                <Close />
                            </IconButton>
                        </div>
                    </div>
                    {loading ?
                        <CircularProgress />
                        :
                        <form className={classes.root} noValidate autoComplete="off" >
                            <div className={classes.form} >
                                <div className={classes.formControl}>
                                    <input value={props.id} hidden disabled label="userId" />
                                    <TextField id="standard-basic" className={classes.formInput} value={data.nama} label="Nama" onChange={(e) => handleChange("nama", e.target.value)} />
                                    <FormControl className={classes.formInput}>
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
                                    <TextField id="standard-basic" className={classes.formInput} value={data.kd_spesialis} label="Kode Spesialis" onChange={(e) => handleChange("kd_spesialis", e.target.value)} />
                                    <TextField id="standard-basic" className={classes.formInput} value={data.kualifikasi} label="Kualifikasi" onChange={(e) => handleChange("kualifikasi", e.target.value)} />
                                </div>
                                <div className={classes.formControlGambar}>
                                    <Avatar alt={data.nama} src={data.foto} className={classes.large} />
                                </div>
                            </div>
                        </form>
                    }
                </div>
            </Modal>
        </div>
    )
}

export default GetDokterUser
