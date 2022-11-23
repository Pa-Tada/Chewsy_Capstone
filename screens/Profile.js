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
import { auth, db, getUser, user } from "../firebase";
import firebase from "firebase/compat";
import RNPickerSelect from "react-native-picker-select";
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
import { ScrollView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";

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
  const navigation = useNavigation();
  console.log("USER WITHIN FORM:", user);
  // console.log(auth.currentUser.email)
  useEffect(() => {
    getUser();
    console.log("im working");
  });
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);

  const [foodName, setFoodName] = useState("");
  const [foodGenre, setFoodGenre] = useState(user.foodGenre);

  const [restaurantRating, setRestaurantRating] = useState(
    user.restaurantRating
  );
  const [dietaryRestrictions, setDietaryRestrictions] = useState(
    user.dietaryRestrictions
  );
  const [affordability, setAffordability] = useState(user.affordability); // probably use int here, or string.length

  const [likedRestaurants, setLikedRestaurants] = useState(
    user.likedRestaurants
  );
  const [likedRestaurantName, setLikedRestaurantName] = useState("");

  const [dislikedRestaurants, setDislikedRestaurants] = useState(
    user.dislikedRestaurants
  );
  const [dislikedRestaurantName, setDislikedRestaurantName] = useState("");

  const [visitedRestaurants, setVisitedRestaurants] = useState(
    user.visitedRestaurants
  );
  const [visitedRestaurantName, setVisitedRestaurantName] = useState("");

  const handleEdit = () => {
    setDoc(doc(db, "users", auth.currentUser.uid), {
      email: user.email,
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
              // value={foodName}
              onChangeText={(text) => setFoodName(text)}
            >
              {foodName}
            </Input>
            <RNPickerSelect
              labelStyle={{ fontWeight: "normal" }}
              inputStyle={{ color: "white", fontSize: 14 }}
              label="Food Genre"
              onValueChange={(value) => setFoodName(value)}
              items={[
                { label: "Chinese", value: "Chinese" },
                { label: "Italian", value: "Italian" },
                { label: "Thai", value: "Thai" },
                { label: "American", value: "American" },
              ]}
            />

            <TouchableOpacity
              onPress={() => {
                setFoodGenre([...foodGenre, foodName]);
                setFoodName("");
                console.log("FOOD GENRE");
              }}
            >
              <View style={styles.buttonWrapper2}>
                <Text style={styles.button}>+</Text>
              </View>
            </TouchableOpacity>

            <View>
              {foodGenre.map((item, index) => (
                <View key={index} style={styles.foodGenres}>
                  <Text style={styles.foodListItem}>{item}</Text>
                  <TouchableOpacity
                    style={styles.foodButtonWrapper}
                    onPress={() => {
                      console.log(foodGenre);
                      setFoodGenre(
                        foodGenre.filter((currentFood) => {
                          console.log(currentFood);
                          return currentFood !== item;
                        })
                      );
                    }}
                  >
                    <Text>-</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

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
                handleEdit();
                getUser();
                setFoodName("");
                navigation.navigate("Home")
              }}
            >
              <View style={styles.buttonWrapper}>
                <Text style={styles.button}>Submit</Text>
              </View>
            </TouchableOpacity>
          </KeyboardAwareScrollView>
        </View>
      </View>
      {/* <Footer /> */}
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
    marginBottom:30,
    paddingHorizontal: 10,
    borderRadius: 60,
    width: 150,
    backgroundColor: "orange",
    alignItems: "center",
    alignSelf: "center",
  },
  buttonWrapper2: {
    width: 40,
    height: 40,
    backgroundColor: "orange",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  button: {},
  foodGenres: {
    flexDirection: "row",
    justifyContent: "",
    padding: 5,
  },
  foodListItem: {
    color: "white",
    fontWeight: "normal",
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 5,
  },
  foodButtonWrapper: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 80,
    width: 50,
    backgroundColor: "orange",
    alignItems: "center",
    alignSelf: "center",
  },
});
