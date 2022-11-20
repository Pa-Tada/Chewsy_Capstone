import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  SafeAreaView,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import React, { useEffect, useState } from "react";
import { Icon, Input, Avatar, Divider } from "@rneui/themed";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { auth, db } from "../firebase";
import firebase from "firebase/compat";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { set } from "react-native-reanimated";

// const fields = [
//   { id: 1, field: "Email" },
//   { id: 2, field: "Password" },
//   { id: 3, field: "First Name" },
//   { id: 4, field: "Last Name" },

//   { id: 5, field: "Food Genre" },
//   { id: 6, field: "Restaurant Rating" },
//   { id: 7, field: "Dietary Restrictions" },
//   { id: 8, field: "Affordability" },
//   { id: 9, field: "Visited Before" },
//   { id: 10, field: "Restaurants You've Liked" },
//   { id: 11, field: "Restaurants You Haven't Liked" },
// ];

// Dummy image - need to make dynamic based on logged in user
const firstItem = () => {
  return (
    <View>
      <TouchableOpacity>
        <Avatar
          rounded
          containerStyle={{ alignSelf: "center", paddingBottom: 10 }}
          size="large"
          source={{
            uri: "https://c8.alamy.com/comp/2HYCH09/larry-david-attending-the-natural-resources-defense-councils-stand-up!-event-at-the-wallis-annenberg-center-for-the-performing-arts-2HYCH09.jpg",
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

const lastItem = () => {
  return (
    <TouchableOpacity>
      <View style={styles.buttonWrapper}>
        <Text style={styles.button}>Submit</Text>
      </View>
    </TouchableOpacity>
  );
};

const Profile = () => {
  // console.log("CURRENT USER AUTH Email:", auth.currentUser.email, auth.currentUser.uid);
  // console.log("CURRENT USER id:", auth.currentUser.id);
  let user;
  const getUser = async () => {

    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    // console.log(doc.id, " => ", doc.data());
    // r
    if(doc.data().email.toLowerCase() === auth.currentUser.email){
      user = {data:doc.data(),id:doc.id}
      console.log("USER:",user)
    } // try switching this to id
    });
    const docRef = doc(db, "users", auth.currentUser.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  };
  getUser()
  console.log(doc(db,'users', auth.currentUser.uid))

  // const db = getFirestore();

  // // collection ref
  // const colRef = collection(db, "users");

  // // get collection data
  // getDocs(colRef).then((snapshot) => {
  //   // console.log("snapshot docs:", snapshot.docs)
  //   // console.log("DOC DATA:", doc.data())
  //   let users = [];
  //   let user
  //   snapshot.docs.forEach((doc) => {
  //     users.push({ ...doc.data(), id: doc.id });
  //   });
  //   snapshot.docs.filter((doc)=>{
  //     console.log("DOC DATA:", doc.data().email)
  //   })
  //   // console.log(users)
  // });

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("")
  const [foodGenre, setFoodGenre]= useState('')// initial value might need to be the users food genre
  const [foodName, setFoodName] = useState("")

  if(user){
    setFirstName(user.firstName)
  }

  const handleEdit = async () => {
    // setFoodGenre([
    //   ...foodGenre, foodName
    // ])
    await setDoc(doc(db, "users", user.id),{
      email: user.data.email,
      firstName: firstName,
      lastName: lastName,
      foodGenre: foodGenre
    });
    console.log("handle edit user:",user)
  };
  const fields = [
    { id: 1, field: "Email" },
    { id: 2, field: "Password" },
    { id: 3, field: "First Name" },
    { id: 4, field: "Last Name" },

    { id: 5, field: "Food Genre" },
    { id: 6, field: "Restaurant Rating" },
    { id: 7, field: "Dietary Restrictions" },
    { id: 8, field: "Affordability" },
    { id: 9, field: "Visited Before" },
    { id: 10, field: "Restaurants You've Liked" },
    { id: 11, field: "Restaurants You Haven't Liked" },
  ];
  //   console.log("CHECK HERE FOR UID", auth.currentUser.uid)
  //   useEffect(()=> {
  //     const getUser = async () => {
  //       const usersRef = db.collection("users");
  //       //console.log(usersRef)
  //       const user = await usersRef.where("email", "==", "petedavidson@snl.com").get();
  //       //const user = await firebase.firestore().collection('users').doc("qn91knUBt6Ysypra66OAgBKJnWi1").get();
  //       console.log("CHECK HERE FOR USER",user)
  //   }
  //   getUser()
  // }, [])

  //   if (user.empty) {
  //   console.log('No matching documents.');
  //   return;
  // }

  // user.forEach(doc => {
  //   console.log(doc.id, '=>', doc.data());
  // });

  return (
    <View style={styles.container}>
      <Divider />
      <View style={styles.contents}>
        <Text style={styles.sectionTitle}>Edit Profile</Text>

        <View style={styles.form}>
          {/* <FlatList
            ListHeaderComponent={firstItem}
            ListFooterComponent={lastItem}
            data={fields}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <KeyboardAwareScrollView>
                <Input
                  labelStyle={{ fontWeight: "normal" }}
                  inputStyle={{ color: "white", fontSize: 14 }}
                  label={item.field}
                  onChangeText={
                    item.field==="First Name"?(text) => setFirstName(text):setFirstName(firstName)
                  }
                />
              </KeyboardAwareScrollView>
            )}
          /> */}
          <KeyboardAwareScrollView>
            <TouchableOpacity>
              <Avatar
                rounded
                containerStyle={{ alignSelf: "center", paddingBottom: 10 }}
                size="large"
                source={{
                  uri: "https://c8.alamy.com/comp/2HYCH09/larry-david-attending-the-natural-resources-defense-councils-stand-up!-event-at-the-wallis-annenberg-center-for-the-performing-arts-2HYCH09.jpg",
                }}
              />
            </TouchableOpacity>
            <Input
              labelStyle={{ fontWeight: "normal" }}
              inputStyle={{ color: "white", fontSize: 14 }}
              label="First Name"
              value={firstName}
              onChangeText={(text) => setFirstName(text)}
            />
            <Input
              labelStyle={{ fontWeight: "normal" }}
              inputStyle={{ color: "white", fontSize: 14 }}
              label="Last Name"
              value={lastName}
              onChangeText={(text) => setLastName(text)}
            />
            <Input
              labelStyle={{ fontWeight: "normal" }}
              inputStyle={{ color: "white", fontSize: 14 }}
              label="Food Genre"
              value={foodName}
              onChangeText={(text) => setFoodName(text)}
            />

            <TouchableOpacity onPress = {()=>{
              //  setFoodGenre([
              //   ...foodGenre, foodName
              // ])
              // console.log("food genre:", foodGenre)
               handleEdit()

               setFoodGenre([
                ...foodGenre, foodName
              ])
              setFirstName("")
              setLastName("")
              setFoodName([])}}>
              <View style={styles.buttonWrapper}>
                <Text style={styles.button}>Submit</Text>
              </View>
            </TouchableOpacity>
          </KeyboardAwareScrollView>
        </View>
      </View>
      <Footer />
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#242526",
    flex: 1,
    justifyContent: "center",
  },
  contents: {
    flex: 1.7,
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginTop: 20,
    marginBottom: 15,
  },
  form: {
    alignSelf: "center",
    width: "80%",
    paddingBottom: 55,
  },
  buttonWrapper: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 60,
    width: 150,
    backgroundColor: "orange",
    alignItems: "center",
    alignSelf: "center",
  },
  button: {},
});
