import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import useAuth from '@/hooks/useAuth'; // Asegúrate de importar correctamente el hook useAuth

const SignUpScreen = () => {
  const { signUp, error } = useAuth(); // Obtén signUp y error del hook useAuth
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');

  const handleSignUp = async () => {
    try {
      await signUp(email, password, nombre, apellido, new Date(fechaNacimiento)); // Llama a signUp con los datos necesarios
    } catch (error) {
      console.error('Sign up error:', error); // Maneja o muestra el error si ocurre
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
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
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        onChangeText={setNombre}
        value={nombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Apellido"
        onChangeText={setApellido}
        value={apellido}
      />
      <TextInput
        style={styles.input}
        placeholder="Fecha de Nacimiento (YYYY-MM-DD)"
        onChangeText={setFechaNacimiento}
        value={fechaNacimiento}
      />
      {error && <Text style={styles.errorText}>{error.message}</Text>} {/* Muestra el mensaje de error si hay un error */}
      <Button title="Sign Up" onPress={handleSignUp} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});

export default SignUpScreen;
