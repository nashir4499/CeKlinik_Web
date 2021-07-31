import React from 'react'
import { useSelector } from 'react-redux'
import { selectDokters } from '../../../features/orgaKlinik/orgaKlinikSilce'
import CardDokter from './CardDokter'
import './dokter.css'
import MTDokter from './MTDokter'

function Dokter() {
    const dokters = useSelector(selectDokters)
    return (
        <div className="dokter">
            <div className="dokter__header">
                <h3>List Dokter</h3>
                <MTDokter />
            </div>
            <div className="dokter__content">
                {dokters && dokters.map((dokter) => (
                    <CardDokter key={dokter.id} id={dokter.id} nama={dokter.data.nama} kdSp={dokter.data.kd_spesialis} foto={dokter.data.foto} />
                ))}
            </div>
        </div>
    )
}

export default Dokter
