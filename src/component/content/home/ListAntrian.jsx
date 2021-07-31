
import { DataGrid } from '@material-ui/data-grid';
import React from 'react'
import ModalSegerakan from './ModalSegerakan';
import PasienDetail from './PasienDetail';

function ListAntrian(props) {
    const columns = [
        { field: 'id', headerName: 'No', width: 71 },
        {
            field: 'status', headerName: 'Status', width: 100,
            renderCell: (params) => (
                <div style={{ display: "flex", flexDirection: "row" }}>
                    {params.row.status === "Menunggu" || params.row.status === "Selesai" ?
                        <div className="colMenunggu"
                            style={params.row.status === "Selesai" ? { backgroundColor: "rgb(90, 90, 90)" } : { backgroundColor: "rgb(0, 200, 0)" }}>
                            {params.row.status}
                        </div>
                        :
                        // <Button className="colSegera">Segerakan</Button>
                        <ModalSegerakan id={params.id} data={params.row} status={params.row.status} />
                    }
                </div>
            ),
        },
        { field: 'nama', headerName: 'Nama', width: 130 },
        { field: 'alamat', headerName: 'Alamat', width: 130 },
        {
            field: '', headerName: 'Opsi',
            width: 90, renderCell: (params) => (
                <div style={{ display: "flex", flexDirection: "row" }}>
                    <PasienDetail id={params.id} data={params.row} />
                </div>
            ),
        },
        // {
        //     field: 'age',
        //     headerName: 'Age',
        //     type: 'number',
        //     width: 90,
        // },
        // {
        //     field: 'fullName',
        //     headerName: 'Full name',
        //     description: 'Kolom ini untuk opsi',
        //     sortable: false,
        //     width: 160,
        //     valueGetter: (params) =>
        //         `${params.getValue('nama') || ''} ${params.getValue('alamat') || ''}`,
        // },
    ];

    return (
        // <div style={{ height: '100%', width: '100%' }}>
        <div className="antrian__list">
            {/* {console.log(props.pasien.length)} */}
            <DataGrid
                pageSize={props.pasien.length - 1}
                rowHeight={35}
                headerHeight={35}
                columns={columns}
                hideFooter
                rows={props.pasien.map((data) => (
                    {
                        id: data.nomor,
                        status: data.statusBaru ? data.statusBaru : data.status,
                        nama: data.nama,
                        alamat: data.alamat,
                    })
                )}
            />
        </div>
    )
}

export default ListAntrian
