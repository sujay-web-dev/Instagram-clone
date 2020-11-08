import React, { useState } from "react";
import { Button } from "@material-ui/core";
import firebase from "firebase";
import { storage, db } from "./firebase";
import "./Imageupload.css"


function Imageupload({username}) {
  const [image, setimage] = useState(null);
  const [progress, setprogress] = useState(0);
  const [caption, setcaption] = useState("");

  const handlechange = (e) => {
      if (e.target.files[0]) {
          setimage(e.target.files[0]);
      }
  };

  const handleupload = () => {
    const uploadtask =storage.ref(`images/${image.name}`).put(image);
    uploadtask.on(
        "state_changed",
        (snapshot) => {
            // progress function ...
            const progress = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setprogress(progress);
        },
        (error) => {
            //  Error Function...
            console.log(error);
            alert(error.message);
        },

        () => {
            // complete function...
            storage
                .ref("images")
                .child(image.name)
                .getDownloadURL()
                .then(url => {
                    db.collection("posts").add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        caption: caption,
                        imageUrl: url,
                        username:username
                    });
                    setprogress(0);
                    setcaption("");
                    setimage(null);
                })
        }
    )
  }

  return (
    <div className="imageupload">
        <progress className="imageupload__progress" value={progress} max="100"/>
      <input type="text" placeholder="Enter the caption" onChange={(event) => setcaption(event.target.value)}/>
      <input type="file" onChange={handlechange} />
      <Button onClick={handleupload}>Upload</Button>
    </div>
  );
}

export default Imageupload;
