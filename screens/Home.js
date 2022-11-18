import React, { useEffect, useState } from "react";
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
import { auth, db } from "../firebase";
import {
  collection,
  getDocs,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  orderBy,
  serverTimestamp,
  getDoc,
  query,
  where,
} from "firebase/firestore";

import Footer from "../components/Footer";

const createGroupField = [
  { id: 1, field: "Group Name" },
  { id: 2, field: "Group Members" },
];

const Home = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState({});
  const [groups, setGroups] = useState([]);
  const [events, setEvents] = useState([]);
  const [groupModalOpen, setGroupModalOpen] = useState(false);

  const getUser = async () => {
    try {
      const docRef =  doc(db, "users", auth.currentUser.uid);
      //const gettingUser = await getDoc(docRef);
      onSnapshot(docRef, (doc) => {
        setUser({ ...doc.data(), id: doc.id });
      });
      //setUser({ ...gettingUser.data(), id: gettingUser.id })
      console.log("USER", user);

      let grArr = [];
      await user.groupIds?.map(async (groupId) => {
        const docRef = doc(db, "groups", groupId);
        //   const gettingGroup = await getDoc(docRef);
        //   arr.push({ ...gettingGroup.data(), id: gettingGroup.id });
        // });
        onSnapshot(docRef, (doc) => {
          grArr.push({ ...doc.data(), id: doc.id });
        });
      });
      setGroups(grArr);
      console.log("GROUPS", groups);

      let evArr = [];
      await user.groupIds?.map((groupId) => {
        const colRef = collection(db, "events");
        const gettingEvent = query(
          colRef,
          where("groupId", "==", `${groupId}`)
        );
        onSnapshot(gettingEvent, (snapshot) => {
          snapshot.docs.forEach((doc) => {
            evArr.push({ ...doc.data(), id: doc.id });
          });
        });
      });
      setEvents(evArr);
      console.log("EVENTS", events);
    } catch (err) {
      console.log(err);
    }
  };


  useEffect(() => {
    getUser()
  }, []);

   //  useEffect(() => {
  // const getUser = async () => {
  //   try {
    // const docRef = doc(db, "users", auth.currentUser.uid);
    // //const gettingUser = await getDoc(docRef);
    // onSnapshot(docRef, (doc) => {
    //   setUser({ ...doc.data(), id: doc.id });
    // });
    // console.log("USER", user);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
  //getUser()
//  }, []);

 //  useEffect(() => {
  // const getGroups = async () => {
  //   try {
    // let grArr = [];
    // await user.groupIds?.map(async (groupId) => {
    //   const docRef = doc(db, "groups", groupId);
    //   //   const gettingGroup = await getDoc(docRef);
    //   //   arr.push({ ...gettingGroup.data(), id: gettingGroup.id });
    //   // });
    //   onSnapshot(docRef, (doc) => {
    //     grArr.push({ ...doc.data(), id: doc.id });
    //   });
    // });
    // setGroups(grArr);
    // console.log("GROUPS", groups);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
  //getGroups()
//  }, []);

//  useEffect(() => {
  // const getEvents = async () => {
  //   try {
    // let evArr = [];
    // await user.groupIds?.map((groupId) => {
    //   const colRef = collection(db, "events");
    //   const gettingEvent = query(
    //     colRef,
    //     where("groupId", "==", `${groupId}`)
    //   );
    //   onSnapshot(gettingEvent, (snapshot) => {
    //     snapshot.docs.forEach((doc) => {
    //       evArr.push({ ...doc.data(), id: doc.id });
    //     });
    //   });
    // });
    // setEvents(evArr);
    // console.log("EVENTS", events);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
  //getEvents()
//  }, []);


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
            </View>
          </View>
        </SafeAreaView>
      </Modal>

      <View style={styles.groupsWrapper}>
        <View style={styles.titleContainer}>
          <Text style={styles.sectionTitle}>{user.firstName}'s Groups</Text>
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
      <View style={styles.eventsWrapper}>
        <Text style={styles.sectionTitle}>{user.firstName}'s Events</Text>
        <View style={styles.events}>
          <FlatList
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
                    source={{ uri: item.restImgUrl }}
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
  img: {},
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
