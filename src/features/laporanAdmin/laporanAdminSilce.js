import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    stafs:[],
    tp: 0,
    tk: 0,
    pd: 0,
    pb: 0
}

const laporanAdminSilce = createSlice({
    name: 'laporanAdmin',
    initialState,
    reducers: {
        incrementLaporan: (state, action) => {
            // state.value += action.payload;
            const cek = state.stafs.filter(staf =>staf===action.payload.id)
                if(cek.length===0){
                    state.stafs = [...state.stafs,action.payload.id]
                    state.tp += action.payload.tp;
                    state.tk += action.payload.tk;
                    state.pd += action.payload.pd;
                    state.pb += action.payload.pb;
                }
          },
    }
});

export const {
    incrementLaporan,
} = laporanAdminSilce.actions

export const selectLaporanAdmin = state => state.laporanAdmin

export default laporanAdminSilce.reducer