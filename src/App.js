import React, { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { routes } from "./routes";
import { useDispatch, useSelector } from "react-redux";
import { login, logout, selectUser } from "./features/user/userSlice";
import { auth, db } from "./config/firebase";
import LayoutLogin from "./component/login/LayoutLogin";
import Login from "./component/login/Login";
import loadingImg from "./component/img/Loading.svg";
import {
  clearOrga,
  getDokters,
  getKlinik,
  getOrgaId,
  getStafs,
} from "./features/orgaKlinik/orgaKlinikSilce";

function App(props) {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log(process.env.NODE_ENV.REACT_APP_apiKey);
    console.log(process.env.REACT_APP_apiKey);
    setLoading(true);
    auth.onAuthStateChanged((userAuth) => {
      if (userAuth) {
        //user is logged in
        const stafref = db.collection("stafs").doc(userAuth.uid);
        stafref
          .get()
          .then((query) => {
            // dispatch(login({
            //   email: userAuth.email,
            //   uid: userAuth.uid,
            // }));
            dispatch(login(query.data()));
          })
          .catch((error) => alert(error));

        db.collection("orga_kliniks")
          .where("stafs", "array-contains", stafref)
          .get()
          .then((querySnapshot) => {
            if (querySnapshot.empty === false) {
              querySnapshot.forEach((doc) => {
                const orgaData = doc.data();
                dispatch(getOrgaId(doc.id));

                orgaData.klinik
                  .get()
                  .then((res) => {
                    dispatch(
                      getKlinik({
                        id: res.id,
                        nama: res.data().nama,
                        alamat: res.data().alamat,
                        jenis: res.data().jenis,
                        layanan: res.data().layanan,
                        gambar: res.data().gambar,
                        lokasi: res.data().lokasi,
                        // tambahan baru setelah revisian
                        cerdas: res.data().cerdas,
                      })
                    );
                    // console.log(res.id)
                    // setLoading(false)
                  })
                  .catch((error) => alert(error));

                orgaData.stafs.map((stafs) =>
                  stafs
                    .get()
                    .then((res) => {
                      const orgaStafs = res.data();
                      const idStaf = res.id;
                      const dataStaf = { id: idStaf, data: orgaStafs };
                      dispatch(getStafs(dataStaf));
                      // console.log(dataStaf)
                    })
                    .catch((error) => alert(error))
                );
                orgaData.dokters.map((dokters) =>
                  dokters
                    .get()
                    .then((res) => {
                      const orgaDokters = res.data();
                      const idDokter = res.id;
                      const dataDokter = { id: idDokter, data: orgaDokters };
                      dispatch(getDokters(dataDokter));
                      // console.log(dataDokter)
                      setLoading(false);
                    })
                    .catch((error) => alert(error))
                );
                // setLoading(false)
              });
            } else {
              //user is logged out
              auth.signOut();
              dispatch(logout());
              dispatch(clearOrga());
              setLoading(false);
            }
          })
          .catch((error) => alert(error));
        // setLoading(false)
      } else {
        //user is logged out
        dispatch(logout());
        dispatch(clearOrga());
        setLoading(false);
      }
      // setLoading(false)
    });
    // },[])
  }, [dispatch]); //percobaan

  return (
    <BrowserRouter>
      {loading ? (
        <div className="loading">
          <img className="loading__img" src={loadingImg} alt="Loading" />
        </div>
      ) : (
        <Switch>
          {!user ? (
            <>
              <Redirect push to="/login" />
              <Route
                path="/login"
                exact={true}
                component={(props) => {
                  return (
                    <LayoutLogin {...props}>
                      <Login {...props} />
                    </LayoutLogin>
                  );
                }}
              />
            </>
          ) : (
            routes.map((route, index) => {
              // console.log(klinik)
              return (
                <Route
                  key={index}
                  path={route.path}
                  exact={true}
                  {...props}
                  component={(props) => {
                    return (
                      <route.layout {...props}>
                        <route.component {...props} />
                      </route.layout>
                    );
                  }}
                />
              );
            })
          )}
        </Switch>
      )}
    </BrowserRouter>
  );
}

export default App;
