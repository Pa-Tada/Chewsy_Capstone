import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Icon, Divider } from "@rneui/themed";
import { auth } from "../firebase";

import Header from "../components/Header";
import Footer from "../components/Footer";

// Dummy image - need to make dynamic based on logged in user
const events = [
  {
    id: 1,
    restaurantName: "awesome restaurant",
    restaurantLocation: "new york, new york",
    restaurantImgUrl:
      "https://static01.nyt.com/images/2018/12/16/world/16xp-davidson1/merlin_146914890_3e2b450f-94bf-472f-b717-a7b8b4004b1a-superJumbo.jpg",
    submissions: 4,
  },
  {
    id: 2,
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

const Home = () => {
  const navigation = useNavigation();
  const [trial, setTrial] = useState({});

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get("http://192.168.1.22:8080/api/events/1");
      console.log(data);
      setTrial(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Divider />

      <View style={styles.groupsWrapper}>
        <View style={styles.titleContainer}>
          <Text style={styles.sectionTitle}>
            {auth.currentUser.email}'s Groups {trial.restaurantLocation}
          </Text>
          <TouchableOpacity style={styles.iconWrapper}>
            {/* CREATE GROUP */}
            <Icon
              type="antdesign"
              size="28px"
              name="addusergroup"
              color="gainsboro"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.groups}>
          <FlatList
            data={groups}
            keyExtractor={(item) => item.id}
            horizontal
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.list}>
                {/* // navigation.navigate("SingleGroup") */}

                <View style={styles.shadow}>
                  {/* <Image style={styles.img} source={{ uri: item.imgUrl }} /> */}
                </View>
                <Text style={styles.name}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
      {/* navigation.navigate("SingleGroup") */}
      <View style={styles.eventsWrapper}>
        <Text style={styles.sectionTitle}>{auth.currentUser.email}'s Events</Text>
        <View style={styles.events}>
          <FlatList
            data={events}
            keyExtractor={(item) => item.id}
            horizontal
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={styles.eventList}
                onPress={() => navigation.navigate("SingleEvent")}
              >
                <View style={styles.shadow}>
                  <Image
                    style={styles.eventImg}
                    source={require("../assets/eventImg1.jpg")}
                  />
                </View>
                <Text style={styles.eventName}>{item.restaurantName}</Text>
                <Text style={styles.eventLoc}>{item.restaurantLocation}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
      <Footer />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#242526",
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    //backgroundColor: "dodgerblue"
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  iconWrapper: {
    shadowColor: "black",
    shadowOffset: { height: 1, width: 1 },
    shadowOpacity: 1,
    shadowRadius: 1,
  },
  shadow: {
    shadowColor: "black",
    shadowOffset: { height: -1, width: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
  },
  groupsWrapper: {
    marginTop: 30,
    paddingHorizontal: 12,
    flex: 1,
  },
  groups: {},
  list: {
    borderWidth: 1,
    borderRadius: 15,
    marginTop: 24,
    marginRight: 8,
    width: 180,
    height: 180,
    alignItems: "center",
  },
  // img: {
  //   width: 180,
  //   height: 180,
  //   borderRadius: 15,
  // },
  name: {
    marginTop: 2,
    fontWeight: "bold",
    color: "darkgray",
  },
  eventsWrapper: {
    paddingHorizontal: 12,
    flex: 1.3,
  },
  events: {},
  eventList: {
    marginTop: 24,
    marginRight: 8,
    width: 180,
    height: 250,
    borderRadius: 15,
  },
  eventImg: {
    width: 180,
    height: 180,
    borderRadius: 15,
  },
  eventName: {
    marginTop: 2,
    fontWeight: "bold",
    color: "darkgray",
  },
  eventLoc: {
    marginTop: 2,
    color: "darkgray",
    fontSize: 12,
  },
});

export default Home;
