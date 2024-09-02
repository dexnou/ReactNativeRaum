import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useSignUp } from '@/app/Contexts/SignUpContext';
import {fetchOrCreateUser} from '@/lib/user'
import AsyncStorage from '@react-native-async-storage/async-storage';
import commonStyles from '../commonStyles';


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
    <View style={commonStyles.container}>
      <Text style={commonStyles.title}>REGISTRO</Text>
      <TextInput
        style={commonStyles.input}
        placeholder="Nombre de Usuario"
        placeholderTextColor="#C5C5C5"
        value={(contextState.username) === '' ? username : contextState.username}
        onChangeText={handleUsernameChange}
      />
      <TextInput
        style={commonStyles.input}
        placeholder="Contraseña"
        placeholderTextColor="#C5C5C5"
        secureTextEntry
        value={(contextState.password) === '' ? password : contextState.password}
        onChangeText={handlePasswordChange}
      />
      <TextInput
        style={commonStyles.input}
        placeholder="Confirmar Contraseña"
        placeholderTextColor="#C5C5C5"
        secureTextEntry
        value={(contextState.confirmPassword) === '' ? confirmPassword : confirmPassword}
        onChangeText={handleConfirmPasswordChange}
      />
      {error ? <Text style={commonStyles.errorText}>{error}</Text> : null}
      <View style={commonStyles.buttonContainer}>
        <TouchableOpacity style={commonStyles.buttonSecondary} onPress={onPrevious}>
          <Text style={commonStyles.buttonText}>Atrás</Text>
        </TouchableOpacity>
        <TouchableOpacity style={commonStyles.button} onPress={handleSignUp} disabled={loading}>
          <Text style={commonStyles.buttonText}>Finalizar</Text>
        </TouchableOpacity>
        {error ? <Text style={commonStyles.errorText}>{error}</Text> : null}
      </View>
    </View>
  );
}
