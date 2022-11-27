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

const Events = (props) => {
  const { groupIds } = props;
  const navigation = useNavigation();
  const [events, setEvents] = useState([{ name: "Loading...", id: "unique" }]);

  useEffect(() => {
    const q = query(collection(db, "events"), orderBy("createdAt", "desc"))
    const unsub = onSnapshot(q, (snapshot)=> {
    let eventArr = []
      snapshot.docs.map(doc=> {
        if (groupIds?.includes(doc.data().groupId || groupIds == doc.data().groupId))
        eventArr.push({...doc.data(), id: doc.id})
      })
      setEvents(eventArr)
    console.log("Events.js events", events)
  })
  return unsub
  }, [groupIds]); //maybe add events


    return (
      <View style={styles.events}>
        <FlatList
          showsHorizontalScrollIndicator={false}
          data={events}
          keyExtractor={(item) => item.id}
          horizontal
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.eventList}
              onPress={() =>{
                console.log("ITEM:",item.createdAt);
                console.log("ITEM DATE:", new Date(1669511280 *1000))
                console.log(new Date(item.createdAt.seconds *1000))
                let timestemp = new Date(item.createdAt.seconds *1000).toLocaleDateString('en-US');
                console.log(timestemp)

                // navigation.navigate("SingleEvent", {
                //   eventId: item.id,
                //   currentEvent: item,
                //   groupId: item.groupId,
                // })
              }
              }
            >
              <View style={styles.shadow}>
                <Image
                  style={styles.eventImg}
                  source={{ uri: item.restImageUrl }}
                />
              </View>
              <Text style={styles.eventName}>Your Event on {new Date(item.createdAt.seconds *1000).toLocaleDateString('en-US')}</Text>
              <Text style={styles.eventLoc}>{item.restLoc}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "black",
    shadowOffset: { height: -1, width: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
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
});

export default Events;
