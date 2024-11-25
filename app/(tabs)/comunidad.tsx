import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useNavigation } from '@react-navigation/native';
import { fetchCategorias } from '@/lib/categorias';

export default function ComunidadScreen() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const loadCategorias = async () => {
      try {
          console.log("Iniciando carga de categorías...");
          const data = await fetchCategorias();
          console.log("Categorías cargadas:", data);
          setCategorias(data);
          setLoading(false);
      } catch (err) {
          console.error("Error al cargar categorías:", err);
          setError(err.message);
          setLoading(false);
      }
  };
  loadCategorias();
  }, []);
  

  const renderCategoria = ({ item }) => (
    <TouchableOpacity
          style={styles.categoriaItem}
          onPress={() => navigation.navigate('ComunidadCursos', { categoriaId: item.id_categoria, categoriaNombre: item.nombre })}
        >
          <Image source={{ uri: item.fotoCategoria }} style={styles.categoriaImagen} />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
    <View style={styles.header}>
        <Text style={styles.headerText}>Comunidad</Text>
    </View>
      <FlatList
        data={categorias}
        renderItem={renderCategoria}
        keyExtractor={item => item.id_categoria.toString()}
        numColumns={2}
        contentContainerStyle={styles.categoriasList}
      />
    </View>
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
    height: 150,
    paddingTop: '15%',
    paddingBottom: '10%',
    paddingHorizontal: '5%',
    borderBottomRightRadius: 40,
    borderBottomLeftRadius: 40,
  },
  headerText: {
      color: 'white',
      fontSize: 30,
      fontWeight: 'bold',
      marginLeft: 20,
  },
  categoriasList: {
    display:'flex',
    justifyContent: 'space-around',
    margin:'6%',
    marginTop:'15%'
  },
  categoriaItem: {
    width: '48%',
    margin: '2%',
    alignItems: 'center',
  },
  categoriaImagen: {
    width: 150,
    height: 150,
    borderRadius: 50,
  },
});


