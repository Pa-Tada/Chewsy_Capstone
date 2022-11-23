import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  TextInput,
  ImageBackground,
  Platform,
} from "react-native";
import { auth, getUser, db } from "../firebase";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const Welcome = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.navigate("Home");
        getUser();
      }
    });
    return unsubscribe; // from my research this unsubscribe variable makes it so it stops pinging this listener apparently--- its possible it's not necessary
  }, []);

  const handleSignup = async () => {
    let user;
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((userCredentials) => {
        user = userCredentials.user;
      })
<<<<<<< HEAD
      .then(() => {
        setDoc(doc(db, "users", user.uid), {
          email: user.email,
          firstName: "",
          lastName: "",
          foodGenre: [],
          affordability: "$",
          restaurantRating: "4",
          dietaryRestrictions: "none",
          likedRestaurants: [],
          dislikedRestaurants: [],
          visitedRestaurants: [],
          groupIds: [],
          imgUrl: "https://cdn3.iconfinder.com/data/icons/vector-icons-6/96/256-512.png"
        });
=======
      .then(()=>{
        setDoc(doc(db, 'users', user.uid),{email:user.email, firstName:"", lastName:"", foodGenre:[],affordability:"$", restaurantRating:"4", dietaryRestrictions:"none", likedRestaurants:[], dislikedRestaurants: [], visitedRestaurants:[], imgUrl:"", groupIds:[]})
>>>>>>> main
      })
      .catch((error) => alert(error.message));
  };

  const handleLogin = () => {
    auth
      .signInWithEmailAndPassword(email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
      })
      .catch((error) => alert(error.message));
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.backgroundImg}
        source={{
          uri: "https://images.unsplash.com/photo-1533640924469-f04e06f8898d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=852&q=80",
        }}
      ></ImageBackground>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.midWrapper}
      >
        <Text style={styles.logo}>Chewsy</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          placeholderTextColor="white"
        ></TextInput>
        <TextInput
          secureTextEntry
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          placeholderTextColor="white"
        ></TextInput>
        <TouchableOpacity onPress={handleSignup}>
          <View style={styles.buttonWrapper}>
            <Text style={styles.button}>Sign Up</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogin}>
          <View style={styles.buttonWrapper}>
            <Text style={styles.button}>Log In</Text>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#242526",
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundImg: {
    flex: 1,
    width: 500,
    opacity: 0.4,
    position: "relative",
  },
  midWrapper: {
    paddingVertical: 30,
    paddingHorizontal: 15,
    alignItems: "center",
    position: "absolute",
    shadowColor: "black",
    shadowOffset: { height: 2, width: 2 },
    shadowOpacity: 1,
    shadowRadius: 1,
  },
  logo: {
    fontSize: 35,
    fontWeight: "bold",
    color: "orange",
    paddingBottom: 20,
  },
  input: {
    marginBottom: 8,
    color: "white",
    backgroundColor: "#242526",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderColor: "#C0C0C0",
    borderRadius: 60,
    borderWidth: 1,
    width: 250,
  },
  buttonWrapper: {
    paddingVertical: 10,
    marginVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 60,
    width: 150,
    backgroundColor: "orange",
    alignItems: "center",
  },
  button: {},
});

export default Welcome;
