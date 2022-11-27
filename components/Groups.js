import React, { useEffect, useState } from "react";
import {StyleSheet,Text,View,TouchableOpacity,FlatList,Image,SafeAreaView,Button,Modal} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { auth, db } from "../firebase";
import {collection,getDocs,onSnapshot,addDoc,deleteDoc,doc, orderBy,serverTimestamp,getDoc,query,where} from "firebase/firestore";


const Groups = (props) => {
  const {groupIds} = props
  const navigation = useNavigation();
  const [groups, setGroups] = useState([{name: "Loading...", id: "unique"}]);

  useEffect(() => {
    const q = query(collection(db, "groups"), orderBy("createdAt", "desc"))
    const unsub = onSnapshot(q, (snapshot)=> {
    let groupArr = []
      snapshot.docs.map(doc=> {
        if (groupIds?.includes(doc.id)){
          groupArr.push({...doc.data(), id: doc.id})
        }
      })
    setGroups([...groupArr])
    console.log("Groups.js groupIds", groupIds)
  })
  return unsub
  }, [groupIds?.length]); 

  return (
        <View style={styles.groups}>
          <FlatList
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
  shadow: {
    shadowColor: "black",
    shadowOffset: { height: -1, width: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
  },
  groups: {},
  list: {
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
