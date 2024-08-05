import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../indexPostLogin";

const Stack = createStackNavigator();
export default function StackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      {/*<Stack.Screen name="SeguirProgreso" component={SeguirProgreso} />
      <Stack.Screen name="Cursos" component={Cursos} />*/}
    </Stack.Navigator>
  );
}
