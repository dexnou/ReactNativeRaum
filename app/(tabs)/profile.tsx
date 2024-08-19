import React, { useState, useCallback } from 'react';
import { FlatList, StyleSheet, ScrollView, Image, TouchableOpacity, Button, Alert, ActivityIndicator } from 'react-native';
import 'react-native-url-polyfill/auto';
import { Text, View } from '@/components/Themed';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { supabase } from '@/lib/supabase';
import { fetchUser, fetchAmigos } from '@/lib/user'; // Importamos fetchUser desde user.ts

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
 
  const route = useRoute();
  const navigation = useNavigation();
  const [amigosFotos, setAmigosFotos] = useState([]);
  const [userTea, setUserTea] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   const checkLoginStatus = async () => {
  //     try {
  //       const userId = await AsyncStorage.getItem('userId');
  //       console.log('Verificando si hay un ID de usuario guardado:', userId); // Log adicional
  //       if (!userId) {
  //         Alert.alert(
  //           'No estás logueado', 
  //           'Por favor, inicia sesión para acceder a tu perfil.',
  //           [
  //             {
  //               text: "OK",
  //               onPress: () => navigation.navigate('Login') // Redirigir después de que el usuario presione "OK"
  //             }
  //           ]
  //         );
  //       }
  //     } catch (error) {
  //       console.error('Error verificando el estado de la sesión:', error);
  //     }
  //   };

  //   checkLoginStatus();
  // }, [navigation]);

  const fetchData = async (storedUserId: string) => {
    try {
      setIsLoading(true);
      const amigosData: any = await fetchAmigos(storedUserId);
      setAmigosFotos(amigosData);

      const userData: any = await fetchUser(storedUserId);
      if (userData) {
        if (userData.fotoUsuario === null) {
          userData.fotoUsuario = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
        }
        setUserTea([userData]);
      } else {
        setUserTea([]);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert('Error', 'No se pudo cargar la información del perfil');
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const loadProfileData = async () => {
        const storedUserId = route.params?.userId || await AsyncStorage.getItem('userId');
        console.log('ID de usuario obtenido en useFocusEffect:', storedUserId); // Log adicional
        if (storedUserId) {
          await fetchData(storedUserId);
        } else {
          console.error('No se encontró el ID del usuario en AsyncStorage');
          // Asegurarse de redirigir si no hay un ID
          // ESTE ALERT MANDA SOLO POR CELULAR PERO SI ESTÁ NO TE APARECE EL PERFIL
          // Alert.alert(
          //             'No estás logueado', 
          //             'Por favor, inicia sesión para acceder a tu perfil.',
          //             [
          //               {
          //                 text: "OK",
          //                 onPress: () => navigation.navigate('Login') // Redirigir después de que el usuario presione "OK"
          //               }
          //             ]
          //           );
          setIsLoading(false);
          navigation.navigate("Login");
        }
      };
      loadProfileData();
    }, [route.params?.userId, navigation])
  );

  const handleLogout = async () => {
    try {
      setUserTea([]);
      setAmigosFotos([]);
      await AsyncStorage.removeItem('userId');
      navigation.navigate('FirstPage');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  const renderUsuarioItem = ({ item }) => (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: item[0].fotoUsuario }} style={styles.profilePicture} />
        <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
          <Text style={styles.editButtonText}>Editar Perfil</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{`${item[0].username || ''}`.trim() || 'Nombre no disponible'}</Text>
        <Text style={styles.infoUserBold}>Ubicación: </Text>
        <Text style={styles.infoUser}>{item[0].Provincias?.nombre || 'Ubicación no disponible'}</Text>
        <Text style={styles.infoUserBold}>Categoría Favorita: </Text>
        <Text style={styles.infoUser}>{item[0].Categoria?.nombre || 'Categoría no disponible'}</Text>
        <Text style={styles.infoUserBold}>Sobre mí: </Text>
        <Text style={styles.infoUser}>{item[0].descripcion || 'Descripción no disponible'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cursos hechos:</Text>
        <View style={styles.courses}>
          {item.Curso && item.Curso.length > 0 ? (
            item.Curso.map((curso) => (
              <Text key={curso.id_curso} style={styles.course}>{curso.nombre || 'Curso sin nombre'}</Text>
            ))
          ) : (
            <Text style={styles.infoUser}>No hay cursos disponibles</Text>
          )}
        </View>
      </View>
    </View>
  );

  const renderFotosItem = ({ item }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Amigos:</Text>
      <ScrollView horizontal style={styles.friends}>
        {item.length > 0 ? (
          item.map((amigo) => (
            <TouchableOpacity key={amigo.id} style={styles.friend}>
              <Image source={{ uri: amigo.fotoUsuario || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' }} style={styles.friendPicture} />
              <Text>{`${amigo.nombre || ''} ${amigo.apellido || ''}`.trim() || 'Nombre no disponible'}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.infoUser}>No tienes amigos</Text>
        )}
      </ScrollView>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1e3a8a" />
        <Text style={styles.loadingText}>Cargando perfil...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={userTea}
        keyExtractor={item => item.id ? item.id.toString() : 'default-key'}
        renderItem={renderUsuarioItem}
      />
      {amigosFotos.length > 0 && renderFotosItem({ item: amigosFotos })}
      <Button
        onPress={handleLogout}
        title="Cerrar Sesión"
        color="#d32f2f"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display:'flex',
    justifyContent:'center',
    width:'100%',
    height:'100%',
    backgroundColor: '#ffff',
    borderRadius:0,
  },
  header: {
    display:'flex',
    justifyContent:'flex-start',
    backgroundColor: '#1e3a8a',
    padding: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#fff',
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  infoUserBold:{
    fontWeight:'bold',
    textAlign:'justify',
    fontSize: 16,
    color:'#1D59CB',
  },
  infoUser:{
    textAlign:'justify',
    fontSize: 16,
  },
  section: {
    display:'flex',
    justifyContent:'flex-start',
    textAlign:'justify',
    backgroundColor: 'transparent',
    padding: 20,
    marginVertical: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  sectionTitle: {
    display:'flex',
    justifyContent:'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign:'center'
  },
  courses: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  course: {
    fontSize: 14,
    color: '#374151',
    backgroundColor: '#e5e7eb',
    padding: 10,
    borderRadius: 5,
    margin: 5,
  },
  friends: {
    flexDirection: 'row',
  },
  friend: {
    alignItems: 'center',
    marginRight: 10,
  },
  friendPicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  logout: {
    color: '#d32f2f',
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center'
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
  editButton: {
    backgroundColor: '#4a90e2',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
