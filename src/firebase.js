import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyA-ODqUgCpTu47r96w-eQIATiYYdU1b4ww",
  authDomain: "home-organisation-25bbe.firebaseapp.com",
  projectId: "home-organisation-25bbe",
  storageBucket: "home-organisation-25bbe.appspot.com",
  messagingSenderId: "178714985735",
  appId: "1:178714985735:web:6d0af6870283d4b9c031a2",
  databaseUrl: "https://home-organisation-25bbe-default-rtdb.firebaseio.com/",
};

export const firebaseApp = initializeApp(firebaseConfig);
