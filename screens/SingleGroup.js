import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Image,
  ImageBackground,
} from "react-native";

const events = [
  {
    groupId: 1,
    restaurantName: "awesome restaurant",
    restaurantLocation: "new york, new york",
    restaurantImgUrl:
      "https://static01.nyt.com/images/2018/12/16/world/16xp-davidson1/merlin_146914890_3e2b450f-94bf-472f-b717-a7b8b4004b1a-superJumbo.jpg",
    submissions: 4,
  },
  {
    groupId: 2,
    restaurantName: "awesome restaurant 2",
    restaurantLocation: "new york, new york",
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
    <View style={styles.container}>
      <View style={styles.friendsWrapper}>
        <Text style={styles.sectionTitle}> Your Friends </Text>
        <View style={styles.friends}>
          <FlatList
            data={friends}
            keyExtractor={(item) => item.id}
            horizontal
            renderItem={({ item }) => (
              <View style={styles.list}>
                <Image style={styles.img} source={item.imgUrl} />
                <Text style={styles.name}> {item.firstName} </Text>
              </View>
            )}
          />
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

      <TouchableOpacity>
        <View style={styles.buttonWrapper}>
          <Text style={styles.button}> Create Event</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#E8EAED",
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  friends: {
    padding: 2,
    paddingLeft: 6,
    paddingBottom: 8,
    paddingTop: 4,
  },
  list: {
    backgroundColor: "pink",
    marginTop: 24,
    marginHorizontal: 5,
    padding: 10,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 50,
    width: 80,
    height: 80,
  },
  img: {
    resizeMode: "contain",
  },
  name: {
    marginTop: 2,
    fontWeight: "bold",
  },
  buttonWrapper: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 60,
    borderWidth: 2,
    width: 150,
    backgroundColor: "linen",
    borderColor: "#C0C0C0",
    alignItems: "center",
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
  }
});

export default SingleGroup;
