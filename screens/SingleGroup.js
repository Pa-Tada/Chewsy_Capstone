import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Image,
  SafeAreaView,
  Modal,
  Button,
} from "react-native";
import { auth, db, currUser, allUsers, allGroups, allEvents } from "../firebase";
import {collection,getDocs,onSnapshot,addDoc,deleteDoc,doc,orderBy,serverTimestamp,getDoc,query,where} from "firebase/firestore";
import { Icon, Divider, Input } from "@rneui/themed";
import Footer from "../components/Footer";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";


const addFriendField = [{ id: 1, field: "Email/Username" }];
const addEventField = [
  { id: 1, field: "Event Time" },
  { id: 2, field: "Event Date" },
];

const SingleGroup = ({ route }) => {
  const { groupId, currentGroup } = route.params
  const navigation = useNavigation();
  const [friends, setFriends] = useState([]);
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [eventModalOpen, setEventModalOpen] = useState(false);

  const groupActivity = () => {
    let filteredEvents = []
      allEvents.filter((event)=> {
        if (event.groupId==groupId) filteredEvents.push(event)
    })
    setEvents(filteredEvents)
    console.log("EVENTS", events)

    let members = []
    currentGroup.userIds?.map((userId)=> {
      allUsers.filter((user)=> {
       if (user.id==userId  && user.id != auth.currentUser.uid) members.push(user)
     })
   })
   setFriends(members)
  }

  useEffect(()=> {
   groupActivity()
  }, [])

  const lastItem = () => {
    return (
      <View>
        <TouchableOpacity onPress={() => setModalOpen(false)}>
          <View style={styles.buttonWrapper}>
            <Text style={styles.button}>Submit</Text>
          </View>
        </TouchableOpacity>
        <Button title="Cancel" onPress={() => setModalOpen(false)}></Button>
      </View>
    );
  };

  const eventLastItem = () => {
    return (
      <View>
        <TouchableOpacity onPress={() => setEventModalOpen(false)}>
          <View style={styles.buttonWrapper}>
            <Text style={styles.button}>Create Event</Text>
          </View>
        </TouchableOpacity>
        <Button
          title="Cancel"
          onPress={() => setEventModalOpen(false)}
        ></Button>
      </View>
    );
  };


  return (
    <SafeAreaView style={styles.container}>
      <Divider />
      <Modal visible={modalOpen} animationType="slide">
        <SafeAreaView style={styles.modalContent}>
          <View style={styles.modalContent}>
            <View style={styles.container}>
              <Divider />
              <View style={styles.contents}>
                <Text style={styles.sectionTitle}>Add Friends</Text>

                <View style={styles.form}>
                  <FlatList
                    ListFooterComponent={lastItem}
                    data={addFriendField}
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

      <View style={styles.friendsWrapper}>
        <View style={styles.titleContainer}>
          <Text style={styles.sectionTitle}>Friends In Group</Text>
          <TouchableOpacity
            style={styles.iconWrapper}
            onPress={() => setModalOpen(true)}
          >
            {/* ADD FRIEND */}
            <Icon
              type="antdesign"
              size="28px"
              name="adduser"
              color="gainsboro"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.friends}>
          <FlatList
          showsHorizontalScrollIndicator={false}
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
      <Modal visible={eventModalOpen} animationType="slide">
        <SafeAreaView style={styles.modalContent}>
          <View style={styles.modalContent}>
            <View style={styles.container}>
              <Divider />
              <View style={styles.contents}>
                <Text style={styles.sectionTitle}>Create Event</Text>

                <View style={styles.form}>
                  <FlatList
                    ListFooterComponent={eventLastItem}
                    data={addEventField}
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

      <View style={styles.eventsWrapper}>
        <View style={styles.titleContainer}>
          <Text style={styles.sectionTitle}>Group Events</Text>
          <TouchableOpacity
            style={styles.iconWrapper}
            onPress={() => setEventModalOpen(true)}
          >
            <Icon
              type="material-community"
              size="30px"
              name="calendar-plus"
              color="gainsboro"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.events}>
          <FlatList
          showsHorizontalScrollIndicator={false}
            data={events}
            keyExtractor={(item) => item.id}
            horizontal
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.eventList}
                onPress={() => navigation.navigate("SingleEvent")}
              >
                <View style={styles.shadow}>
                  <Image
                    style={styles.eventImg}
                    source={{uri: item.restImgUrl}}
                  />
                </View>

                <Text style={styles.eventName}>{item.restName}</Text>
                <Text style={styles.eventLoc}>{item.restLoc}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>

      <Footer />
    </SafeAreaView>
  );
};

export const styles = StyleSheet.create({
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
    alignContent: "center",
    justifyContent: "center",
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
    marginTop: 30,
    paddingHorizontal: 12,
    flex: 1,
  },
  friends: {},
  list: {
    marginTop: 24,
    marginRight: 8,
    width: 150,
    height: 300,
    borderRadius: 50,
    alignItems: "center",
  },
  img: {
    width: 150,
    height: 150,
    borderRadius: 70,
  },
  name: {
    marginTop: 2,
    fontWeight: "bold",
    color: "darkgray",
  },
  eventsWrapper: {
    paddingHorizontal: 12,
    flex: 1,
  },
  events: {},
  eventList: {
    marginTop: 24,
    marginRight: 8,
    width: 180,
    height: 250,
    borderRadius: 15,
    alignItems: "center",
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

export default SingleGroup;
