import React from 'react'
import { useSelector } from 'react-redux'
import { selectStafs } from '../../../features/orgaKlinik/orgaKlinikSilce'
import { selectUser } from '../../../features/user/userSlice'
import CardStaf from './CardStaf'
import ModalTambahStaff from './ModalTambahStaff'
import './staff.css'

function Staff() {
    const stafs = useSelector(selectStafs)
    const user = useSelector(selectUser)

    return (
        <div className="staff">
            <div className="staff__header">
                <h3>Halaman Staff</h3>
                <div className="staff__tambah">
                    <ModalTambahStaff user={user.userId} />
                </div>
            </div>

            <div className="staff__content">
                <h4>Staf Administrasi</h4>
                <div className="staff__content__admin">
                    {
                        stafs && stafs
                            .filter(res => res.data.bagian === "Admin")
                            .map((staf) => (
                                <CardStaf key={staf.id} id={staf.id} nama={staf.data.nama} bagian={staf.data.bagian} noHp={staf.data.noHp} foto={staf.data.foto} />
                            ))
                    }
                </div>
                <h4 style={{ marginTop: 10 }}>Staf Pendaftaran</h4>
                <div className="staff__content__admin">
                    {
                        stafs && stafs
                            .filter(res => res.data.bagian === "Pendaftaran")
                            .map((staf) => (
                                <CardStaf key={staf.id} id={staf.id} nama={staf.data.nama} bagian={staf.data.bagian} noHp={staf.data.noHp} foto={staf.data.foto} email={staf.data.email} />
                            ))
                    }
                </div>

            </div>
        </div>
    )
}

export default Staff
