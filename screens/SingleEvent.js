import React, { useEffect, useState } from "react";
import { REACT_APP_YELP_API_KEY } from "@env";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  SafeAreaView,
  Alert,
} from "react-native";
import Footer from "../components/Footer";
import { auth, db, allUsers, getUser } from "../firebase";
import {
  collection,
  getDocs,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  updateDoc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { Divider } from "@rneui/themed";
import Slider from "@react-native-community/slider";
import RNPickerSelect from "react-native-picker-select";
import Constants from "expo-constants";
import * as Location from "expo-location";
import Ripple from "react-native-material-ripple";

export default function EventPage({ route }, props) {
  const { groupId, name, location, image, eventId } = route?.params;
  const navigation = useNavigation();
  console.log("EVENTID", eventId);
  const [restaurantData, setRestaurantData] = useState([]);
  const [user, setUser] = useState({}); // -----------------USE AUTH.CURRENTUSER.UID INSTEAD-------------------
  const [isShown, setIsShown] = useState(false);
  const [event, setEvent] = useState({});

  const userInfo = () => {
    const filteredUsers = allUsers.filter(
      (user) => user.id === auth.currentUser.uid
    );
    setUser(filteredUsers[0]);
  };

  useEffect(() => {
    userInfo();
    getUser();
  }, [user]);

  const getEventDoc = async () => {
    try {
      const docSnap = await getDoc(doc(db, "events", eventId));
      return setEvent({ ...docSnap.data(), id: docSnap.id });
    } catch (err) {
      console.log("Error getting eventDoc", err);
    }
  };
  useEffect(() => {
    getEventDoc();
  }, [restaurantData]);

  const [restaurantName, setRestaurantName] = useState(event?.restName);
  const [restaurantLocation, setRestaurantLocation] = useState("");
  const [restaurantImage, setRestaurantImage] = useState("");
  const [cuisineType, setCuisineType] = useState("");
  const [budget, setBudget] = useState("3"); // 1 = $, 2 = $$, 3 = $$$, 4 = $$$$
  const [radius, setRadius] = useState("0"); // 1 mile = 1609.34 meters
  const [longitude, setLongitude] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([{ name: "Loading...", id: "unique" }]);
  const [restaurantCity, setRestaurantCity] = useState("");
  const [restaurantState, setRestaurantState] = useState("");
  const [restaurantZip, setRestaurantZip] = useState("");

  // finding all users in the group
  const getUsersInGroup = async () => {
    try {
      const userRef = collection(db, "users");
      const q = query(userRef, where("groupIds", "array-contains", groupId));

      const userSnapshot = await getDocs(q);
      const usersArr = [];
      userSnapshot.forEach((doc) => {
        usersArr.push(doc.data());
      });
      setUsers(usersArr);
    } catch (err) {
      console.log(err);
    }
  };

  // finding single group info
  const groupRef = collection(db, "groups");
  useEffect(() => {
    getDocs(groupRef).then((snapshot) => {
      let currentGroup = [];
      snapshot.docs.forEach((doc) => {
        currentGroup.push({ ...doc.data(), id: doc.id });
      });
      setGroups(currentGroup.filter((group) => group.id === groupId)[0]);
    });
  }, []);

  useEffect(() => {
    getUsersInGroup();
  }, []);

  // finding most popular cuisine type in group
  const getSelectedGenre = async () => {
    try {
      const findGenres = users.map((user) => {
        if (user.foodGenre) {
          return user.foodGenre;
        }
      });

      const totalCount = await findGenres.flat().reduce((acc, genre) => {
        if (acc[genre]) {
          acc[genre] += 1;
        } else {
          acc[genre] = 1;
        }
        return acc;
      }, {});

      const sortedGenres = Object.entries(totalCount).sort(
        (a, b) => b[1] - a[1]
      );
      const mostPopularGenre = sortedGenres[0][0];
      setCuisineType(mostPopularGenre);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getSelectedGenre();
  }, [users]);

  // setting lat and long
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);
    })();
  }, [radius]);

  const handleEdit = async () => {
    try {
      const { data } = await axios.get(
        `https://api.yelp.com/v3/businesses/search?radius=${radius}&limit=1&categories=${cuisineType}&latitude=${latitude}&longitude=${longitude}&sort_by=rating`,
        {
          headers: {
            Authorization: `Bearer ${REACT_APP_YELP_API_KEY}`,
          },
        }
      );
      setRestaurantData(data.businesses);
      setRestaurantName(data.businesses[0]?.name);
      setRestaurantLocation(data.businesses[0]?.location.address1);
      setRestaurantCity(data.businesses[0]?.location.city);
      setRestaurantState(data.businesses[0]?.location.state);
      setRestaurantZip(data.businesses[0]?.location.zip_code);
      setRestaurantImage(data.businesses[0]?.image_url);

      await updateDoc(doc(db, "events", eventId), {
        restName: data.businesses[0]?.name,
        restLoc: `${data.businesses[0]?.location.address1}, ${data.businesses[0]?.location.city}, ${data.businesses[0]?.location.state}, ${data.businesses[0]?.location.zip_code}`,
        restImageUrl: data.businesses[0]?.image_url,
      });
    } catch (err) {
      console.log("Error updating events table", err);
    }
  };

  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  return user.id === groups.leaderId ? (
    <SafeAreaView style={styles.container}>
      <Divider color="orange" />
      <View style={styles.contents}>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text style={styles.eventDate}></Text>
          {!isShown && event.restName === "" ? (
            <View style={{ alignSelf: "center" }}>
              <Text style={styles.eventRadius}>
                Slide to select radius {"\n"}
                {(radius / 1609).toFixed(2)} Miles
              </Text>
              <Slider
                style={{ width: 250, height: 70 }}
                minimumValue={0}
                maximumValue={16090}
                minimumTrackTintColor="orange"
                maximumTrackTintColor="#FFFFFF"
                onValueChange={(value) => setRadius(Math.floor(value))}
              />
              <View style={styles.yellowButtonWrapper}>
                <Ripple
                  rippleColor="#f5c007"
                  rippleSize={300}
                  rippleOpacity={0.7}
                  style={styles.roundButton}
                  onPress={() => {
                    setIsShown(!isShown);
                    // Alert.alert("Your restaurant is ready!");

                    forceUpdate();
                    handleEdit();
                  }}
                >
                  <Text style={{ fontSize: 38, fontWeight: "600" }}>
                    CHEWSE
                  </Text>
                </Ripple>
              </View>
              <View style={styles.createbutton}>
                <Ripple
                  rippleColor="#f5c007"
                  rippleSize={80}
                  rippleOpacity={0.8}
                  onPress={() => {
                    navigation.goBack();
                  }}
                >
                  <View style={styles.buttonWrapper}>
                    <Text style={styles.button}>Back To Home</Text>
                  </View>
                </Ripple>
              </View>
            </View>
          ) : (
            <View style={styles.showingEvent}>
              <View style={styles.eventDetails}>
                <Text style={styles.sectionTitle}>We've chosen</Text>
                <Image
                  style={styles.imgEvent}
                  source={{ uri: event.restImageUrl }}
                />
                <Text style={styles.eventRestName}>
                  {"\n"}
                  {event.restName}
                  {"\n"}
                </Text>

                <Text style={styles.eventRestLocation}>{event.restLoc}</Text>
              </View>
              <View style={styles.createbutton}>
                <Ripple
                  rippleColor="#f5c007"
                  rippleSize={80}
                  rippleOpacity={0.8}
                  onPress={() => {
                    navigation.goBack();
                  }}
                >
                  <View style={styles.buttonWrapper}>
                    <Text style={styles.button}>Back To Home</Text>
                  </View>
                </Ripple>
              </View>
            </View>
          )}
          {isShown && event.restName !== "" ? (
            <View
              style={{ justifyContent: "center", alignItems: "center" }}
            ></View>
          ) : null}
        </View>
      </View>
      <Footer />
    </SafeAreaView>
  ) : (
    <SafeAreaView style={styles.container}>
      <Divider color="orange" />
      <View style={styles.contents}>
        <View style={styles.roundButtonWrapper}>
          <Ripple
            rippleColor="#fff"
            style={styles.roundButtonDisabled}
            onPress={() => {
              Alert.alert("Please wait for the group leader to click Chewse.");
            }}
          >
            <Text style={{ fontSize: 38, fontWeight: "600", color: "white" }}>
              CHEWSE
            </Text>
          </Ripple>
        </View>
        <View style={styles.createbutton}>
          <Ripple
            rippleColor="#f5c007"
            rippleSize={80}
            rippleOpacity={0.8}
            onPress={() => {
              navigation.goBack();
            }}
          >
            <View style={styles.buttonWrapper}>
              <Text style={styles.button}>Back To Home</Text>
            </View>
          </Ripple>
        </View>
      </View>
      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1b1b1b",
  },
  contents: {
    flex: 2.4,
    alignItems: "center",
  },
  showingEvent: {
    // justifyContent: "center",
    // alignItems: "center",
    // flexDirection: "column",
    // justifyContent: "space-between"
  },
  eventDetails: {
    alignItems: "center",
  },
  eventDate: {
    fontSize: 16,
    color: "white",
  },
  eventRadius: {
    fontSize: 20,
    color: "white",
    textAlign: "center",
    alignContent: "center",
  },
  yellowButtonWrapper: {
    paddingTop: 50,
    shadowColor: "black",
    shadowOffset: { height: 2, width: 2 },
    shadowOpacity: 2,
    shadowRadius: 2,
  },
  roundButtonWrapper: {
    paddingTop: 150,
    shadowColor: "black",
    shadowOffset: { height: 2, width: 2 },
    shadowOpacity: 2,
    shadowRadius: 2,
  },
  roundButton: {
    width: 240,
    height: 240,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 240,
    backgroundColor: "orange",
  },
  roundButtonDisabled: {
    width: 240,
    height: 240,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 240,
    backgroundColor: "grey",
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "white",
    marginBottom: 20,
    textAlign: "center",
    paddingBottom: 25,
    shadowColor: "black",
    shadowOffset: { height: 2, width: 2 },
    shadowOpacity: 2,
    shadowRadius: 2,
  },
  imgEvent: {
    width: 280,
    height: 280,
    borderRadius: 15,
  },
  eventRestName: {
    fontSize: 19,
    fontWeight: "bold",
    color: "orange",
  },
  eventRestLocation: {
    fontSize: 16,
    fontWeight: "600",
    color: "darkgray",
  },
  createbutton: {
    paddingTop: 60,
  },
  buttonWrapper: {
    paddingVertical: 10,
    borderRadius: 60,
    width: 170,
    backgroundColor: "orange",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 10,
  },
  button: {
    fontWeight: "700",
    fontSize: 16,
    color: "#181818",
  },
});
