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

const firebaseConfig = { // chewsy 1
  apiKey: "AIzaSyAEHjcMAwTGGilDO0R5rEv9UgMjQ9EABl0",
  authDomain: "chewsy-72992.firebaseapp.com",
  projectId: "chewsy-72992",
  storageBucket: "chewsy-72992.appspot.com",
  messagingSenderId: "335930455123",
  appId: "1:335930455123:web:6dc475b489b9a8274442a6",
};

// const firebaseConfig = { // chewsy 2
//   apiKey: "AIzaSyAwJNaV_7u-v-IebeaPaFNPxbT8D1AmUd0",
//   authDomain: "chewsy2-296c9.firebaseapp.com",
//   projectId: "chewsy2-296c9",
//   storageBucket: "chewsy2-296c9.appspot.com",
//   messagingSenderId: "589371967540",
//   appId: "1:589371967540:web:40a7d8e7363fe5cc75a261",
//   measurementId: "G-Y9SMGW9NJT"
// };

// Initialize Firebase
let app;

if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const auth = firebase.auth();
// const db = firebase.firestore() // old way

// init services
const db = getFirestore();

// collection ref
const colRef = collection(db, "users");

// get collection data
getDocs(colRef).then((snapshot) => {
  // console.log("snapshot docs:", snapshot.docs)
  let users = [];
  snapshot.docs.forEach((doc) => {
    users.push({ ...doc.data(), id: doc.id });
  });
  // console.log(users)
});

// getting all users // might delete later
const usersRef = collection(db, "users");
let allUsers;
onSnapshot(usersRef, (docSnap) => {
  allUsers = [];
  docSnap.forEach((doc) => {
    allUsers.push({ ...doc.data(), id: doc.id });
  });
});

// get current user data
let user;
const getUser = async () => {
  if (auth.currentUser) {
    // const querySnapshot = await getDocs(collection(db, "users"));
    // querySnapshot.forEach((doc) => {
    //   // doc.data() is never undefined for query doc snapshots
    //   // console.log(doc.id, " => ", doc.data());
    //   // r

    //   if (doc.data().email === auth.currentUser.email) {
    //     user = { data: doc.data(), id: doc.id };
    //     console.log("USER:", user);
    //   } // try switching this to id
    // });
    const docRef = doc(db, "users", auth.currentUser.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      user = docSnap.data()
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  }

};
getUser();

export { auth, db, user, getUser, allUsers };
