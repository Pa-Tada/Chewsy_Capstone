import React, { useEffect, useState } from "react";
import { MultipleSelectList } from "react-native-dropdown-select-list";

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
  const {
    modalOpen,
    setModalOpen,
    currentGroup,
    group,
    setGroup,
    friends,
    setFriends,
  } = props;
  const [allSelected, setAllSelected] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    const getAllUsers = () => {
      let userLimted = allUsers.map((user) => {
        return { key: user.id, value: user.email };
      });
      setData(userLimted);
    };
    getAllUsers();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "users"), (snapshot) => {
      let members = [];
      snapshot.docs.map((doc) => {
        if (group.userIds?.includes(doc.id))
          // && doc.id != auth.currentUser.uid
          members.push({ ...doc.data(), id: doc.id });
      });
      setFriends(members);
    });
    return unsub;
  }, [group]);

  const handleSubmit = async () => {
    console.log("SELECTS", allSelected);

    try {
      //console.log("Modal BEFORE SETGROUP", group);
      // console.log("Add Friend", member);
      //setMembers(members.push(member)); //setMembers([...members, member]);

      // console.log("Add Friends Array", members);

      // Extract member ids from input first
      await Promise.all(
        allSelected.map(async (selected) => {
          await updateDoc(doc(db, "groups", currentGroup.id), {
            userIds: arrayUnion(selected),
          });
          await updateDoc(doc(db, "users", selected), {
            groupIds: arrayUnion(currentGroup.id),
          });
        })
      );

      // await setGroup(
      //   onSnapshot(doc(db, "groups", group.id), (snapshot) => {
      //     console.log("SNAPSHOT", snapshot);
      //     return { ...snapshot.data(), id: snapshot.id };
      //   })
      // );
      //console.log("Modal After SETGROUP", group);

      setModalOpen(false);
      //setMember("");
    } catch (err) {
      console.log("AddFriend.js error creating", err);
    }
  };

  return (
    <View style={styles.modalContent}>
      <View style={styles.form}>
        <View style={styles.selectionList}>
          <MultipleSelectList
            save="key"
            setSelected={(val) => setAllSelected(val)}
            data={data}
            placeholder="Find Friends"
            boxStyles={{color: "white" }}
            dropdownStyles={{color: "white" }}
            inputStyles={{color: "white" }}
            dropdownItemStyles={{color:"white"}}
            dropdownTextStyles={{color:"white"}}
            maxHeight={300}
          />
        </View>
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
  form: {
    padding: 10,
  },
  selectionList: {
    paddingHorizontal: 15,
    color: "white"
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
});

export default AddFriend;
