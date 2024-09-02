import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser } from "@/lib/user"; // Asegúrate de importar correctamente la función
import commonStyles from './commonStyles';


const LoginScreen = ({ navigation }: { navigation: any }) => {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!mail || !password) {
      setError("Email y contraseña son obligatorios");
      return;
    }

    setLoading(true);

    try {
      const user = await loginUser({ mail, password });
      console.log("Usuario logueado:", user);

      // Almacenar el ID del usuario en AsyncStorage
      await AsyncStorage.setItem('userId', user.id);

      // Redirigir al usuario a la pantalla principal o a otra pantalla
      console.log('Login manda el userId', user.id);
      navigation.navigate('Home', { userId: user.id });
    } catch (err) {
      console.error("Error al iniciar sesión:", err.message);
      setError("Error al iniciar sesión. Verifica tus credenciales.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={commonStyles.background}>
      <View style={commonStyles.topShape} />
      <View style={commonStyles.bottomShape} />
      <View style={commonStyles.container}>
        <Text style={commonStyles.title}>LOGIN</Text>
        <TextInput
          style={commonStyles.input}
          placeholder="Email"
          onChangeText={setMail}
          value={mail}
          textContentType="emailAddress"
          autoCapitalize="none"
          placeholderTextColor="#C5C5C5"
        />
        <TextInput
          style={commonStyles.input}
          placeholder="Password"
          onChangeText={setPassword}
          value={password}
          secureTextEntry
          placeholderTextColor="#C5C5C5"
        />
        {error ? <Text style={commonStyles.errorText}>{error}</Text> : null}
        <TouchableOpacity style={commonStyles.button} onPress={handleLogin} disabled={loading}>
          <Text style={commonStyles.buttonText}>
            {loading ? "Loading..." : "Login"}
          </Text>
        </TouchableOpacity>
        <View style={commonStyles.noAccountContainer}>
          <Text style={commonStyles.noAccountText}>¿No tienes cuenta?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={commonStyles.registerText}>Registrate aquí</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;
