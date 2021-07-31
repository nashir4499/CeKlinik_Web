import { LocalHospital } from '@material-ui/icons'
import React from 'react'

function SideKiri() {
    return (
        <div className="side__kiri">
            <div className="kiri__header">
                <LocalHospital color="secondary" />
                <h4>Ce<span>Klinik</span></h4>
            </div>
            <div className="kiri__content">
                <h1>Selamat Datang Di Ce<span>Klinik</span></h1>
                <p>Silahkan masuk <br /> untuk melanjutkan akses</p>
            </div>
            <div className="kiri__footer">
                <p><b>Aplikasi Pendaftaran Klinik</b></p>
            </div>
        </div>
    )
}

export default SideKiri
