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


const CreateGroup = (props) => {
  const { user, setUser, groupModalOpen, setGroupModalOpen } = props;
  const [groupName, setGroupName] = useState("");
  const [member, setMember] = useState("");
  const [members, setMembers] = useState([auth.currentUser.uid]);

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
      console.log("GROUP MEMBER", member);
      setMembers(members.push(member));
      //setMembers([...members, member]);
      console.log("GROUP MEMBERS ARRAY", members);
      console.log("USER IN CREATEGROUP BEFORE SET", user);

      const groupDocRef = await addDoc(collection(db, "groups"), {
        name: groupName,
        leaderId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
        imgUrl:
          "https://s3.amazonaws.com/freestock-prod/450/freestock_564895924.jpg",
        userIds: members,
      });

      // await updateDoc(doc(db, "users", auth.currentUser.uid), {
      //   groupIds: arrayUnion(groupDocRef.id),
      // });

      await Promise.all(
        members.map(async (memberId) => {
          await updateDoc(doc(db, "users", memberId), {
            groupIds: arrayUnion(groupDocRef.id),
          });
        })
      );

      await setUser(      //-------ESSENTIAL--------
        onSnapshot(doc(db, "users", auth.currentUser.uid), (snapshot) => {
          return { ...snapshot.data(), id: snapshot.id };
        })
      );

      setGroupModalOpen(false);
      setGroupName("");
      setMember("");
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
          <Input
            placeholder="Email/Username"
            labelStyle={{ fontWeight: "bold" }}
            inputStyle={{ color: "white", fontSize: 14 }}
            label="Add Group Members"
            value={member}
            onChangeText={(text) => setMember(text)}
          />
          <TouchableOpacity onPress={() => handleSubmit()}>
            <View style={styles.buttonWrapper}>
              <Text style={styles.button}>Create Group</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setGroupModalOpen(false)}
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

export default CreateGroup;
