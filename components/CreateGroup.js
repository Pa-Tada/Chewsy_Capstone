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
import Ripple from "react-native-material-ripple";

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
      console.log("SELECTS", allSelected);
      let addLeader = allSelected.push(auth.currentUser.uid);
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
    <View style={styles.modalBackground}>
      <View style={styles.modalContent}>
        <KeyboardAwareScrollView>
          <Ripple
            rippleColor="#fff"
            onPress={() => setGroupModalOpen(false)}
            style={styles.iconWrapper}
          >
            <Icon
              type="antdesign"
              name="closecircleo"
              color="white"
              style={styles.icon}
              size={30}
            />
          </Ripple>
          <View style={styles.form}>
            <Input
              inputContainerStyle={{ borderBottomWidth: 0 }}
              labelStyle={{ color: "white", fontWeight: "normal" }}
              inputStyle={{
                color: "white",
                fontSize: 14,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: "gray",
                paddingVertical: 12,
                paddingHorizontal: 10,
                marginTop: 10,
                marginBottom: 10,
              }}
              label="Add Group Name"
              value={groupName}
              onChangeText={(text) => setGroupName(text)}
            />
            <Text style={styles.text}>Add Friends</Text>
            <View style={styles.selectionList}>
              <MultipleSelectList
                save="key"
                setSelected={(val) => setAllSelected(val)}
                data={data}
                placeholder="search"
                boxStyles={{ color: "white" }}
                dropdownStyles={{ color: "white" }}
                inputStyles={{ color: "white" }}
                dropdownItemStyles={{ color: "white" }}
                dropdownTextStyles={{ color: "white" }}
                maxHeight={220}
                searchPlaceholder="Username"
                closeicon={
                  <Icon type="antdesign" name="close" color="white" size={18} />
                }
                searchicon={
                  <Icon
                    type="antdesign"
                    name="search1"
                    color="white"
                    size={15}
                  />
                }
                arrowicon={
                  <Icon
                    type="material"
                    name="keyboard-arrow-down"
                    color="white"
                    size={18}
                    checkBoxStyles={{ backgroundColor: "white" }}
                    badgeStyles={{ backgroundColor: "white" }}
                    labelStyles={{ backgroundColor: "white" }}
                  />
                }
              />
            </View>
            <Ripple rippleColor="#fff" onPress={() => handleSubmit()}>
              <View style={styles.buttonWrapper}>
                <Text style={styles.button}>Create Group</Text>
              </View>
            </Ripple>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(240,200,167,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    borderWidth: 0.2,
    borderColor: "orange",
    backgroundColor: "#181818",
    elevation: 20,
    //alignContent: "center",
    borderRadius: 15,

    width: "80%",
    height: "70%",
  },
  form: {
    paddingTop: 50,
    //paddingVertical: 20,
    paddingHorizontal: 30,
  },
  text: {
    color: "white",
    fontWeight: "normal",
    fontSize: 17,
    paddingLeft: 10,
  },
  selectionList: {
    paddingHorizontal: 8,
    color: "white",
    paddingVertical: 10,
  },
  buttonWrapper: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 60,
    width: 230,
    backgroundColor: "orange",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 15,
  },
  button: {
    fontWeight: "bold",
    fontSize: 15,
  },
  iconWrapper: {
    alignItems: "flex-end",
  },
});

export default CreateGroup;
