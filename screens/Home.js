import React, { useEffect, useState } from "react";
import {StyleSheet,Text,View,TouchableOpacity,FlatList,Image,SafeAreaView,Button,Modal} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { Icon, Divider, Input } from "@rneui/themed";
import { auth, db, allUsers } from "../firebase";
import {collection,getDocs,onSnapshot,addDoc,deleteDoc,doc,orderBy,serverTimestamp,getDoc,query,where} from "firebase/firestore";
import Footer from "../components/Footer";
import Groups from "../components/Groups";
import Events from "../components/Events";

const createGroupField = [
  { id: 1, field: "Group Name" },
  { id: 2, field: "Group Members" },
];

const Home = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState({});
  const [groupModalOpen, setGroupModalOpen] = useState(false);

  // Oliviarodrigo@gmail.com
  const userInfo = () => {
    const filteredUsers = allUsers.filter((user)=> user.id===auth.currentUser.uid)
    setUser(filteredUsers[0])
    console.log("USER", user);
  };

  useEffect(() => {
     userInfo()
  }, [user.groupIds]);

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

if (user.groupIds?.length){
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
          <Text style={styles.sectionTitle}>Your Groups</Text>
          <TouchableOpacity
            style={styles.iconWrapper}
            onPress={() => setGroupModalOpen(true)}
          >
            <Icon
              type="antdesign"
              size="28px"
              name="addusergroup"
              color="gainsboro"
            />
          </TouchableOpacity>
        </View>
        <Groups groupIds={user.groupIds}/>
      </View>
      <View style={styles.eventsWrapper}>
        <Text style={styles.sectionTitle}>Your Events</Text>
        <Events groupIds={user.groupIds}/>
      </View>
      <Footer />
    </SafeAreaView>
  );
  } else {
    return (
      <Text>Looks like you don't have any plans yet. Create groups to get started!</Text>
    )
  }
}

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
  eventsWrapper: {
    paddingHorizontal: 12,
    flex: 1,
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
