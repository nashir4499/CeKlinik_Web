import React, { useState } from 'react'
// import { useSelector } from 'react-redux'
// import { selectKlinik } from '../../../features/orgaKlinik/orgaKlinikSilce'
// import { db } from '../../../config/firebase'
// import ListPasien from './ListPasien'
import './pasien.css'
import ListPasien from './ListPasien'
import { Button } from '@material-ui/core'
import ModalTamPasien from './ModalTamPasien'

function Pasien() {
    // const klinik = useSelector(selectKlinik)
    // const [pasienBTs, setPasienBTs] = useState([])
    const [pasienPilih, setPasienPilih] = useState(true)
    const [updateList, setUpdateList] = useState(true)
    const handleUpdate = () => {
        setUpdateList(updateList === true ? false : true)
    }
    // useEffect(() => {

    // }, [klinik.id])

    return (
        <div className="pasien">
            <div className="pasien__header">
                <div className="pasien_header_kiri">
                    <h4>Halaman Pasien</h4>
                </div>
                <div className="pasien_header_kanan">

                </div>
            </div>
            <div className="pasien__content">
                <div className="pasein__content__header">
                    <Button className="tombol" style={{ margin: "0px 10px 0px 10px" }} variant="contained" color={pasienPilih ? "primary" : "default"} onClick={() => setPasienPilih(true)} >
                        Pasien Terdaftar
                    </Button>
                    <Button className="tombol" style={{ marginRight: 10 }} variant="contained" color={!pasienPilih ? "primary" : "default"} onClick={() => setPasienPilih(false)}>
                        Pasien Belum Terdaftar
                    </Button>
                    {
                        pasienPilih &&
                        <ModalTamPasien updatePas={handleUpdate} />
                    }
                </div>
                <div className="pasein__content__list">
                    {pasienPilih ?
                        <ListPasien status="pasienTerdaftar" updateTambah={updateList} />
                        :
                        // pasienBTs.length !== 0 && (
                        <ListPasien status="pasienBelumTerdaftar" />
                    }
                </div>
                {/* {pasienBTs && pasienBTs.map(pasienBT =>
                <ListPasien key={pasienBT.id} id={pasienBT.id} pasien={pasienBT.data} />
                )} */}
                {/* <ListPasien pasien="as" /> */}
            </div>
        </div>
    )
}

export default Pasien
