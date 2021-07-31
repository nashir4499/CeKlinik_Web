import React from 'react'
import logo from '../img/logo.svg'
import { BottomNavigation, BottomNavigationAction } from '@material-ui/core'
import { useSelector } from 'react-redux'
import { selectUser } from '../../features/user/userSlice'
import { NavLink } from 'react-router-dom'
import { selectKlinik } from '../../features/orgaKlinik/orgaKlinikSilce'
import ModalLogout from './ModalLogout'

function Sidebar() {
    const user = useSelector(selectUser)
    const klinik = useSelector(selectKlinik)

    return (
        <div className="sidebar">
            <div className="sidebar__header">
                <img src={logo} alt="klinik" />
                <h5>{klinik.id !== 1 ? klinik.nama : "Klinik Bersalin"}</h5>
            </div>
            <div className="sidebar__content">
                <BottomNavigation
                    //   value={value}
                    //   onChange={(event, newValue) => {
                    //     setValue(newValue);
                    //   }}
                    //   className={classes.root}
                    className="sidebar__nav"
                    showLabels
                >
                    <BottomNavigationAction component={NavLink} to="/home" label="Beranda" icon={<i className="fas fa-home"></i>} />
                    <BottomNavigationAction component={NavLink} to="/klinik" label="Klinik" icon={<i className="fas fa-clinic-medical"></i>} />
                    {user && (user.bagian === "Pendaftaran" &&
                        <BottomNavigationAction component={NavLink} to="/pasien" label="Pasien" icon={<i className="fas fa-user-injured"></i>} />
                    )}
                    {user && (user.bagian === "Admin" &&
                        <BottomNavigationAction component={NavLink} to="/dokter" label="Dokter" icon={<i className="fas fa-user-md fa-lg"></i>} />
                    )}
                    {user.bagian === "Admin" &&
                        <BottomNavigationAction component={NavLink} to="/staff" label="Staf" icon={<i className="fas fa-user-nurse"></i>} />
                    }
                    {/* <BottomNavigationAction component={NavLink} to="/staff" label="Staf" icon={<i className="fas fa-user-nurse"></i>} /> */}

                </BottomNavigation>
            </div>
            <div className="sidebar__footer">
                <ModalLogout sidebar={true} />
            </div>
        </div>
    )
}

export default Sidebar
