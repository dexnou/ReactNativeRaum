import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '@/lib/supabase';
import { fetchUser } from '@/lib/user';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({
    nombre: '',
    apellido: '',
    descripcion: '',
    provincia: '',
    categoria: '',
  });

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
          const user = await fetchUser(userId);
          setUserData({
            nombre: user.nombre || '',
            apellido: user.apellido || '',
            descripcion: user.descripcion || '',
            provincia: user.Provincias?.nombre || '',
            categoria: user.Categoria?.nombre || '',
          });
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        Alert.alert('Error', 'No se pudo cargar la información del usuario');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) throw new Error('User ID not found');

      const { error } = await supabase
        .from('Usuario')
        .update({
          nombre: userData.nombre,
          apellido: userData.apellido,
          descripcion: userData.descripcion,
          // Nota: Aquí deberías manejar la actualización de provincia y categoría
          // de manera diferente, ya que ahora son strings y no IDs
        })
        .eq('id', userId);

      if (error) throw error;

      Alert.alert('Éxito', 'Perfil actualizado correctamente');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'No se pudo actualizar el perfil');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1e3a8a" />
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Nombre:</Text>
        <TextInput
          style={styles.input}
          value={userData.nombre}
          onChangeText={(text) => setUserData({ ...userData, nombre: text })}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Apellido:</Text>
        <TextInput
          style={styles.input}
          value={userData.apellido}
          onChangeText={(text) => setUserData({ ...userData, apellido: text })}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Descripción:</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={userData.descripcion}
          onChangeText={(text) => setUserData({ ...userData, descripcion: text })}
          multiline
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Provincia:</Text>
        <TextInput
          style={styles.input}
          value={userData.provincia}
          onChangeText={(text) => setUserData({ ...userData, provincia: text })}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Categoría Favorita:</Text>
        <TextInput
          style={styles.input}
          value={userData.categoria}
          onChangeText={(text) => setUserData({ ...userData, categoria: text })}
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Guardar Cambios</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#1e3a8a',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#1e3a8a',
  },
});