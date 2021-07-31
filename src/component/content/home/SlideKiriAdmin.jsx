import React from 'react'
import { useSelector } from 'react-redux'
import { selectLaporanAdmin } from '../../../features/laporanAdmin/laporanAdminSilce'
import CardLaporan from './CardLaporan'

function SlideKiriAdmin() {
    const laporanAdmin = useSelector(selectLaporanAdmin)

    return (
        <div className="hk__laporan">
            <div className="jk__laporan__text">
                <h5>Laporan Mingguan Keseluruhan</h5>
            </div>
            <div className="hk__laporan__card">
                <CardLaporan title="Total Pasien" nilai={laporanAdmin.tp} icon={<i className="fas fa-user-injured"></i>} color="rgba(0,0,255,0.8)" />
                <CardLaporan title="Total Kunujungan" nilai={laporanAdmin.tk} icon={<i className="fas fa-hospital-user"></i>} color="rgba(0,180,0,1)" />
                <CardLaporan title="Pasien Darurat" nilai={laporanAdmin.pd} icon={<i className="fas fa-procedures"></i>} color="rgba(230,120,0,1)" />
                <CardLaporan title="Pasien Batal" nilai={laporanAdmin.pb} icon={<i className="fas fa-user-minus"></i>} color="rgba(230,0,0,0.8)" />
            </div>
        </div>
    )
}

export default SlideKiriAdmin
