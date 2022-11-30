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
import Ripple from "react-native-material-ripple";

const Profile = () => {
  const navigation = useNavigation();

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
  const [affordability, setAffordability] = useState(user.affordability);

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
    <SafeAreaView style={styles.container}>
      <Divider color="orange" />
      <View style={styles.contents}>
        <View style={styles.form}>
          <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
            <Avatar
              rounded
              containerStyle={{ alignSelf: "center", paddingBottom: 6 }}
              size="large"
              source={{
                uri: `${imgUrl}`,
              }}
            />

            <View style={styles.fields}>
              <Input
                placeholder="Enter URL"
                placeholderTextColor="white"
                inputContainerStyle={{ borderBottomWidth: 0 }}
                labelStyle={{
                  fontSize: 19,
                  color: "orange",
                  fontWeight: "600",
                }}
                inputStyle={{
                  color: "white",
                  fontSize: 16,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: "gray",
                  paddingVertical: 11,
                  paddingHorizontal: 16,
                  marginTop: 10,
                  width: 300,
                }}
                label="Profile Picture"
                value={imgUrl}
                onChangeText={(text) => setImgUrl(text)}
              />
            </View>
            <View style={styles.fields}>
              <Input
                placeholder="Enter first name"
                placeholderTextColor="white"
                inputContainerStyle={{ borderBottomWidth: 0 }}
                labelStyle={{
                  color: "orange",
                  fontWeight: "600",
                  fontSize: 19,
                }}
                inputStyle={{
                  color: "white",
                  fontSize: 16,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: "gray",
                  paddingVertical: 11,
                  paddingHorizontal: 16,
                  marginTop: 10,
                }}
                label="First Name"
                value={firstName}
                onChangeText={(text) => setFirstName(text)}
              />
            </View>

            <View style={styles.fields}>
              <Input
                placeholder="Enter last name"
                placeholderTextColor="white"
                inputContainerStyle={{ borderBottomWidth: 0 }}
                labelStyle={{
                  color: "orange",
                  fontWeight: "600",
                  fontSize: 19,
                }}
                inputStyle={{
                  color: "white",
                  fontSize: 16,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: "gray",
                  paddingVertical: 11,
                  paddingHorizontal: 16,
                  marginTop: 10,
                }}
                label="Last Name"
                value={lastName}
                onChangeText={(text) => setLastName(text)}
              />
            </View>

            <View style={styles.fields}>
              <Input
                inputContainerStyle={{ borderBottomWidth: 0 }}
                labelStyle={{
                  color: "orange",
                  fontWeight: "600",
                  fontSize: 19,
                }}
                inputStyle={{
                  color: "white",
                  fontSize: 16,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: "gray",
                  paddingVertical: 11,
                  paddingHorizontal: 18,
                  marginTop: 10,
                }}
                label="Dietary Restrictions"
                value={dietaryRestrictions}
                onChangeText={(text) => setDietaryRestrictions(text)}
              />
            </View>

            <View style={styles.picker}>
              <View style={styles.fields}>
                <Text style={styles.text}>Food Genre</Text>
                <View style={styles.pickCuisine}>
                  <RNPickerSelect
                    textColor="white"
                    style={pickerSelectStylesFood}
                    label="Food Genre"
                    onValueChange={(value) => setFoodName(value)}
                    placeholder={{
                      label: "What are you feeling?",
                      value: null,
                    }}
                    items={[
                      { label: "American", value: "newamerican" },
                      {
                        label: "Breakfast & Brunch",
                        value: "breakfast_brunch",
                      },
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

                  <Ripple
                    rippleColor="#f5c007"
                    rippleSize={40}
                    rippleOpacity={0.9}
                    style={styles.plusbuttonWrapper}
                    onPress={() => {
                      setFoodGenre([...foodGenre, foodName]);
                      setFoodName("");
                    }}
                  >
                    <Text style={styles.button}>+</Text>
                  </Ripple>
                </View>

                <View>
                  {foodGenre.map((item, index) => (
                    <View key={index} style={styles.foodGenres}>
                      <Text style={styles.foodListItem}>{item}</Text>
                      <Ripple
                        rippleColor="#f5c007"
                        rippleSize={40}
                        rippleOpacity={0.9}
                        style={styles.foodButtonWrapper}
                        onPress={() => {
                          console.log("Profile.js", foodGenre);
                          setFoodGenre(
                            foodGenre.filter((currentFood) => {
                              console.log(
                                "Profile.js currentFood",
                                currentFood
                              );
                              return currentFood !== item;
                            })
                          );
                        }}
                      >
                        <Text style={styles.button}>-</Text>
                      </Ripple>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.fields}>
                <Text style={styles.text}>Minimum Rating</Text>
                <RNPickerSelect
                  style={pickerSelectStyles}
                  label="Affordability"
                  onValueChange={(value) => setRestaurantRating(value)}
                  placeholder={{ label: "Select rating", value: 4 }}
                  items={[
                    { label: "*", value: 1 },
                    { label: "**", value: 2 },
                    { label: "***", value: 3 },
                    { label: "****", value: 4 },
                    { label: "*****", value: 5 },
                  ]}
                />
              </View>

              <View style={styles.fields}>
                <Text style={styles.text}>Price Range</Text>
                <RNPickerSelect
                  style={pickerSelectStyles}
                  label="Affordability"
                  onValueChange={(value) => setAffordability(value.length)}
                  placeholder={{ label: "Select range", value: "$" }}
                  items={[
                    { label: "$", value: "$" },
                    { label: "$$", value: "$$" },
                    { label: "$$$", value: "$$$" },
                    { label: "$$$$", value: "$$$$" },
                  ]}
                />
              </View>
            </View>
            <View style={styles.fields}>
              <View style={styles.createbutton}>
                <Ripple
                  rippleColor="#f5c007"
                  rippleSize={80}
                  rippleOpacity={0.8}
                  onPress={() => {
                    handleEdit();
                    getUser();
                    setFoodName("");
                    navigation.goBack();
                  }}
                >
                  <View style={styles.buttonWrapper}>
                    <Text style={styles.button}>Edit Profile</Text>
                  </View>
                </Ripple>
                <Ripple
                  rippleColor="#f5c007"
                  rippleSize={80}
                  rippleOpacity={0.8}
                  onPress={() => {
                    navigation.goBack();
                  }}
                >
                  <View style={styles.buttonWrapper}>
                    <Text style={styles.button}>Cancel</Text>
                  </View>
                </Ripple>
              </View>
            </View>
          </KeyboardAwareScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Profile;

const pickerSelectStylesFood = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
    color: "white",
    paddingRight: 30, // to ensure the text is never behind the icon
    paddingVertical: 11,
    paddingHorizontal: 16,
    marginTop: 10,
    width: 240,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,

    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
    color: "white",
    paddingRight: 30, // to ensure the text is never behind the icon
    paddingVertical: 11,
    paddingHorizontal: 16,
    marginTop: 10,
    width: 300,
  },
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1b1b1b",
    flex: 1,
    justifyContent: "center",
  },
  contents: {
    paddingVertical: 35,
    flex: 1,
  },
  form: {
    alignSelf: "center",
  },
  fields: {
    paddingVertical: 8,
  },
  text: {
    color: "orange",
    fontWeight: "600",
    fontSize: 20,
    paddingLeft: 4,
  },
  pickCuisine: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 2,
  },
  picker: {
    //width: 260
  },
  buttonWrapper: {
    paddingVertical: 10,
    borderRadius: 60,
    width: 145,
    backgroundColor: "orange",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 10,
  },
  button: {
    fontWeight: "700",
    fontSize: 18,
    color: "#181818",
  },
  plusbuttonWrapper: {
    paddingVertical: 10,
    borderRadius: 60,
    width: 50,
    backgroundColor: "orange",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 10,
  },
  foodGenres: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 3,
    paddingRight: 3,
  },
  foodListItem: {
    color: "white",
    fontWeight: "normal",
    paddingTop: 8,
    paddingRight: 11,
  },
  foodButtonWrapper: {
    paddingVertical: 5,
    borderRadius: 60,
    width: 50,
    backgroundColor: "orange",
    alignItems: "center",
    alignSelf: "center",
  },
  createbutton: {
    paddingTop: 25,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
