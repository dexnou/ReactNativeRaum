import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../indexPostLogin";
import ProfileScreen from "../profile";
import ComunidadScreen from "../comunidad";
import LoginScreen from "../login";
import SignUpScreen from "../signup";
import FirstPage from "../index";

const Stack = createStackNavigator();
export default function StackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      {/*<Stack.Screen name="SeguirProgreso" component={SeguirProgreso} />
      <Stack.Screen name="Cursos" component={Cursos} />*/}
      <Stack.Screen name="Profile" component={ProfileScreen}/>
      <Stack.Screen name="Comunidad" component={ComunidadScreen}/>
      <Stack.Screen name="SignUp" component={SignUpScreen}/>
      <Stack.Screen name="Login" component={LoginScreen}/>
      <Stack.Screen name="IndexNormal" component={FirstPage}/>
    </Stack.Navigator>
  );
}
