import React, { useState, useCallback } from 'react';
import { FlatList, StyleSheet, ScrollView, Image, TouchableOpacity, Button, Alert, ActivityIndicator } from 'react-native';
import 'react-native-url-polyfill/auto';
import { Text, View } from '@/components/Themed';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { supabase } from '@/lib/supabase';
import { fetchUser, fetchAmigos } from '@/lib/user';
import FontAwesome from '@expo/vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';   

export default function ProfileScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const [amigosFotos, setAmigosFotos] = useState([]);
  const [userTea, setUserTea] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async (storedUserId: string) => {
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
  }, []);

  useFocusEffect(
    useCallback(() => {
      const loadProfileData = async () => {
        const storedUserId = route.params?.userId || await AsyncStorage.getItem('userId');
        if (storedUserId) {
          await fetchData(storedUserId);
        } else {
          console.error('No se encontró el ID del usuario en AsyncStorage');
          setIsLoading(false);
          navigation.navigate("Login");
        }
      };
      loadProfileData();
    }, [route.params?.userId, route.params?.updateTimestamp, navigation, fetchData])
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

      {amigosFotos.length > 0 && renderFotosItem(amigosFotos )}
      
    </View>
  );

  const renderFotosItem = (amigos) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Amigos:</Text>
      <View style={styles.friendsGrid}>
        {amigos.length > 0 ? (
          amigos.map((amigo) => (
            <TouchableOpacity key={amigo.id} style={styles.friend}>
              <Image source={{ uri: amigo.fotousuario || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' }} style={styles.friendPicture} />
              <Text>{`${amigo.nombre || ''} ${amigo.apellido || ''}`.trim() || 'Nombre no disponible'}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.infoUser}>No se han encontrado amigos</Text>
        )}
      </View>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <FlatList
          data={userTea}
          keyExtractor={item => item.id ? item.id.toString() : 'default-key'}
          renderItem={renderUsuarioItem}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display:"flex",
},
  header: {
    backgroundColor: '#03175E',
    height: 150,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    borderBottomRightRadius: 40,
    borderBottomLeftRadius: 40,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#fff',
  },
  section: {
    marginTop: "5%",
    marginRight: "10%",
    marginLeft: "10%",
    zIndex:99999,
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
    fontSize: 18,
    color: '#03175E',

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
  editButton: {
    position: "absolute",
    top: "10%",
    right: "5%",
  },
});
