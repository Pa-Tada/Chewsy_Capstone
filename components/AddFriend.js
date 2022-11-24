import React, { useEffect, useState } from "react";
import { SearchBar } from "@rneui/themed";
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
  updateDoc,
  serverTimestamp,
  getDoc,
  query,
  where,
  setDoc,
  arrayUnion,
} from "firebase/firestore";

const AddFriend = (props) => {
  const { modalOpen, setModalOpen, currentGroup } = props;
  const [member, setMember] = useState("");
  const [members, setMembers] = useState([]);
  const [data, setData] = useState([]);
  const [query, setQuery] = useState("");
  const [heroes, setHeroes] = useState([]);

  useEffect(() => {
    const getAllUsers = () => {
      // let allUsers;
      // onSnapshot(collection(db, "users"), (docSnap) => {
      //   allUsers = [];
      //   docSnap.forEach((doc) => {
      //     allUsers.push({ ...doc.data(), id: doc.id });
      //   });
      // });
      setData(allUsers);
      setHeroes(allUsers.slice());
    };
    getAllUsers();
  }, [data]);

  const updateQuery = (input) => {
    setHeroes(data.slice())
    setQuery(input);
  };

  const filterNames = (hero) => {
    let search = query.toLowerCase();
    if (hero.startsWith(search, 0)) {
      return hero;
    } else {
      heroes.splice(heroes.indexOf(hero), 1);
      return null;
    }
  };

  const handleSubmit = async () => {
    try {
      console.log("Add Friend", member);
      setMembers([...members, member]);
      console.log("Add Friends Array", members);

      // Extract member ids from input first
      members.map(async (memberId) => {
        await updateDoc(doc(db, "groups", currentGroup.id), {
          userIds: arrayUnion(memberId), //enter member id instead of group id
        });
        await updateDoc(doc(db, "users", memberId), {
          groupIds: arrayUnion(currentGroup.id), //enter member id instead of group id
        });
      });

      setModalOpen(false);
      setGroupName("");
      setMember("");
    } catch (err) {
      console.log("AddFriend.js error creating", err);
    }
  };

  return (
    <View style={styles.modalContent}>

      <View style={styles.form}>
                  <Input
            placeholder="Email/Username"
            labelStyle={{ fontWeight: "bold" }}
            inputStyle={{ color: "white", fontSize: 14 }}
            label="Add Friends"
            value={member}
            onChangeText={(text) => setMember(text)}
          />
      {/* <SearchBar
        onChangeText={updateQuery}
        value={query}
        placeholder="Type Here..."
      />
        <KeyboardAwareScrollView>

          <FlatList
            showsVerticalScrollIndicator={false}
            data={heroes}
            extraData={query}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View>
                <Text style={styles.flatList}>{filterNames(item.email)}</Text>
              </View>
            )}
          />
        </KeyboardAwareScrollView> */}
        <View style={styles.allButtons}>
          <TouchableOpacity onPress={() => handleSubmit()}>
            <View style={styles.buttonWrapper}>
              <Text style={styles.button}>Submit</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setModalOpen(false)}
            style={{ color: "white" }}
          >
            <Text style={{ color: "white", textAlign: "center" }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    borderWidth: 0.2,
    borderTopColor: "orange",
    backgroundColor: "#181818",
    height: "60%",
    marginTop: "auto",
    alignContent: "center",
    borderRadius: 15,
    paddingTop: 15,
  },
  allButtons: {
    paddingTop: 7,
    paddingBottom: 12,
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
  button: {
    fontWeight: "bold",
    fontSize: 15,
  },
  form: {
    //alignSelf: "center",
    marginTop: 15,
    padding: 10,
  },
  list: {
    marginTop: 24,
    marginRight: 8,
    width: 150,
    height: 300,
    borderRadius: 50,
    alignItems: "center",
  },
  flatList: {
    paddingLeft: 15,
    marginTop: 15,
    paddingBottom: 15,
    fontSize: 20,
    borderBottomColor: "#26a69a",
    borderBottomWidth: 1,
    color: "white",
  },
});

export default AddFriend;
