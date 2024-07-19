// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA7v5V-KbWiVLf0nrGGHKdfd4EVpyVsgTY",
  authDomain: "react-js-blog-website-yt-b4a21.firebaseapp.com",
  projectId: "react-js-blog-website-yt-b4a21",
  storageBucket: "react-js-blog-website-yt-b4a21.appspot.com",
  messagingSenderId: "827690283551",
  appId: "1:827690283551:web:d7fbdbb3cbc490003a9b2a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// google Auth
const provider = new GoogleAuthProvider();
const auth = getAuth();

export const authWithGoogle = async() => {

    let user = null;

    await signInWithPopup(auth, provider)
    .then((result) => {
        user = result.user
    })
    .catch((err) => {
        console.log(err)
    })

    return user;

}