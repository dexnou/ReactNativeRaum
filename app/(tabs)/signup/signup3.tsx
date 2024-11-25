import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useSignUp } from '@/app/Contexts/SignUpContext';
import commonStyles from '../commonStyles';

export default function EmailStep({ onNext, onPrevious }: { onNext: (data: object) => void, onPrevious: () => void }) {
  const [email, setEmail] = useState('');
  const [emailTutor, setEmailTutor] = useState('');
  const [fecNac, setFecNac] = useState('');
  const {contextState, setContextState} = useSignUp();

  useEffect(() => {
    setEmail(contextState.email);
    setEmailTutor(contextState.emailTutor);
    setFecNac(contextState.fechaNacimiento);
  }, [contextState.email, contextState.emailTutor, contextState.fechaNacimiento]);

  const handleEmailChange = (text: string) => {
    setEmail(text);
    setContextState({ newValue: text, type: 'SET_EMAIL' });
  };

  const handleEmailTutorChange = (text: string) => {
    setEmailTutor(text);
    setContextState({ newValue: text, type: 'SET_EMAIL_TUTOR' });
  };

  const handleFechaNacimientoChange = (text: string) => {
    setFecNac(text);
    setContextState({ newValue: text, type: 'SET_FECHA_NACIMIENTO' });
  };

  const handleNext = () => {
    onNext({ email, emailTutor, fecNac });
  };

  console.log('Fecha es ',fecNac);
  console.log('Fecha context es ', contextState.fechaNacimiento);

  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.title}>REGISTRO</Text>
      <TextInput
        style={commonStyles.input}
        placeholder="Email"
        placeholderTextColor="#C5C5C5"
        value={(contextState.email) === '' ? email : contextState.email}
        onChangeText={handleEmailChange}
      />
      <TextInput
        style={commonStyles.input}
        placeholder="Email del Tutor"
        placeholderTextColor="#C5C5C5"
        value={(contextState.emailTutor) === '' ? emailTutor : contextState.emailTutor}
        onChangeText={handleEmailTutorChange}
      />
      <Text style={commonStyles.helperText}>
        Debe ser una persona de confianza que podrá seguir tu progreso en la app
      </Text>
      <TextInput
        style={commonStyles.input}
        placeholder="Fecha de Nacimiento: AAAA-MM-DD"
        placeholderTextColor="#C5C5C5"
        value={(contextState.fechaNacimiento) === '' ? fecNac : contextState.fechaNacimiento}
        onChangeText={handleFechaNacimientoChange}
      />
      <View style={commonStyles.buttonContainer}>
        <TouchableOpacity style={commonStyles.buttonSecondary} onPress={onPrevious}>
          <Text style={commonStyles.buttonText}>Atrás</Text>
        </TouchableOpacity>
        <TouchableOpacity style={commonStyles.button} onPress={handleNext}>
          <Text style={commonStyles.buttonText}>Siguiente</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
/*
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 30,
    marginHorizontal: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 30,
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
});*/
