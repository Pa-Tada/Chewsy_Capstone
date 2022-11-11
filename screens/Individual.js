import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const events = [
  {
    restaurantName: "awesome restaurant",
    restaurantLocation: "new york, new york",
    restaurantImgUrl:
      "https://static01.nyt.com/images/2018/12/16/world/16xp-davidson1/merlin_146914890_3e2b450f-94bf-472f-b717-a7b8b4004b1a-superJumbo.jpg",
    submissions: 4,
  },
  {
    restaurantName: "awesome restaurant 2",
    restaurantLocation: "new york, new york",
    restaurantImgUrl:
      "https://static01.nyt.com/images/2018/12/16/world/16xp-davidson1/merlin_146914890_3e2b450f-94bf-472f-b717-a7b8b4004b1a-superJumbo.jpg",
    submissions: 2,
  },
];

const Individual = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.groupsWrapper}>
        <Text style={styles.sectionTitle}> Your Groups </Text>
        <View style={styles.groups}>
          <TouchableOpacity onPress={() => navigation.navigate("SingleGroup")}>
            <View style={styles.buttonWrapper}>
              <Text style={styles.button}> Group 1 </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.eventsWrapper}>
        <Text style={styles.sectionTitle}> Your Events </Text>
        <View style={styles.events}>
          <FlatList
            data={events}
            keyExtractor={(item) => item.index}
            horizontal
            renderItem={({ item }) => (
              <View style={styles.eventList}>
                {/* <Image
                  style={styles.eventImg}
                  source={require("../assets/eventImg1.jpg")}
                /> */}
                <Text style={styles.eventName}> {item.restaurantName} </Text>
                <Text style={styles.eventLoc}> {item.restaurantLocation} </Text>
              </View>
            )}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  groupsWrapper: {
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  groups: {},
  eventsWrapper: {},
  events: {},
  buttonWrapper: {
    padding: 10,
    backgroundColor: "linen",
    borderColor: "#C0C0C0",
    alignItems: "center",
    marginTop: 24,
    marginHorizontal: 5,
    borderWidth: 1,
    width: 180,
    height: 180,
  },
  eventList: {
    marginTop: 24,
    marginHorizontal: 5,
    padding: 10,
    borderColor: "black",
    borderWidth: 1,
    width: 180,
    height: 180,
  },
  eventImg: {
    resizeMode: "contain",
  },
});

export default Individual;
