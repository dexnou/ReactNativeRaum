import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useRoute, useNavigation } from '@react-navigation/native';
import { fetchCursos } from '@/lib/categorias';

const ComunidadCursosScreen = () => {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const route = useRoute();
  const { categoriaId } = route.params;
  const navigation = useNavigation();

  useEffect(() => {
    const loadCursos = async () => {
      try {
        const data = await fetchCursos(categoriaId);
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
      <View style={[styles.cursoIcon, { backgroundColor: item.color || '#1E3A8A' }]}>
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
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          {/* Add back button */}
        </TouchableOpacity>
        <Text style={styles.headerText}>Cursos</Text>
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
    backgroundColor: 'white',
  },
  header: {
    backgroundColor: '#1E3A8A',
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
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