import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator, Image, Platform } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '@/lib/supabase';
import { fetchUser, updateUserProfile } from '@/lib/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({
    id: '',
    username: '',
    fotoUsuario: '',
    descripcion: '',
    id_provincia: '',
    catFav: '',
  });
  const [provincias, setProvincias] = useState([]);
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
          const user = await fetchUser(userId);
          setUserData({
            id: userId,
            username: user.username || '',
            fotoUsuario: user.fotoUsuario || '',
            descripcion: user.descripcion || '',
            id_provincia: user.id_provincia?.toString() || '',
            catFav: user.catFav?.toString() || '',
          });
        }
        await loadProvincias();
        await loadCategorias();
      } catch (error) {
        console.error('Error loading user data:', error);
        Alert.alert('Error', 'No se pudo cargar la información del usuario');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  const loadProvincias = async () => {
    const { data, error } = await supabase.from('Provincias').select('id, nombre');
    if (error) {
      console.error('Error loading provincias:', error);
    } else {
      setProvincias(data);
    }
  };

  const loadCategorias = async () => {
    const { data, error } = await supabase.from('Categoria').select('id_categoria, nombre');
    if (error) {
      console.error('Error loading categorias:', error);
    } else {
      setCategorias(data);
      console.log('Categorías cargadas:', data);
    }
  };

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setUserData({ ...userData, fotoUsuario: result.assets[0].uri });
    }
  };
  const handleLogout = async () => {
    try {
      setUserData([]); // Clear user data for security
      setProvincias([]);
      setCategorias([]);
      await AsyncStorage.removeItem('userId');
      navigation.navigate('FirstPage'); // Navigate to login or home screen
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };
  const handleSave = async () => {
    setIsLoading(true);
    try {
      let fotoUrl = userData.fotoUsuario;
      if (userData.fotoUsuario && userData.fotoUsuario.startsWith('file://')) {
        const file = await fetch(userData.fotoUsuario);
        const blob = await file.blob();
        const fileName = `profile-${userData.id}-${Date.now()}.jpg`;
        const { data, error } = await supabase.storage
          .from('profile-pictures')
          .upload(fileName, blob);
        
        if (error) throw error;
        
        const { data: { publicUrl } } = supabase.storage
          .from('profile-pictures')
          .getPublicUrl(fileName);
        
        fotoUrl = publicUrl;
      }
  
      const updateData = {
        username: userData.username,
        fotoUsuario: fotoUrl,
        descripcion: userData.descripcion,
        id_provincia: userData.id_provincia,
        catFav: userData.catFav,
      };
  
      console.log('Datos a actualizar:', updateData);
      console.log('ID de usuario:', userData.id);
  
      if (!userData.id) {
        throw new Error('ID de usuario no encontrado');
      }
  
      if (Object.values(updateData).every(value => value === undefined || value === '')) {
        throw new Error('Todos los campos están vacíos');
      }
  
      await updateUserProfile(userData.id, updateData);
  
      Alert.alert('Éxito', 'Perfil actualizado correctamente');
      console.log("Hola, estoy arriba del navigate");
      navigation.navigate('Profile', { userId: userData.id });
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'No se pudo actualizar el perfil: ' + error.message);
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

  console.log('Renderizando categorías:', categorias);

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.imageContainer} onPress={handleImagePick}>
        <Image
          source={{ uri: userData.fotoUsuario || 'https://via.placeholder.com/150' }}
          style={styles.profileImage}
        />
        <Text style={styles.changePhotoText}>Cambiar foto</Text>
      </TouchableOpacity>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Username:</Text>
        <TextInput
          style={styles.input}
          value={userData.username}
          onChangeText={(text) => setUserData({ ...userData, username: text })}
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
        <Picker
          selectedValue={userData.id_provincia}
          onValueChange={(itemValue) => setUserData({ ...userData, id_provincia: itemValue })}
          style={styles.picker}
        >
          <Picker.Item label="Seleccione una provincia" value="" />
          {provincias.map((provincia) => (
            <Picker.Item key={provincia.id} label={provincia.nombre} value={provincia.id.toString()} />
          ))}
        </Picker>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Categoría Favorita:</Text>
        <Picker
          selectedValue={userData.catFav}
          onValueChange={(itemValue) => setUserData({ ...userData, catFav: itemValue })}
          style={styles.picker}
        >
          <Picker.Item label="Seleccione una categoría" value="" />
          {categorias.map((categoria) => (
            <Picker.Item 
              key={categoria.id_categoria} 
              label={categoria.nombre} 
              value={categoria.id_categoria.toString()} 
            />
          ))}
        </Picker>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Guardar Cambios</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>CERRAR SESIÓN</Text>
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
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
  },
  changePhotoText: {
    color: '#1e3a8a',
    fontSize: 16,
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
  picker: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    ...Platform.select({
      ios: {
        backgroundColor: '#fff',
      },
    }),
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
  // Estilos para el botón de Logout
  logoutButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 20,
    width: '90%',
    alignSelf: 'center',
  },
  logoutButtonText: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 16,
  },
});