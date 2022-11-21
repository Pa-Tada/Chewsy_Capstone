// o: please remove this

// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// // import axios from "axios";
// import { auth, db } from "../firebase";
// import {
//   collection,
//   getDocs,
//   onSnapshot,
//   addDoc,
//   deleteDoc,
//   doc,
//   orderBy,
//   serverTimestamp,
//   getDoc,
//   query,
//   where,
// } from "firebase/firestore";

// export const getUser = createAsyncThunk("getUser", async () => {
//   const docRef = doc(db, "users", auth.currentUser.uid);
//   const gettingUser = await getDoc(docRef);
//   console.log("GETTING USER", gettingUser);
//   return { ...gettingUser.data(), id: gettingUser.id };
//   // onSnapshot(docRef, (doc) => {
//   //   return { ...doc.data(), id: doc.id }
//   // });
// });

// const userSlice = createSlice({
//   name: "loggedInUser",
//   initialState: {
//     user: {},
//     error: null,
//   },
//   reducers: {},
//   extraReducers(builder) {
//     builder
//       .addCase(getUser.fulfilled, (state, action) => {
//         console.log("USER", action.payload);
//         state.user = action.payload;
//       })
//       .addCase(getUser.rejected, (state, action) => {
//         state.error = action.error;
//       });
//   },
// });

// export default userSlice.reducer;
