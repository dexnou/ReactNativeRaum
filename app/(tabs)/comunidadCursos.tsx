import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useRoute, useNavigation } from '@react-navigation/native';
import { supabase } from '@/lib/supabase';
import Icon from 'react-native-vector-icons/FontAwesome';

const ComunidadCursosScreen = () => {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const route = useRoute();
  const { categoriaId, categoriaNombre } = route.params;
  const navigation = useNavigation();
  console.log('Este es el nombreCategoria que le llega a comunidadCursos', categoriaNombre);

  useEffect(() => {
    const loadCursos = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('Curso')
          .select('*')
          .eq('id_categoria', categoriaId);
        if (error) {
          throw error;
        }
        setCursos(data);
      } catch (err) {
        console.error("Error al cargar cursos:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadCursos();
  }, [categoriaId]);


  const renderCurso = ({ item }) => (
    <TouchableOpacity
      style={styles.cursoItem}
      onPress={() => navigation.navigate('ComunidadUsuarios', { cursoId: item.id_curso })}
    >
      <View style={[styles.cursoIcon, { backgroundColor: item.color || '#03175E' }]}>
        <Image
          source={{ uri: item.fotoCurso || 'https://via.placeholder.com/100' }}
          style={styles.cursoImagen}
        />
      </View>
      <Text style={styles.cursoNombre}>{item.nombre}</Text>
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
                <TouchableOpacity onPress={() => navigation.navigate('Comunidad')} style={styles.backButton}>
                    <Icon name="arrow-left" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerText}>{categoriaNombre}</Text>
            </View>
      <FlatList
        contentContainerStyle={styles.list}
        data={cursos}
        renderItem={renderCurso}
        keyExtractor={item => item.id_curso.toString()}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
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
  list: {
    padding: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  cursoItem: {
    alignItems: 'center',
    marginBottom: 20,
    width: '45%',
  },
  cursoIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  cursoImagen: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  cursoNombre: {
    fontSize: 16,
    textAlign: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ComunidadCursosScreen;