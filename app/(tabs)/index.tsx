import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "expo-router";

const LoginScreen = ({ navigation }: { navigation: any }) => {
  return (
    <View style={styles.background}>
      <View style={styles.topShape} />
      <View style={styles.bottomShape} />
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.buttonText}>YA TENGO CUENTA</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation.navigate("Signup")}
        >
          <Text style={styles.secondaryButtonText}>
            QUIERO TENER UNA CUENTA
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "#03175E",
  },
  topShape: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "60%",
    backgroundColor: "#03175E",
    borderBottomRightRadius: 200,
  },
  bottomShape: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "40%",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 200,
  },
  container: {
    alignItems: "center",
    padding: 20,
  },
  button: {
    width: "80%",
    height: 50,
    backgroundColor: "#000080",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  secondaryButton: {
    backgroundColor: "#FFFFFF",
    borderColor: "#000080",
    borderWidth: 2,
  },
  secondaryButtonText: {
    color: "#000080",
    fontWeight: "bold",
  },
});

export default LoginScreen;
