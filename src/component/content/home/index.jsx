import { Avatar, Button } from '@material-ui/core'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../features/user/userSlice'
import Antrian from './Antrian'
import './home.css'
import SlideKananAdmin from './SlideKananAdmin'
import SlideKiri from './SlideKiri'
import ghkheader from '../../img/doctors.svg'
import SlideKiriAdmin from './SlideKiriAdmin'
import GetDokterUser from './GetDokterUser'
import GetUserInfo from './GetUserInfo'
import UbahPass from './UbahPass'
import ModalLogout from '../ModalLogout'

function Home() {
    const user = useSelector(selectUser)
    const [waktu, setWaktu] = useState(new Date())
    const [menuDropDown, setMenuDropDown] = useState(null);
    const [dokter, setDokter] = useState()

    const cekDokter = (value) => {
        setDokter(value)
    }

    useEffect(() => {
        // setInterval(() => setWaktu(new Date().toLocaleTimeString()), 1000)
        // move clean up function to here:
        var timerID = setInterval(() => trikWaktu(), 1000);
        return function cleanup() {
            clearInterval(timerID);
        };

    }, [])

    const trikWaktu = () => {
        setWaktu(new Date())
    }


    return (
        <div className="home">
            {menuDropDown &&
                <div className="untukClose" onClick={() => setMenuDropDown(false)}>
                </div>
            }
            <div className="home__kiri">
                <div className="home__header__kiri">
                    <div className="home__title">
                        <h3>Beranda</h3>
                    </div>
                    <div className="home__date">
                        <h5>{new Date().toISOString().substring(0, 10)} {waktu.toLocaleTimeString()}</h5>
                    </div>
                </div>
                <div className="hk">
                    <div className="hk__header">
                        <div className="hk_header_text">
                            <h3 style={{ fontSize: "1.5vw" }}>Selamat Siang, {user.nama}</h3>
                            <p style={{ fontSize: "1.2vw" }}>Semoga hari anda di tempat kerja menyenangkan </p>
                        </div>
                        <img className="hkh_gambar" src={ghkheader} alt="" />
                    </div>

                    {user && (user.bagian === "Pendaftaran" ?
                        <SlideKiri /> :
                        <SlideKiriAdmin />
                    )}
                </div>
            </div>

            <div className="home__kanan">
                <div className="home__header__kanan">
                    <div className="home__header__dokter">
                        {user && (user.bagian === "Pendaftaran" &&
                            <GetDokterUser id={user.userId} getDok={cekDokter} />
                        )}
                    </div>
                    <div className="home__user">
                        <Button className="home__user__btn" onClick={!menuDropDown ? () => setMenuDropDown(true) : () => setMenuDropDown(false)}>
                            <div className="home__header__text">
                                <h4>{user && user.nama}</h4>
                                <p>Staf {user && user.bagian}</p>
                            </div>
                            <Avatar src={user.foto} alt={user.nama} />
                        </Button>
                        <div className={menuDropDown ? "dropdown-content" : "dropdown-content-hide"}>
                            <GetUserInfo id={user.userId} dokterNama={dokter} />
                            <UbahPass id={user.userId} email={user.email} />
                            <ModalLogout />
                        </div>
                    </div>
                </div>
                {user && user.bagian === "Pendaftaran" ?
                    <Antrian /> :
                    <SlideKananAdmin />
                }
                {/* <ListAntrian /> */}
            </div>
        </div>
    )
}

export default Home
