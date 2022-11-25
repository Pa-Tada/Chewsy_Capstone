import firebase from "firebase/compat";
import {
  getFirestore,
  collection,
  getDocs,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  orderBy,
  serverTimestamp,
  getDoc,
  query,
  where,
} from "firebase/firestore";

// ------------- PRIMARY --------------
// const firebaseConfig = {
//   apiKey: "AIzaSyAwJNaV_7u-v-IebeaPaFNPxbT8D1AmUd0",
//   authDomain: "chewsy2-296c9.firebaseapp.com",
//   projectId: "chewsy2-296c9",
//   storageBucket: "chewsy2-296c9.appspot.com",
//   messagingSenderId: "589371967540",
//   appId: "1:589371967540:web:40a7d8e7363fe5cc75a261",
//   measurementId: "G-Y9SMGW9NJT"
// };

// ------------- BACKUP --------------
const firebaseConfig = {
  // chewsy 2
  apiKey: "AIzaSyAwJNaV_7u-v-IebeaPaFNPxbT8D1AmUd0",
  authDomain: "chewsy2-296c9.firebaseapp.com",
  projectId: "chewsy2-296c9",
  storageBucket: "chewsy2-296c9.appspot.com",
  messagingSenderId: "589371967540",
  appId: "1:589371967540:web:40a7d8e7363fe5cc75a261",
  measurementId: "G-Y9SMGW9NJT",
};

// Initialize Firebase
let app;

if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

// init services
const auth = firebase.auth();
const db = getFirestore();

// collection ref
const colRef = query(collection(db, "users"), orderBy("email"));

// getting all users
let allUsers;
onSnapshot(colRef, (docSnap) => {
  allUsers = [];
  docSnap.forEach((doc) => {
    allUsers.push({ ...doc.data(), id: doc.id });
  });
});

// get current user data
let user;
const getUser = async () => {
  if (auth.currentUser) {
    const docRef = doc(db, "users", auth.currentUser.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      user = { ...docSnap.data(), id: docSnap.id };
    } else {
      console.log("No such document!");
    }
  }
};
getUser();

export { auth, db, user, getUser, allUsers };
