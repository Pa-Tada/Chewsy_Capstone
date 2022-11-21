import firebase from "firebase/compat";
import { getFirestore, collection,getDocs,onSnapshot,addDoc,deleteDoc,doc,orderBy,serverTimestamp,getDoc,query,where } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAEHjcMAwTGGilDO0R5rEv9UgMjQ9EABl0",
  authDomain: "chewsy-72992.firebaseapp.com",
  projectId: "chewsy-72992",
  storageBucket: "chewsy-72992.appspot.com",
  messagingSenderId: "335930455123",
  appId: "1:335930455123:web:6dc475b489b9a8274442a6",
};

// Initialize Firebase
let app;

if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const auth = firebase.auth();
const db = getFirestore();


const usersRef = collection(db, "users")
let allUsers;
onSnapshot(usersRef, (docSnap)=> {
allUsers = []
  docSnap.forEach((doc)=> {
    allUsers.push({ ...doc.data(), id: doc.id }
    )
  })
})


export { auth, db, allUsers};
