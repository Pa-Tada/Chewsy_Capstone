import React from "react";
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
} from "react-native";

const Home = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.logo}>Chewsy</Text>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inputWrapper}
      >
        <TextInput style={styles.input} placeholder="Email"></TextInput>
        <TextInput style={styles.input} placeholder="Password"></TextInput>
        <TouchableOpacity onPress={() => navigation.navigate("Individual")}>
          <View style={styles.buttonWrapper}>
            <Text style={styles.button}> Log in or Sign up </Text>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  // background: {
  //   flex: 1,
  //   justifyContent: "center",
  //   alignItems: "center",
  //   width: 500,
  //   opacity: 0.5,
  // },
  logo: {
    fontSize: 30,
    fontWeight: "bold",
    color: "orange",
  },
  inputWrapper: {
    paddingVertical: 30,
    paddingHorizontal: 15,
    alignItems: "center",
  },
  input: {
    color: "black",
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderColor: "#C0C0C0",
    borderRadius: 60,
    borderWidth: 1,
    width: 250,
  },
  buttonWrapper: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 60,
    borderWidth: 2,
    width: 150,
    backgroundColor: "linen",
    borderColor: "#C0C0C0",
    alignItems: "center",
  },
  button: {},
});

export default Home;
