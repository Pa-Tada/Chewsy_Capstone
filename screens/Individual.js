import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  ImageBackground,
  SafeAreaView,
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

const groups = [
  {
    id: 1,
    name: "pete's group",
  },
  { id: 2, name: "Wanda and olivia's group" },
];

const Individual = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.groupsWrapper}>
        <Text style={styles.sectionTitle}>Your Groups</Text>
        <View style={styles.groups}>
          <FlatList
            data={groups}
            keyExtractor={(item) => item.id}
            horizontal
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => navigation.navigate("SingleGroup")}
              >
                <View style={styles.list}>
                  {/* <Image style={styles.img} source={{ uri: item.imgUrl }} /> */}
                  <Text style={styles.name}>{item.name}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>

      <View style={styles.eventsWrapper}>
        <Text style={styles.sectionTitle}>Your Events</Text>
        <View style={styles.events}>
          <FlatList
            data={events}
            keyExtractor={(item) => item.index}
            horizontal
            renderItem={({ item }) => (
              <View style={styles.eventList}>
                <Image
                  style={styles.eventImg}
                  source={require("../assets/eventImg1.jpg")}
                />
                <Text style={styles.eventName}>{item.restaurantName}</Text>
                <Text style={styles.eventLoc}>{item.restaurantLocation}</Text>
              </View>
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#242526",
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  groupsWrapper: {
    paddingTop:20,
    paddingHorizontal: 6,
    flex: 1,
    justifyContent: "center",
  },
  groups: {},
  list: {
    borderWidth:1,
    marginTop: 24,
    marginHorizontal: 5,
    width: 180,
    height: 180,
    alignItems: "center",
  },
  // img: {
  //   width: 100,
  //   height: 100,
  //   borderRadius: 50,
  // },
  name: {
    marginTop: 2,
    fontWeight: "bold",
    color: "darkgray",
  },
  eventsWrapper: {
    paddingTop: 30,
    paddingHorizontal: 6,
    flex: 1,
    justifyContent: "flex-start",
  },
  events: {},
  eventList: {
    marginTop: 24,
    marginHorizontal: 5,
    width: 180,
    height: 250,
  },
  eventImg: {
    width: 180,
    height: 180,
  },
  eventName: {
    marginTop: 2,
    fontWeight: "bold",
    color: "darkgray",
  },
  eventLoc: {
    marginTop: 2,
    color: "darkgray",
  },
});

export default Individual;
