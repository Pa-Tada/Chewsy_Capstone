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
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Icon, Divider, Input } from "@rneui/themed";
import { auth, db, allUsers } from "../firebase";
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
  setDoc, arrayUnion
} from "firebase/firestore";
import Footer from "../components/Footer";
import Groups from "../components/Groups";
import Events from "../components/Events";
import CreateGroup from "../components/CreateGroup";


const Home = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState({});
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [member, setMember] = useState("");
  const [members, setMembers] = useState([]);

  // Oliviarodrigo@gmail.com
  const userInfo = () => {
    const filteredUser = allUsers.find(
      (user) => user.id === auth.currentUser.uid
    );
    setUser(filteredUser);
    console.log("HOMEPAGE USER", user);
  };

  useEffect(() => {
    userInfo();
  }, [user]); // try putting back in user?.groupIds

  const handleSubmit = async () => {
    setMembers([...members, member])
    const groupDocRef = await addDoc(doc(db, "groups"), {
      name: groupName,
      leaderId: auth.currentUser.uid,
      createdAt: serverTimestamp(),
      imgUrl: "https://www.clipartmax.com/png/middle/198-1980729_leadership-orange-icon-mcdonnell-douglas-f-4-phantom-ii.png",
      userIds: members,
    });
    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      groupIds: arrayUnion(groupDocRef.id)
    });
    // await updtae doc forr added user also 

    setGroupName("")
    setMember("")
    setGroupModalOpen(false)
  };

  // if (user.groupIds?.length){
  return (
    <SafeAreaView style={styles.container}>
      <Divider color="orange" />

      <Modal visible={groupModalOpen} animationType="slide" transparent={true}>
        {/* <CreateGroup/> */}
        <SafeAreaView style={styles.modalContent}>
          <KeyboardAwareScrollView>
            <View style={styles.form}>
              <Input
                labelStyle={{ fontWeight: "normal" }}
                inputStyle={{ color: "white", fontSize: 14 }}
                label="Group Name"
                value={groupName}
                onChangeText={(text) => setGroupName(text)}
              />
              <Input
                labelStyle={{ fontWeight: "normal" }}
                inputStyle={{ color: "white", fontSize: 14 }}
                label="Group Members"
                value={members}
                onChangeText={(text) => setMembers(text)}
              />
              <TouchableOpacity onPress={handleSubmit}>
                <View style={styles.buttonWrapper}>
                  <Text style={styles.button}>Create Group</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setGroupModalOpen(false)}
                style={{ color: "white" }}
              >
                <Text style={{ color: "white", textAlign: "center" }}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAwareScrollView>
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
              color="white"
            />
          </TouchableOpacity>
        </View>
        <Groups groupIds={user?.groupIds} />
      </View>
      <View style={styles.eventsWrapper}>
        <Text style={styles.sectionTitle}>Your Events</Text>
        <Events groupIds={user?.groupIds} />
      </View>
      <Footer />
    </SafeAreaView>
  );
  // } else {
  //   return (
  //     <View>
  //       <Text>Looks like you don't have any plans yet. Create groups to get started!</Text>
  //     <Footer />
  //     </View>

  //   )
};
// }

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
    marginBottom: 15,
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
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
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
  modalContent: {
    borderWidth: 0.2,
    borderTopColor: "orange",
    backgroundColor: "#181818",
    height: "50%",
    marginTop: "auto",
    alignContent: "center",
    borderRadius: 15,
  },
  button: {
    fontWeight: "semi-bold",
    fontSize: 15,
  },
  form: {
    color: "red",
    marginTop: 15,
    padding: 10,
  },
});

export default Home;
