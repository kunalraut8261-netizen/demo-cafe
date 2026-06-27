import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDkAZs7BCjantGossmvdeoEJKAS25eoo4U",
  authDomain: "breeze-ed53c.firebaseapp.com",
  projectId: "breeze-ed53c",
  storageBucket: "breeze-ed53c.firebasestorage.app",
  messagingSenderId: "559457391957",
  appId: "1:559457391957:web:470427f751c34740d8cbdc",
  measurementId: "G-M1Q0FJJFY7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

window.db = db;
window.collection = collection;
window.addDoc = addDoc;
window.getDocs = getDocs;
window.query = query;
window.orderBy = orderBy;