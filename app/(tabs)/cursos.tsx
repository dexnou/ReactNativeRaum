import React, { useState, useEffect } from 'react';
import { FlatList, TouchableOpacity, View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchCategorias } from '../../lib/user.ts'; // Asegúrate de que la ruta sea correcta

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
            onPress={() => {
                console.log("Navegando a CursosPorCategoria con:", item.id_categoria, item.nombre);
                navigation.navigate('CursosPorCategoria', { categoriaId: item.id_categoria, categoriaNombre: item.nombre });
            }}
        >
            {item.fotoCategoria && (
                <Image 
                    source={{ uri: item.fotoCategoria }} 
                    style={styles.categoriaImagen} 
                />
            )}
            <Text style={styles.categoriaNombre}>{item.nombre}</Text>
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
            <Text style={styles.title}>Categorías de Cursos</Text>
            {categorias.length > 0 ? (
                <FlatList
                    data={categorias}
                    renderItem={renderCategoria}
                    keyExtractor={item => item.id_categoria.toString()}
                />
            ) : (
                <Text style={styles.noData}>No se encontraron categorías</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    categoriaItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        flexDirection: 'row',
        alignItems: 'center',
    },
    categoriaImagen: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    categoriaNombre: {
        fontSize: 18,
    },
    noData: {
        fontSize: 18,
        textAlign: 'center',
    },
});

export default CursosScreen;