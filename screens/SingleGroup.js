import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Image,
  ImageBackground,
  SafeAreaView,
} from "react-native";

const events = [
  {
    groupId: 1,
    restaurantName: "awesome restaurant and more words",
    restaurantLocation: "soho, new york city, new york",
    restaurantImgUrl:
      "https://static01.nyt.com/images/2018/12/16/world/16xp-davidson1/merlin_146914890_3e2b450f-94bf-472f-b717-a7b8b4004b1a-superJumbo.jpg",
    submissions: 4,
  },
  {
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
    userId: 1,
    firstName: "Pete",
    lastName: "Davidson",
    imgUrl:
      "https://static01.nyt.com/images/2018/12/16/world/16xp-davidson1/merlin_146914890_3e2b450f-94bf-472f-b717-a7b8b4004b1a-superJumbo.jpg",
  },
  {
    userId: 2,
    firstName: "Olivia",
    lastName: "Rodrigo",
    imgUrl:
      "https://people.com/thmb/dv8KhUNc3TKeFQomQQK_ED3k4tA=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():focal(719x289:721x291)/Olivia-Rodrigo-fdf97f03ad6b4b94a178c3d6088b7308.jpg",
  },
  {
    userId: 3,
    firstName: "Charles",
    lastName: "Barkely",
    imgUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/1_charles_barkley_2019_%28cropped%29.jpg/1200px-1_charles_barkley_2019_%28cropped%29.jpg",
  },
  {
    userId: 4,
    firstName: "Wanda",
    lastName: "Sykes",
    imgUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlhhuFmKXC41WL4-MVoLkxg_8ZdO38ab4txZ3v9vGTgm46Hv4tyAsUI20&s",
  },
  {
    userId: 5,
    firstName: "Captain",
    lastName: "America",
    imgUrl:
      "https://c8.alamy.com/comp/CPNCC5/captain-america-the-first-avenger-CPNCC5.jpg",
  },
  {
    userId: 6,
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
        <Text style={styles.sectionTitle}>Your Friends</Text>
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

      <View style={styles.buttonWrapper}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Create Event</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#E8EAED",
    flex: 1,
    alignItems: "center",
    backgroundColor: "#242526",
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  friendsWrapper: {
    paddingTop:40,
    paddingHorizontal: 6,
    flex: 2,
    justifyContent: "center",
    // backgroundColor: "blue"
  },
  friends: {},
  list: {
    marginTop: 24,
    marginHorizontal: 5,
    borderRadius: 50,
    width: 100,
    height: 200,
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
    paddingHorizontal: 6,
    flex: 2,
    justifyContent: "center",
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
  buttonWrapper: {
    paddingVertical: 30,
    paddingHorizontal: 10,
    flex: 0.2,
    justifyContent: "center",
  },
  button: {
    borderRadius: 60,
    width: 250,
    height: 50,
    backgroundColor: "orange",
  },
  buttonText: {
    paddingTop: 10,
    textAlign: "center",
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default SingleGroup;
