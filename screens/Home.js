import React, { useState } from "react";
//import axios from "axios";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  SafeAreaView,
  Button,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Icon, Divider, Input } from "@rneui/themed";

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

// const fetchUsers = async () =>{
//   try{

//     const {data} = await axios.get('/api/users')
//     console.log('hello')
//     console.log(data)
//     return data
//    }catch(error){
//      console.error(error)
//    }
// }

const createGroupField = [
  { id: 1, field: "Group Name" },
  { id: 2, field: "Group Members" },
];

const Home = () => {
  const navigation = useNavigation();

  const groupLastItem = () => {
    return (
      <View>
        <TouchableOpacity onPress={() => setGroupModalOpen(false)}>
          <View style={styles.buttonWrapper}>
            <Text style={styles.button}>Create Group</Text>
          </View>
        </TouchableOpacity>
        <Button
          title="Cancel"
          onPress={() => setGroupModalOpen(false)}
        ></Button>
      </View>
    );
  };
  const [groupModalOpen, setGroupModalOpen] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <Divider />
      <Modal visible={groupModalOpen} animationType="slide">
        <SafeAreaView style={styles.modalContent}>
          <View style={styles.modalContent}>
            <View style={styles.container}>
              <Divider />
              <View style={styles.contents}>
                <Text style={styles.sectionTitle}>Create Group</Text>

                <View style={styles.form}>
                  <FlatList
                    ListFooterComponent={groupLastItem}
                    data={createGroupField}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                      <Input
                        labelStyle={{ fontWeight: "normal" }}
                        inputStyle={{ color: "white", fontSize: 14 }}
                        label={item.field}
                      />
                    )}
                  />
                </View>
              </View>
              {/* <Footer /> */}
            </View>
          </View>
        </SafeAreaView>
      </Modal>

      <View style={styles.groupsWrapper}>
        <View style={styles.titleContainer}>
          <Text style={styles.sectionTitle}>Your Groups</Text>
          <TouchableOpacity
            style={styles.iconWrapper}
            onPress={() => setGroupModalOpen(true)}
          >
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
              <TouchableOpacity
                style={styles.list}
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
      {/* navigation.navigate("SingleGroup") */}
      <View style={styles.eventsWrapper}>
        <Text style={styles.sectionTitle}>Your Events</Text>
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
  buttonWrapper: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 60,
    width: 150,
    backgroundColor: "orange",
    alignItems: "center",
    alignSelf: "center",
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
  modalToggle: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#f2f2f2",
    padding: 10,
    borderRadius: 10,
    alignSelf: "center",
  },
  modalContent: {
    flex: 1,
  },
});

export default Home;
