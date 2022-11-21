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
import { auth, db } from "../firebase";
import {collection,getDocs,onSnapshot,addDoc,deleteDoc,doc,orderBy,serverTimestamp,getDoc,query,where} from "firebase/firestore";
import { Icon, Divider, Input } from "@rneui/themed";
import Footer from "../components/Footer";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Events from "../components/Events";


const addFriendField = [{ id: 1, field: "Email/Username" }];
const addEventField = [
  { id: 1, field: "Event Time" },
  { id: 2, field: "Event Date" },
];

const Friends = (props) => {
  const { currentGroup } = props
  const navigation = useNavigation();
  const [friends, setFriends] = useState([]);

  useEffect(()=> {
    const unsub = onSnapshot(collection(db, "users"),  (snapshot)=> {
      let members = []
        snapshot.docs.map(doc=> {
          if (currentGroup.userIds?.includes(doc.id) && doc.id != auth.currentUser.uid)
          members.push({...doc.data(), id: doc.id})
        })
      setFriends(members)
      console.log("FRIENDS", friends)
    })

    return unsub
  }, [currentGroup])

  return (
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
  );
};

export const styles = StyleSheet.create({
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
});

export default Friends;
