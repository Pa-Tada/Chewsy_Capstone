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
    flex: 1,
    backgroundColor: "#242526",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    fontSize: 35,
    fontWeight: "bold",
    color: "orange",
    paddingVertical: 30,
    paddingHorizontal: 15,
  },
})
