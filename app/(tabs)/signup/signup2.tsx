import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSignUp } from '@/app/Contexts/SignUpContext';

export default function NameStep({ onNext }: { onNext: (data: object) => void }) {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const {contextState, setContextState} = useSignUp();

  useEffect(() => {
    setNombre(contextState.nombre);
    setApellido(contextState.apellido);
  }, [contextState.nombre, contextState.apellido]);

  const handleNombreChange = (text: string) => {
    setNombre(text);
    setContextState({ newValue: text, type: 'SET_NOMBRE' });
  };

  const handleApellidoChange = (text: string) => {
    setApellido(text);
    setContextState({ newValue: text, type: 'SET_APELLIDO' });
  };

  const handleNext = () => {
    onNext({ nombre, apellido });
  };
  console.log('El nombre y apellido son', nombre, apellido);
  console.log('El nombre context es',contextState.nombre);
  console.log('El apellido context es',contextState.apellido);  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>REGISTRO</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        placeholderTextColor="#C5C5C5"
        value={(contextState.nombre) === '' ? nombre : contextState.nombre}
        onChangeText={handleNombreChange}
      />
      <TextInput
        style={styles.input}
        placeholder="Apellido"
        placeholderTextColor="#C5C5C5"
        value={(contextState.apellido) === '' ? apellido : contextState.apellido}
        onChangeText={handleApellidoChange}
      />
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Siguiente</Text>
      </TouchableOpacity>
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
  button: {
    width: '100%',
    backgroundColor: '#0F1138',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
