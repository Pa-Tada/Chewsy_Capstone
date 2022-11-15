import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Welcome from "./screens/Welcome";
import Home from "./screens/Home";
import SingleGroup from "./screens/SingleGroup";
import SingleEvent from "./screens/SingleEvent";
import AppLoading from "expo-app-loading";
import useFonts from "./hooks/useFonts";

export default function App() {
  const Stack = createNativeStackNavigator();

  const [IsReady, SetIsReady] = useState(false);

  const FontLoading = async () => {
    await useFonts(); // Font is being loaded here
  };

  if (!IsReady) {
    return (
      <AppLoading
        startAsync={FontLoading}
        onFinish={() => SetIsReady(true)}
        onError={() => {}}
      />
    );
  }

  return (
    <NavigationContainer>
      <SafeAreaProvider>
        <Stack.Navigator>
          <Stack.Screen
            name="Welcome"
            component={Welcome}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SingleGroup"
            component={SingleGroup}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SingleEvent"
            component={SingleEvent}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </SafeAreaProvider>
    </NavigationContainer>
  );
}
