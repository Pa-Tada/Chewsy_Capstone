import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Icon } from "@rneui/themed";
import React, {useState} from "react";
import { useNavigation } from "@react-navigation/native";
import { auth, db, allUsers } from "../firebase";
import PendingInvites from "../screens/PendingInvites";

const Footer = (props) => {
  const navigation = useNavigation();
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  return (
    <View style={styles.container}>
      <Modal visible={inviteModalOpen} transparent={true} animationType="slide">
        <PendingInvites
          inviteModalOpen={inviteModalOpen}
          setInviteModalOpen={setInviteModalOpen}
        />
      </Modal>
      <TouchableOpacity
        style={styles.iconWrapper}
        onPress={() => navigation.navigate("Home")}
      >
        <Icon type="antdesign" name="home" color="white" style={styles.icon} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.iconWrapper}
        onPress={() =>navigation.navigate("Profile") }
      >
        <Icon type="antdesign" name="form" color="white" style={styles.icon} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.iconWrapper}
        onPress={() => setInviteModalOpen(true)}
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
        onPress={async () => {
          try {
            await auth.signOut();
            console.log("Signout successful");
            navigation.navigate("Welcome");
          } catch (err) {
            console.log("Signout error", err);
          }
        }}
      >
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
    marginTop: 18,
    shadowColor: "black",
    shadowOffset: { height: 2, width: 2 },
    shadowOpacity: 1,
    shadowRadius: 2,
  },
  icon: {
    // width: 35,
    // height: 35,
    // borderRadius: 50,
  },
});
