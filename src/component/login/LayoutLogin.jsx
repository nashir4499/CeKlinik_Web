import React from 'react'
// import { useSelector } from 'react-redux'
// import { useHistory } from 'react-router'
// import { selectUser } from '../../features/user/userSlice'
import './login.css'
import SideKiri from './SideKiri'

function LayoutLogin(props) {
    // const history = useHistory()
    // const user = useSelector(selectUser)

    // useEffect(() => {
    //     if (user == null) {
    //         history.push("/login")
    //     }
    // }, [user, history])

    return (
        <div className="login">
            <div className="login__container">
                <SideKiri />
                {props.children}
            </div>
        </div>
    )
}

export default LayoutLogin
