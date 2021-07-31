import { Redirect } from 'react-router-dom'
import Layout from "./component/content/Layout";
import Home from "./component/content/home";
import Klinik from "./component/content/klinik";
import Pasien from "./component/content/pasien";
import Dokter from "./component/content/dokter";
import Staff from "./component/content/staff";
import NotFound from './component/error/NotFound';
import LayoutError from './component/error/LayoutError';
// import { useSelector } from 'react-redux';
// import { selectUser } from './features/user/userSlice';
// import LayoutLogin from './component/login/LayoutLogin';
// import Login from './component/login/Login';

// export default [
//     {
//         path : '/',
//         layout : LayoutLogin,
//         component : () => <Redirect to="/login"/>
//     },
//     {
//         path : '/login',
//         layout : LayoutLogin,
//         component : Login
//     }
// ]
// const routesLogin =[{
//     path:'/login',
//     layout: LayoutLogin,
//     component:Login,
// }]

const routes = [
    // {
    //     path:'/login',
    //     layout: LayoutLogin,
    //     component:Login,
    // },
    {
        path : '/',
        layout : Layout,
        component : () => <Redirect to="/home"/>
    },
    {
        path : '/login',
        layout : Layout,
        component : () => <Redirect to="/home"/>
    },
    {
        path : '/home',
        layout : Layout,
        component : Home
    },
    {
        path : '/klinik',
        layout : Layout,
        component : Klinik
    },
    {
        path : '/pasien',
        layout : Layout,
        component : Pasien
    },
    {
        path : '/dokter',
        layout : Layout,
        component : Dokter
    },
    {
        path : '/staff',
        layout : Layout,
        component : Staff
    },
    {
        path : '*',
        layout : LayoutError,
        component : NotFound
    }
]

export {routes}