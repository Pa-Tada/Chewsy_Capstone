import React from "react";
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
import { Icon } from '@rneui/themed';
import Header from "../components/Header";
import Footer from "../components/Footer";

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

// const firstItem = () => {
//   const navigation = useNavigation()
// return ()
// }

const Individual = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <Header/>
      <View style={styles.groupsWrapper}>

      <View style={styles.titleContainer}>
        <Text style={styles.sectionTitle}>Your Groups</Text>
        <TouchableOpacity style={styles.iconWrapper}>
                    {/* CREATE GROUP */}
          <Icon type="antdesign" size="28px" name="addusergroup" color='gainsboro' />
        </TouchableOpacity>
        </View>

        <View style={styles.groups}>
          <FlatList
          // ListHeaderComponent={firstItem}
            data={groups}
            keyExtractor={(item) => item.id}
            horizontal
            renderItem={({ item, index }) => (
              <TouchableOpacity style={styles.list}
                onPress={() => navigation.navigate("SingleGroup")}
              >
                  <View style={styles.shadow}>
                  {/* <Image style={styles.img} source={{ uri: item.imgUrl }} /> */}
                  </View>
                  <Text style={styles.name}>{item.name}</Text>
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
              <TouchableOpacity style={styles.eventList}>
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
      <Footer/>
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
    marginTop:30,
    paddingHorizontal: 12,
    flex: 1,
  },
  groups: {},
  list: {
    borderWidth:1,
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

export default Individual;
