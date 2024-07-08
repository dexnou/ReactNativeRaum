import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import NavBar from '@/components/NavBar';

import ProfileScreen from "../(tabs)/profile";
import TabTwoScreen from '../(tabs)/two';
// import FriendsInfoScreen from '../(tabs)/friendsInfo';
import LoginScreen from '../(tabs)/login';
import signUp from '../(tabs)/signup';
import FirstPage from '../(tabs)/index';

type RootTabParamList = {
  FirstPage: undefined;
  Profile: undefined;
  TabTwo: undefined;
  FriendsInfo: undefined;
  Login: undefined;
  Signup: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
  title: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function MainNavigator() {
  const colorScheme = useColorScheme();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}
      tabBar={(props) => <NavBar {...props} />}
    >
      <Tab.Screen
        name="FirstPage"
        component={FirstPage}
        options={{
          tabBarButton: () => null,
          tabBarStyle: { display: 'none' },
          tabBarIcon: () => (
            <Ionicons name="star" size={24} color="black" />
          ),
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
          tabBarIcon: () =>   <Ionicons name="reorder-two" size={24} color="black" />
        }}
      />
      {/* <Tab.Screen
        name="FriendsInfo"
        component={FriendsInfoScreen}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="users" color={color} />,
        }}
      /> */}
      <Tab.Screen
        name="Login"
        component={LoginScreen}
        options={{
          tabBarIcon: ({ color }) =>  <Ionicons name="log-in" size={24} color="black" />
        }}
      />
      <Tab.Screen
        name="Signup"
        component={signUp}
        options={{
          tabBarIcon: ({ color }) =>   <Ionicons name="log-in-outline" size={24} color="black" />
        }}
      />
    </Tab.Navigator>
  );
}