import React from 'react'

function LayoutError(props) {
    return (
        <div className="layout" style={{ display: "grid", placeItems: "center", height: "100vh", backgroundColor: "rgb(167, 233, 255)" }}>
            <div className="content">
                {props.children}
            </div>
        </div>
    )
}

export default LayoutError
