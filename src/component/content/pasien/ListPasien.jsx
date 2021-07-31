import React, { useEffect } from 'react'
import { DataGrid } from '@material-ui/data-grid';
import { CircularProgress } from '@material-ui/core';
import ModalDelPas from './ModalDelPas';
import ModalEditPas from './ModalEditPas';
import { db } from '../../../config/firebase';
import { useSelector } from 'react-redux';
import { selectKlinik } from '../../../features/orgaKlinik/orgaKlinikSilce';
import { useState } from 'react';

function ListPasien(props) {
    const columns = [
        { field: 'no', headerName: 'No', width: 71 },
        { field: 'id', headerName: props.status === 'pasienTerdaftar' ? "ID" : "Nomor", width: 130 },
        { field: 'nama', headerName: 'Nama', width: 150 },
        { field: 'alamat', headerName: 'Alamat', width: 200 },
        { field: 'namaSuami', headerName: 'Nama Suami', width: 150 },
        { field: 'noHp', headerName: 'Nomor HP', width: 130 },
        { field: 'ttl', headerName: 'Tnggal Lahir', width: 135 },
        {
            field: '', headerName: 'Opsi',
            width: 90, renderCell: (params) => (
                <div style={{ display: "flex", flexDirection: "row" }}>
                    {/* {console.log(params.id)} */}
                    {/* <Button className="tmb_tab" variant="outlined" size="small" color="primary" >
                        <Edit style={{ fontSize: "12px", margin: 0, padding: 0 }} />
                    </Button> */}
                    <ModalEditPas id={params.id} status={props.status} updatePas={handleUpdate} />
                    <ModalDelPas data={params.row} status={props.status} updatePas={handleUpdate} />
                </div>
            ),
        },
    ];

    const klinik = useSelector(selectKlinik)
    const [pasienBTs, setPasienBTs] = useState([])
    const [loading, setLoading] = useState(false)
    const [updatePas, setUpdatePas] = useState(props.status === 'pasienTerdaftar' && props.updateTambah)

    const handleUpdate = () => {
        setUpdatePas(updatePas === true ? false : true)
    }

    useEffect(() => {
        setPasienBTs([])
        setLoading(true)
        // console.log(updatePas)
        db.collection('laporans').doc(klinik.id).collection(props.status)
            .get().then((querySnapshot => {
                if (!querySnapshot.empty) {
                    querySnapshot.forEach((doc) => {
                        const pasBt = { id: doc.id, data: doc.data() }
                        setPasienBTs(pasienBTs => [...pasienBTs, pasBt])
                    });
                    setLoading(false)
                } else {
                    setLoading(false)
                }
            })).catch(err => alert(err))
    }, [props.status, klinik.id, updatePas, props.updateTambah])
    var no = 1
    return (
        <div className="pasien__list">
            {loading ?
                <CircularProgress />
                :
                <DataGrid
                    // pageSize={props.pasien.length - 1}
                    pageSize={5}
                    rowHeight={35}
                    headerHeight={35}
                    columns={columns}
                    hideFooter
                    rows={pasienBTs.map((res) => {

                        return {
                            no: no++,
                            id: res.id,
                            nama: res.data.nama,
                            alamat: res.data.alamat,
                            namaSuami: res.data.namaSuami,
                            noHp: res.data.noHp,
                            ttl: res.data.ttl,
                        }
                    }
                    )}
                // rows={props.pasien.map((res) => (
                //     {
                //         id: res.id,
                //         nama: res.data.nama,
                //         alamat: res.data.alamat
                //     })
                // )}
                />
            }
            {/* {console.log(props.pasien)} */}
        </div>
    )
}

export default ListPasien
