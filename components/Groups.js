import React, { useEffect, useState } from "react";
import {StyleSheet,Text,View,TouchableOpacity,FlatList,Image,SafeAreaView,Button,Modal} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { auth, db, allUsers, allEvents } from "../firebase";
import {collection,getDocs,onSnapshot,addDoc,deleteDoc,doc,orderBy,serverTimestamp,getDoc,query,where} from "firebase/firestore";


const Groups = (props) => {
  const {groupIds} = props
  const navigation = useNavigation();
  const [groups, setGroups] = useState([{name: "Loading...", id: "unique"}]);

  const groupsRef = collection(db, "groups")
  let allGroups;
  onSnapshot(groupsRef, (docSnap)=> {
  allGroups = []
    docSnap.forEach((doc)=> {
      allGroups.push({ ...doc.data(), id: doc.id })
    })})

  useEffect(() => {
    const getGroups = async() => {
        let filteredGroups = []
        groupIds?.map((groupId)=> {
          allGroups.filter((group)=> {
            if (group.id==groupId) filteredGroups.push(group)
          })
        })
        // await groupIds?.map((groupId) => {
        //   const docRef = doc(db, "groups", groupId);
        //   onSnapshot(docRef, (doc) => {
        //     filteredGroups.push({ ...doc.data(), id: doc.id });
        //   });
        // });
        setGroups(filteredGroups)
        console.log("GROUPS", groups)
    }
    getGroups()
  }, [groups.length, groupIds]);


  if (groups.length){
  return (
        <View style={styles.groups}>
          <FlatList
          showsHorizontalScrollIndicator={false}
            data={groups}
            keyExtractor={(item) => item.id}
            horizontal
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.list}
                onPress={() => navigation.navigate("SingleGroup", {groupId: item.id, currentGroup: item})}
              >
                <View style={styles.shadow}>
                  <Image
                    style={styles.groupImg}
                    source={{ uri: item.imgUrl }}
                  />
                </View>
                <Text style={styles.name}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
  );
  } else {
    return (
      <Text> Looks like you don't have any plans yet. Create groups to get started! </Text>
    )
  }
}

const styles = StyleSheet.create({
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
    //borderWidth: 1,
    borderRadius: 15,
    marginTop: 24,
    marginRight: 8,
    width: 180,
    height: 200,
    alignItems: "center",
  },
  groupImg: {
    width: 180,
    height: 180,
    borderRadius: 15,
  },
  name: {
    marginTop: 2,
    fontWeight: "bold",
    color: "darkgray",
  },

});

export default Groups;
