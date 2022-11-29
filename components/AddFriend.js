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
    try {
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
      setModalOpen(false);
    } catch (err) {
      console.log("AddFriend.js error creating", err);
    }
  };

  return (
    <View style={styles.modalBackground}>
      <View style={styles.modalContent}>
        <TouchableOpacity
          onPress={() => setModalOpen(false)}
          style={styles.iconWrapper}
        >
          <Icon
            type="antdesign"
            name="closecircleo"
            color="orange"
            style={styles.icon}
            size={30}
          />
        </TouchableOpacity>
        <View style={styles.formContainer}>
          <View style={styles.form}>
            <Text style={styles.text}>{"  "}Friends</Text>
            <View style={styles.selectionList}>
              <MultipleSelectList
                save="key"
                setSelected={(val) => setAllSelected(val)}
                data={data}
                placeholder="Find Friends"
                boxStyles={{ color: "white" }}
                dropdownStyles={{ color: "white" }}
                inputStyles={{ color: "gray" }}
                dropdownItemStyles={{ color: "white" }}
                dropdownTextStyles={{ color: "white" }}
                maxHeight={300}
                searchPlaceholder="     Username"
                closeicon={
                  <Icon type="antdesign" name="close" color="white" size={17} />
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
            <View style={styles.btnContainer}>
            <TouchableOpacity onPress={() => handleSubmit()}>
              <View style={styles.buttonWrapper}>
                <Text style={styles.button}>Add Friends</Text>
              </View>
            </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(240,200,167,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    // borderWidth: 0.2,
    // borderColor: "orange",
    backgroundColor: "#181818",
    elevation: 20,
    borderRadius: 15,
    width: "80%",
    height: "60%",
  },
  formContainer: {
    //justifyContent: "center",
    flexDirection: "column",
    justifyContent: "space-evenly",

  },
  form: {
    paddingHorizontal: 30,

    //justifyContent: "space-evenly"
  },
  btnContainer: {},
  text: {
    color: "orange",
    fontWeight: "600",
    fontSize: 20,
    paddingLeft: 10,
  },
  selectionList: {
    paddingHorizontal: 15,
    color: "white",
    paddingVertical: 10,
  },
  buttonWrapper: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 60,
    width: 225,
    backgroundColor: "orange",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 30,
  },
  button: {
    fontWeight: "700",
    fontSize: 18,
    color: "#181818",
  },
  iconWrapper: {
    alignItems: "flex-end",
  },
});

export default AddFriend;
