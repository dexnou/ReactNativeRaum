import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from "@/constants/Colors";

import { useColorScheme } from "@/components/useColorScheme";
import NavBar from "@/components/NavBar";
import { AuthProvider, useUserInfo } from "@/lib/userContext";

/*registro y login*/
import LoginScreen from "./login";
import SignUpScreen from "./signup/signup";
import FirstPage from "./index";

/*pos ingreso*/
import StackNavigator from "./navigation/ScreenNavigator";
import ComunidadScreen from "./comunidad"
import CursosScreen from "./cursos"
import Eventos from "./eventos"
import ProfileScreen from "./profile";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const colorScheme = useColorScheme();
  const { session } = useUserInfo();

  return (
    <AuthProvider>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = 'home';
            } else if (route.name === 'Comunidad') {
              iconName = 'users';
            } else if (route.name === 'Cursos') {
              iconName = 'gamepad';
            } else if (route.name === 'Eventos') {
              iconName = 'calendar';
            } else if (route.name === 'Profile') {
              iconName = 'user';
            }

            return <FontAwesome name={iconName} size={size} color={color} />;
          },
        })}
        tabBar={(props) => <NavBar {...props} />}
      >
        <Tab.Screen
          name="Home"
          component={StackNavigator}
          options={{
            tabBarButton: () => null,
            tabBarStyle: { display: "none" },
          }}
        />
        <Tab.Screen
          name="Comunidad"
          component={ComunidadScreen}
        />
        <Tab.Screen
          name="Cursos"
          component={CursosScreen}
        />
        <Tab.Screen
          name="Eventos"
          component={Eventos}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
        />
      </Tab.Navigator>
    </AuthProvider>
  );
}