import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function EmailStep({ onNext, onPrevious }: { onNext: (data: object) => void, onPrevious: () => void }) {
  const [email, setEmail] = useState('');
  const [emailTutor, setEmailTutor] = useState('');
  const [fecNac, setFecNac] = useState('');

  const handleNext = () => {
    onNext({ email, emailTutor, fecNac });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>REGISTRO</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#C5C5C5"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Email del Tutor"
        placeholderTextColor="#C5C5C5"
        value={emailTutor}
        onChangeText={setEmailTutor}
      />
      <Text style={styles.helperText}>
        Debe ser una persona de confianza que podrá seguir tu progreso en la app
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Año de Nacimiento"
        placeholderTextColor="#C5C5C5"
        value={fecNac}
        onChangeText={setFecNac}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonSecondary} onPress={onPrevious}>
          <Text style={styles.buttonText}>Atrás</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Siguiente</Text>
        </TouchableOpacity>
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
  helperText: {
    fontSize: 12,
    color: '#888',
    marginBottom: 10,
    textAlign: 'left',
    width: '100%',
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
});
