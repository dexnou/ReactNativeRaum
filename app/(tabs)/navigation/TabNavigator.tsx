import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import NavBar from "@/components/NavBar";
import ProfileScreen from "../profile";
import TabTwoScreen from "../two";
import LoginScreen from "../login";
import signUp from "../signup";
import FirstPage from "../index";
import { AuthProvider, useUserInfo } from "@/lib/userContext";

const Tab = createBottomTabNavigator();
export default function TabNavigator() {
  const colorScheme = useColorScheme();
  const { session } = useUserInfo();

  return (
    <AuthProvider>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: false,
        }}
        tabBar={(props) => <NavBar {...props} />}
      >
        <Tab.Screen
          name="FirstPage"
          component={FirstPage}
          options={{
            tabBarButton: () => null,
            tabBarStyle: { display: "none" },
            tabBarIcon: () => <Ionicons name="star" size={24} color="black" />,
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarIcon: () => (
              <Ionicons name="person" size={24} color="black" />
            ),
          }}
        />
        <Tab.Screen
          name="TabTwo"
          component={TabTwoScreen}
          options={{
            tabBarIcon: () => (
              <Ionicons name="reorder-two" size={24} color="black" />
            ),
          }}
        />
        <Tab.Screen
          name="Login"
          component={LoginScreen}
          options={{
            tabBarIcon: () => (
              <Ionicons name="log-in" size={24} color="black" />
            ),
          }}
        />
        <Tab.Screen
          name="Signup"
          component={signUp}
          options={{
            tabBarIcon: () => (
              <Ionicons name="log-in-outline" size={24} color="black" />
            ),
          }}
        />
      </Tab.Navigator>
    </AuthProvider>
  );
}