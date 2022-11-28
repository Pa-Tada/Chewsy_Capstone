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
import Animated, {
  interpolate,
  Extrapolate,
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

const CARD_LENGTH = 190;
const SPACING = 8;
const SIDECARD_LENGTH = 5;
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

function Item({ item, index, scrollX }) {
  const navigation = useNavigation();
  const size = useSharedValue(1);

  const inputRange = [
    index * CARD_LENGTH,
    index * CARD_LENGTH,
    (index + 1) * CARD_LENGTH,
  ];

  size.value = interpolate(scrollX, inputRange, [1, 1, 0.8], Extrapolate.CLAMP);

  const opacity = useSharedValue(1);
  const opacityInputRange = [
    index * CARD_LENGTH,
    index * CARD_LENGTH,
    (index + 1) * CARD_LENGTH,
  ];
  opacity.value = interpolate(
    scrollX,
    opacityInputRange,
    [1, 1, 0.5],
    Extrapolate.CLAMP
  );

  const cardStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scaleY: size.value }],
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View
      style={[
        styles.card,
        cardStyle,
        {
          marginLeft: index == 0 ? SIDECARD_LENGTH : SPACING,
          marginRight: index == 2 ? SIDECARD_LENGTH : SPACING,
        },
      ]}
    >
      <TouchableOpacity
        style={styles.eventList}
        onPress={() =>
          navigation.navigate("SingleEvent", {
            eventId: item.id,
            currentEvent: item,
            groupId: item.groupId,
            //date: item.createdAt,
            name: item.restName,
            image: item.restImageUrl,
          })
        }
      >
        <View style={styles.shadow}>
          <Image style={styles.eventImg} source={{ uri: item.restImageUrl }} />
        </View>
        <Text style={styles.eventName}>
          Your Event at{" "}
          {new Date(item.createdAt?.seconds * 1000).toLocaleTimeString(
            "en-US",
            { hour: "2-digit", minute: "2-digit" }
          )}{" "}
          on{" "}
          {new Date(item.createdAt?.seconds * 1000).toLocaleDateString("en-US")}
        </Text>
        <Text style={styles.eventName}>{item.restName}</Text>
        <Text style={styles.eventLoc}>{item.restLoc}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const Events = (props) => {
  const { groupIds } = props;
  const [events, setEvents] = useState([{ name: "Loading...", id: "unique" }]);
  const [scrollX, setScrollX] = useState(0);

  useEffect(() => {
    const q = query(collection(db, "events"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      let eventArr = [];
      snapshot.docs.map((doc) => {
        if (
          groupIds?.includes(
            doc.data().groupId || groupIds == doc.data().groupId
          )
        )
          eventArr.push({ ...doc.data(), id: doc.id });
      });
      setEvents(eventArr);
      //console.log("Events.js events", events)
    });
    return unsub;
  }, [groupIds]);

  return (
    <Animated.View>
      <AnimatedFlatList
        scrollEventThrottle={16}
        decelerationRate={0.8}
        snapToInterval={CARD_LENGTH + SPACING * 1.5}
        disableIntervalMomentum={true}
        disableScrollViewPanResponder={true}
        snapToAlignment={"center"}
        showsHorizontalScrollIndicator={false}
        data={events}
        keyExtractor={(item) => item.id}
        horizontal
        renderItem={({ item, index }) => {
          return <Item item={item} index={index} scrollX={scrollX} />;
        }}
        onScroll={(event) => {
          setScrollX(event.nativeEvent.contentOffset.x);
        }}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_LENGTH,
    overflow: "hidden",
    borderRadius: 15,
  },
  shadow: {
    shadowColor: "#ff8c00",
    shadowOffset: { height: -1, width: -1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  events: {},
  eventList: {
    marginTop: 24,
    marginRight: 8,
    width: 190,
    height: 250,
    borderRadius: 15,
    alignItems: "center",
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
  eventLoc: {
    marginTop: 2,
    color: "darkgray",
    fontSize: 12,
  },
});

export default Events;
