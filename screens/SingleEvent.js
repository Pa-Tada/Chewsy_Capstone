// import React from "react";
// import { useEffect, useState } from "react";
// import { REACT_APP_YELP_API_KEY } from "@env";
// // import { REACT_APP_YELP_API_KEY } from "@env"
// import axios from "axios";
// import {
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   Image,
//   SafeAreaView,
//   Alert,
// } from "react-native";
// import Footer from "../components/Footer";
// import { Divider } from "@rneui/themed";

// export default function EventPage() {
//   const [restaurantData, setRestaurantData] = useState([]);
//   const [isShown, setIsShown] = useState(false);

//   /*
//   Sorry Orlando, I'll delete this before the final review, just wanted to keep the logic here so we can easily reference it

//     with our yelp request, we want to:
//     get restaurants that are open at the time of the event - (bug with this, need to find workaround)
//     get restaurants that are open on the day of the event - [see above]

//     have available reservation space (based on group size) [] - there is a yelp reservations query, but ideally, we want to query all available reservation platforms and cross reference them to decide on availability, probably will work on that after 1st demo
//     have reviews above 4 stars []
//     with a minimum of 50 reviews []
//     fit within group stipulated budget [x]
//     and that are within a certain radius of the event location based on the user's lat and long. Radius is measured in meters we may need to convert to miles for use with maps? */

//   const [eventTime, setEventTime] = useState("7:30pm");
//   const [eventDate, setEventDate] = useState("11/19/2022");
//   const [eventLocation, setEventLocation] = useState("New York, NY");
//   const [cuisineType, setCuisineType] = useState("Italian");
//   const [budget, setBudget] = useState("3"); // 1 = $, 2 = $$, 3 = $$$, 4 = $$$$
//   const [radius, setRadius] = useState("1610"); // 1 mile = 1609.34 meters
//   const [reviewCount, setReviewCount] = useState("50");
//   const [longitude, setLongitude] = useState("73.9690"); // having issues with this query, need to review documentation further
//   const [latitude, setLatitude] = useState("40.6602"); // having issues with this query, need to review documentation further

//   const getRestaurantData = async () => {
//     try {
//       const { data } = await axios.get(
//         `https://api.yelp.com/v3/businesses/search?term=restaurant&location=${eventLocation}&price=${budget}&radius=${radius}&categories=${cuisineType}&sortby=rating&limit=1`,
//         {
//           headers: {
//             Authorization: `Bearer ${REACT_APP_YELP_API_KEY}`,
//           },
//         }
//       );
//       setRestaurantData(data.businesses);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     getRestaurantData();
//   }, []);

//   return (
//     <SafeAreaView style={styles.container}>
//       <Divider />
//       <View style={styles.contents}>
//         <View style={{ justifyContent: "center", alignItems: "center" }}>
//           <Text style={styles.eventText}>
//             {"\n"}Event Time: {eventTime}
//           </Text>
//           <Text style={styles.eventText}>
//             Event Date: {eventDate}
//             {"\n"}
//           </Text>
//           {!isShown ? (
//             <View>
//               <TouchableOpacity
//                 style={styles.roundButton1}
//                 onPress={() =>
//                   setIsShown(!isShown) &&
//                   Alert.alert("Your restaurant is ready!")
//                 }
//               >

//                 <Text style={{ fontSize: 42 }}>Chewse</Text>

//               </TouchableOpacity>
//               <Text> </Text>
//             </View>
//           ) : null}
//           {isShown && (
//             <View style={{ justifyContent: "center", alignItems: "center" }}>
//               <Text style={styles.eventText}>
//                 Your Restaurant Is:
//                 {"\n"}
//               </Text>
//               <Image
//                 style={styles.imgEvent}
//                 source={{ uri: restaurantData[0]?.image_url }}
//               />
//               <Text style={styles.eventText}>
//                 {"\n"}
//                 {restaurantData[0]?.name}
//                 {"\n"}
//               </Text>

//               <Text style={styles.eventText}>
//                 {restaurantData[0]?.location.address1}
//               </Text>

//               <Text style={styles.eventText}>
//                 {restaurantData[0]?.location.city},{" "}
//                 {restaurantData[0]?.location.state}{" "}
//                 {restaurantData[0]?.location.zip_code}
//                 {"\n"}
//               </Text>
//             </View>
//           )}
//         </View>
//       </View>
//       <Footer />
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#242526",
//   },
//   contents: {
//     flex: 2.4,
//     alignItems: "center",
//   },
//   titleContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     //backgroundColor: "dodgerblue"
//   },
//   sectionTitle: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "white",
//   },
//   iconWrapper: {
//     shadowColor: "black",
//     shadowOffset: { height: 1, width: 1 },
//     shadowOpacity: 1,
//     shadowRadius: 1,
//   },
//   shadow: {
//     shadowColor: "black",
//     shadowOffset: { height: -1, width: 1 },
//     shadowOpacity: 0.8,
//     shadowRadius: 1,
//   },
//   friendsWrapper: {
//     marginTop: 30,
//     paddingHorizontal: 12,
//     flex: 1,
//   },
//   friends: {},
//   list: {
//     marginTop: 24,
//     marginRight: 8,
//     width: 100,
//     height: 200,
//     borderRadius: 50,
//     alignItems: "center",
//   },
//   img: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//   },
//   imgEvent: {
//     width: 200,
//     height: 200,
//     borderRadius: 10,
//   },
//   name: {
//     marginTop: 2,
//     fontWeight: "bold",
//     color: "darkgray",
//   },
//   eventsWrapper: {
//     paddingHorizontal: 12,
//     flex: 1.3,
//   },
//   events: {},
//   eventList: {
//     marginTop: 24,
//     marginRight: 8,
//     width: 180,
//     height: 250,
//     borderRadius: 15,
//   },
//   eventImg: {
//     width: 180,
//     height: 180,
//     borderRadius: 15,
//   },
//   eventName: {
//     marginTop: 2,
//     fontWeight: "bold",
//     color: "darkgray",
//   },
//   eventText: {
//     // fontFamily: "Inter_400Regular",

//     fontSize: 16,
//     color: "white",
//   },

//   eventLoc: {
//     marginTop: 2,
//     color: "darkgray",
//     fontSize: 12,
//   },
//   roundButton1: {
//     width: 150,
//     height: 150,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 10,
//     borderRadius: 100,
//     backgroundColor: "orange",
//   },
//   // buttonWrapper: {
//   //   paddingVertical: 30,
//   //   paddingHorizontal: 10,
//   //   flex: 0.2,
//   //   justifyContent: "center",
//   // },
//   // button: {
//   //   borderRadius: 60,
//   //   width: 250,
//   //   height: 50,
//   //   backgroundColor: "orange",
//   // },
//   // buttonText: {
//   //   paddingTop: 10,
//   //   textAlign: "center",
//   //   color: "black",
//   //   fontSize: 20,
//   //   fontWeight: "bold",
//   // },
// });

import React from "react";
import { useEffect, useState } from "react";
import { REACT_APP_YELP_API_KEY } from "@env";
import axios from "axios";
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
import { auth, db } from "../firebase";
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
} from "firebase/firestore";
import { Divider } from "@rneui/themed";
import Slider from "@react-native-community/slider";
import RNPickerSelect from "react-native-picker-select";

export default function EventPage({ route, navigation }) {
  const [restaurantData, setRestaurantData] = useState([]);
  const [isShown, setIsShown] = useState(false);
  const { groupId, currentGroup } = route?.params;

  /*
  Sorry Orlando, I'll delete this before the final review, just wanted to keep the logic here so we can easily reference it

    with our yelp request, we want to:
    get restaurants that are open at the time of the event - (bug with this, need to find workaround)
    get restaurants that are open on the day of the event - [see above]

    have available reservation space (based on group size) [] - there is a yelp reservations query, but ideally, we want to query all available reservation platforms and cross reference them to decide on availability, probably will work on that after 1st demo
    have reviews above 4 stars []
    with a minimum of 50 reviews []
    fit within group stipulated budget [x]
    and that are within a certain radius of the event location based on the user's lat and long. Radius is measured in meters we may need to convert to miles for use with maps? */

  const [eventTime, setEventTime] = useState("7:30pm");
  const [eventDate, setEventDate] = useState("11/19/2022");
  const [eventLocation, setEventLocation] = useState("New York, NY");
  const [cuisineType, setCuisineType] = useState("");
  const [budget, setBudget] = useState("3"); // 1 = $, 2 = $$, 3 = $$$, 4 = $$$$
  const [radius, setRadius] = useState("10000"); // 1 mile = 1609.34 meters
  const [reviewCount, setReviewCount] = useState("50");
  const [longitude, setLongitude] = useState("73.9690"); // having issues with this query, need to review documentation further
  const [latitude, setLatitude] = useState("40.6602"); // having issues with this query, need to review documentation further
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [events, setEvents] = useState([]);

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

  useEffect(() => {
    getUsersInGroup();
  }, []);

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
    getSelectedGenre();
  }, [users]);

  console.log("SingleEvent.js Cuisine Type", cuisineType);
  console.log("SingleEvent.js GroupId", groupId);

  const getRestaurantData = async () => {
    try {
      console.log("cuisine type within api call:", cuisineType);
      const { data } = await axios.get(
        `https://api.yelp.com/v3/businesses/search?term=restaurant&location=${eventLocation}&price=${budget}&radius=${radius}&categories=${cuisineType}&sortby=rating&limit=1`,
        {
          headers: {
            Authorization: `Bearer ${REACT_APP_YELP_API_KEY}`,
          },
        }
      );
      setRestaurantData(data.businesses);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getRestaurantData(cuisineType);
  }, [cuisineType]);

  return (
    <SafeAreaView style={styles.container}>
      <Divider color="orange" />
      <View style={styles.contents}>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text style={styles.eventText}>
            {"\n"}Event Time: {eventTime}
          </Text>
          <Text style={styles.eventText}>
            Event Date: {eventDate}
            {"\n"}
          </Text>
          {!isShown ? (
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
              <Text style={styles.eventText}>Select a Borough</Text>
              <RNPickerSelect
                style={styles.eventText}
                labelStyle={{ fontWeight: "normal" }}
                inputStyle={{ color: "white", fontSize: 14 }}
                label="Location"
                onValueChange={(value) => setEventLocation(value)}
                items={[
                  { label: "Queens", value: "Queens, NY" },
                  { label: "Brooklyn", value: "Brooklyn" },
                  { label: "Bronx", value: "Bronx" },
                  { label: "Manhattan", value: "Manhattan, NY" },
                  { label: "Staten Island", value: "Staten Island, NY" },
                ]}
              />

              <TouchableOpacity
                style={styles.roundButton1}
                onPress={() => {
                  console.log("cuisine type on press", cuisineType);
                  // await getRestaurantData(cuisineType)
                  setIsShown(!isShown);
                  Alert.alert("Your restaurant is ready!");
                  setDoc(collection(db, "events"), {
                    createdAt: date,
                    groupId: groupId,
                    restImageUrl:
                      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFuys8jY57bOyYwcKNIapFCCYLx18yRcXyEYJxcw7-BQgr5eqvIa-RRSY2XoByxp_GuVE&usqp=CAU",
                    restLoc: "",
                    restName: "",
                    submissions: 1,
                  });
                }}
              >
                <Text style={{ fontSize: 32 }}>Chewse</Text>
              </TouchableOpacity>
              <Text> </Text>
            </View>
          ) : null}
          {isShown && (
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Text style={styles.eventText}>
                Your Restaurant Is:
                {"\n"}
              </Text>
              <Image
                style={styles.imgEvent}
                source={{ uri: restaurantData[0]?.image_url }}
              />
              <Text style={styles.eventText}>
                {"\n"}
                {restaurantData[0]?.name}
                {"\n"}
              </Text>

              <Text style={styles.eventText}>
                {restaurantData[0]?.location.address1}
              </Text>

              <Text style={styles.eventText}>
                {restaurantData[0]?.location.city},{" "}
                {restaurantData[0]?.location.state}{" "}
                {restaurantData[0]?.location.zip_code}
                {"\n"}
              </Text>
            </View>
          )}
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
    // fontFamily: "Inter_400Regular",

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
  // buttonWrapper: {
  //   paddingVertical: 30,
  //   paddingHorizontal: 10,
  //   flex: 0.2,
  //   justifyContent: "center",
  // },
  // button: {
  //   borderRadius: 60,
  //   width: 250,
  //   height: 50,
  //   backgroundColor: "orange",
  // },
  // buttonText: {
  //   paddingTop: 10,
  //   textAlign: "center",
  //   color: "black",
  //   fontSize: 20,
  //   fontWeight: "bold",
  // },
});
