import React, { useEffect, useState, useReducer } from "react";
import {StyleSheet,Text,View,TouchableOpacity,FlatList,Image,SafeAreaView,Button,Modal, ViewToken} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth, db, getUser, allUsers } from "../firebase";
import {collection,getDocs,onSnapshot,addDoc,deleteDoc,doc, orderBy,serverTimestamp,getDoc,query,where} from "firebase/firestore";
import Animated, { useSharedValue, withTiming, useAnimatedStyle } from "react-native-reanimated";


const Groups = (props) => {
  const {groupIds, setUser, user} = props
  const navigation = useNavigation();
  const [groups, setGroups] = useState([{name: "Loading...", id: "unique"}]);

  useEffect(() => {
    //console.log("GROUPS.JS GROUPID", groupIds);
    const q = query(collection(db, "groups"), orderBy("createdAt", "desc"))
    const unsub = onSnapshot(q, (snapshot)=> {
    let groupArr = []
      snapshot.docs.map(doc=> {
        if (groupIds.includes(doc.id)){
          groupArr.push({...doc.data(), id: doc.id})
        }
      })
    setGroups([...groupArr])
    //console.log("GROUPS.JS GROUPID", groupIds);
  })
  return unsub
  }, [groupIds?.length]);


//const viewableItems= useSharedValue([])

  return (
        <View style={styles.groups}>
          <FlatList
          // onViewableItemsChanged={({vItems})=> {
          //   viewableItems.value=vItems
          // }}
          extraData={groups}
          showsHorizontalScrollIndicator={false}
            data={groups}
            keyExtractor={(item) => item?.id}
            horizontal
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.list}
                onPress={() => navigation.navigate("SingleGroup", {groupId: item.id, currentGroup: item, groups: groups})}
              >
                <View style={styles.shadow}>
                  <Image
                    style={styles.groupImg}
                    source={{ uri: item?.imgUrl }}
                  />
                </View>
                <Text style={styles.name}>{item?.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
  );
}

const styles = StyleSheet.create({
  groups: {},
  list: {
    borderRadius: 15,
    marginTop: 24,
    marginRight: 8,
    width: 180,
    height: 200,
    alignItems: "center",
  },
  shadow: {
    shadowColor: "black",
    shadowOffset: { height: -1, width: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
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
