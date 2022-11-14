import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Welcome from "./screens/Welcome";
import Home from "./screens/Home";
import SingleGroup from "./screens/SingleGroup";


export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <SafeAreaProvider>
      <Stack.Navigator>
        <Stack.Screen name="Welcome" component={Welcome} options={{headerShown:false}}/>
        <Stack.Screen name="Home" component={Home} options={{headerShown:false}}/>
        <Stack.Screen name="SingleGroup" component={SingleGroup} options={{headerShown:false}}/>
      </Stack.Navigator>
      </SafeAreaProvider>
    </NavigationContainer>
  );
}
