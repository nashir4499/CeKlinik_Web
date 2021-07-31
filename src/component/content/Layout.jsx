import React from 'react'
import './layout.css'
import Sidebar from './Sidebar'


function Layout(props) {


    return (
        <div className="layout">
            <div className="layout__container">
                <Sidebar />
                <div className="content">
                    {props.children}
                </div>
            </div>
        </div>
    )
}

export default Layout
