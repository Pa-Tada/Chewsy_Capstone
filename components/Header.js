import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Header = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Chewsy</Text>
    </View>
  )
}

export default Header

const styles = StyleSheet.create({
  container: {
    flex: 0.2,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    flexDirection: "row",
    borderBottomWidth: 0.4,
    borderColor: "gray",
  },
  logo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "orange",
  },
})
