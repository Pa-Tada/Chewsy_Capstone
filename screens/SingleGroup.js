import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Image,
  SafeAreaView,
  Modal,
  Button,
  TextInput,
} from "react-native";
import { auth, db, allUsers, user, getUser } from "../firebase";
import {
  collection,
  getDocs,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  orderBy,
  serverTimestamp,
  getDoc,
  query,
  where,
  setDoc,
} from "firebase/firestore";

import { Icon, Divider, Input } from "@rneui/themed";
import Footer from "../components/Footer";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Events from "../components/Events";
import Friends from "../components/Friends";
import AddFriend from "../components/AddFriend";
import Ripple from "react-native-material-ripple"
import RNDateTimePicker from "@react-native-community/datetimepicker";
import RNPickerSelect from "react-native-picker-select";

const SingleGroup = ({ route }) => {
  const { groupId, currentGroup, groups } = route.params;
  const navigation = useNavigation();
  const [modalOpen, setModalOpen] = useState(false);
  const [eventModalOpen, setEventModalOpen] = useState(false);

  const [userFoodGenre, setUserFoodGenre] = useState(user.foodGenre);
  const [userFoodGenreName, setUserFoodGenreName] = useState("");
  const [group, setGroup] = useState(currentGroup);

  const [date, setDate] = useState(new Date());

  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    if (Platform.OS === "android") {
      setShow(true);
      // for iOS, add a button that closes the picker
    }
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showTimepicker = () => {
    showMode("time");
  };

  const [friends, setFriends] = useState([
    { name: "Loading...", id: "unique" },
  ]);

  useEffect(() => {
    const groupInfo = onSnapshot(collection(db, "groups"), (snapshot) => {
      snapshot.docs.map((doc) => {
        if (groupId == doc.id) {
          setGroup({ ...doc.data(), id: doc.id });
        }
      });
    });
    return groupInfo;
  }, [currentGroup, currentGroup.userIds.length]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "users"), (snapshot) => {
      let members = [];
      snapshot.docs.map((doc) => {
        if (currentGroup.userIds?.includes(doc.id))
          members.push({ ...doc.data(), id: doc.id });
      });
      setFriends(members);
    });
    return unsub;
  }, [currentGroup, currentGroup.userIds.length]);

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

  const createEvent = async () => {
    console.log("group id:", groupId);
    console.log("date:", date);
    await addDoc(collection(db, "events"), {
      createdAt: date,
      groupId: groupId,
      restImageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFuys8jY57bOyYwcKNIapFCCYLx18yRcXyEYJxcw7-BQgr5eqvIa-RRSY2XoByxp_GuVE&usqp=CAU",
      restLoc: "",
      restName: "",
      submissions: [auth.currentUser.uid],
    });
  };

  useEffect(() => {
    getUser();
  });

  return (
    <SafeAreaView style={styles.container}>
      <Divider color="orange" />
      <Modal visible={modalOpen} animationType="slide" transparent={true}>
        <AddFriend
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          currentGroup={currentGroup}
          friends={friends}
          setFriends={setFriends}
          group={group}
          setGroup={setGroup}
        />
      </Modal>

      <View style={styles.friendsWrapper}>
        <View style={styles.titleContainer}>
          <Text style={styles.sectionTitle}>{currentGroup.name} Members</Text>
          <Ripple rippleColor="#fff"
            style={styles.iconWrapper}
            onPress={() => setModalOpen(true)}
          >
            <Icon type="antdesign" size="28px" name="adduser" color="white" />
          </Ripple>
        </View>
        <Friends
          currentGroup={currentGroup}
          friends={friends}
          setFriends={setFriends}
          groups={groups}
          setGroup={setGroup}
        />
      </View>
      <Modal visible={eventModalOpen} animationType="slide" transparent={true}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
          <Ripple rippleColor="#fff"
              onPress={() => {
                setEventModalOpen(false);
              }}
              style={styles.crossIconWrapper}
            >
              <Icon
                type="antdesign"
                name="closecircleo"
                color="orange"
                style={styles.icon}
                size={30}
              />
             </Ripple>
            <View style={styles.formContainer}>
              <View style={styles.form}>
                <Input
                  label=" Event Date & Time"
                  labelStyle={{
                    color: "orange",
                    fontWeight: "600",
                    fontSize: 19,
                  }}
                  inputContainerStyle={{ borderBottomWidth: 0 }}
                  inputStyle={{
                    color: "white",
                    fontSize: 16,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: "gray",
                    paddingVertical: 11,
                    paddingHorizontal: 18,
                    marginTop: 10,
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: "16",
                      alignSelf: "center",
                      marginTop: 15,
                    }}
                  >
                    {date.toLocaleString()}
                  </Text>
                </Input>
                <View style={{ display: "flex", alignItems: "center" }}>
                  <RNDateTimePicker
                    style={{}}
                    testID="dateTimePicker"
                    value={date}
                    mode="datetime"
                    minuteInterval={15}
                    is24Hour={true}
                    onChange={onChange}
                    display="spinner"
                    textColor="white" // change this to change text color
                  />
                </View>
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
                  <Ripple rippleColor="#fff"
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
                    </Ripple>
                </View>
                <FlatList
                  data={userFoodGenre}
                  renderItem={(foodGenre) => (
                    <View style={styles.foodGenres}>
                      <Text style={styles.foodListItem}>{foodGenre.item}</Text>
                      <Ripple rippleColor="#fff"
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
                        </Ripple>
                    </View>
                  )}
                />
              </View>
              <View style={styles.createbutton}>
              <Ripple rippleColor="#fff"
                  onPress={() => {
                    handleFoodGenreEdit();
                    createEvent();
                    setEventModalOpen(false);
                  }}
                >
                  <View style={styles.buttonWrapper}>
                    <Text style={styles.button}>Create Event</Text>
                  </View>
                  </Ripple>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.eventsWrapper}>
        <View style={styles.titleContainer}>
          <Text style={styles.sectionTitle}>{currentGroup.name} Events</Text>
          <Ripple rippleColor="#fff"
            style={styles.iconWrapper}
            onPress={() => setEventModalOpen(true)}
          >
            <Icon
              type="material-community"
              size="30px"
              name="calendar-plus"
              color="white"
            />
          </Ripple>
        </View>
        <Events groupIds={groupId} />
      </View>

      <Footer />
    </SafeAreaView>
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1b1b1b",
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    alignContent: "center",
    justifyContent: "center",
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
  friendsWrapper: {
    marginTop: 30,
    paddingHorizontal: 12,
    flex: 1,
  },
  eventsWrapper: {
    paddingHorizontal: 12,
    flex: 1,
  },
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
  crossIconWrapper: {
    alignItems: "flex-end",
  },
  formContainer: {
    justifyContent: "center",
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  form: {
    paddingHorizontal: 18,
  },
  text: {
    color: "orange",
    fontWeight: "600",
    fontSize: 20,
    paddingLeft: 10,
  },
  pickCuisine: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 9,
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
    width: 300,
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
    paddingRight: 10,
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

export default SingleGroup;
