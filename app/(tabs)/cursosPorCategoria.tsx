import React, { useState, useEffect } from 'react';
import { FlatList, TouchableOpacity, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { fetchCursos } from '../../lib/user'; // Asegúrate de que la ruta sea correcta

const CursosPorCategoriaScreen = () => {
    const [cursos, setCursos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const route = useRoute();
    const navigation = useNavigation();
    const { categoriaId, categoriaNombre } = route.params;

    useEffect(() => {
        const loadCursos = async () => {
            try {
                console.log("Cargando cursos para la categoría:", categoriaId);
                const data = await fetchCursos(categoriaId);
                console.log("Cursos cargados:", data);
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
            onPress={() => {
                console.log("Navegando a juegodeCurso con:", item.id_curso, item.nombre);
                navigation.navigate('JuegoCurso', { cursoId: item.id_curso, cursoNombre: item.nombre });
            }}
        >
            <Text style={styles.cursoNombre}>{item.nombre}</Text>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" />
                <Text>Cargando cursos...</Text>
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
            <Text style={styles.title}>Cursos de {categoriaNombre}</Text>
            {cursos.length > 0 ? (
                <FlatList
                    data={cursos}
                    renderItem={renderCurso}
                    keyExtractor={item => item.id_curso.toString()}
                />
            ) : (
                <Text style={styles.noData}>No se encontraron cursos para esta categoría</Text>
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
    cursoItem: {
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
    cursoNombre: {
        fontSize: 18,
    },
    noData: {
        fontSize: 18,
        textAlign: 'center',
    },
});

export default CursosPorCategoriaScreen;