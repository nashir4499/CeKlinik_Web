import { Button, CircularProgress, makeStyles, TextField } from '@material-ui/core'
import { Close, SkipNext } from '@material-ui/icons';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import React, { useEffect } from 'react'
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { db, dbRef } from '../../../config/firebase';
import { selectKlinik } from '../../../features/orgaKlinik/orgaKlinikSilce';
import { selectUser } from '../../../features/user/userSlice';
import ListAntrian from './ListAntrian';
import NomorAntrian from './NomorAntrian';
import TambahAntrian from './TambahAntrian';


const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1),
    },
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '100%',
        },
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
}));

function Antrian() {
    const classes = useStyles();
    const klinik = useSelector(selectKlinik)
    const user = useSelector(selectUser)
    // const dokter = useSelector(selectDokters)
    const [buka, setBuka] = useState(false)
    const [jumlahAntrian, setJumlahAntrian] = useState('')
    const [antrian, setAntrian] = useState()
    // const [pasien, setPasien] = useState({
    //     nama: '',
    //     alamat: '',
    //     noHp: '',
    //     namaSuami: ''
    // })
    const [loading, setLoading] = useState(true)

    // const fbAntrian = dbRef.ref('antrian').child(klinik.id).child(user.userId)
    const [fbAntrian, setfbAntrian] = useState('')
    // const [lapPasien, setLapPasien] = useState()

    // console.log(klinik.id)

    useEffect(() => {
        let mounted = true; //Agar Terhindar dari Warning: Can't perform a React state update on an unmounted component. This is a no-op,
        setLoading(true)
        setfbAntrian(dbRef.ref('antrian').child(klinik.id).child(user.userId))
        dbRef.ref('antrian').child(klinik.id).child(user.userId).on('value', (snapshot) => {
            if (mounted) {
                if (snapshot.val() !== null) {
                    setAntrian(snapshot.val())
                    setBuka(true)
                    setLoading(false)
                } else {
                    setBuka(false)
                    setLoading(false)
                }
            }
        });
        return () => mounted = false;
        // console.log(pasien.nama)
    }, [klinik, user])



    const bukaPendaftaran = (e) => {
        e.preventDefault()
        fbAntrian.set({
            dokter: 'QmlJVDDBfydQj5XuqXdV',
            jumlahAntrian: jumlahAntrian,
            antrianBerjalan: 0,
            pasienTerdaftar: 0,
            // pasienTerlewat: [null],
            // pasien: [null],
            tanggal: new Date(),
        }).catch(err => alert(err))

        fbAntrian.on('value', async (snapshot) => {
            try {
                await setAntrian(snapshot.val())
            } catch (err) {
                alert(err)
            }
        });
        setBuka(true)
    }

    async function sendPushNotification(expoPushToken, kondisi) {
        console.log(kondisi)
        const message = {
            to: expoPushToken,
            sound: 'default',
            title: 'Antrian Sudah Dekat',
            body: 'Segera Datang Ke Klinik!',
            data: { someData: 'goes here' },
        };

        await fetch('https://exp.host/--/api/v2/push/send', {
            mode: 'no-cors',
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        });
    }

    const lanjut = () => {
        // Push Nitifikasi
        // console.log(antrian.pasien[antrian.antrianBerjalan])

        if (antrian.statusDarurat) {
            fbAntrian.child('statusDarurat').set(null).catch(err => alert(err))
        }
        if (antrian.antrianBerjalan + 1 <= antrian.pasienTerdaftar) {
            // Push Nitifikasi
            if (antrian.pasien[antrian.antrianBerjalan] !== undefined) {
                // console.log(antrian.pasien[antrian.antrianBerjalan].nomor)
                fbAntrian.child('pasien')
                    .orderByChild('nomor')
                    .startAt(antrian.pasien[antrian.antrianBerjalan].nomor + 1)
                    .endAt(antrian.pasien[antrian.antrianBerjalan].nomor + 6)
                    .once('value', (snapshot) => {
                        // console.log(snapshot.val())
                        for (const data of Object.entries(snapshot.val())) {
                            // console.log(data[1]) // array 0 = key array 1 = value
                            // console.log(data[1].token) // array 0 = key array 1 = value
                            if (data[1].token !== undefined) {
                                sendPushNotification(data[1].token, "Lanjut")
                            }
                        }
                    });
                fbAntrian.child('pasien').child(antrian.pasien[antrian.antrianBerjalan].nomor)
                    .update({
                        statusBaru: "Selesai"
                    }).catch(err => alert(err))
            }
            fbAntrian.update({
                antrianBerjalan: antrian.antrianBerjalan + 1
            }).catch(err => alert(err))
        } else if (antrian.antrianBerjalan + 1 > antrian.jumlahAntrian) {
            alert("Antrian sudah memenuhi kuota")
            if (antrian.pasien[antrian.antrianBerjalan] !== undefined) {
                fbAntrian.child('pasien').child(antrian.pasien[antrian.antrianBerjalan].nomor)
                    .update({
                        statusBaru: "Selesai"
                    }).catch(err => alert(err))
            }
        } else {
            alert("Pasien belum ada yang mendaftar lagi")
            if (antrian.pasien[antrian.antrianBerjalan] !== undefined) {
                fbAntrian.child('pasien').child(antrian.pasien[antrian.antrianBerjalan].nomor)
                    .update({
                        statusBaru: "Selesai"
                    }).catch(err => alert(err))
            }
        }
    }

    const lewat = () => {

        if (antrian.statusDarurat) {
            fbAntrian.child('statusDarurat').set(null).catch(err => alert(err))
        }
        if (antrian.antrianBerjalan !== 0) {
            const pasien = antrian.pasien[antrian.antrianBerjalan]
            if (antrian.antrianBerjalan + 1 <= antrian.pasienTerdaftar) {
                if (window.confirm(`Anda yakin ingin melewati antrian pasien nomor ${antrian.antrianBerjalan} dengan nama ${pasien.nama}?`)) {

                    // Push Nitifikasi
                    if (antrian.pasien[antrian.antrianBerjalan] !== undefined) {
                        fbAntrian.child('pasien').orderByChild('nomor')
                            .startAt(antrian.pasien[antrian.antrianBerjalan].nomor + 1).endAt(antrian.pasien[antrian.antrianBerjalan].nomor + 6)
                            .once('value', (snapshot) => {
                                // console.log(snapshot.val())
                                for (const data of Object.entries(snapshot.val())) {
                                    // console.log(data[1]) // array 0 = key array 1 = value
                                    if (data[1].token !== undefined) {
                                        sendPushNotification(data[1].token, "Lewat1")
                                    }
                                }
                            });
                        fbAntrian.child('pasien').child(antrian.pasien[antrian.antrianBerjalan].nomor)
                            .update({
                                statusBaru: "Terlewat"
                            }).catch(err => alert(err))
                    }

                    fbAntrian.child("pasienTerlewat").child(antrian.antrianBerjalan).set({
                        nama: pasien.nama,
                        alamat: pasien.alamat,
                        namaSuami: pasien.namaSuami,
                        noHp: pasien.noHp,
                    }).catch(err => alert(err))
                    fbAntrian.update({
                        antrianBerjalan: antrian.antrianBerjalan + 1
                    }).catch(err => alert(err))
                }
            } else if (antrian.antrianBerjalan + 1 > antrian.jumlahAntrian || antrian.antrianBerjalan + 1 > antrian.pasienTerdaftar) {
                if (window.confirm(`Anda yakin ingin melewati antrian pasien nomor ${antrian.antrianBerjalan} dengan nama ${pasien.nama}?`)) {

                    // Push Nitifikasi
                    if (antrian.pasien[antrian.antrianBerjalan] !== undefined) {
                        fbAntrian.child('pasien').orderByChild('nomor')
                            .startAt(antrian.pasien[antrian.antrianBerjalan].nomor + 1).endAt(antrian.pasien[antrian.antrianBerjalan].nomor + 6)
                            .once('value', (snapshot) => {
                                // console.log(snapshot.val())
                                for (const data of Object.entries(snapshot.val())) {
                                    // console.log(data[1]) // array 0 = key array 1 = value
                                    if (data[1].token !== undefined) {
                                        sendPushNotification(data[1].token, "Lewat2")
                                    }
                                }
                            });
                        fbAntrian.child('pasien').child(antrian.pasien[antrian.antrianBerjalan].nomor)
                            .update({
                                statusBaru: "Terlewat"
                            }).catch(err => alert(err))
                    }

                    fbAntrian.child("pasienTerlewat").child(antrian.antrianBerjalan).set({
                        nama: pasien.nama,
                        alamat: pasien.alamat,
                        namaSuami: pasien.namaSuami,
                        noHp: pasien.noHp,
                    }).catch(err => alert(err))
                    alert("Pasien Terlewat telah di tambahkan")
                }
            } else {
                alert("Pasien belum ada yang mendaftar lagi")
                if (antrian.pasien[antrian.antrianBerjalan] !== undefined) {
                    fbAntrian.child('pasien').child(antrian.pasien[antrian.antrianBerjalan].nomor)
                        .update({
                            statusBaru: "Terlewat"
                        }).catch(err => alert(err))
                }
            }
        } else {
            alert("Harap pilih lanjut terlebih dahulu")
        }

    }

    const tutupPendaftaran = () => {
        // if (antrian.antrianBerjalan < antrian.pasienTerdaftar) {
        if (antrian.antrianBerjalan < antrian.pasienTerdaftar) {
            alert("Pasien belum diperiksa semua")
        } else {
            if (window.confirm("Anda yakin ingin menutup antrian pendaftaran?")) {
                dbRef.ref('antrian').child(klinik.id).child(user.userId).once('value')
                    .then((snap) => {
                        const data = snap.val();
                        // const Data_Baru = user.userId
                        const lapTitle = "Laporan_" + user.userId
                        let lapPasien = { pasien: data.pasien, pasienTerlewat: data.pasienTerlewat }
                        const newTitle = new Date().toISOString().substring(0, 10) + "-" + user.userId
                        const dataBaru = { [newTitle]: data }
                        const update = {}
                        update[user.userId] = null
                        // update[newTitle] = data
                        update[lapTitle] = dataBaru
                        // console.log(update)
                        // console.log(Object.assign({}, data.pasien))
                        dbRef.ref('antrian').child(klinik.id).update(update)
                        // Masuk Ke FireStore
                        const judul = new Date().toISOString().substring(0, 10)
                        const dataStore = {
                            totalPasien: antrian.pasienTerdaftar,
                            totalKunjungan: antrian.pasienTerlewat !== undefined ? antrian.pasienTerdaftar - Object.keys(antrian.pasienTerlewat).length : antrian.pasienTerdaftar,
                            pasienDarurat: antrian.pasien.filter(x => x.status === 'Segerakan').length,
                            pasienBatal: antrian.pasienTerlewat !== undefined ? Object.keys(antrian.pasienTerlewat).length : 0,
                            pasien: Object.assign({}, data.pasien),
                            listPasienBatal: data.pasienTerlewat !== undefined ? data.pasienTerlewat : 0,
                        }
                        // console.log(dataStore)
                        const bungkus = {}
                        bungkus[judul] = dataStore
                        const buatData = {}
                        buatData[user.userId] = bungkus
                        // console.log(buatData)
                        db.collection('laporans').doc(klinik.id).set(buatData, { merge: true }).catch(err => alert(err))
                        // db.collection('laporans').doc(klinik.id).update(buatData).catch(err => alert(err))
                        lapPasien.pasien.forEach(pasienNya => {
                            // console.log(pasienNya)
                            // console.log(pasienNya.pasienId)
                            if (!pasienNya.pasienId) {
                                if (pasienNya.id) {
                                    db.collection('laporans').doc(klinik.id).collection("pasienTerdaftar")
                                        .where('id', '==', pasienNya.id).get().then(querySnapshot => {
                                            // console.log(querySnapshot)
                                            if (querySnapshot.empty === true) {
                                                db.collection('laporans').doc(klinik.id).collection("pasienBelumTerdaftar").doc(pasienNya.noHp)
                                                    .set(pasienNya).catch(err => alert(err))
                                            }
                                        }).catch(err => alert(err))
                                } else {
                                    db.collection('laporans').doc(klinik.id).collection("pasienBelumTerdaftar").doc(pasienNya.noHp)
                                        .set(pasienNya).catch(err => alert(err))
                                }
                            }
                        });
                    }).catch((err) => alert(err))
                // setBuka(false)
            }
        }
    }

    return (
        <div className="antrian">
            {loading ?
                <CircularProgress />
                : buka ? (
                    <div className="antrian__content">

                        <div className="antrian__opsi">
                            <div className="antrian__nomber">
                                <div className="nomber__header">
                                    <h5>Jumlah Antrian {antrian.pasienTerdaftar}/{antrian.jumlahAntrian} <i className="fas fa-edit"></i></h5>
                                    {/* <input type="text" placeholder={`Jumlah Antrian ${antrian.jumlahAntrian}`} /> */}
                                    {/* <button className=""><i className="fas fa-edit"></i></button> */}
                                </div>
                                {/* {console.log(antrian.pasien !== undefined)} */}
                                {/* {antrian.pasien !== undefined &&
                                    <NomorAntrian noAntrian={antrian.antrianBerjalan}
                                        pasien={antrian.antrianBerjalan !== 0 ? antrian.pasien[antrian.antrianBerjalan]
                                            : { nama: "", alamat: "" }}
                                    />} */}
                                {antrian.pasien !== undefined &&
                                    (antrian.statusDarurat !== undefined || null || 0 ?
                                        <NomorAntrian noAntrian={antrian.antrianBerjalan} statusDarurat={true}
                                            pasien={antrian.antrianBerjalan !== 0 ? antrian.pasien[antrian.statusDarurat]
                                                : { nama: "", alamat: "" }}
                                        /> :
                                        <NomorAntrian noAntrian={antrian.antrianBerjalan}
                                            pasien={antrian.antrianBerjalan !== 0 ? antrian.pasien[antrian.antrianBerjalan]
                                                : { nama: "", alamat: "" }}
                                        />
                                    )
                                }

                            </div>

                            <div className="antrian__tombol">
                                <Button variant="contained" color="primary" className={classes.button} endIcon={<NavigateNextIcon />} onClick={lanjut}>
                                    Lanjut
                                </Button>
                                <Button variant="contained" color="default" className={classes.button} endIcon={<SkipNext />} onClick={lewat}>
                                    Lewat
                                </Button>
                                <TambahAntrian antrian={antrian} />
                                <Button variant="contained" color="secondary" className={classes.button} endIcon={<Close />} onClick={tutupPendaftaran} >
                                    Tutup
                                </Button>
                            </div>
                        </div>

                        <div className="antrian__content__list">

                            {antrian.pasien !== undefined &&
                                <ListAntrian pasien={antrian.pasien} />
                            }
                        </div>

                    </div>
                ) : (
                    <div className="antrian__buka" onSubmit={bukaPendaftaran}>
                        <div className="antrian__buka__content">
                            <h5 style={{ color: "grey" }}>Silahkan masukkan jumlah antrian yang akan dibuka</h5>
                            <form className="antrian__form" action="">
                                <TextField id="standard-basic" label="Jumlah Antrian"
                                    style={{ margin: 10 }}
                                    type="number" value={jumlahAntrian} required
                                    onChange={(e) => setJumlahAntrian(e.target.value)}
                                />
                                <Button style={{ margin: 10 }} variant="outlined" type="submit">
                                    Buka Antrian
                                </Button>
                            </form>
                        </div>
                    </div>
                )}
        </div>
    )
}

export default Antrian
