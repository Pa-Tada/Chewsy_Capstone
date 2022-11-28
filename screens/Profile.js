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
  updateDoc,
} from "firebase/firestore";
import { set } from "react-native-reanimated";
import { Button } from "@rneui/base";
import { ScrollView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";


const Profile = () => {
  const navigation = useNavigation();
  console.log("USER WITHIN FORM:", user);
  // console.log(auth.currentUser.email)
  // useEffect(() => {
  //   getUser();
  //   console.log("im working");
  // }, []);

  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);

  const [imgUrl, setImgUrl] = useState(user.imgUrl);

  const [foodName, setFoodName] = useState("");
  const [foodGenre, setFoodGenre] = useState(user.foodGenre);

  const [restaurantRating, setRestaurantRating] = useState(
    user.restaurantRating
  );
  const [dietaryRestrictions, setDietaryRestrictions] = useState(
    user.dietaryRestrictions
  );
  const [affordability, setAffordability] = useState(user.affordability); // probably use int here, or string.length

  const handleEdit = () => {
    setDoc(doc(db, "users", auth.currentUser.uid), {
      email: user.email,
      firstName: firstName,
      lastName: lastName,
      foodGenre: foodGenre,
      restaurantRating: restaurantRating,
      dietaryRestrictions: dietaryRestrictions,
      affordability: affordability,
      imgUrl: imgUrl,
      groupIds: user.groupIds,
    });
  };


  return (
    <View style={styles.container}>
      <Divider color="orange" />
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
                  uri: `${imgUrl}`,
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
            {/* <Input
              labelStyle={{ fontWeight: "normal" }}
              inputStyle={{ color: "white", fontSize: 14 }}
              label="Food Genre"
              // value={foodName}
              onChangeText={(text) => setFoodName(text)}
            >
              {foodName}
            </Input> */}
            <RNPickerSelect
              // labelStyle={{ fontWeight: "normal" }}
              style={pickerSelectStyles}
              label="Food Genre"
              onValueChange={(value) => setFoodName(value)}
              // onDonePress = {setFoodGenre([...foodGenre, foodName])}
              placeholder={{ label: "What are you feeling?", value: null }}
              items={[
                { label: "American", value: "newamerican" },
                { label: "Breakfast & Brunch", value: "breakfast_brunch" },
                { label: "Burgers", value: "burgers" },
                { label: "Caribbean", value: "caribbean" },
                { label: "Chinese", value: "chinese" },
                { label: "Cuban", value: "cuban" },
                { label: "French", value: "french" },
                { label: "Halal", value: "halal" },
                { label: "Indian", value: "indpak" },
                { label: "Italian", value: "italian" },
                { label: "Mediterranean", value: "mediterranean" },
                { label: "Mexican", value: "mexican" },
                { label: "Middle Eastern", value: "mideastern" },
                { label: "Pizza", value: "pizza" },
                { label: "Sandwiches", value: "sandwiches" },
                { label: "Sushi", value: "sushi" },
                { label: "Thai", value: "thai" },
                { label: "Vegan", value: "vegan" },
                { label: "Vegetarian", value: "vegetarian" },
              ]}
            />

            <TouchableOpacity
              onPress={() => {
                setFoodGenre([...foodGenre, foodName]);
                setFoodName("");
              }}
            >
              <View style={styles.buttonWrapper2}>
                <Text style={styles.button}>Add food</Text>
              </View>
            </TouchableOpacity>

            <View>
              {foodGenre.map((item, index) => (
                <View key={index} style={styles.foodGenres}>
                  <Text style={styles.foodListItem}>{item}</Text>
                  <TouchableOpacity
                    style={styles.foodButtonWrapper}
                    onPress={() => {
                      console.log("Profile.js", foodGenre);
                      setFoodGenre(
                        foodGenre.filter((currentFood) => {
                          console.log("Profile.js currentFood", currentFood);
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

            {/* <Input
              labelStyle={{ fontWeight: "normal" }}
              inputStyle={{ color: "white", fontSize: 14 }}
              label="Restaurant Rating (Out of 5)"
              value={restaurantRating}
              onChangeText={(text) => setRestaurantRating(text)}
            /> */}
            <RNPickerSelect
              // labelStyle={{ fontWeight: "normal" }}
              style={pickerSelectStyles}
              label="Affordability"
              onValueChange={(value) => setRestaurantRating(value)}
              // onDonePress = {setFoodGenre([...foodGenre, foodName])}
              placeholder={{ label: "Minimum rating?", value: 4 }}
              items={[
                { label: "*", value: 1 },
                { label: "**", value: 2 },
                { label: "***", value: 3 },
                { label: "****", value: 4 },
                { label: "*****", value: 5 },
              ]}
            />

            {/* <Input
              labelStyle={{ fontWeight: "normal" }}
              inputStyle={{ color: "white", fontSize: 14 }}
              label="Affordability (max: 4 dolalr signs)"
              value={affordability}
              onChangeText={(text) => setAffordability(text)}
            /> */}
            <RNPickerSelect
              // labelStyle={{ fontWeight: "normal" }}
              style={pickerSelectStyles}
              label="Affordability"
              onValueChange={(value) => setAffordability(value.length)}
              // onDonePress = {setFoodGenre([...foodGenre, foodName])}
              placeholder={{ label: "Price?", value: "$" }}
              items={[
                { label: "$", value: "$" },
                { label: "$$", value: "$$" },
                { label: "$$$", value: "$$$" },
                { label: "$$$$", value: "$$$$" },
              ]}
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
              label="Profile Picture Url"
              value={imgUrl}
              onChangeText={(text) => setImgUrl(text)}
            />
            {/* <Input
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
            </TouchableOpacity> */}

            <TouchableOpacity
              onPress={() => {
                handleEdit();
                getUser();
                setFoodName("");
                navigation.navigate("Home");
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
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "white",
    paddingRight: 30, // to ensure the text is never behind the icon
    marginTop: 10,
    marginBottom: 10,
  },
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1b1b1b",
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
    marginBottom: 30,
    marginTop: 30,
    paddingHorizontal: 10,
    borderRadius: 60,
    width: 150,
    backgroundColor: "orange",
    alignItems: "center",
    alignSelf: "center",
  },
  buttonWrapper2: {
    width: 100,
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
