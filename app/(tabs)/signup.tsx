import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import useAuth from '@/hooks/useAuth'; // Asegúrate de importar correctamente el hook useAuth
import SignUp from '@/components/SignUp';
import { supabase } from '@/lib/supabase';
import { fetchOrCreateUser } from '@/lib/user'; // Asegúrate de importar la función correctamente


export default function SignUpScreen(){
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [username, setUsername] = useState('');
  const [mail, setMail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [fecNac, setFecNac] = useState('');
  const [numDni, setNumDni] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!mail || !contraseña || !nombre || !apellido || !username || !fecNac || !numDni) {
      setError('Todos los campos son obligatorios');
      return;
    }
  
    try {
      const user = await fetchOrCreateUser({ 
        nombre, 
        apellido, 
        username, 
        mail,  // Verifica que este valor no sea null
        contraseña, 
        fec_nac: fecNac, 
        num_dni: numDni 
      });
      console.log('User:', user);
      // Navegar a la pantalla de inicio de sesión o inicio de la app
    } catch (err) {
      setError(err.message);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your last name"
        value={apellido}
        onChangeText={setApellido}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={mail}
        onChangeText={setMail}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your contraseña"
        value={contraseña}
        onChangeText={setContraseña}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your birth date (YYYY-MM-DD)"
        value={fecNac}
        onChangeText={setFecNac}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your DNI number"
        value={numDni}
        onChangeText={setNumDni}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: '80%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  title: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  itemContainer: {
    alignItems: 'center',
    padding: 20,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  username: {
    fontSize: 18,
    color: 'gray',
    marginBottom: 5,
  },
  email: {
    fontSize: 18,
    color: 'gray',
    marginBottom: 5,
  },
  dni: {
    fontSize: 18,
    color: 'gray',
    marginBottom: 5,
  },
  birthDate: {
    fontSize: 18,
    color: 'gray',
    marginBottom: 20,
  },
  dniPicture: {
    width: 200,
    height: 100,
    marginBottom: 20,
  },
});

































// const SignUpScreen = () => {
//   const { signUp, error } = useAuth(); // Obtén signUp y error del hook useAuth
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [nombre, setNombre] = useState('');
//   const [apellido, setApellido] = useState('');
//   const [fechaNacimiento, setFechaNacimiento] = useState('');

//   const handleSignUp = async () => {
//     try {
//       await signUp(email, password, nombre, apellido, new Date(fechaNacimiento)); // Llama a signUp con los datos necesarios
//     } catch (error) {
//       console.error('Sign up error:', error); // Maneja o muestra el error si ocurre
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Sign Up</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Email"
//         onChangeText={setEmail}
//         value={email}
//         keyboardType="email-address"
//         autoCapitalize="none"
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Password"
//         onChangeText={setPassword}
//         value={password}
//         secureTextEntry
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Nombre"
//         onChangeText={setNombre}
//         value={nombre}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Apellido"
//         onChangeText={setApellido}
//         value={apellido}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Fecha de Nacimiento (YYYY-MM-DD)"
//         onChangeText={setFechaNacimiento}
//         value={fechaNacimiento}
//       />
//       {error && <Text style={styles.errorText}>{error}</Text>} {/* Muestra el mensaje de error si hay un error */}
//       <Button title="Sign Up" onPress={handleSignUp} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   input: {
//     width: '100%',
//     height: 40,
//     borderColor: 'gray',
//     borderWidth: 1,
//     borderRadius: 5,
//     marginBottom: 10,
//     paddingHorizontal: 10,
//   },
//   errorText: {
//     color: 'red',
//     marginBottom: 10,
//   },
// });

// export default SignUpScreen;