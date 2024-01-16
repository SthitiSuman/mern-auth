import React, { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import { useSelector } from "react-redux";
import {
  getStorage,
  uploadBytesResumable,
  ref,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase";

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const [image, setImage] = useState(undefined);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (image) {
      handleFileUpload(image);
    }
  }, [image]);

  const handleFileUpload = async (image) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercent(Math.round(progress));
      },
      (error) => {
        setImageError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, profilePicture: downloadURL });
        });
      }
    );
  };

  return (
    <div>
      <Header />
      <div
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
        <form className="flex flex-col gap-4 ">
          <input
            type="file"
            ref={fileRef}
            hidden
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
          <img
            src={formData?.profilePicture || currentUser?.profilePicture}
            alt="profile"
            className="h-24 w-24 self-center cursor-pointer rounded-full object-cover mt-2"
            onClick={() => fileRef.current.click()}
          ></img>
          <p className="text-sm self-center">
            {imageError ? (
              <span className="text-red-700">
                Error Uploading Image(file size must be less than 2 MB)
              </span>
            ) : imagePercent > 0 && imagePercent < 100 ? (
              <span className="text-slate-700">{`Uploading : ${imagePercent} %`}</span>
            ) : imagePercent === 100 ? (
              <span className="text-green-700">Image Uploaded Sucessfully</span>
            ) : (
              ""
            )}
          </p>
          <input
            type="text"
            id="username"
            placeholder="Username"
            className="bg-slate-100 rounded-lg p-3 w-80 self-center"
            defaultValue={currentUser?.username}
          ></input>
          <input
            type="text"
            id="email"
            placeholder="Email"
            className="bg-slate-100 rounded-lg p-3 w-80 self-center"
            defaultValue={currentUser?.email}
          ></input>
          <input
            type="text"
            id="password"
            placeholder="Password"
            className="bg-slate-100 rounded-lg p-3 w-80 self-center"
          ></input>
          <button className="bg-slate-700 text-white p-3,rounded-lg hover:opacity-95 disabled:opacity-80 w-80 h-10 self-center">
            Update
          </button>
        </form>
        <div className="flex justify-center mt-5 gap-10">
          <span className="text-red-700 cursor-pointer">Delete Account</span>
          <span className="text-red-700 cursor-pointer ml-6">Sign out</span>
        </div>
      </div>
    </div>
  );
}
