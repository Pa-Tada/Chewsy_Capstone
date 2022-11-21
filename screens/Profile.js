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
import { Button } from "@rneui/base";

//consider putting a little add button by each of the array objects
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
  console.log(
    "CURRENT USER AUTH Email:",
    auth.currentUser.email,
    auth.currentUser.uid
  );
  // console.log("CURRENT USER id:", auth.currentUser.id)
  let user;
  const getUser = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, " => ", doc.data());
      // r

      if (doc.data().email === auth.currentUser.email) {
        return (user = { data: doc.data(), id: doc.id });
        console.log("USER:", user);
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
  getUser();
  // console.log(doc(db, "users", auth.currentUser.uid));

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [foodName, setFoodName] = useState("");
  const [foodGenre, setFoodGenre] = useState([]);

  const [restaurantRating, setRestaurantRating] = useState("4");
  const [dietaryRestrictions, setDietaryRestrictions] = useState("none");
  const [affordability, setAffordability] = useState("$");

  const [likedRestaurants, setLikedRestaurants] = useState([]);
  const [likedRestaurantName, setLikedRestaurantName] = useState("");

  const [dislikedRestaurants, setDislikedRestaurants] = useState([]);
  const [dislikedRestaurantName, setDislikedRestaurantName] = useState("");

  const [visitedRestaurants, setVisitedRestaurants] = useState([]);
  const [visitedRestaurantName, setVisitedRestaurantName] = useState("");

  const handleEdit = () => {
    // console.log("food name", foodName)
    // let newArray = [foodName].concat(foodGenre)
    // console.log(newArray)
    // setFoodGenre(newArray);
    // console.log("food genre", foodGenre)
    setLikedRestaurants([...likedRestaurants, likedRestaurantName]);
    setDislikedRestaurants([...dislikedRestaurants, dislikedRestaurantName]);
    setVisitedRestaurants([...visitedRestaurants, visitedRestaurantName]);
    return setDoc(doc(db, "users", user.id), {
      email: user.data.email,
      firstName: firstName,
      lastName: lastName,
      foodGenre: foodGenre,
      restaurantRating: restaurantRating,
      dietaryRestrictions: dietaryRestrictions,
      affordability: affordability,
      likedRestaurants: likedRestaurants,
      dislikedRestaurants: dislikedRestaurants,
      visitedRestaurants: visitedRestaurants,
    });
  };
  return (
    <View style={styles.container}>
      <Divider />
      <View style={styles.contents}>
        <Text style={styles.sectionTitle}>Edit Profile</Text>

        <View style={styles.form}>
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
              value={foodGenre}
              onChangeText={(text) => setFoodName(text)}
            />
            <TouchableOpacity
              onPress={() => {
                setFoodGenre([...foodGenre, foodName]);
                setFoodName("");
              }}
            >
              <View style={styles.buttonWrapper2}>
                <Text style={styles.button}>+</Text>
              </View>
            </TouchableOpacity>
            <Input
              labelStyle={{ fontWeight: "normal" }}
              inputStyle={{ color: "white", fontSize: 14 }}
              label="Restaurant Rating (Out of 5)"
              value={restaurantRating}
              onChangeText={(text) => setRestaurantRating(text)}
            />
            <Input
              labelStyle={{ fontWeight: "normal" }}
              inputStyle={{ color: "white", fontSize: 14 }}
              label="Dietary Restrictions"
              value={dietaryRestrictions}
              onChangeText={(text) => setDietaryRestrictions(text)}
            />
            <Input
              labelStyle={{ fontWeight: "normal" }}
              inputStyle={{ color: "white", fontSize: 14 }}
              label="Affordability (max: 4 dolalr signs)"
              value={affordability}
              onChangeText={(text) => setAffordability(text)}
            />
            <Input
              labelStyle={{ fontWeight: "normal" }}
              inputStyle={{ color: "white", fontSize: 14 }}
              label="Restaurants You've Liked"
              value={likedRestaurants}
              onChangeText={(text) => setLikedRestaurantName(text)}
            />
            <TouchableOpacity
              onPress={() => {
                setLikedRestaurants([...likedRestaurants, likedRestaurantName]);
                setLikedRestaurantName("");
              }}
            >
              <View style={styles.buttonWrapper2}>
                <Text style={styles.button}>+</Text>
              </View>
            </TouchableOpacity>

            <Input
              labelStyle={{ fontWeight: "normal" }}
              inputStyle={{ color: "white", fontSize: 14 }}
              label="Restaurants You've Disliked"
              value={dislikedRestaurants}
              onChangeText={(text) => setDislikedRestaurantName(text)}
            />
            <TouchableOpacity
              onPress={() => {
                setDislikedRestaurants([
                  ...dislikedRestaurants,
                  dislikedRestaurantName,
                ]);
                setDislikedRestaurantName("");
              }}
            >
              <View style={styles.buttonWrapper2}>
                <Text style={styles.button}>+</Text>
              </View>
            </TouchableOpacity>

            <Input
              labelStyle={{ fontWeight: "normal" }}
              inputStyle={{ color: "white", fontSize: 14 }}
              label="Visisted Restaurants"
              value={visitedRestaurants}
              onChangeText={(text) => setVisitedRestaurantName(text)}
            />
            <TouchableOpacity
              onPress={() => {
                setVisitedRestaurants([
                  ...visitedRestaurants,
                  visitedRestaurantName,
                ]);
                setVisitedRestaurantName("");
              }}
            >
              <View style={styles.buttonWrapper2}>
                <Text style={styles.button}>+</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                // setFoodGenre([...foodGenre, foodName]);
                // setLikedRestaurants([...likedRestaurants, likedRestaurantName])
                // setDislikedRestaurants([...dislikedRestaurants, dislikedRestaurantName])
                // setVisitedRestaurants([...visitedRestaurants, visitedRestaurantName])
                handleEdit();
                // setFoodName("");
                // setLikedRestaurantName("")
                // setDislikedRestaurantName("")
                // setVisitedRestaurantName("")
                setFirstName("");
                setLastName("");
              }}
            >
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
  buttonWrapper2:{
    width:40,
    height:40,
    backgroundColor: "orange",
    alignItems:"center",
    justifyContent:"center",
    marginTop:-15,
    marginBottom:10,
    borderRadius:10
  },
  button: {},
});
