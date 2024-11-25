import React, { useState, useEffect } from 'react';
import { FlatList, TouchableOpacity, View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchCategorias } from '@/lib/categorias'; // Asegúrate de que la ruta sea correcta


const CursosScreen = () => {
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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
          onPress={() => navigation.navigate('CursosPorCategoria', { categoriaId: item.id_categoria, categoriaNombre: item.nombre })}
        >
          <Image source={{ uri: item.fotoCategoria }} style={styles.categoriaImagen} />
        </TouchableOpacity>
      );

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" />
                <Text>Cargando categorías...</Text>
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
                <Text style={styles.headerText}>Cursos</Text>
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

export default CursosScreen;