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
    const fetchData = async () => {
      try {
        const categoriasData = await fetchCategorias();
        setCategorias(categoriasData);
      } catch (error) {
        console.error("Error fetching categorias:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const renderCategoria = ({ item }) => (
    <TouchableOpacity
      style={styles.categoriaItem}
      onPress={() => navigation.navigate('ComunidadCursos', { categoriaId: item.id_categoria })}
    >
      <Image source={{ uri: item.fotoCategoria }} style={styles.categoriaImagen} />
      <Text style={styles.categoriaNombre}>{item.nombre}</Text>
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
    justifyContent: 'space-between',
    alignContent:'center',
    margin:'5%'
  },
  categoriaItem: {
    width: '48%',
    marginBottom: 20,
    alignItems: 'center',
  },
  categoriaImagen: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  categoriaNombre: {
    textAlign: 'center',
    fontSize: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});