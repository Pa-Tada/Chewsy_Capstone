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

import DateTimePicker from "@react-native-community/datetimepicker";

const addFriendField = [{ id: 1, field: "Email/Username" }];

const SingleGroup = ({ route }) => {
  const { groupId, currentGroup } = route.params;
  const navigation = useNavigation();
  const [modalOpen, setModalOpen] = useState(false);
  const [eventModalOpen, setEventModalOpen] = useState(false);

  const [userFoodGenre, setUserFoodGenre] = useState(user.foodGenre);
  const [userFoodGenreName, setUserFoodGenreName] = useState("");

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

  // useEffect(() => {
  //   const unsubscribe = onSnapshot(
  //     doc(db, "users", auth.currentUser.uid),
  //     (doc) => {
  //       console.log("Current data: ", doc.data());
  //     }
  //   );
  //   return unsubscribe;
  // }, [userFoodGenre]);

  const eventLastItem = () => {
    return (
      <View>
        <TouchableOpacity onPress={() => setEventModalOpen(false)}>
          <View style={styles.buttonWrapper}>
            <Text style={styles.button}>Create Event</Text>
          </View>
        </TouchableOpacity>
        <Button
          title="Cancel"
          onPress={() => setEventModalOpen(false)}
        ></Button>
      </View>
    );
  };

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
    console.log('group id:', groupId)
    console.log('date:', date)
    await addDoc(collection(db, "events"), {
      createdAt: date,
      groupId: groupId,
      restImageUrl:
        "https://images.unsplash.com/photo-1540224769541-7e6e20a42330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=776&q=80",
      restLoc: "",
      restName: "",
      submissions: 1,
    });
  };

  useEffect(() => {
    getUser();
    console.log("im working");
  });

  return (
    <SafeAreaView style={styles.container}>
      <Divider color="orange" />
      <Modal visible={modalOpen} animationType="slide" transparent={true}>
        <AddFriend
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          currentGroup={currentGroup}
        />
      </Modal>

      <View style={styles.friendsWrapper}>
        <View style={styles.titleContainer}>
          <Text style={styles.sectionTitle}>Group Members</Text>
          <TouchableOpacity
            style={styles.iconWrapper}
            onPress={() => setModalOpen(true)}
          >
            <Icon type="antdesign" size="28px" name="adduser" color="white" />
          </TouchableOpacity>
        </View>
        <Friends currentGroup={currentGroup} />
      </View>
      <Modal visible={eventModalOpen} animationType="slide">
        <SafeAreaView style={styles.modalContent}>
          <View style={styles.modalContent}>
            <View style={styles.container}>
              <Divider />
              <View style={styles.contents}>
                <Text style={styles.sectionTitle}>Create Event</Text>

                <View style={styles.form}>
                  {/* <Input
                    labelStyle={{ fontWeight: "normal" }}
                    inputStyle={{ color: "white", fontSize: 14 }}
                    label="Event Date"
                  />
                  <Input
                    labelStyle={{ fontWeight: "normal" }}
                    inputStyle={{ color: "white", fontSize: 14 }}
                    label="Event Time"
                  /> */}

                  <View>
                    <Text
                      style={{
                        color: "white",
                        fontSize: "14",
                        alignSelf: "center",
                      }}
                    >
                      Your Event Will take place on {date.toLocaleString()}
                    </Text>
                    <TouchableOpacity
                      style={styles.buttonWrapper}
                      onPress={showDatepicker}
                    >
                      <Text>Select Date</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.buttonWrapper}
                      onPress={showTimepicker}
                    >
                      <Text>Select Time</Text>
                    </TouchableOpacity>

                    <DateTimePicker
                      style={{ color: "white" }}
                      testID="dateTimePicker"
                      value={date}
                      mode={mode}
                      is24Hour={true}
                      onChange={onChange}
                    />
                  </View>

                  <Input
                    labelStyle={{ fontWeight: "normal" }}
                    inputStyle={{ color: "white", fontSize: 14 }}
                    label="What are you feeling?"
                    value={userFoodGenreName}
                    onChangeText={setUserFoodGenreName}
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
                    <Text>Add Food Genre</Text>
                  </TouchableOpacity>
                  {/* <View style = {}> */}
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
          <Text style={styles.sectionTitle}>Group Events</Text>
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
    backgroundColor: "#242526",
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
    shadowOffset: { height: 1, width: 1 },
    shadowOpacity: 1,
    shadowRadius: 1,
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

export default SingleGroup;
