import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./screens/Home";
import Individual from "./screens/Individual";
import SingleGroup from "./screens/SingleGroup";

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} options={{headerShown:false}}/>
        <Stack.Screen name="Individual" component={Individual} options={{headerShown:false}}/>
        <Stack.Screen name="SingleGroup" component={SingleGroup} options={{headerShown:false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
