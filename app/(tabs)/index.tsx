import { FlatList, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import 'react-native-url-polyfill/auto';
import { Text, View } from '@/components/Themed';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '@/lib/supabase';
import { fetchUser } from '@/lib/user'; // Importamos fetchUser desde user.ts

export default function ProfileScreen() {
  const [userTea, setUserTea] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchUser();
        setUserTea(data); // Actualizamos el estado con los datos obtenidos
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: item.fotoUsuario }} style={styles.profilePicture} />
      </View>

      <View style={styles.section}>
        <div style={{width:'90%'}}><Text style={styles.sectionTitle}>{`${item.nombre} ${item.apellido}`}</Text></div>
        <div style={{width:'90%'}}><Text style={styles.infoUserBold}>Ubicacion: </Text><Text style={styles.infoUser}>{item.Paises.nombre_pais}</Text></div>
        <div style={{width:'90%'}}><Text style={styles.infoUserBold}>Categoria Favorita: </Text><Text style={styles.infoUser}>{item.Categoria.nombre}</Text></div>
        <div style={{width:'90%'}}><Text style={styles.infoUserBold}>Sobre mi: </Text><Text style={styles.infoUser}>{item.descripcion}</Text></div>
      </View>

      <View style={styles.section}>
        
        <Text style={styles.sectionTitle}>Cursos hechos:</Text>
        <View style={styles.courses}>
          {
            item.Curso && item.Curso.map((curso) => (
              <Text key={curso.id_curso} style={styles.course}>{curso.nombre}</Text>
            ))
          }
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Amigos:</Text>
        <ScrollView horizontal style={styles.friends}>
          {
            item.Amigos && item.Amigos.map((amigo) => (
              <TouchableOpacity 
                key={amigo.id} 
                style={styles.friend} 
                /*onPress={() => navigation.navigate('FriendDetail', { amigoId: amigo.id })}*/
              >
                <Image source={{ uri: amigo.foto }} style={styles.friendPicture} />
              </TouchableOpacity>
            ))
          }
        </ScrollView>
      </View>

      <Text style={styles.logout}>Cerrar Sesión</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={userTea}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
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
    marginVertical: 10,
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