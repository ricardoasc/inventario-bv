import firebase from "firebase/compat/app"; // Importa a biblioteca principal do Firebase
import "firebase/compat/firestore"; // Importa o módulo Firestore

const firebaseConfig = {
  apiKey: "AIzaSyAQA0upjNHW8oP6FKFlJaMFEVbNfxakrS0",
  authDomain: "inventario-bv2.firebaseapp.com",
  projectId: "inventario-bv2",
  storageBucket: "inventario-bv2.appspot.com",
  messagingSenderId: "159799550005",
  appId: "1:159799550005:web:ded02d17c5624cf62bd17c",
  measurementId: "G-4PRRGRQK3G",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

export default db;
