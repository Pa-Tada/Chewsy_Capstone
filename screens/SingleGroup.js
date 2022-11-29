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
    console.log("SingleGroup.js GROUP", group);
    return groupInfo;
  }, [currentGroup, currentGroup.userIds.length]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "users"), (snapshot) => {
      let members = [];
      snapshot.docs.map((doc) => {
        if (currentGroup.userIds?.includes(doc.id))
          // && doc.id != auth.currentUser.uid
          members.push({ ...doc.data(), id: doc.id });
      });
      setFriends(members);
    });
    //console.log("SingleGroup.js friends", friends)
    return unsub;
  }, [currentGroup, currentGroup.userIds.length]);

  const handleFoodGenreEdit = () => {
    console.log(user);
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
          <TouchableOpacity
            style={styles.iconWrapper}
            onPress={() => setModalOpen(true)}
          >
            <Icon type="antdesign" size="28px" name="adduser" color="white" />
          </TouchableOpacity>
        </View>
        <Friends
          currentGroup={currentGroup}
          friends={friends}
          setFriends={setFriends}
          groups={groups} setGroup={setGroup}
        />
      </View>
      <Modal visible={eventModalOpen} animationType="slide">
        <SafeAreaView style={styles.modalContent}>
          <View style={styles.modalContent}>
            <View style={styles.container}>
              <Divider />
              <View style={styles.contents}>
                <Text style={styles.sectionTitle}>Create Event</Text>

                <View style={styles.form}>
                  <View style={{ display: "flex", alignItems: "center" }}>
                    <Text
                      style={{
                        color: "orange",
                        fontSize: "16",
                        alignSelf: "center",
                        marginTop: 15,
                      }}
                    >
                      Your Event Will take place on {date.toLocaleString()}
                    </Text>

                    <RNDateTimePicker
                      style={{ marginTop: 10, marginBottom: 10 }}
                      testID="dateTimePicker"
                      value={date}
                      mode="datetime"
                      minuteInterval={15}
                      is24Hour={true}
                      onChange={onChange}
                      display="spinner"
                      textColor="orange" // change this to change text color
                    />
                  </View>
                  <RNPickerSelect
                    // labelStyle={{ fontWeight: "normal" }}
                    style={pickerSelectStyles}
                    label="Food Genre"
                    onValueChange={(value) => setUserFoodGenreName(value)}
                    // onDonePress = {setFoodGenre([...foodGenre, foodName])}
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
                    style={styles.buttonWrapper}
                    onPress={() => {
                      setUserFoodGenre([...userFoodGenre, userFoodGenreName]);
                      // handleFoodGenreEdit();
                      console.log(userFoodGenre);
                      handleFoodGenreEdit();
                      setUserFoodGenreName("");
                      getUser();
                    }}
                  >
                    <Text>+</Text>
                  </TouchableOpacity>
                  <FlatList
                    data={userFoodGenre}
                    renderItem={(foodGenre) => (
                      <View style={styles.foodGenres}>
                        <Text style={styles.foodListItem}>
                          {foodGenre.item}
                        </Text>
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
                          <Text>-</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  />
                  {/* </View> */}

                  <TouchableOpacity
                    onPress={() => {
                      handleFoodGenreEdit();
                      createEvent();
                      setEventModalOpen(false);
                    }}
                  >
                    <View style={styles.buttonWrapper}>
                      <Text style={styles.button}>Create Event</Text>
                    </View>
                  </TouchableOpacity>
                  <Button
                    title="Cancel"
                    onPress={() => {
                      setEventModalOpen(false);
                    }}
                  ></Button>
                </View>
              </View>
              {/* <Footer /> */}
            </View>
          </View>
        </SafeAreaView>
      </Modal>

      <View style={styles.eventsWrapper}>
        <View style={styles.titleContainer}>
          <Text style={styles.sectionTitle}>{currentGroup.name} Events</Text>
          <TouchableOpacity
            style={styles.iconWrapper}
            onPress={() => setEventModalOpen(true)}
          >
            <Icon
              type="material-community"
              size="30px"
              name="calendar-plus"
              color="white"
            />
          </TouchableOpacity>
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
  buttonWrapper: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
    marginTop: 10,
    borderRadius: 60,
    width: 150,
    backgroundColor: "orange",
    alignItems: "center",
    alignSelf: "center",
  },
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
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    //backgroundColor: "dodgerblue"
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
  modalToggle: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#f2f2f2",
    padding: 10,
    borderRadius: 10,
    alignSelf: "center",
  },
  modalContent: {
    flex: 1,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "white",
    paddingRight: 30, // to ensure the text is never behind the icon
    marginTop: 10,
    marginBottom: 10,
  },
});

export default SingleGroup;
