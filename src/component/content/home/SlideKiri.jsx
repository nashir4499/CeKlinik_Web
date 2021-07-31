import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { db } from '../../../config/firebase'
import { selectKlinik } from '../../../features/orgaKlinik/orgaKlinikSilce'
import { selectUser } from '../../../features/user/userSlice'
import CardLaporan from './CardLaporan'

function SlideKiri() {
    const user = useSelector(selectUser)
    const klinik = useSelector(selectKlinik)
    const [laporan, setLaporan] = useState({
        keys: null,
        tp: 0,
        tk: 0,
        pd: 0,
        pb: 0
    })

    useEffect(() => {
        let mounted = true; //Agar Terhindar dari Warning: Can't perform a React state update on an unmounted component. This is a no-op,
        db.collection('laporans').doc(klinik.id).get()
            .then((doc) => {
                if (mounted) {
                    if (doc.exists) {
                        const userGet = user.userId
                        const datas = doc.data()[userGet]
                        // const cekLength = Object.keys(datas).length
                        const waktu = new Date().getDate()
                        let tp = 0, tk = 0, pd = 0, pb = 0, keys = null
                        for (const [key, value] of Object.entries(datas)) {
                            // console.log(waktu - new Date(key).getDate() <= 7)
                            if (waktu - new Date(key).getDate() >= 7) {
                                return null
                            } else {
                                keys += key
                                tp += value.totalPasien
                                tk += value.totalKunjungan
                                pd += value.pasienDarurat
                                pb += value.pasienBatal
                                setLaporan({
                                    keys: keys,
                                    tp: tp,
                                    tk: tk,
                                    pd: pd,
                                    pb: pb
                                })
                            }
                        }
                    } else {
                        console.log("No such document!");
                    }
                }
            }).catch((error) => {
                console.log("Error getting document:", error);
            });
        return () => mounted = false;
    }, [klinik.id, user.userId])



    return (
        <div className="hk__laporan">
            <div className="jk__laporan__text">
                <h5>Laporan Mingguan</h5>
            </div>
            <div className="hk__laporan__card">
                <CardLaporan title="Total Pasien" nilai={laporan.tp} icon={<i className="fas fa-user-injured"></i>} color="rgba(0,0,255,0.8)" />
                <CardLaporan title="Total Kunujungan" nilai={laporan.tk} icon={<i className="fas fa-hospital-user"></i>} color="rgba(0,180,0,1)" />
                <CardLaporan title="Pasien Darurat" nilai={laporan.pd} icon={<i className="fas fa-procedures"></i>} color="rgba(230,120,0,1)" />
                <CardLaporan title="Pasien Batal" nilai={laporan.pb} icon={<i className="fas fa-user-minus"></i>} color="rgba(230,0,0,0.8)" />
            </div>
        </div>
    )
}

export default SlideKiri
