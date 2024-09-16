import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useSignUp } from '@/app/Contexts/SignUpContext';
import { fetchOrCreateUser } from '@/lib/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import commonStyles from '../commonStyles';
import { supabase } from '@/lib/supabase'; // Asegúrate de importar tu cliente de Supabase
import { sleep } from '@/components/helpers'; // Asegúrate de crear esta función de utilidad


export default function UsernamePasswordStep({ onNext, onPrevious, navigation }: { onNext: (data: object) => void, onPrevious: () => void, navigation: any }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { contextState, setContextState } = useSignUp();
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
    setError('');
  
    try {
      // Paso 1: Registrar al usuario (esto también inicia sesión automáticamente)
      const { data, error } = await supabase.auth.signUp({
        email: contextState.email,
        password: contextState.password,
        options: {
          data: {
            nombre: contextState.nombre,
            apellido: contextState.apellido,
            username: contextState.username,
            email_tutor: contextState.emailTutor,
            fecha_nacimiento: contextState.fechaNacimiento,
          }
        }
      });
  
      if (error) throw error;
  
      if (data.user) {
        // Paso 2: Crear el perfil del usuario en tu tabla personalizada
        await fetchOrCreateUser(
          contextState.nombre,
          contextState.apellido,
          contextState.username,
          contextState.email,
          contextState.emailTutor,
          contextState.password,
          contextState.fechaNacimiento
        );
  
        // Paso 3: Almacenar el ID del usuario en AsyncStorage
        await AsyncStorage.setItem('userId', data.user.id);
  
        // Paso 4: Redirigir al usuario a la pantalla principal
        navigation.navigate('Home', { userId: data.user.id });
      } else {
        throw new Error('No se pudo crear el usuario');
      }
    } catch (err) {
      console.error("Error durante el proceso de registro:", err.message);
      setError("Error al registrarse. Por favor, intenta de nuevo.");
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
