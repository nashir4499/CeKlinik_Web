import { configureStore } from '@reduxjs/toolkit';
import laporanAdminReducer from '../features/laporanAdmin/laporanAdminSilce';
import orgaKlinikReducer from '../features/orgaKlinik/orgaKlinikSilce';
import userReducer from '../features/user/userSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    orgaKlinik: orgaKlinikReducer,
    laporanAdmin: laporanAdminReducer,
  },
});
