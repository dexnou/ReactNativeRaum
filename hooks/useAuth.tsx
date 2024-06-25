import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase'; // Importa tu instancia de Supabase
import * as SecureStore from 'react-native-sensitive-info'; // Importa SecureStore para almacenamiento seguro en React Native

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

  useEffect(() => {
    // Función para obtener la sesión almacenada en SecureStore
    const fetchStoredSession = async () => {
      try {
        const sessionData = await SecureStore.getItem(USER_SESSION_KEY, {});
        if (sessionData && sessionData.access_token) {
          // Si hay un token de sesión almacenado, intentamos restaurar la sesión
          const { data: userData, error } = await supabase.auth.api.getUser(sessionData.access_token);
          if (error) {
            throw error;
          }
          if (userData) {
            setUser(userData);
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
        await SecureStore.setItem(USER_SESSION_KEY, session);
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
      await SecureStore.deleteItem(USER_SESSION_KEY);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  // Función para registrarse
  const signUp = async (email: string, password: string, nombre: string, apellido: string, fechaNacimiento: Date) => {
    try {
      // Registrar el usuario en Supabase Auth
      const { user: authUser, session, error: authError } = await supabase.auth.signUp({ email, password });
      if (authError) {
        throw authError;
      }

      // Insertar datos en la tabla Usuario_TEA
      const { data, error: insertError } = await supabase
        .from('Usuario_TEA')
        .insert([{ mail: email, nombre, apellido, fec_nac: fechaNacimiento }]);
      
      if (insertError) {
        throw insertError;
      }
      
      if (authUser && session) {
        setUser(authUser);
        await SecureStore.setItem(USER_SESSION_KEY, session);
      }
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  return { user, loading, signIn, signOut, signUp };
};

export default useAuth;
