import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { db } from '../../../config/firebase'
import { incrementLaporan } from '../../../features/laporanAdmin/laporanAdminSilce'
import { selectStafs } from '../../../features/orgaKlinik/orgaKlinikSilce'
import CardLAdmin from './CardLAdmin'

function SlideKananAdmin() {
    const stafs = useSelector(selectStafs)

    return (
        <div className="kanan__admin">
            <div className="jk__laporan__text">
                <h5>Laporan Mingguan Staf</h5>
            </div>
            {stafs && (
                stafs.filter(res => res.data.bagian === "Pendaftaran")
                    .map(staf => <GetLaporan key={staf.id} id={staf.id} nama={staf.data.nama} />)
            )}
            <hr />
        </div>
    )
}

const GetLaporan = (props) => {
    const [laporan, setLaporan] = useState({
        keys: null,
        tp: 0,
        tk: 0,
        pd: 0,
        pb: 0
    })
    const dispatch = useDispatch();

    useEffect(() => {
        db.collection('laporans').where(props.id, '!=', null).get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // if (doc.exists) {
                    const userGet = props.id
                    const datas = doc.data()[userGet]
                    const cekLength = Object.keys(datas).length
                    if (cekLength >= 7) {

                    } else {
                        let tp = 0, tk = 0, pd = 0, pb = 0, keys = null
                        for (const [key, value] of Object.entries(datas)) {
                            keys += key
                            tp += value.totalPasien
                            tk += value.totalKunjungan
                            pd += value.pasienDarurat
                            pb += value.pasienBatal
                        }
                        setLaporan({
                            keys: keys,
                            tp: tp,
                            tk: tk,
                            pd: pd,
                            pb: pb
                        })
                        dispatch(incrementLaporan({
                            id: props.id,
                            tp: tp,
                            tk: tk,
                            pd: pd,
                            pb: pb
                        }))

                    }
                });
            }).catch((error) => {
                console.log("Error getting document:", error);
            });
    }, [props.id, dispatch])

    return (
        <>
            <hr />
            <div style={{ margin: 5, textAlign: "start" }} className="">
                <h6>{props.nama}</h6>
            </div>
            <div className="hk__laporan__card" style={{ marginBottom: 10 }}>
                <CardLAdmin title="Total Pasien" nilai={laporan.tp} icon={<i className="fas fa-user-injured"></i>} color="rgba(0,0,255,0.8)" />
                <CardLAdmin title="Total Kunujungan" nilai={laporan.tk} icon={<i className="fas fa-hospital-user"></i>} color="rgba(0,180,0,1)" />
                <CardLAdmin title="Pasien Darurat" nilai={laporan.pd} icon={<i className="fas fa-procedures"></i>} color="rgba(230,120,0,1)" />
                <CardLAdmin title="Pasien Batal" nilai={laporan.pb} icon={<i className="fas fa-user-minus"></i>} color="rgba(230,0,0,0.8)" />
            </div>
        </>
    )
}

export default SlideKananAdmin
