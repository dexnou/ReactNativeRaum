import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../indexPostLogin";
import ProfileScreen from "../profile";
import ComunidadScreen from "../comunidad";
import LoginScreen from "../login";
import SignUpScreen from "../signup/signup";
import FirstPage from "../index";
import CursosScreen from "../cursos";
import SeguirProgreso from "../seguirProgreso";
import AmigosProgresoScreen from "../progresoMisAmigos";
import React from "react";

const Stack = createStackNavigator();
export default function StackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen}/>
      <Stack.Screen name="Profile" component={ProfileScreen}/>
      <Stack.Screen name="Comunidad" component={ComunidadScreen}/>
      <Stack.Screen name="SignUp" component={SignUpScreen}/>
      <Stack.Screen name="Login" component={LoginScreen}/>
      <Stack.Screen name="FirstPage" component={FirstPage}/>
      <Stack.Screen name="Cursos" component={CursosScreen}/>
      <Stack.Screen name="SeguirProgreso" component={SeguirProgreso}/>
      <Stack.Screen name="AmigosProgreso" component={AmigosProgresoScreen}/>

    </Stack.Navigator>
  );
}
