import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FontAwesome from '@expo/vector-icons/FontAwesome5';
import   
 Colors from "@/constants/Colors";

import { useColorScheme } from "@/components/useColorScheme";
import { AuthProvider, useUserInfo } from "@/lib/userContext";
import { NavigationContainer   
} from '@react-navigation/native';   


/*registro y login*/
import LoginScreen from "./login";
import SignUpScreen from "./signup/signup";
import FirstPage from "./index"; // Assuming this is the index screen

/*pos ingreso*/
import StackNavigator from "./navigation/ScreenNavigator";
import ComunidadScreen from "./comunidad";
import CursosScreen from "./cursos";
import Eventos from "./eventos";
import ProfileScreen from "./profile";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const colorScheme = useColorScheme();
  const { session, isLoading } = useUserInfo();
  
  if (isLoading) {
    return <Text>Cargando...</Text>;
  }

  // Agregar un console.log para verificar el valor de session
  console.log('Session en TabNavigator:', session);

  return (
    <NavigationContainer>
    <AuthProvider>
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
            } else if (route.name === 'Cursos') {  // Corrected typo
              iconName = 'gamepad';
            } else if (route.name === 'Eventos') {
              iconName = 'calendar-check';
            } else if (route.name === 'Profile') {
              iconName = 'user-alt';
            }

            return <FontAwesome name={iconName} size={size} color={color} />;
          },
        })}
        tabBar={(props) => (
          <NavBar {...props} isAuthenticated={!!session} />
        )}
      >
        {/* Home (StackNavigator) should not have a tab button */}
        <Tab.Screen
          name="Home"
          component={StackNavigator}
          options={{
            tabBarButton: () => null,
            tabBarStyle: { display: "none" },
          }}
        />

        <Tab.Screen name="Comunidad" component={ComunidadScreen} />
        <Tab.Screen name="Cursos" component={CursosScreen} />
        <Tab.Screen name="Eventos" component={Eventos} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </AuthProvider>
    </NavigationContainer>
  );
}