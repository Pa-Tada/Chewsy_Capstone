import React, { useEffect, useState, useReducer } from "react";
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
import { auth, db, allUsers, getUser } from "../firebase";
import {collection,getDocs,onSnapshot,addDoc,deleteDoc,doc,orderBy,serverTimestamp,getDoc,query,where} from "firebase/firestore";
import Footer from "../components/Footer";
import Groups from "../components/Groups";
import Events from "../components/Events";
import CreateGroup from "../components/CreateGroup";
import { LinearGradient } from "expo-linear-gradient";
import Ripple from "react-native-material-ripple";

const Home = ({ route }) => {
  const navigation = useNavigation();
  const [user, setUser] = useState({});
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [groupIds, setGroupIds] = useState([])


  const userInfo = () => {
    const filteredUser = allUsers.find(
      (user) => user.id === auth.currentUser.uid
    );
    setUser(filteredUser);
    console.log("Home.js USER", user);
  };
  useEffect(() => {
     userInfo()
    getUser()
  }, [user]);


  return (
    <SafeAreaView style={styles.container}>
      <Divider color="orange" />
      <Modal visible={groupModalOpen} transparent={true} animationType="slide">
        <CreateGroup
        user={user}
        setUser={setUser}
          groupModalOpen={groupModalOpen}
          setGroupModalOpen={setGroupModalOpen}
        />
      </Modal>

      <View style={styles.groupsWrapper}>
        <View style={styles.titleContainer}>
          <Text style={styles.sectionTitle}>Your Groups</Text>
          <Ripple rippleColor="#fff"
            style={styles.iconWrapper}
            onPress={() => setGroupModalOpen(true)}
          >
            <Icon
              type="antdesign"
              size="28px"
              name="addusergroup"
              color="white"
            />
          </Ripple>
        </View>
        {user?.groupIds && user.groupIds.length ? (
          <Groups groupIds={user.groupIds} setUser={setUser} user={user}/>
        ) : (
          <View style={styles.nodata}>
            <Text style={styles.nodataText}>
              Create a group to get started!
            </Text>
          </View>
        )}
      </View>
      <View style={styles.eventsWrapper}>
        <Text style={styles.sectionTitle}>Your Events</Text>
        {user?.groupIds && user.groupIds.length ? (
          <Events groupIds={user.groupIds} />
        ) : (
          <View style={styles.nodata}>
            <Text style={styles.nodataText}>
              Create a group to get started!
            </Text>
          </View>
        )}
      </View>
      <Footer />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  //backgroundColor: "#242526",
  backgroundColor: "#1b1b1b"
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
    shadowOffset: { height: 2, width: 2 },
    shadowOpacity: 1,
    shadowRadius: 2,
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
  nodata: {
    alignItems: "center",
    paddingTop: 120,
  },
  nodataText: {
    color: "white",
    padding: 10,
    shadowColor: "black",
    shadowOffset: { height: 1, width: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
  },
});

export default Home;
