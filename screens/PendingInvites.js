import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  SafeAreaView,
  Modal,
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

const PendingInvites = (props) => {
  const { inviteModalOpen, setInviteModalOpen } = props;

  const navigation = useNavigation();
  const [currentEvent, setCurrentEvent] = useState({});
  const [currGroup, setCurrGroup] = useState({});

  useEffect(() => {
    const unsub = () => {
      onSnapshot(collection(db, "events"), (snapshot) => {
        snapshot.docs.map((snap) => {
          if (
            user.groupIds?.includes(snap.data().groupId) &&
            !snap.data().submissions.includes(user.id)
          ) {
            setCurrentEvent({ ...snap.data(), id: snap.id });
            onSnapshot(doc(db, "groups", snap.data().groupId), (snapshot) =>
              setCurrGroup({ ...snapshot.data(), id: snapshot.id })
            );
          }
        });
      });
      console.log("PendingInvites.js useEffect currentEvent", currentEvent);
    };
    unsub();
  }, []);

  const [affordability, setAffordability] = useState(user.affordability);
  // const [allSelected, setAllSelected] = useState([]);
  // const data = [
  //   { value: "American", key: "newamerican" },
  //   { value: "Breakfast & Brunch", key: "breakfast_brunch" },
  //   { value: "Burgers", key: "burgers" },
  //   { value: "Caribbean", key: "caribbean" },
  //   { value: "Chinese", key: "chinese" },
  //   { value: "Cuban", key: "cuban" },
  //   { value: "French", key: "french" },
  //   { value: "Halal", key: "halal" },
  //   { value: "Indian", key: "indpak" },
  //   { value: "Italian", key: "italian" },
  //   { value: "Mediterranean", key: "mediterranean" },
  //   { value: "Mexican", key: "mexican" },
  //   { value: "Middle Eastern", key: "mideastern" },
  //   { value: "Pizza", key: "pizza" },
  //   { value: "Sandwiches", key: "sandwiches" },
  //   { value: "Sushi", key: "sushi" },
  //   { value: "Thai", key: "thai" },
  //   { value: "Vegan", key: "vegan" },
  //   { value: "Vegetarian", key: "vegetarian" },
  // ];

  const [userFoodGenre, setUserFoodGenre] = useState(user.foodGenre);
  const [userFoodGenreName, setUserFoodGenreName] = useState("");

  const handleFoodGenreEdit = () => {
    setDoc(doc(db, "users", auth.currentUser.uid), {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      foodGenre: userFoodGenre,
      restaurantRating: user.restaurantRating,
      dietaryRestrictions: user.dietaryRestrictions,
      affordability: user.affordability,
      imgUrl: user.imgUrl,
      groupIds: user.groupIds,
    });
  };

  const handleSubmit = async () => {
    console.log("handleSubmit SELECTS", allSelected);
    console.log("handleSubmit UserId", auth.currentUser.uid);
    console.log("handleSubmit EventId", currentEvent.id);
    console.log("handleSubmit EventId Group", currGroup);
    try {
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        //foodGenre: allSelected,
        foodGenre: userFoodGenre,
        affordability: affordability,
      });
      await updateDoc(doc(db, "events", currentEvent.id), {
        submissions: arrayUnion(auth.currentUser.uid),
      });
      setInviteModalOpen(false);
    } catch (err) {
      console.log("PendingInvites.js error creating", err);
    }
  };

  return (
    <View style={styles.modalBackground}>
      <View style={styles.modalContent}>
        <TouchableOpacity
          onPress={() => setInviteModalOpen(false)}
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
        <View style={styles.contents}>
          {currentEvent.id ? (
            <View style={styles.formContainer}>
              <View style={styles.form}>
                <Text style={styles.sectionTitle}>
                  Invitation from{"\n"}
                  {currGroup?.name}
                </Text>
                {/* <View style={styles.selectionList}> */}
                {/* <MultipleSelectList
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
                  </View> */}
                  <View style={styles.fields}>
                <Text style={styles.text}>Price Range</Text>
                <RNPickerSelect
                  style={pickerSelectStylesPrice}
                  label="Affordability"
                  onValueChange={(value) => setAffordability(value.length)}
                  placeholder={{ label: "Select range", value: "$" }}
                  items={[
                    { label: "$", value: "$" },
                    { label: "$$", value: "$$" },
                    { label: "$$$", value: "$$$" },
                    { label: "$$$$", value: "$$$$" },
                  ]}
                />
                </View>

                <View style={styles.fields}>
                <Text style={styles.text}>Food Genre</Text>
                <View style={styles.pickCuisine}>
                  <RNPickerSelect
                    // labelStyle={{ fontWeight: "normal" }}
                    textColor="white"
                    style={pickerSelectStyles}
                    label="Food Genre"
                    onValueChange={(value) => setUserFoodGenreName(value)}
                    placeholder={{
                      label: "What are you feeling?",
                      value: null,
                    }}
                    items={[
                      { label: "American", value: "newamerican" },
                      {
                        label: "Breakfast & Brunch",
                        value: "breakfast_brunch",
                      },
                      { label: "Burgers", value: "burgers" },
                      { label: "Caribbean", value: "caribbean" },
                      { label: "Chinese", value: "chinese" },
                      { label: "Cuban", value: "cuban" },
                      { label: "French", value: "french" },
                      { label: "Halal", value: "halal" },
                      { label: "Indian", value: "indpak" },
                      { label: "Italian", value: "italian" },
                      { label: "Mediterranean", value: "mediterranean" },
                      { label: "Mexican", value: "mexican" },
                      { label: "Middle Eastern", value: "mideastern" },
                      { label: "Pizza", value: "pizza" },
                      { label: "Sandwiches", value: "sandwiches" },
                      { label: "Sushi", value: "sushi" },
                      { label: "Thai", value: "thai" },
                      { label: "Vegan", value: "vegan" },
                      { label: "Vegetarian", value: "vegetarian" },
                    ]}
                  />
                  <TouchableOpacity
                    style={styles.plusbuttonWrapper}
                    onPress={() => {
                      setUserFoodGenre([...userFoodGenre, userFoodGenreName]);
                      console.log(userFoodGenre);
                      handleFoodGenreEdit();
                      setUserFoodGenreName("");
                      getUser();
                    }}
                  >
                    <Text style={styles.button}>+</Text>
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={userFoodGenre}
                  renderItem={(foodGenre) => (
                    <View style={styles.foodGenres}>
                      <Text style={styles.foodListItem}>{foodGenre.item}</Text>
                      <TouchableOpacity
                        style={styles.foodButtonWrapper}
                        onPress={() => {
                          console.log(foodGenre.item);
                          setUserFoodGenre(
                            userFoodGenre.filter((currentFood) => {
                              console.log("current food:", currentFood);
                              return currentFood !== foodGenre.item;
                            })
                          );
                        }}
                      >
                        <Text style={styles.button}>-</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                />
                </View>
                <View style={styles.fields}>
                <View style={styles.createbutton}>
                <TouchableOpacity
                  onPress={() => {
                    handleSubmit();
                    getUser();
                    //navigation.navigate("Home"); // or group page
                  }}
                >
                  <View style={styles.buttonWrapper}>
                    <Text style={styles.button}>Send Your Preferences</Text>
                  </View>
                </TouchableOpacity>
                </View>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.nodata}>
              <Text style={styles.nodataText}>No pending invites</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default PendingInvites;

const pickerSelectStylesPrice= StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
    color: "white",
    paddingRight: 30, // to ensure the text is never behind the icon
    marginTop: 10,
    // marginBottom: 10,
    width: 300,
    placeholder: {
      color: "white",
    },
  },
});


const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
    color: "white",
    paddingRight: 30, // to ensure the text is never behind the icon
    marginTop: 10,
    // marginBottom: 10,
    width: 240,
    placeholder: {
      color: "white",
    },
  },
});

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(240,200,167,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#181818",
    elevation: 20,
    borderRadius: 15,
    width: "90%",
    height: "75%",
  },
  iconWrapper: {
    alignItems: "flex-end",
  },
  icon: {},
  contents: {
    // alignItems: "center",
    // justifyContent: "center",
    // alignSelf: "center",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "white",
    marginTop: 20,
    marginBottom: 20,
    textAlign: "center",
    paddingBottom: 25,
    shadowColor: "black",
    shadowOffset: { height: 2, width: 2 },
    shadowOpacity: 2,
    shadowRadius: 2,
  },
  formContainer: {
    justifyContent: "center",
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  form: {
    paddingHorizontal: 25,
  },
  fields: {
    paddingVertical: 10

  },
  text: {
    color: "orange",
    fontWeight: "600",
    fontSize: 20,
    paddingLeft: 5,
  },
  pickCuisine: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 2,
  },
  plusbuttonWrapper: {
    paddingVertical: 10,
    //paddingHorizontal: 10,
    borderRadius: 60,
    width: 50,
    backgroundColor: "orange",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 10,
  },
  buttonWrapper: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 60,
    width: 260,
    backgroundColor: "orange",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 10,
  },
  button: {
    fontWeight: "700",
    fontSize: 18,
    color: "#181818",
  },
  foodGenres: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 3,
    paddingRight: 3,
  },
  foodListItem: {
    color: "white",
    fontWeight: "normal",
    paddingTop: 8,
    paddingRight: 11,
  },
  foodButtonWrapper: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 60,
    width: 50,
    backgroundColor: "orange",
    alignItems: "center",
    alignSelf: "center",
  },
  createbutton: { paddingTop: 20 },
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
});
