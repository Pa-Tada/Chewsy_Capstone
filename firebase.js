import firebase from "firebase/compat"

import {getFirestore, collection, getDocs} from 'firebase/firestore'


const firebaseConfig = {
  apiKey: "AIzaSyAEHjcMAwTGGilDO0R5rEv9UgMjQ9EABl0",
  authDomain: "chewsy-72992.firebaseapp.com",
  projectId: "chewsy-72992",
  storageBucket: "chewsy-72992.appspot.com",
  messagingSenderId: "335930455123",
  appId: "1:335930455123:web:6dc475b489b9a8274442a6"
};

// Initialize Firebase
let app;
if(firebase.apps.length === 0){
  app = firebase.initializeApp(firebaseConfig);
}else{
  app = firebase.app()
}

const auth = firebase.auth()
// const db = firebase.firestore() // old way

// init services
const db = getFirestore()

// collection ref
const colRef = collection(db, "users")

// get collection data
getDocs(colRef)
  .then((snapshot)=>{
    // console.log("snapshot docs:", snapshot.docs)
    let users = [];
    snapshot.docs.forEach((doc)=>{
      users.push({ ...doc.data(), id: doc.id})
    })
    // console.log(users)
  })

export {auth, db}

