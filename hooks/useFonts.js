import * as Font from "expo-font";
// import { Inter_300Light } from '@expo-google-fonts/inter';
import { Pacifico_400Regular } from "@expo-google-fonts/pacifico";
import { Inter_400Regular } from "@expo-google-fonts/inter";

export default useFonts = async () => {
  await Font.loadAsync({
    Pacifico_400Regular: Pacifico_400Regular,
    Inter_400Regular: Inter_400Regular,
  });
};
