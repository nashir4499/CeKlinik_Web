import React, { useEffect, useState } from "react";
import "./klinik.css";
import {
  Button,
  TextField,
  Avatar,
  makeStyles,
  CircularProgress,
  IconButton,
  LinearProgress,
  FormControlLabel,
  Switch,
} from "@material-ui/core";
import { Edit } from "@material-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  getKlinik,
  selectKlinik,
} from "../../../features/orgaKlinik/orgaKlinikSilce";
import { storageRef, firebase, db } from "../../../config/firebase";
import { selectUser } from "../../../features/user/userSlice";

function Klinik() {
  const classes = useStyles();
  const klinik = useSelector(selectKlinik);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [loadingImg, setLoadingImg] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [progresLoad, setProgresLoad] = useState(0);
  const [edit, setEdit] = useState(false);
  const [gambarSementara, setGambarSementara] = useState();
  const [data, setData] = useState({
    id: "",
    nama: "",
    jenis: "",
    layanan: "",
    alamat: "",
    gambar: "",
    lokasi: "",
    // setelah revisian
    cerdas: "",
  });

  const handleChange = (nama, value) => {
    setData({
      ...data,
      [nama]: value,
    });
  };

  useEffect(() => {
    setData({
      id: klinik.id,
      nama: klinik.nama,
      jenis: klinik.jenis,
      layanan: klinik.layanan,
      alamat: klinik.alamat,
      gambar: klinik.gambar,
      lokasi: klinik.lokasi,
      //   Setelah revisian
      cerdas: klinik.cerdas,
    });
  }, [klinik]);

  const onChangePhoto = (dataFile) => {
    setLoadingImg(true);
    // console.log(dataFile.target.files[0])
    if (
      dataFile.target.files[0].type === "image/jpeg" ||
      dataFile.target.files[0].type === "image/png"
    ) {
      setGambarSementara(dataFile.target.files[0]);
      const uploadTask = storageRef
        .child("klinik/" + klinik.id + "coba")
        .put(dataFile.target.files[0]);
      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED.length,
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          // var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgresLoad(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          // console.log('Upload is ' + progress + '% done');
        },
        (error) => {
          console.log(error.code);
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            // console.log('File available at', downloadURL);
            setData({ ...data, gambar: downloadURL });
            setLoadingImg(false);
          });
        }
      );
    } else {
      alert("File harus berupa JPEG atau PNG");
    }
  };

  const ubahInfoKlinik = (e) => {
    e.preventDefault();
    setLoadingSave(true);
    // console.log(gambarSementara)
    if (gambarSementara !== undefined) {
      const uploadTask = storageRef
        .child("klinik/" + data.id)
        .put(gambarSementara);
      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED.length,
        (snapshot) => {
          setProgresLoad(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
        },
        (error) => {
          console.log(error.code);
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            db.collection("kliniks").doc(data.id).update({
              nama: data.nama,
              jenis: data.jenis,
              layanan: data.layanan,
              alamat: data.alamat,
              lokasi: data.lokasi,
              //   setelah revisian
              cerdas: data.cerdas,
              gambar: downloadURL,
            });
            dispatch(
              getKlinik({
                id: data.id,
                nama: data.nama,
                alamat: data.alamat,
                jenis: data.jenis,
                layanan: data.layanan,
                lokasi: data.lokasi,
                //   setelah revisian
                cerdas: data.cerdas,
                gambar: downloadURL,
              })
            );
            setEdit(false);
            setLoadingSave(false);
          });
        }
      );
    } else {
      db.collection("kliniks").doc(data.id).update({
        nama: data.nama,
        jenis: data.jenis,
        layanan: data.layanan,
        alamat: data.alamat,
        lokasi: data.lokasi,
        //   setelah revisian
        cerdas: data.cerdas,
        gambar: data.gambar,
      });
      dispatch(
        getKlinik({
          id: data.id,
          nama: data.nama,
          alamat: data.alamat,
          jenis: data.jenis,
          layanan: data.layanan,
          lokasi: data.lokasi,
          //   setelah revisian
          cerdas: data.cerdas,
          gambar: data.gambar,
        })
      );
      setEdit(false);
      setLoadingSave(false);
    }
  };

  return (
    <div className="klinik">
      <div className="klinik__header">
        <h3 style={{ marginLeft: 10 }}>Informasi Klinik</h3>
        {user && user.bagian === "Admin" && (
          <IconButton
            className={classes.headerOpsiEdit}
            size="small"
            color="primary"
            onClick={() => setEdit(!edit)}
          >
            <Edit />
            <h6>Edit</h6>
          </IconButton>
        )}
      </div>
      <div className="klinik__content">
        <form
          className="kc_form"
          noValidate
          autoComplete="off"
          onSubmit={ubahInfoKlinik}
        >
          <div className="kcf_content">
            <div className="kcfc__kiri">
              <input type="text" value={data.id} disabled hidden />
              <TextField
                id="standard-basic"
                className={edit ? classes.formInputTrue : classes.formInput}
                value={data.nama}
                label="Nama Klinik"
                onChange={(e) => handleChange("nama", e.target.value)}
                fullWidth
              />
              <TextField
                id="standard-basic"
                className={edit ? classes.formInputTrue : classes.formInput}
                value={data.jenis}
                label="Jenis Klinik"
                onChange={(e) => handleChange("jenis", e.target.value)}
                fullWidth
              />
              <TextField
                id="standard-basic"
                className={edit ? classes.formInputTrue : classes.formInput}
                value={data.layanan}
                label="Layanan Klinik"
                onChange={(e) => handleChange("layanan", e.target.value)}
                fullWidth
              />
              <TextField
                id="standard-basic"
                className={edit ? classes.formInputTrue : classes.formInput}
                value={data.alamat}
                label="Alamat Klinik"
                multiline
                rows={3}
                onChange={(e) => handleChange("alamat", e.target.value)}
                fullWidth
              />
              <TextField
                id="standard-basic"
                className={edit ? classes.formInputTrue : classes.formInput}
                value={data.lokasi}
                label="Lokasi Klinik (Link Google Maps)"
                onChange={(e) => handleChange("lokasi", e.target.value)}
                fullWidth
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={data.cerdas}
                    onChange={(e) => handleChange("cerdas", e.target.checked)}
                    disabled={!edit && true}
                  />
                }
                label="Mode Antrian Cerdas"
              />
            </div>
            <div className="kcfc__kanan">
              <div className={classes.formControlGambar}>
                {loadingImg ? (
                  <CircularProgress variant="determinate" value={progresLoad} />
                ) : (
                  <>
                    <Avatar
                      alt={data.nama}
                      src={data.gambar}
                      className={classes.large}
                    />
                    {edit && (
                      <div className="kcfc__kanan_input_gambar">
                        <Edit className="kcfc__kanan_input_gambar_icon" />
                        <input
                          className="kcfc__kanan_input_gambar_file"
                          type="file"
                          name="profile"
                          id="profile"
                          onChange={onChangePhoto}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="kcf_button">
            {edit &&
              (!loadingSave ? (
                <Button
                  className={classes.tombol}
                  variant="contained"
                  color="primary"
                  fullWidth
                  type="submit"
                >
                  Simpan Perubahan
                </Button>
              ) : (
                <LinearProgress />
              ))}
          </div>
        </form>
      </div>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  headerOpsiEdit: {
    padding: "0px 10px 0px 10px",
    "& h6": {
      opacity: 0,
      transition: "0.5s",
    },
    "&:hover": {
      "& h6": {
        opacity: 1,
      },
    },
  },
  formInput: {
    margin: 5,
    pointerEvents: "none",
  },
  formInputTrue: {
    margin: 5,
  },
  formControlGambar: {
    flex: 0.4,
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  large: {
    // width: theme.spacing(20),
    // height: theme.spacing(20),
    width: "15vw",
    height: "15vw",
    // marginBottom: theme.spacing(1),
  },
  // loadingSave: {
  //     color: "white",
  //     margin: 10,
  // },
  tombol: {
    background: "rgb(0,150,0)",
    "&:hover": {
      background: "rgb(0,200,0)",
    },
  },
}));

export default Klinik;
