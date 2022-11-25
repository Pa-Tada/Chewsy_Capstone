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
import { auth, db, user, getUser, allUsers } from "../firebase";
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
import { MultipleSelectList } from "react-native-dropdown-select-list";

const CreateGroup = (props) => {
  const { user, setUser, groupModalOpen, setGroupModalOpen } = props;
  const [groupName, setGroupName] = useState("");
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

  const userInfo = () => {
    const filteredUser = allUsers.find(
      (user) => user.id === auth.currentUser.uid
    );
    setUser(filteredUser);
  };
  useEffect(() => {
    userInfo();
    getUser();
  }, [user]);

  const handleSubmit = async () => {
    try {
      console.log("SELECTS", allSelected)
      let addLeader = allSelected.push(auth.currentUser.uid)
      console.log("WITH LEADER", allSelected);

      const groupDocRef = await addDoc(collection(db, "groups"), {
        name: groupName,
        leaderId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
        imgUrl:
          "https://s3.amazonaws.com/freestock-prod/450/freestock_564895924.jpg",
        userIds: allSelected,
      });

      // await updateDoc(doc(db, "users", auth.currentUser.uid), {
      //   groupIds: arrayUnion(groupDocRef.id),
      // });

      await Promise.all(
        allSelected.map(async (memberId) => {
          await updateDoc(doc(db, "users", memberId), {
            groupIds: arrayUnion(groupDocRef.id),
          });
        })
      );

              //-------ESSENTIAL--------
      await setUser(
        onSnapshot(doc(db, "users", auth.currentUser.uid), (snapshot) => {
          return { ...snapshot.data(), id: snapshot.id };
        })
      );

      setGroupModalOpen(false);
      setGroupName("");
    } catch (err) {
      console.log("CreateGroup.js error creating", err);
    }
  };

  return (
    <View style={styles.modalContent}>
      <KeyboardAwareScrollView>
        <View style={styles.form}>
          <Input
            labelStyle={{ fontWeight: "bold" }}
            inputStyle={{ color: "white", fontSize: 14 }}
            label="Add Group Name"
            value={groupName}
            onChangeText={(text) => setGroupName(text)}
          />
          <View style={styles.selectionList}>
            <MultipleSelectList

              save="key"
              setSelected={(val) => setAllSelected(val)}
              data={data}
              placeholder="Find Friends"
              boxStyles={{ color: "white" }}
              dropdownStyles={{ color: "white" }}
              inputStyles={{ color: "white" }}
              dropdownItemStyles={{ color: "white" }}
              dropdownTextStyles={{ color: "white" }}
              maxHeight={220}
            />
          </View>
          <View style={styles.allButtons}>
            <TouchableOpacity onPress={() => handleSubmit()}>
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
        </View>
      </KeyboardAwareScrollView>
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
    color: "white",
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

export default CreateGroup;
