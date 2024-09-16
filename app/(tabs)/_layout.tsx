// import React, {useState} from "react";
// import { Text } from 'react-native';
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { createStackNavigator } from "@react-navigation/stack";
// import FontAwesome from '@expo/vector-icons/FontAwesome5';
// import Colors from "@/constants/Colors";
// import { useColorScheme } from "@/components/useColorScheme";
// import { AuthProvider, useUserInfo } from "@/lib/userContext";
// import NavBar from "@/components/NavBar";
// import AsyncStorage from '@react-native-async-storage/async-storage';

// // Screen imports
// import StackNavigator from "./navigation/ScreenNavigator";
// import ComunidadScreen from "./comunidad";
// import CursosScreen from "./cursos";
// import Eventos from "./eventos";
// import ProfileScreen from "./profile";
// import LoginScreen from "./login";
// import SignUpScreen from "./signup/signup";
// import FirstPage from "./index";

// const Tab = createBottomTabNavigator();
// const Stack = createStackNavigator();

// const AuthenticatedTabs = () => {
//   const colorScheme = useColorScheme();

//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         headerShown: false,
//         tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
//         tabBarIcon: ({ color, size }) => {
//           let iconName;

//           if (route.name === 'Home') {
//             iconName = 'home';
//           } else if (route.name === 'Comunidad') {
//             iconName = 'user-friends';
//           } else if (route.name === 'Cursos') {
//             iconName = 'gamepad';
//           } else if (route.name === 'Eventos') {
//             iconName = 'calendar-check';
//           } else if (route.name === 'Profile') {
//             iconName = 'user-alt';
//           }

//           return <FontAwesome name={iconName} size={size} color={color} />;
//         },
//       })}
//       tabBar={(props) => <NavBar {...props} />}
//     >
//       <Tab.Screen name="Home" component={StackNavigator} options={{
//             tabBarButton: () => null,
//             tabBarStyle: { display: "none" },
//           }}/>
//       <Tab.Screen name="Comunidad" component={ComunidadScreen} />
//       <Tab.Screen name="Cursos" component={CursosScreen} />
//       <Tab.Screen name="Eventos" component={Eventos} />
//       <Tab.Screen name="Profile" component={ProfileScreen} />
//     </Tab.Navigator>
//   );
// };

// const UnauthenticatedStack = () => (
//   <Stack.Navigator screenOptions={{ headerShown: false }}>
//     <Stack.Screen name="FirstPage" component={FirstPage} />
//     <Stack.Screen name="Login" component={LoginScreen} />
//     <Stack.Screen name="SignUp" component={SignUpScreen} />
//   </Stack.Navigator>
// );

// const checkIfAsyncStorageIsEmpty = async () => {
//   try {
//     const keys = await AsyncStorage.getAllKeys();
//     return keys.length === 0; // Devuelve true si está vacío, false si no lo está
//   } catch (error) {
//     console.error("Error checking AsyncStorage:", error);
//     return false; // Devuelve false en caso de error
//   }
// };

// export default async function TabNavigator() {
//   // const session = checkIfAsyncStorageIsEmpty();
//   //const [isLoading, setIsLoading] = useState(true);
//   //const [isEmpty, setIsEmpty] = React.useState(true);
//   // setIsEmpty(session)

  

//   return (
//     <AuthProvider>
//       {true ? <AuthenticatedTabs /> : <UnauthenticatedStack />}
//     </AuthProvider>
//   );
// }


import React, { useState, useEffect, useCallback } from "react";
import { Text, View } from 'react-native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import FontAwesome from '@expo/vector-icons/FontAwesome5';
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { AuthProvider, useUserInfo } from "@/lib/userContext";
import NavBar from "@/components/NavBar";
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      <Tab.Screen name="Home" component={StackNavigator} options={{
            tabBarButton: () => null,
            tabBarStyle: { display: "none" },
          }}/>
      <Tab.Screen name="Comunidad" component={ComunidadScreen} />
      <Tab.Screen name="Cursos" component={CursosScreen} />
      <Tab.Screen name="Eventos" component={Eventos} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const UnauthenticatedStack = ({ onLoginSuccess }) => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="FirstPage" component={FirstPage} />
    <Stack.Screen name="Login">
      {(props) => <LoginScreen {...props} onLoginSuccess={onLoginSuccess} />}
    </Stack.Screen>
    <Stack.Screen name="SignUp" component={SignUpScreen} />
  </Stack.Navigator>
);

const checkIfAsyncStorageIsEmpty = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    return keys.length === 0;
  } catch (error) {
    console.error("Error checking AsyncStorage:", error);
    return false;
  }
};

function TabNavigator() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  const checkAuthentication = useCallback(async () => {
    const isEmpty = await checkIfAsyncStorageIsEmpty();
    setIsAuthenticated(!isEmpty);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    checkAuthentication();
  }, [checkAuthentication, reloadKey]);

  const handleLoginSuccess = useCallback(() => {
    setReloadKey(prevKey => prevKey + 1);
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <AuthProvider>
      {isAuthenticated ? (
        <AuthenticatedTabs />
      ) : (
        <UnauthenticatedStack onLoginSuccess={handleLoginSuccess} />
      )}
    </AuthProvider>
  );
}

export default TabNavigator;