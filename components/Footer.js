import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { Icon } from "@rneui/themed";
import React from "react";
import { useNavigation } from "@react-navigation/native";

const Footer = (props) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.iconWrapper}
        onPress={() => navigation.navigate("Home")}
      >
        <Icon type="antdesign" name="home" color="white" style={styles.icon} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.iconWrapper}
        onPress={() => navigation.navigate("Profile")}
      >
        <Icon type="antdesign" name="form" color="white" style={styles.icon} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.iconWrapper}
        onPress={() => navigation.navigate("PendingInvites")}
      >
        <Icon
          type="antdesign"
          name="calendar"
          color="white"
          style={styles.icon}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.iconWrapper}
        onPress={() => navigation.navigate("Welcome")}
      >
        {/* LOG OUT */}
        <Icon
          type="antdesign"
          name="logout"
          color="white"
          style={styles.icon}
        />
      </TouchableOpacity>
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 0.3,
    borderColor: "orange",
    paddingHorizontal: 40,
    flex: 0.25,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  iconWrapper: {
    marginTop: 12,
    shadowColor: "black",
    shadowOffset: { height: 1, width: 1 },
    shadowOpacity: 1,
    shadowRadius: 1,
  },
  icon: {
    // width: 35,
    // height: 35,
    // borderRadius: 50,
  },
});
