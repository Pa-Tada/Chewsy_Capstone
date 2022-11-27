import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  SafeAreaView,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import React, { useEffect, useState } from "react";
import { Icon, Input, Avatar, Divider } from "@rneui/themed";
import { auth, db, getUser, user, allUsers } from "../firebase";
import firebase from "firebase/compat";
import RNPickerSelect from "react-native-picker-select";
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
import { useNavigation } from "@react-navigation/native";
import { MultipleSelectList } from "react-native-dropdown-select-list";

const PendingInvites = () => {
  console.log("USER WITHIN PENDING INVITES:", user);
  const navigation = useNavigation();
  const [currentEvent, setCurrentEvent] = useState({});
  //const [currGroup, setCurrGroup] = useState({})

  useEffect(() => {
    const unsub = () => {
      onSnapshot(collection(db, "events"), (snapshot) => {
        snapshot.docs.map((doc) => {
          if (
            user.groupIds?.includes(doc.data().groupId) &&
            !doc.data().submissions.includes(user.id)
          )
            setCurrentEvent({ ...doc.data(), id: doc.id });
        });
        console.log("PendingInvites.js useEffect currentEvent", currentEvent);
      });
    };
    unsub();

  }, []);

  const [affordability, setAffordability] = useState(user.affordability);
  const [allSelected, setAllSelected] = useState([]);
  const data = [
    { value: "American", key: "newamerican" },
    { value: "Breakfast & Brunch", key: "breakfast_brunch" },
    { value: "Burgers", key: "burgers" },
    { value: "Caribbean", key: "caribbean" },
    { value: "Chinese", key: "chinese" },
    { value: "Cuban", key: "cuban" },
    { value: "French", key: "french" },
    { value: "Halal", key: "halal" },
    { value: "Indian", key: "indpak" },
    { value: "Italian", key: "italian" },
    { value: "Mediterranean", key: "mediterranean" },
    { value: "Mexican", key: "mexican" },
    { value: "Middle Eastern", key: "mideastern" },
    { value: "Pizza", key: "pizza" },
    { value: "Sandwiches", key: "sandwiches" },
    { value: "Sushi", key: "sushi" },
    { value: "Thai", key: "thai" },
    { value: "Vegan", key: "vegan" },
    { value: "Vegetarian", key: "vegetarian" },
  ];

  const handleSubmit = async () => {
    console.log("handleSubmit SELECTS", allSelected);
    console.log("handleSubmit UserId", auth.currentUser.uid);
    console.log("handleSubmit EventId", currentEvent.id);
    try {
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        foodGenre: allSelected,
        affordability: affordability,
      });
      await updateDoc(doc(db, "events", currentEvent.id), {
        submissions: arrayUnion(auth.currentUser.uid),
      });
    } catch (err) {
      console.log("PendingInvites.js error creating", err);
    }
  };

  return (
    <View style={styles.container}>
      <Divider color="orange" />
      <View style={styles.contents}>
        {currentEvent.id ? (
          <View style={styles.invite}>
            <Text style={styles.sectionTitle}>
              You've been invited to chewse by INSERT GROUP NAME
            </Text>

            <View style={styles.form}>
              <KeyboardAwareScrollView>
                <View style={styles.selectionList}>
                  <MultipleSelectList
                    //defaultOption={{ key:'1', value:'Jammu & Kashmir' }}
                    save="key"
                    setSelected={(val) => setAllSelected(val)}
                    data={data}
                    placeholder="What are you feeling?"
                    boxStyles={{ color: "white" }}
                    dropdownStyles={{ color: "white" }}
                    inputStyles={{ color: "white" }}
                    dropdownItemStyles={{ color: "white" }}
                    dropdownTextStyles={{ color: "white" }}
                    maxHeight={250}
                  />
                </View>
                <RNPickerSelect
                  style={pickerSelectStyles}
                  label="Affordability"
                  onValueChange={(value) => setAffordability(value.length)}
                  placeholder={{ label: "Price range", value: "$" }}
                  items={[
                    { label: "$", value: "$" },
                    { label: "$$", value: "$$" },
                    { label: "$$$", value: "$$$" },
                    { label: "$$$$", value: "$$$$" },
                  ]}
                />
                <TouchableOpacity
                  onPress={() => {
                    handleSubmit();
                    getUser();
                    navigation.navigate("Home"); // or group page
                  }}
                >
                  <View style={styles.buttonWrapper}>
                    <Text style={styles.button}>Submit</Text>
                  </View>
                </TouchableOpacity>
              </KeyboardAwareScrollView>
            </View>
          </View>
        ) : (
          <View style={styles.nodata}>
            <Text style={styles.nodataText}>
              You don't have any pending invites
            </Text>
            <TouchableOpacity
                  onPress={() => {
                    navigation.goBack(); // or group page
                  }}
                >
                  <View style={styles.buttonWrapper}>
                    <Text style={styles.button}>Go back</Text>
                  </View>
                </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default PendingInvites;

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
    color: "white",
    paddingRight: 30, // to ensure the text is never behind the icon
    marginTop: 10,
    marginBottom: 10,
  },
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#242526",
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
  },
  contents: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    paddingHorizontal: 10,
    flex: 1.5,
  },
  nodata: {
    alignItems: "center",
    paddingBottom: 130,
    justifyContent: "center",
  },
  nodataText: {
    color: "white",
    fontSize: 18,
    padding: 10,
    shadowColor: "black",
    shadowOffset: { height: 1, width: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
  },
  invite: {
    paddingTop: 135,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: "bold",
    color: "white",
    marginTop: 20,
    marginBottom: 20,
    textAlign: "center",
  },
  form: {
    alignSelf: "center",
    paddingTop: 25,
    padding: 10,
  },
  selectionList: {
    color: "white",
  },
  buttonWrapper: {
    paddingVertical: 10,
    marginBottom: 30,
    marginTop: 30,
    paddingHorizontal: 10,
    borderRadius: 60,
    width: 150,
    backgroundColor: "orange",
    alignItems: "center",
    alignSelf: "center",
  },
  buttonWrapper2: {
    width: 100,
    height: 40,
    backgroundColor: "orange",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  button: {},
  foodGenres: {
    flexDirection: "row",
    justifyContent: "",
    padding: 5,
  },
  foodListItem: {
    color: "white",
    fontWeight: "normal",
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 5,
  },
  foodButtonWrapper: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 80,
    width: 50,
    backgroundColor: "orange",
    alignItems: "center",
    alignSelf: "center",
  },
});
