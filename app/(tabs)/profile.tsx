import React, { useState, useCallback } from 'react';
import { FlatList, StyleSheet, ScrollView, Image, TouchableOpacity, Button, Alert, ActivityIndicator } from 'react-native';
import 'react-native-url-polyfill/auto';
import { Text, View } from '@/components/Themed';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { supabase } from '@/lib/supabase';
import { fetchUser, fetchAmigos } from '@/lib/user'; // Importamos fetchUser desde user.ts
import FontAwesome from '@expo/vector-icons/FontAwesome5';
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
          <FontAwesome name="edit" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={{margin:"5%"}}>
        <Text style={styles.sectionTitle}>{`${item[0].nombre || ''} ${item[0].apellido || ''}`.trim() || 'Nombre no disponible'}</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.divInfo}>
          <Text style={styles.infoUserBold}>Ubicación: </Text>
          <Text style={styles.infoUser}>{item[0].Provincias?.nombre || 'Ubicación no disponible'}</Text>
        </View>
        <View style={styles.divInfo}>
          <Text style={styles.infoUserBold}>Categoría Favorita: </Text>
          <Text style={styles.infoUser}>{item[0].Categoria?.nombre || 'Categoría no disponible'}</Text>
        </View>
        <View style={styles.divInfo}>
          <Text style={styles.infoUserBold}>Sobre mí: </Text>
          <Text style={styles.infoUser}>{item[0].descripcion || 'Descripción no disponible'}</Text>
        </View>
      </View>

      {/* Mover la sección de cursos arriba */}
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

      {/* Mover la sección de amigos abajo */}
      {amigosFotos.length > 0 && renderFotosItem({ item: amigosFotos })}
    </View>
  );

  const renderFotosItem = ({ item }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Amigos:</Text>
      <View style={styles.friendsGrid}>
        {item.length > 0 ? (
          item.map((amigo) => (
            <TouchableOpacity key={amigo.id} style={styles.friend}>
              <Image source={{ uri: amigo.fotoUsuario || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' }} style={styles.friendPicture} />
              <Text>{`${amigo.nombre || ''} ${amigo.apellido || ''}`.trim() || 'Nombre no disponible'}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.infoUser}>No se han encontrado amigos</Text>
        )}
      </View>
    </View>
  );

  const LogoutButton = () => (
    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
      <Text style={styles.logoutButtonText}>CERRAR SESIÓN</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={userTea}
        keyExtractor={item => item.id ? item.id.toString() : 'default-key'}
        renderItem={renderUsuarioItem}
      />
      
      <LogoutButton /> {/* Aquí se renderiza el botón de Cerrar Sesión */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
    backgroundColor: '#ffff',
  },
  header: {
    backgroundColor: '#1E3A8A',
    height: "30%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#fff',
  },
  section: {
    margin: "5%",
    marginRight: "10%",
    marginLeft: "10%",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  divInfo: {
    flexDirection: "row",
    marginBottom: 5,
  },
  infoUserBold: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#1D59CB',
  },
  infoUser: {
    fontSize: 16,
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
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 2,
    margin: 2,
  },
  friendsGrid: {
    display:"flex",
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  friend: {
    alignItems: 'center',
    margin: "5%",
  },
  friendPicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
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
    position: "absolute",
    top: "10%",
    right: "5%",
  },
  // Estilos para el botón de Logout
  logoutButton: {
    backgroundColor: '#d32f2f',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 20,
    width: '90%',
    alignSelf: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});