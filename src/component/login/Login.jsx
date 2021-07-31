import React, { useState } from 'react'
import { Avatar, Button, FormControl, Grid, IconButton, Input, InputLabel } from '@material-ui/core'
import { Contacts, Email, Lock } from '@material-ui/icons'
import { auth } from '../../config/firebase'
import { useDispatch } from 'react-redux'
import { login } from '../../features/user/userSlice'

function Login(props) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const dispatch = useDispatch()


    const loginApp = (e) => {
        e.preventDefault()
        auth.signInWithEmailAndPassword(email, password)
            .then(userAuth => {
                dispatch(login({
                    email: userAuth.email,
                    uid: userAuth.uid,
                }))
                props.history.push("/home");
            }).catch(error => alert(error))
        // window.location.reload();
    }

    return (
        <div className="side__kanan">
            <div className="kanan__header">
                <h1>Sign In</h1>
                {/* <AccountCircle style={{ fontSize: 150 }} /> */}
                <Avatar className="login__ikon" style={{ height: '100px', width: '100px' }} />
            </div>

            <div className="kanan__content">
                <form className="login__form">
                    <Grid container spacing={1} alignItems="flex-end" className="form__input">
                        <Grid item>
                            <Email />
                        </Grid>
                        <Grid item>
                            {/* <TextField className="input__email" id="standard-basic" label="Email" fullWidth /> */}
                            <FormControl >
                                <InputLabel htmlFor="standard-adornment-email">Email</InputLabel>
                                <Input id="standard-adornment-email" type="email" style={{ width: '20vw' }} value={email} onChange={(e) => setEmail(e.target.value)} />
                            </FormControl>
                        </Grid>
                    </Grid>

                    <Grid container spacing={1} alignItems="flex-end" className="form__input">
                        <Grid item>
                            <Lock />
                        </Grid>
                        <Grid item>
                            <FormControl >
                                <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
                                <Input id="standard-adornment-password" type="password" style={{ width: '20vw' }} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="on" />
                            </FormControl>
                        </Grid>
                    </Grid>

                    <Grid container spacing={1} justify="center">
                        <Button type="submit" onClick={loginApp} variant="contained" color="primary" fullWidth>Login</Button>
                    </Grid>
                </form>
            </div>

            <div className="kanan__footer">
                <IconButton aria-label="" onClick={() => window.open("mailto:mnashirmudzakir@gmail.com")}>
                    <Contacts />
                    <h6>Contact Us</h6>
                </IconButton>
            </div>
        </div>
    )
}

export default Login
