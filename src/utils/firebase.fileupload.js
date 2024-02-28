import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "./firebase.config.js";

const storeImage = async (localFilePathle) => {
  return new Promise((resolve, reject) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + localFilePathle;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, localFilePathle);
    // the above line is generating error of cors origin
    // on 16.11.23 it is solved my making some changes in firebase storage rules
    /*service firebase.storage {
        match /b/{bucket}/o {
          match /{allPaths=**} {
            allow read, write;
          }
        }
      }*/
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100; // this will show the percentage of image is uploaded
        console.log(`Upload is ${progress}% done`);
      },
      (error) => {
        reject(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve(downloadURL);
        });
      }
    );
  });
};

export {storeImage};