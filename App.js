import React, { useState } from "react";
import { Provider } from "react-redux";
//import store from "./redux/store.js"
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Welcome from "./screens/Welcome";
import Home from "./screens/Home";
import SingleGroup from "./screens/SingleGroup";
import SingleEvent from "./screens/SingleEvent";
//import AppLoading from "expo-app-loading";
//import useFonts from "./hooks/useFonts";
import Profile from "./screens/Profile";
//import AppLoading from "expo-splash-screen"



export default function App() {
  const Stack = createNativeStackNavigator();

  // const [IsReady, SetIsReady] = useState(false);

  // const FontLoading = async () => {
  //   await useFonts(); // Font is being loaded here
  // };

  // if (!IsReady) {
  //   return (
  //     <AppLoading
  //       startAsync={FontLoading}
  //       onFinish={() => SetIsReady(true)}
  //       onError={() => {}}
  //     />
  //   );
  // }

  return (
    <NavigationContainer>
      <SafeAreaProvider>

        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: "#242526",
            },
            headerTintColor: "orange",
            headerTitleStyle: {
              fontSize: 20,
              fontWeight: "bold",
              //fontFamily: "Pacifico_400Regular"
            },
          }}
        >

          <Stack.Screen
            name="Welcome"
            component={Welcome}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Home"
            component={Home}

            options={{ title: "Chewsy", headerBackVisible: false }}

          />
          <Stack.Screen
            name="SingleGroup"
            component={SingleGroup}

            options={{ title: "Chewsy", headerBackVisible: false }}
          />
          <Stack.Screen
            name="SingleEvent"
            component={SingleEvent}

            options={{ title: "Chewsy", headerBackVisible: false }}
          />
          <Stack.Screen
            name="Profile"
            component={Profile}
            options={{ title: "Chewsy", headerBackVisible: false }}

          />
        </Stack.Navigator>
      </SafeAreaProvider>
    </NavigationContainer>
  );
}
