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


export default function EventPage({ route }, props) {

  const { groupId, name, location, image, eventId } =
    route?.params;
  const navigation = useNavigation();
console.log("EVENTID", eventId)
  const [restaurantData, setRestaurantData] = useState([]);
  const [user, setUser] = useState({})// -----------------USE AUTH.CURRENTUSER.UID INSTEAD-------------------
  const [isShown, setIsShown] = useState(false);
  const [event, setEvent] = useState({})

  const userInfo = () => {
    const filteredUsers = allUsers.filter(
      (user) => user.id === auth.currentUser.uid
    );
    setUser(filteredUsers[0]);
    console.log("USER", user);
  };

  useEffect(() => {
    userInfo();
    getUser();
  }, [user]);

  const getEventDoc = async ()=> {
    try{
    const docSnap = await getDoc(doc(db, "events", eventId));
    return setEvent({ ...docSnap.data(), id: docSnap.id })
    } catch (err){
      console.log("Error getting eventDoc", err)
    }
  }
  useEffect(()=> {
    getEventDoc()
  }, [restaurantData])

  // const [eventTime, setEventTime] = useState(time);// ---------WHY NOT JUST PUT IMPORTED PROPS AS VALUES??-----------------
  // const [eventDate, setEventDate] = useState(date);// ---------WHY NOT JUST PUT IMPORTED PROPS AS VALUES??-----------------
  const [restaurantName, setRestaurantName] = useState(event?.restName);
  const [restaurantLocation, setRestaurantLocation] = useState("");
  const [restaurantImage, setRestaurantImage] = useState("");

  const [cuisineType, setCuisineType] = useState("");
  const [budget, setBudget] = useState("3"); // 1 = $, 2 = $$, 3 = $$$, 4 = $$$$
  const [radius, setRadius] = useState("0"); // 1 mile = 1609.34 meters
  const [longitude, setLongitude] = useState(null); // having issues with this query, need to review documentation further
  const [latitude, setLatitude] = useState(null); // having issues with this query, need to review documentation further
  const [errorMsg, setErrorMsg] = useState(null);


  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([{ name: "Loading...", id: "unique" }]);// -------------- WHY??-----------------

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
  const groupRef = collection(db, "groups");// ---------------------------- WHY??-----------------
  useEffect(() => {
    getDocs(groupRef).then((snapshot) => {
      let currentGroup = [];
      snapshot.docs.forEach((doc) => {
        currentGroup.push({ ...doc.data(), id: doc.id });
      });
      setGroups(currentGroup.filter((group) => group.id === groupId)[0]);
    });
  }, []);

  console.log("GROUPS", groups);

  useEffect(() => {
    console.log("im working");
    getUsersInGroup();
    // setEventTime(time);// -------------- WHY??-----------------
    // setEventDate(date);// -------------- WHY??-----------------
    // setRestaurantName(name);// -------------- WHY?? SEE BELOW-----------------
    // setRestaurantLocation(location);// -------------- WHY?? SEE BELOW-----------------
    // setRestaurantImage(image);// -------------- WHY?? SEE BELOW-----------------
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
      console.log("cuisine type within function:", cuisineType);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    console.log("im also working");
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

  console.log("latitude", latitude);
  console.log("longitude", longitude);
  console.log("radius", radius);


  // pulling data from yelp api
  // const getRestaurantData = async () => {
  //   try {
  //     console.log("cuisine type within api call:", cuisineType);
  //     // const { data } = await axios.get(
  //     //   `https://api.yelp.com/v3/businesses/search?latitude=${latitude}&longitude=${longitude}&price=${budget}&radius=${radius}&categories=${cuisineType}&sortby=rating&limit=1`,
  //     const { data } = await axios.get(
  //       `https://api.yelp.com/v3/businesses/search?radius=${radius}&limit=1&categories=${cuisineType}&latitude=${latitude}&longitude=${longitude}&sort_by=rating`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${REACT_APP_YELP_API_KEY}`,
  //         },
  //       }
  //     );
  //     setRestaurantData(data.businesses);
  //     setRestaurantName(data.businesses[0]?.name);
  //     setRestaurantLocation(restaurantData[0]?.location.address1);
  //     //setRestaurantImage(restaurantData[0]?.image_url);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   getRestaurantData(cuisineType);
  // }, [cuisineType]);

  console.log("RESTURANT NAME OUTSIDE FUNCTIONS", event?.restName)
  const handleEdit = async () => {
    try{
      // console.log("Rest Name from db", event.restName)
      console.log("cuisine type within api call:", cuisineType);
      // const { data } = await axios.get(
      //   `https://api.yelp.com/v3/businesses/search?latitude=${latitude}&longitude=${longitude}&price=${budget}&radius=${radius}&categories=${cuisineType}&sortby=rating&limit=1`,
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
      setRestaurantImage(data.businesses[0]?.image_url);

    console.log("HANDLE EDIT RESTNAME", restaurantName)
    await updateDoc(doc(db, "events", eventId), {
      // eventDate: eventDate,
      // eventTime: eventTime,
      // groupId: groupId,
      restName: data.businesses[0]?.name,
      restLoc: data.businesses[0]?.location.address1,
      restImageUrl: data.businesses[0]?.image_url
    });
  } catch (err){
    console.log("Error updating events table",err)
  }
  };


  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  return user.id === groups.leaderId ? (
    <SafeAreaView style={styles.container}>
      <Divider color="orange" />
      <View style={styles.contents}>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text style={styles.eventText}>
            {/* Event Date: {date} */}
            {"\n"}
          </Text>
          {!isShown && event.restName === "" ? (
            <View>
              <Text style={styles.eventText}>
                Choice Radius: {(radius / 1609).toFixed(2)} Miles
              </Text>
              <Slider
                style={{ width: 200, height: 40 }}
                minimumValue={0}
                maximumValue={16090}
                minimumTrackTintColor="#FFFFFF"
                maximumTrackTintColor="#000000"
                onValueChange={(value) => setRadius(Math.floor(value))}
              />

              <TouchableOpacity
                style={styles.roundButton1}
                onPress={() => {
                  setIsShown(!isShown);
                  Alert.alert("Your restaurant is ready!");
                  console.log("cuisine type on press", cuisineType);
                  console.log("radius on press", `${radius} meters`);
                  console.log("RESTAURANT DATA", restaurantData);

                  setRestaurantName(restaurantData[0]?.name); //--------WHYY HERE AND NOT INSIDE HANDLE EDIT FUNC???-----------
                  setRestaurantLocation(restaurantData[0]?.location.address1);//--------WHYY???-----------
                  //setRestaurantImage(restaurantData[0]?.image_url);//--------WHYY???-----------
                  forceUpdate();
                  handleEdit();
                }}
              >
                <Text style={{ fontSize: 32 }}>Chewse</Text>
              </TouchableOpacity>
              <Text> </Text>
            </View>
          ) : (
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Text style={styles.eventText}>
                Your Restaurant Is:
                {"\n"}
              </Text>
              <Image
                style={styles.imgEvent}
                // source={{ uri: image }}
                source={{ uri: event.restImageUrl }}
              />
              <Text style={styles.eventText}>
                {"\n"}
                {/* {name} */}
                {event.restName}
                {"\n"}
              </Text>

              <Text style={styles.eventText}>
                {event.restLoc}
              </Text>

              <Text style={styles.eventText}>
                {/* {location}
                {restaurantData[0]?.location.city},{" "}
                {restaurantData[0]?.location.state}{" "}
                {restaurantData[0]?.location.zip_code}
                {"\n"} */}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.goBack();
                }}
              >
                <Text style={styles.eventText}>Back to Group</Text>
              </TouchableOpacity>
            </View>
          )}
          {isShown && event.restName !== ""? (
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              {/* <Text style={styles.eventText}>
                Your Restaurant Is:
                {"\n"}
              </Text> */}
              {/* <Image
                style={styles.imgEvent}
                // source={{ uri: image }}
                source={{ uri: restaurantData[0]?.image_url }}
              /> */}
              {/* <Text style={styles.eventText}> */}
                {/* {"\n"} */}
                {/* {name} */}
                {/* {restaurantData[0]?.name} */}
                {/* {"\n"} */}
              {/* </Text> */}

              {/* <Text style={styles.eventText}>
                {restaurantData[0]?.location.address1}
              </Text> */}

              {/* <Text style={styles.eventText}> */}
                {/* {location} */}
                {/* {restaurantData[0]?.location.city},{" "}
                {restaurantData[0]?.location.state}{" "}
                {restaurantData[0]?.location.zip_code} */}
                {/* {"\n"} */}
              {/* </Text> */}
              {/* <TouchableOpacity
                onPress={() => {
                  navigation.goBack();
                }}
              >
                <Text style={styles.eventText}>Back to Group</Text>
              </TouchableOpacity> */}
            </View>
          ):null}
        </View>
      </View>
      <Footer />
    </SafeAreaView>
  ) : (
    <SafeAreaView style={styles.container}>
      <Divider color="orange" />
      <View style={styles.contents}>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          {/* <Text style={styles.eventText}>
            {"\n"}Event Time: {eventTime}
          </Text> */}
          {/* <Text style={styles.eventText}>
            Event Date: {eventDate}
            {"\n"}
          </Text> */}

          <TouchableOpacity
            style={styles.roundButton2}
            onPress={() => {
              Alert.alert(
                "Please wait for the group leader to hit the Chewse button for the group."
              );
            }}
          >
            <Text style={{ fontSize: 32 }}>Chewse</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#242526",
  },
  contents: {
    flex: 2.4,
    alignItems: "center",
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
  friends: {},
  list: {
    marginTop: 24,
    marginRight: 8,
    width: 100,
    height: 200,
    borderRadius: 50,
    alignItems: "center",
  },
  img: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  imgEvent: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  name: {
    marginTop: 2,
    fontWeight: "bold",
    color: "darkgray",
  },
  eventsWrapper: {
    paddingHorizontal: 12,
    flex: 1.3,
  },
  events: {},
  eventList: {
    marginTop: 24,
    marginRight: 8,
    width: 180,
    height: 250,
    borderRadius: 15,
  },
  eventImg: {
    width: 180,
    height: 180,
    borderRadius: 15,
  },
  eventName: {
    marginTop: 2,
    fontWeight: "bold",
    color: "darkgray",
  },
  eventText: {
    fontSize: 16,
    color: "white",
  },

  eventLoc: {
    marginTop: 2,
    color: "darkgray",
    fontSize: 12,
  },
  roundButton1: {
    width: 150,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 100,
    backgroundColor: "orange",
  },
  roundButton2: {
    width: 150,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 100,
    backgroundColor: "grey",
  },
});


