import React, { useEffect, useState } from "react";
import { SearchBar } from '@rneui/themed';
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
      console.log("Add Members ERROR", err);
    }
  };

  return (
    <View style={styles.modalContent}>
      <KeyboardAwareScrollView>
        <View style={styles.form}>
          <Input
            placeholder="Email/Username"
            labelStyle={{ fontWeight: "bold" }}
            inputStyle={{ color: "white", fontSize: 14 }}
            label="Add Friends"
            value={member}
            onChangeText={(text) => setMember(text)}
          />
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
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    borderWidth: 0.2,
    borderTopColor: "orange",
    backgroundColor: "#181818",
    height: "50%",
    marginTop: "auto",
    alignContent: "center",
    borderRadius: 15,
    paddingTop: 15,
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
    marginTop: 15,
    padding: 10,
  },
});

export default AddFriend;
