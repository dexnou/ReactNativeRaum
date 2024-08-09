import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { supabase } from "@/lib/supabase";
import { loginUser } from "@/lib/user"; // Asegúrate de importar correctamente la función
import AsyncStorage from '@react-native-async-storage/async-storage';


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

      // Aquí puedes redirigir al usuario a la pantalla principal o a otra pantalla
      console.log('Login manda el userId', user.id)
      navigation.navigate('Home',{userId: user.id});
      //Hay que pasar por props el id del usuario conseguido
    } catch (err) {
      console.error("Error al iniciar sesión:", err.message);
      setError("Error al iniciar sesión. Verifica tus credenciales.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <View style={styles.background}>
      <View style={styles.topShape} />
      <View style={styles.bottomShape} />
      <View style={styles.container}>
        <Text style={styles.title}>LOGIN</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={setMail}
          value={mail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          onChangeText={setPassword}
          value={password}
          secureTextEntry
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Loading..." : "Login"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000080",
  },
  topShape: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "60%",
    backgroundColor: "#000080",
    borderBottomRightRadius: 200,
  },
  bottomShape: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "40%",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 200,
  },
  container: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000",
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: "#f5f5f5",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  button: {
    width: "100%",
    height: 40,
    backgroundColor: "#000080",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  forgotPassword: {
    color: "#000080",
    marginVertical: 10,
  },
});

export default LoginScreen;