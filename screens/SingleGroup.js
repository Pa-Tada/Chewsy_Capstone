import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Image,
  SafeAreaView,
} from "react-native";
import { Icon } from '@rneui/themed';
import Footer from "../components/Footer";
import Header from "../components/Header";

const events = [
  {
    id: 1,
    groupId: 1,
    restaurantName: "awesome restaurant and more words",
    restaurantLocation: "soho, new york city, new york",
    restaurantImgUrl:
      "https://static01.nyt.com/images/2018/12/16/world/16xp-davidson1/merlin_146914890_3e2b450f-94bf-472f-b717-a7b8b4004b1a-superJumbo.jpg",
    submissions: 4,
  },
  {
    id: 2,
    groupId: 2,
    restaurantName: "awesome restaurant 2",
    restaurantLocation: "harlem, new york city, new york",
    restaurantImgUrl:
      "https://static01.nyt.com/images/2018/12/16/world/16xp-davidson1/merlin_146914890_3e2b450f-94bf-472f-b717-a7b8b4004b1a-superJumbo.jpg",
    submissions: 2,
  },
];

const friends = [
  {
    id: 1,
    firstName: "Pete",
    lastName: "Davidson",
    imgUrl:
      "https://static01.nyt.com/images/2018/12/16/world/16xp-davidson1/merlin_146914890_3e2b450f-94bf-472f-b717-a7b8b4004b1a-superJumbo.jpg",
  },
  {
    id: 2,
    firstName: "Olivia",
    lastName: "Rodrigo",
    imgUrl:
      "https://people.com/thmb/dv8KhUNc3TKeFQomQQK_ED3k4tA=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():focal(719x289:721x291)/Olivia-Rodrigo-fdf97f03ad6b4b94a178c3d6088b7308.jpg",
  },
  {
    id: 3,
    firstName: "Charles",
    lastName: "Barkely",
    imgUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/1_charles_barkley_2019_%28cropped%29.jpg/1200px-1_charles_barkley_2019_%28cropped%29.jpg",
  },
  {
    id: 4,
    firstName: "Wanda",
    lastName: "Sykes",
    imgUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlhhuFmKXC41WL4-MVoLkxg_8ZdO38ab4txZ3v9vGTgm46Hv4tyAsUI20&s",
  },
  {
    id: 5,
    firstName: "Captain",
    lastName: "America",
    imgUrl:
      "https://c8.alamy.com/comp/CPNCC5/captain-america-the-first-avenger-CPNCC5.jpg",
  },
  {
    id: 6,
    firstName: "Larry",
    lastName: "David",
    imgUrl:
      "https://c8.alamy.com/comp/2HYCH09/larry-david-attending-the-natural-resources-defense-councils-stand-up!-event-at-the-wallis-annenberg-center-for-the-performing-arts-2HYCH09.jpg",
  },
];

const SingleGroup = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.friendsWrapper}>

      <View style={styles.titleContainer}>
        <Text style={styles.sectionTitle}>Your Friends</Text>
        <TouchableOpacity style={styles.iconWrapper}>
                    {/* ADD FRIEND */}
          <Icon type="antdesign" size="28px" name="adduser" color='gainsboro' />
        </TouchableOpacity>
        </View>

        <View style={styles.friends}>
          <FlatList
            data={friends}
            keyExtractor={(item) => item.id}
            horizontal
            renderItem={({ item }) => (
              <View style={styles.list}>
                  <Image style={styles.img} source={{ uri: item.imgUrl }} />
                <Text style={styles.name}>{item.firstName}</Text>
              </View>
            )}
          />
        </View>
      </View>

      <View style={styles.eventsWrapper}>

      <View style={styles.titleContainer}>
        <Text style={styles.sectionTitle}>Your Events</Text>
        <TouchableOpacity style={styles.iconWrapper}>
                    {/* CREATE EVENT*/}
          <Icon type="material-community" size="30px" name="calendar-plus" color='gainsboro' />
        </TouchableOpacity>
        </View>

        <View style={styles.events}>
          <FlatList
            data={events}
            keyExtractor={(item) => item.id}
            horizontal
            renderItem={({ item, index }) => (
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

      {/* <View style={styles.buttonWrapper}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Create Event</Text>
        </TouchableOpacity>
      </View> */}
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
  friendsWrapper: {
    marginTop:30,
    paddingHorizontal: 12,
    flex: 1,
  },
  friends: {},
  list: {
    marginTop: 24,
    marginRight: 8,
    width: 100,
    height: 200,
    borderRadius: 50,
    alignItems: "center",
  },
  img: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
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
  // buttonWrapper: {
  //   paddingVertical: 30,
  //   paddingHorizontal: 10,
  //   flex: 0.2,
  //   justifyContent: "center",
  // },
  // button: {
  //   borderRadius: 60,
  //   width: 250,
  //   height: 50,
  //   backgroundColor: "orange",
  // },
  // buttonText: {
  //   paddingTop: 10,
  //   textAlign: "center",
  //   color: "black",
  //   fontSize: 20,
  //   fontWeight: "bold",
  // },
});

export default SingleGroup;
