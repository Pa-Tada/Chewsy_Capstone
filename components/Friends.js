import React, { useEffect, useState, useReducer } from "react";
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
  Alert,
} from "react-native";
import { auth, db, getUser, user } from "../firebase";
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
  updateDoc,
  arrayRemove,
} from "firebase/firestore";
import { Icon, Divider, Input } from "@rneui/themed";
import Footer from "../components/Footer";
import { useNavigation } from "@react-navigation/native";
import Animated, {
  interpolate,
  Extrapolate,
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import Ripple from "react-native-material-ripple";

// const CARD_LENGTH = 150;
// const SPACING = 8;
// const SIDECARD_LENGTH = 5;
// const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const Friends = (props) => {
  const { currentGroup, groups, setGroup, friends, setFriends } = props;
  const navigation = useNavigation();

  const handleDelete = async (memberId, index, firstName) => {
    Alert.alert("Delete", `Are you sure you want to delete ${firstName}?`, [
      {
        text: "Cancel",
        onPress: () => {
          console.log("Cancel delete");
        },
        style: "cancel",
      },
      {
        text: "OK",
        onPress: async () => {
          console.log("OK Deleting memberId", firstName, memberId);

//--------------------REMOVE GROUP FROM USER---------------------
          await updateDoc(doc(db, "users", memberId), {
            groupIds: arrayRemove(currentGroup.id),
          });

//-------------REMOVE USER FROM GROUP'S EVENTS' SUBMISSIONS------------
          const q = query(
            collection(db, "events"),
            where("groupId", "==", `${currentGroup.id}`)
          );
          console.log("FRIENDS.JS QUERIED EVENT", query);
          onSnapshot(q, (snapshot)=> {
            snapshot.docs.map(async (snap)=> {
              await updateDoc(doc(db, "events", snap.id), {
                submissions: arrayRemove(memberId),
              });
            })})

//--------------------REMOVE USER FROM FRIENDS STATE---------------------
          // await setFriends((prevState) => {
          //   const removed = prevState.splice(index, 1);
          //   return [...prevState];
          // });
          await setFriends(friends.filter((friend) => friend.id != memberId));

//--------------------REMOVE USER FROM GROUP (IF REMOVING SELF, NAVIGATE HOME)---------------------
          if (memberId == auth.currentUser.uid) {
            let nextLeader = friends[0].id;
            await updateDoc(doc(db, "groups", currentGroup.id), {
              userIds: arrayRemove(memberId),
              leaderId: nextLeader,
            });
            navigation.navigate("Home", { deletedGroupId: currentGroup.id });
          } else {
            await updateDoc(doc(db, "groups", currentGroup.id), {
              userIds: arrayRemove(memberId),
            });
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.friends}>
      <FlatList
        extraData={friends}
        showsHorizontalScrollIndicator={false}
        data={friends}
        keyExtractor={(item) => item.id}
        horizontal
        renderItem={({ item, index }) => (
          <View style={styles.list}>
            <Image style={styles.img} source={{ uri: item.imgUrl }} />
            <Text style={styles.name}>{item.firstName}</Text>
            {auth.currentUser.uid == currentGroup.leaderId ? (
              <Ripple rippleColor="#fff"
                style={styles.iconWrapper}
                onPress={() => handleDelete(item.id, index, item.firstName)}
              >
                <Icon
                  type="material-community"
                  name="delete-outline"
                  color="white"
                  style={styles.icon}
                />
              </Ripple>
            ) : auth.currentUser.uid == item.id ? (
              <Ripple rippleColor="#fff"
                style={styles.iconWrapper}
                onPress={() => handleDelete(item.id, index, item.firstName)}
              >
                <Icon
                  type="material-community"
                  name="delete-outline"
                  color="white"
                  style={styles.icon}
                />
              </Ripple>
            ) : null}
          </View>
        )}
      />
    </View>
  );
};

export const styles = StyleSheet.create({
  // card: {
  //   width: CARD_LENGTH,
  //   overflow: "hidden",
  //   borderRadius: 15,
  // },
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
  iconWrapper: {
    marginTop: 12,
    shadowColor: "black",
    shadowOffset: { height: 2, width: 2 },
    shadowOpacity: 1,
    shadowRadius: 2,
  },
  icon: {
    // width: 35,
    // height: 35,
    // borderRadius: 50,
  },
});

export default Friends;
