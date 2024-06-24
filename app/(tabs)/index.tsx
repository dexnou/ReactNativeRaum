


import { FlatList,StyleSheet, ScrollView, Image } from 'react-native';
import 'react-native-url-polyfill/auto';
import { Text, View } from '@/components/Themed';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '@/lib/supabase';

export default function ProfileScreen() {
  // const { userId } = route.params;
  const [userTea, setUserTea] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase
      .from('Usuario_TEA')
      .select('*, Paises(nombre_pais), Categoria(nombre), Curso(id_curso, nombre)')
      .innerJoin('Curso', 'Curso-Usuario.id_curso', 'Curso.id_curso');
      if (error) {
        console.log(error);
      } else {
        console.log('User data fetched:', data);

        setUserTea(data);
      }
    };

    fetchUser();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.fotoUsuario }} style={styles.profilePicture} />
      <Text style={styles.name}>{`${item.nombre} ${item.apellido}`}</Text>
      <Text>País: {item.Paises.nombre_pais}</Text>
      <Text>Categoría Favorita: {item.Categoria.nombre}</Text>
      <Text>Descripcion: {item.descripcion}</Text>
      <Text>Cursos Hechos: {} </Text>
      <Text>Amigos: {}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  title: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  itemContainer: {
    alignItems: 'center',
    padding: 20,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  username: {
    fontSize: 18,
    color: 'gray',
    marginBottom: 5,
  },
  email: {
    fontSize: 18,
    color: 'gray',
    marginBottom: 5,
  },
  dni: {
    fontSize: 18,
    color: 'gray',
    marginBottom: 5,
  },
  birthDate: {
    fontSize: 18,
    color: 'gray',
    marginBottom: 20,
  },
  dniPicture: {
    width: 200,
    height: 100,
    marginBottom: 20,
  },
});