import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useSignUp } from '@/app/Contexts/SignUpContext';
import {fetchOrCreateUser} from '@/lib/user'
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function UsernamePasswordStep({ onNext, onPrevious, navigation }: { onNext: (data: object) => void, onPrevious: () => void, navigation: any }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const {contextState, setContextState} = useSignUp();
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    setUsername(contextState.username);
    setPassword(contextState.password);
    setConfirmPassword(contextState.confirmPassword);
  }, [contextState.username, contextState.password, contextState.confirmPassword]);

  const handleUsernameChange = (text: string) => {
    setUsername(text);
    setContextState({ newValue: text, type: 'SET_USERNAME' });
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    setContextState({ newValue: text, type: 'SET_PASSWORD' });
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    setContextState({ newValue: text, type: 'SET_CONFIRM_PASSWORD' });
  };

  const handleSignUp = async () => {
    setLoading(true);

    try {
      const user = await fetchOrCreateUser(contextState.nombre,contextState.apellido,contextState.username, contextState.email, contextState.emailTutor, contextState.password, contextState.fechaNacimiento);
      console.log("Usuario logueado:", user);

      // Almacenar el ID del usuario en AsyncStorage
      await AsyncStorage.setItem('userId', user.id);

      // Redirigir al usuario a la pantalla principal o a otra pantalla
      console.log('Login manda el userId', user.id);
      navigation.navigate('Home', { userId: user.id });
    } catch (err) {
      console.error("Error al iniciar sesión:", err.message);
      setError("Error al registrarse. Verifica tus credenciales.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>REGISTRO</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre de Usuario"
        placeholderTextColor="#C5C5C5"
        value={(contextState.username) === '' ? username : contextState.username}
        onChangeText={handleUsernameChange}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#C5C5C5"
        secureTextEntry
        value={(contextState.password) === '' ? password : contextState.password}
        onChangeText={handlePasswordChange}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmar Contraseña"
        placeholderTextColor="#C5C5C5"
        secureTextEntry
        value={(contextState.confirmPassword) === '' ? confirmPassword : contextState.confirmPassword}
        onChangeText={handleConfirmPasswordChange}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonSecondary} onPress={onPrevious}>
          <Text style={styles.buttonText}>Atrás</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Finalizar</Text>
        </TouchableOpacity>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 30,
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
    width: '100%',
    height: 50,
    backgroundColor: '#F6F6F6',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 10,
    color: '#000',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    backgroundColor: '#0F1138',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginLeft: 5,
  },
  buttonSecondary: {
    flex: 1,
    backgroundColor: '#AAA',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginRight: 5,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});
