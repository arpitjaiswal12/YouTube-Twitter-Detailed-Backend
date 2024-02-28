
import {getStorage} from "firebase/storage"


import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC1W8Mb05-vAnjjW78rkB4Wh8amJDSdUkc",
  authDomain: "mykriyeta.firebaseapp.com",
  projectId: "mykriyeta",
  storageBucket: "mykriyeta.appspot.com",
  messagingSenderId: "1018536176381",
  appId: "1:1018536176381:web:2e8089fd8fc9d235406c94"
};


const app = initializeApp(firebaseConfig);
export {app};