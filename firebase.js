
import firebase from "firebase";



const firebaseConfig = {
  apiKey: "AIzaSyCMZTKiLbly0My1TjIX-6Wkkgfdqd6XLow",
  authDomain: "test-auth-88cc0.firebaseapp.com",
  projectId: "test-auth-88cc0",
  storageBucket: "test-auth-88cc0.appspot.com",
  messagingSenderId: "1082057126919",
  appId: "1:1082057126919:web:e637ece6ea4aed895f26a2"
};

let app;
if (!firebase.apps.length) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app()
}

const auth = firebase.auth()

export { auth };