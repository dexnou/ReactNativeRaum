import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useRoute, useNavigation } from '@react-navigation/native';
import { supabase } from '@/lib/supabase';

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
      <Image
        source={{ uri: item.fotoUsuario || 'https://via.placeholder.com/50' }}
        style={styles.usuarioImagen}
      />
      <Text style={styles.usuarioNombre}>{item.nombre}</Text>
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
          {/* Add back button icon here */}
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
      backgroundColor: 'white',
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
    backButton: {
      padding: 10,
    },
    headerText: {
      color: 'white',
      fontSize: 20,
      fontWeight: 'bold',
      marginLeft: 20,
    },
    usuariosList: {
      padding: 20,
    },
    usuarioItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#e0e0e0',
    },
    usuarioImagen: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 10,
    },
    usuarioNombre: {
      fontSize: 16,
    },
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default ComunidadUsuariosScreen;