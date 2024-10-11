import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../indexPostLogin";
import ProfileScreen from "../profile";
import ComunidadScreen from "../comunidad";
import LoginScreen from "../login";
import SignUpScreen from "../signup/signup";
import FirstPage from "../index";
import CursosScreen from "../cursos";
import CursosPorCategoriaScreen from "../cursosPorCategoria";
import SeguirProgreso from "../seguirProgreso";
import AmigosProgresoScreen from "../progresoMisAmigos";
import JuegoCursoScreen from "../game/juegoCurso"
import EditProfileScreen from "@/components/EditProfileScreen";
import ComunidadCursos from "../comunidadCursos";
import ComunidadUsuarios from "../comunidadUsuarios";
import FriendsInfo from "../friendsInfo";
import EventosCat from "../eventosCat";
import eventos from "../eventos";
import DetalleEvento from "../detalleEvento";
import React from "react";


const Stack = createStackNavigator();
export default function StackNavigator() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Home" component={HomeScreen}/>
      <Stack.Screen name="Profile" component={ProfileScreen}/>
      <Stack.Screen name="Comunidad" component={ComunidadScreen}/>
      <Stack.Screen name="SignUp" component={SignUpScreen}/>
      <Stack.Screen name="Login" component={LoginScreen}/>
      <Stack.Screen name="FirstPage" component={FirstPage}/>
      <Stack.Screen name="Cursos" component={CursosScreen}/>
      <Stack.Screen name="CursosPorCategoria" component={CursosPorCategoriaScreen}/>
      <Stack.Screen name="SeguirProgreso" component={SeguirProgreso}/>
      <Stack.Screen name="AmigosProgreso" component={AmigosProgresoScreen}/>
      <Stack.Screen name="JuegoCurso" component={JuegoCursoScreen}/>
      <Stack.Screen name="EditProfile" component={EditProfileScreen}/>
      <Stack.Screen name="ComunidadCursos" component={ComunidadCursos}/>
      <Stack.Screen name="ComunidadUsuarios" component={ComunidadUsuarios}/>
      <Stack.Screen name="FriendsInfo" component={FriendsInfo}/>
      <Stack.Screen name="EventosCat" component={EventosCat}/>
      <Stack.Screen name="eventos" component={eventos}/>
      <Stack.Screen name="DetalleEvento" component={DetalleEvento}/>
    </Stack.Navigator>
  );
}
