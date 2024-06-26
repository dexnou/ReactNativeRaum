import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase'; // Importa tu instancia de Supabase
import SInfo from 'react-native-sensitive-info'; // Importa SecureStore para almacenamiento seguro en React Native

// Tipo para el usuario autenticado
type User = {
  id: string;
  email: string;
  // Puedes agregar más campos del usuario según tu aplicación
};

// Nombre para la clave en SecureStore
const USER_SESSION_KEY = 'user_session';

// Función para manejar la autenticación
const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Función para obtener la sesión almacenada en SecureStore
    const fetchStoredSession = async () => {
      try {
        const sessionData = await SInfo.getItem(USER_SESSION_KEY, {});
        if (sessionData) {
          const parsedSessionData = JSON.parse(sessionData);
          if (parsedSessionData.access_token) {
            // Si hay un token de sesión almacenado, intentamos restaurar la sesión
            const { data: userData, error } = await supabase.auth.api.getUser(parsedSessionData.access_token);
            if (error) {
              throw error;
            }
            if (userData) {
              setUser(userData);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching stored session:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStoredSession();
  }, []);

  // Función para iniciar sesión
  const signIn = async (email: string, password: string) => {
    try {
      const { user: authUser, session, error } = await supabase.auth.signIn({ email, password });
      if (error) {
        throw error;
      }
      if (authUser && session) {
        setUser(authUser);
        await SInfo.setItem(USER_SESSION_KEY, JSON.stringify(session), {});
      }
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  // Función para cerrar sesión
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      await SInfo.deleteItem(USER_SESSION_KEY, {});
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  // Función para registrarse
  const signUp = async (email: string, password: string, nombre: string, apellido: string, fechaNacimiento: Date) => {
    try {
      console.log('Attempting to sign up user with email:', email);
      
      // Registrar el usuario en Supabase Auth
      const { user: authUser, session, error: authError } = await supabase.auth.signUp({ email, password });
      if (authError) {
        console.error('Error during Supabase Auth sign-up:', authError);
        throw authError;
      }

      console.log('User signed up in Supabase Auth:', authUser);

      // Insertar datos en la tabla Usuario_TEA
      const { data, error: insertError } = await supabase
        .from('Usuario_TEA')
        .insert([{ mail: email, nombre, apellido, fec_nac: fechaNacimiento }]);
      
      if (insertError) {
        console.error('Error inserting user data into Usuario_TEA:', insertError);
        throw insertError;
      }

      console.log('User data inserted into Usuario_TEA:', data);
      
      if (authUser && session) {
        setUser(authUser);
        await SInfo.setItem(USER_SESSION_KEY, JSON.stringify(session), {});
      }
    } catch (error) {
      console.error('Sign up error:', error);
      setError(error.message);
      throw error;
    }
  };

  return { user, loading, signIn, signOut, signUp, error };
};

export default useAuth;