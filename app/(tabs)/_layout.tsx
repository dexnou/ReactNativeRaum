import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import NavBar from "@/components/NavBar";
import ProfileScreen from "./profile";
import TabTwoScreen from "./two";
import LoginScreen from "./login";
import signUp from "./signup";
import FirstPage from "./index";
import { AuthProvider, useUserInfo } from "@/lib/userContext";
import StackNavigator from "./navigation/ScreenNavigator";
import SignUp from "@/components/SignUp";
import TabNavigator from "./navigation/TabNavigator";
import { NavigationContainer } from "@react-navigation/native";

const Tab = createBottomTabNavigator();
export default function App() {
  
  return (
    <NavigationContainer>
      <TabNavigator/>
    </NavigationContainer>

    );
}

//ver como solucionar lo de los 2 tipos de navegadores dentro de una MainNavigator
