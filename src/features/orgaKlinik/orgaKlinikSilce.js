import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    orgaId:null,
    klinik:{
        id:"1"
    },
    dokters:[],
    stafs:[]
}

const orgaKlinikSilce = createSlice({
    name: 'orgaKlinik',
    initialState,
    reducers: {
        getOrgaId:(state, action)=>{
            state.orgaId = action.payload
        },
        getKlinik:(state, action)=>{
            state.klinik = action.payload
        },
        getStafs:(state, action)=>{
            if(state.stafs.length===0){
                state.stafs = [...state.stafs,action.payload]
            }else{
                // const cek = state.stafs.filter(staf =>staf.userId===action.payload.userId)
                const cek = state.stafs.filter(staf =>staf.id===action.payload.id)
                if(cek.length===0){
                    state.stafs = [...state.stafs,action.payload]
                }
            }
        },
        updateStaf:(state, action)=>{
            const index = state.stafs.findIndex(staf=>staf.id===action.payload.id)
            if(index>-1){
                state.stafs.splice(index,1,action.payload)
            }
        },
        deleteStaf:(state, action)=>{
            const index = state.stafs.findIndex(staf=>staf.id===action.payload.id)
            if(index>-1){
                state.stafs.splice(index,1)
            }
        },
        getDokters:(state, action)=>{
            if(state.dokters.length===0){
                state.dokters = [...state.dokters,action.payload]
            }else{
                const cek = state.dokters.filter(dokter =>dokter.id===action.payload.id)
                if(cek.length===0){
                    state.dokters = [...state.dokters,action.payload]
                }
            }
        },
        updateDokter:(state, action)=>{
            const index = state.dokters.findIndex(dokter=>dokter.id===action.payload.id)
            if(index>-1){
                state.dokters.splice(index,1,action.payload)
            }
        },
        deleteDokter:(state, action)=>{
            const index = state.dokters.findIndex(dokter=>dokter.id===action.payload.id)
            if(index>-1){
                state.dokters.splice(index,1)
            }
        },
        clearOrga:(state)=>{
            state.orgaId=null
            state.klinik={
                id:"1"
            }
            state.dokters=[]
            state.stafs=[]
        }
    }
});

export const {
    getOrgaId,getKlinik,getDokters,getStafs,clearOrga,updateStaf,updateDokter,deleteStaf,deleteDokter
} = orgaKlinikSilce.actions

export const selectKlinik = state => state.orgaKlinik.klinik
export const selectOrgaId = state => state.orgaKlinik.orgaId
export const selectStafs = state => state.orgaKlinik.stafs
export const selectDokters = state => state.orgaKlinik.dokters
export const selectClearOrga = state => state.orgaKlinik.clearOrga

export default orgaKlinikSilce.reducer