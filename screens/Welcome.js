import React, { useState, useEffect, Component } from "react";
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
  Alert,
} from "react-native";
import { auth, getUser, db } from "../firebase";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import Ripple from "react-native-material-ripple";

const Welcome = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // navigation.navigate("Home");
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
      .then(() => {
        setDoc(doc(db, "users", user.uid), {
          email: user.email,
          firstName: "",
          lastName: "",
          foodGenre: [],
          affordability: 1,
          restaurantRating: 4,
          dietaryRestrictions: "none",
          groupIds: [],
          imgUrl:
            "https://cdn3.iconfinder.com/data/icons/vector-icons-6/96/256-512.png",
        });
        getUser();
      })
      .then(() => {
        return getUser();
      })
      .then(() => {
        navigation.navigate("Profile");
        setEmail("");
        setPassword("");
      })
      .catch((error) => {
        if (error.message.includes("email-already-in-use")) {
          console.log("ENTIRE ERROR", error.message);
          Alert.alert("This email already exists", "Please use another email.");
        } else if (error.message.includes("network-request-failed")) {
          Alert.alert(
            "Network error",
            "Try again later or check your internet connection."
          );
        } else {
          Alert.alert("Unknown Error", "Try again later.");
        }
      });
  };

  const handleLogin = () => {
    auth
      .signInWithEmailAndPassword(email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
      })
      .then(() => {
        navigation.navigate("Home");
        setEmail("");
        setPassword("");
      })
      .catch((error) => {
        console.log("ENTIRE ERROR", error.message);

        if (error.message.includes("user-not-found")) {
          Alert.alert("User Not Found", "Please sign up.");
        } else if (error.message.includes("invalid-email")) {
          Alert.alert("Invalid Email", "Try again.");
        } else if (error.message.includes("wrong-password")) {
          Alert.alert("Wrong Password", "Try again.");
        } else if (error.message.includes("network-request-failed")) {
          Alert.alert(
            "Network error",
            "Try again later or check your internet connection."
          );
        } else {
          Alert.alert("Unknown Error", "Try again later.");
        }
      });
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
        <Ripple
          rippleColor="#f5c007"
          rippleSize={80}
          rippleOpacity={0.8}
          onPress={handleSignup}
        >
          <View style={styles.buttonWrapper}>
            <Text style={styles.button}>Sign Up</Text>
          </View>
        </Ripple>
        <Ripple
          rippleColor="#f5c007"
          rippleSize={80}
          rippleOpacity={0.8}
          onPress={handleLogin}
        >
          <View style={styles.buttonWrapper}>
            <Text style={styles.button}>Log In</Text>
          </View>
        </Ripple>
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
  button: {
    fontWeight: "500",
  },
});

export default Welcome;
