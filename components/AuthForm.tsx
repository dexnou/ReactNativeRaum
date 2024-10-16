import { useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import { Button, Text, TextInput, View } from "./Themed";

import type {
  SignInWithPasswordCredentials,
  SignUpWithPasswordCredentials,
} from '@supabase/supabase-js';

interface AuthFormProps {
  onSignUp: (credentials: SignUpWithPasswordCredentials) => void;
  onLogin: (credentials: SignInWithPasswordCredentials) => void;
  loading: boolean;
}

export default function AuthForm({
  onSignUp,
  onLogin,
  loading,
}: AuthFormProps) {
  const [mode, setMode] = useState<'login' | 'signUp'>('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    if (mode === 'login') {
      onLogin({ email, password });
    } else {
      onSignUp({ email, password, options: { data: { username } } });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            <Text style={styles.title}>Supabook</Text>
            {mode === 'signUp' && (
              <View style={styles.input}>
                <TextInput
                  placeholder="Nombre de usuario"
                  value={username}
                  onChangeText={setUsername}
                />
              </View>
            )}
            <View style={styles.input}>
              <TextInput
                placeholder="Correo"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
            <View style={styles.input}>
              <TextInput
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
                autoCapitalize="none"
              />
            </View>
            <View style={styles.input}>
              <Button
                title={mode === 'login' ? 'Iniciar sesión' : 'Registrarse'}
                onPress={handleSubmit}
                disabled={loading || !email || !password}
              />
            </View>
            <View style={styles.footer}>
              <Text style={{ marginBottom: 8 }}>
                {mode === 'login'
                  ? '¿No tienes una cuenta?'
                  : '¿Ya tienes una cuenta?'}
              </Text>
              <Button
                title={mode === 'login' ? 'Regístrate' : 'Inicia sesión'}
                onPress={() => setMode(mode === 'login' ? 'signUp' : 'login')}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
    background: {
      flex: 1,
      resizeMode: 'cover',
      justifyContent: 'center',
    },
    container: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
      marginHorizontal: 20,
      alignItems: 'center',
    },
    title: {
      fontSize: 30,
      fontWeight: 'bold',
      marginBottom: 20,
      color: '#000',
    },
    input: {
      width: '100%',
      height: 40,
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 5,
      marginBottom: 10,
      paddingHorizontal: 10,
      backgroundColor: '#f5f5f5',
    },
    errorText: {
      color: 'red',
      marginBottom: 10,
    },
    button: {
      width: '100%',
      height: 40,
      backgroundColor: '#000080',
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 10,
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
    },
    forgotPassword: {
      color: '#000080',
      marginVertical: 10,
    },
    socialLoginContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '50%',
      marginTop: 20,
    },
    socialIcon: {
      width: 40,
      height: 40,
    },
    inner: {
      padding: 16,
      flex: 1,
    },
    footer: {
      paddingTop: 16,
      justifyContent: 'center',
      alignItems: 'center',
    }
  });