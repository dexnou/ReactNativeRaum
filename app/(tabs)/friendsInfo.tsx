import React, { useState, useCallback } from 'react';
import { FlatList, StyleSheet, ScrollView, Image, TouchableOpacity, Button, Alert, ActivityIndicator } from 'react-native';
import 'react-native-url-polyfill/auto';
import { Text, View } from '@/components/Themed';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { supabase } from '@/lib/supabase';
import { fetchUser, addFriend } from '@/lib/user';
import FontAwesome from '@expo/vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FriendsInfoScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const [friendData, setFriendData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFriend, setIsFriend] = useState(false);

  const fetchFriendData = useCallback(async (friendId: string) => {
    try {
      setIsLoading(true);
      const userData: any = await fetchUser(Number(friendId));
      if (userData) {
        if (userData.fotoUsuario === null) {
          userData.fotoUsuario = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
        }
        setFriendData(userData);
      }
    } catch (error) {
      console.error('Error fetching friend data:', error);
      Alert.alert('Error', 'No se pudo cargar la información del amigo');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      const loadFriendData = async () => {
        const friendId = route.params?.friendId;
        if (friendId) {
          await fetchFriendData(friendId);
        } else {
          console.error('No se encontró el ID del amigo');
          setIsLoading(false);
          navigation.goBack();
        }
      };
      loadFriendData();
    }, [route.params?.friendId, navigation, fetchFriendData])
  );

  const handleAddFriend = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (userId && friendData) {
        await addFriend(userId, friendData.id);
        setIsFriend(true);
        Alert.alert('Éxito', 'Amigo agregado correctamente');
      }
    } catch (error) {
      console.error('Error al agregar amigo:', error);
      Alert.alert('Error', 'No se pudo agregar al amigo');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!friendData) {
    return (
      <View style={styles.container}>
        <Text>No se encontró información del amigo</Text>
      </View>
    );
  }

  

  const renderFriendProfile = ({ item }) => (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: item[0].fotousuario }} style={styles.profilePicture} />
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
          {item.Curso && friendData.Curso.length > 0 ? (
            item[0].Curso.map((curso) => (
              <Text key={curso.id_curso} style={styles.course}>{curso.nombre || 'Curso sin nombre'}</Text>
            ))
          ) : (
            <Text style={styles.infoUser}>No hay cursos disponibles</Text>
          )}
        </View>
      </View>

      {!isFriend && (
        <TouchableOpacity style={styles.addFriendButton} onPress={handleAddFriend}>
          <Text style={styles.addFriendButtonText}>Agregar como amigo</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <FlatList
          data={[friendData]}
          keyExtractor={(item) => item.id ? item.id.toString() : 'default-key'}
          renderItem={renderFriendProfile}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display:"flex",
    backgroundColor: 'transparent',
  },
  header: {
    backgroundColor: '#03175E',
    height: 140,
    paddingTop: '15%',
    paddingBottom: '10%',
    paddingHorizontal: '5%',
    borderBottomRightRadius: 40,
    borderBottomLeftRadius: 40,
  },
  headerText: {
      color: 'white',
      fontSize: 24,
      fontWeight: 'bold',
      marginLeft: 20,
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
  addFriendButton: {
    backgroundColor: '#03175E',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 20,
    marginTop: 20,
  },
  addFriendButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});