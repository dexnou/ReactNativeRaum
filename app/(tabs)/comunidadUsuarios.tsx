import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useRoute, useNavigation } from '@react-navigation/native';
import { supabase } from '@/lib/supabase';
import Icon from 'react-native-vector-icons/FontAwesome';

const ComunidadUsuariosScreen = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const route = useRoute();
  const { cursoId } = route.params;
  const navigation = useNavigation();

  useEffect(() => {
    const loadUsuarios = async () => {
      setLoading(true);
      try {
        // Fetch the Curso_Usuario records for the selected course
        const { data: cursoUsuarioData, error: cursoUsuarioError } = await supabase
          .from('Curso_Usuario')
          .select('id_usuario')
          .eq('id_curso', cursoId);

        if (cursoUsuarioError) {
          throw cursoUsuarioError;
        }

        // Fetch the Usuario_TEA records for the users enrolled in the course
        const { data: usuarioData, error: usuarioError } = await supabase
          .from('Usuario_TEA')
          .select('*')
          .in('id', cursoUsuarioData.map(cu => cu.id_usuario));

        if (usuarioError) {
          throw usuarioError;
        }

        setUsuarios(usuarioData);
      } catch (err) {
        console.error("Error al cargar usuarios:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadUsuarios();
  }, [cursoId]);

  const handleUsuarioPress = (usuarioId) => {
    navigation.navigate('FriendsInfo', { friendId: usuarioId });
  };

  const renderUsuario = ({ item }) => (
    <TouchableOpacity
      style={styles.usuarioItem}
      onPress={() => handleUsuarioPress(item.id)}
    >
      <View style={styles.divImagen}>
        <Image
          source={{ uri: item.fotoUsuario || 'https://via.placeholder.com/50' }}
          style={styles.usuarioImagen}
        />
      </View>
      <View style={styles.divNombre}>
        <Text style={styles.usuarioNombre}>{item.nombre}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-left" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Usuarios</Text>
            </View>
      <FlatList
        contentContainerStyle={styles.usuariosList}
        data={usuarios}
        renderItem={renderUsuario}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display:"flex",
    backgroundColor: 'transparent',
  },
  header: {
      backgroundColor: '#03175E',
      height: 150,
      paddingTop: '15%',
      paddingBottom: '10%',
      paddingHorizontal: '5%',
      borderBottomRightRadius: 40,
      borderBottomLeftRadius: 40,
    },
    backButton: {
      padding:10,
      position: 'absolute',
      left: 10,
      top:10,
    },
    headerText: {
        color: 'white',
        fontSize: 30,
        fontWeight: 'bold',
        marginLeft: 20,
    },
    usuariosList: {
      padding: 20,
    },
    usuarioItem: {
      display:'flex',
      flex:1,
      justifyContent:'center',
      flexDirection: 'row',
      alignItems:'center',
      backgroundColor: '#565C92',
      borderRadius: 100,
      padding: 5,
      marginBottom: "5%",
    },
    divImagen:{
      width:'30%',
      display:'flex',
      justifyContent:'flex-start',
      backgroundColor:'trasparent'
    },
    usuarioImagen: {
      width: 60,
      height: 60,
      borderRadius: 100,
    },
    divNombre:{
      width:'70%',
      display:'flex',
      justifyContent:'center',
      backgroundColor:'trasparent'
    },
    usuarioNombre: {
      fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default ComunidadUsuariosScreen;