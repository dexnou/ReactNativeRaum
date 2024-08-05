import { FlatList, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import 'react-native-url-polyfill/auto';
import { Text, View } from '@/components/Themed';
import { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { supabase } from '@/lib/supabase';
import { fetchUser, fetchAmigos } from '@/lib/user'; // Importamos fetchUser desde user.ts

export default function ProfileScreen() {
  const route = useRoute();
  const { userId } = route.params; // Accede al userId desde los parámetros de la ruta
  console.log(userId)
  const [amigosFotos, setAmigosFotos] = useState([]);
  const [userTea, setUserTea] = useState<any[]>([]); // Asegúrate de inicializar como array vacío
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const amigosData: any = await fetchAmigos(userId);
        console.log('Amigos data:', amigosData);
        setAmigosFotos(amigosData);

        const userData: any = await fetchUser(userId);
        // Manejar el caso donde userData puede ser null
        if (userData) {
          setUserTea([userData]); // Ajustar según la estructura de tu dato
        } else {
          setUserTea([]);
        }
        
        if (userData?.fotoUsuario === null) {
          userData.fotoUsuario = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, [userId]); // Agrega userId como dependencia

  const renderUsuarioItem = ({ item }) => (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: item.fotoUsuario || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' }} style={styles.profilePicture} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{`${item.nombre || 'Nombre no disponible'} ${item.apellido || 'Apellido no disponible'}`}</Text>
        <Text style={styles.infoUserBold}>Ubicacion: </Text><Text style={styles.infoUser}>{item.Provincias?.nombre || 'Ubicación no disponible'}</Text>
        <Text style={styles.infoUserBold}>Categoria Favorita: </Text><Text style={styles.infoUser}>{item.Categoria?.nombre || 'Categoría no disponible'}</Text>
        <Text style={styles.infoUserBold}>Sobre mi: </Text><Text style={styles.infoUser}>{item.descripcion || 'Descripción no disponible'}</Text>
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
              <Text>{amigo.nombre || 'Nombre no disponible'} {amigo.apellido || 'Apellido no disponible'}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.infoUser}>No tienes amigos</Text>
        )}
      </ScrollView>
      <Text style={styles.logout}>Cerrar Sesión</Text>
    </View>
  );


  
  return (
    <View style={styles.container}>
      <FlatList
        data={userTea}
        keyExtractor={(item) => item.id.toString()}        
        renderItem={renderUsuarioItem}
      />
      {amigosFotos.length > 0 && renderFotosItem({ item: amigosFotos })}
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
});