import React, { useEffect, useState, useReducer } from "react";
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
import { auth, db, getUser, allUsers } from "../firebase";
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

function Item({ item, groups, index, scrollX }) {
  const navigation = useNavigation();
  const size = useSharedValue(1);

  const inputRange = [
    (index) * CARD_LENGTH,
    index * CARD_LENGTH,
    (index + 1) * CARD_LENGTH,
  ];

  size.value = interpolate(
    scrollX,
    inputRange,
    [1, 1, 0.8],
    Extrapolate.CLAMP
  );

  const opacity = useSharedValue(1);
  const opacityInputRange = [
    (index) * CARD_LENGTH,
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
        style={styles.list}
        onPress={() =>
          navigation.navigate("SingleGroup", {
            groupId: item.id,
            currentGroup: item,
            groups: groups,
          })
        }
      >
        <View style={styles.shadow}>
          <Image style={styles.groupImg} source={{ uri: item?.imgUrl }} />
        </View>

        <Text style={styles.name}>{item?.name}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const Groups = (props) => {
  const { groupIds, setUser, user } = props;
  const [groups, setGroups] = useState([{ name: "Loading...", id: "unique" }]);
  const [scrollX, setScrollX] = useState(0);

  useEffect(() => {
    //console.log("GROUPS.JS GROUPID", groupIds);
    const q = query(collection(db, "groups"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      let groupArr = [];
      snapshot.docs.map((doc) => {
        if (groupIds.includes(doc.id)) {
          groupArr.push({ ...doc.data(), id: doc.id });
        }
      });
      setGroups([...groupArr]);
      //console.log("GROUPS.JS GROUPID", groupIds);
    });
    return unsub;
  }, [groupIds?.length]);

  return (
    <Animated.View>
      <AnimatedFlatList
        scrollEventThrottle={16}
        decelerationRate={0.8}
        snapToInterval={CARD_LENGTH + SPACING * 1.5}
        disableIntervalMomentum={true}
        disableScrollViewPanResponder={true}
        snapToAlignment={"center"}
        extraData={groups}
        showsHorizontalScrollIndicator={false}
        data={groups}
        keyExtractor={(item) => item?.id}
        horizontal
        renderItem={({ item, index }) => {
          return (
            <Item item={item} groups={groups} index={index} scrollX={scrollX} />
          );
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
  groups: {},
  list: {
    borderRadius: 15,
    marginTop: 24,
    width: 190,
    height: 200,
    alignItems: "center",
  },
  groupImg: {
    width: 180,
    height: 180,
    borderRadius: 15,
  },
  name: {
    marginTop: 2,
    fontWeight: "bold",
    color: "darkgray",
  },
});

export default Groups;
