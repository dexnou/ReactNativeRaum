import React from "react";
import { Text } from 'react-native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import FontAwesome from '@expo/vector-icons/FontAwesome5';
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { AuthProvider, useUserInfo } from "@/lib/userContext";
import NavBar from "@/components/NavBar";

// Screen imports
import StackNavigator from "./navigation/ScreenNavigator";
import ComunidadScreen from "./comunidad";
import CursosScreen from "./cursos";
import Eventos from "./eventos";
import ProfileScreen from "./profile";
import LoginScreen from "./login";
import SignUpScreen from "./signup/signup";
import FirstPage from "./index";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const AuthenticatedTabs = () => {
  const colorScheme = useColorScheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Comunidad') {
            iconName = 'user-friends';
          } else if (route.name === 'Cursos') {
            iconName = 'gamepad';
          } else if (route.name === 'Eventos') {
            iconName = 'calendar-check';
          } else if (route.name === 'Profile') {
            iconName = 'user-alt';
          }

          return <FontAwesome name={iconName} size={size} color={color} />;
        },
      })}
      tabBar={(props) => <NavBar {...props} />}
    >
      <Tab.Screen name="Home" component={StackNavigator} />
      <Tab.Screen name="Comunidad" component={ComunidadScreen} />
      <Tab.Screen name="Cursos" component={CursosScreen} />
      <Tab.Screen name="Eventos" component={Eventos} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const UnauthenticatedStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="FirstPage" component={FirstPage} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="SignUp" component={SignUpScreen} />
  </Stack.Navigator>
);

export default function TabNavigator() {
  const { session, isLoading } = useUserInfo();
  
  if (isLoading) {
    return <Text>Cargando...</Text>;
  }

  return (
    <AuthProvider>
      {session ? <AuthenticatedTabs /> : <UnauthenticatedStack />}
    </AuthProvider>
  );
}