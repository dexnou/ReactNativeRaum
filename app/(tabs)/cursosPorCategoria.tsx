import React, { useState, useEffect } from 'react';
import { FlatList, TouchableOpacity, View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { fetchCursos } from '../../lib/user'; // Asegúrate de que la ruta sea correcta
import Icon from 'react-native-vector-icons/FontAwesome'; // Asegúrate de tener instalada esta librería

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
            <View style={[styles.cursoIcon, { backgroundColor: item.color || '#90EE90' }]}>
                <Image 
                    source={{ uri: item.iconUrl || 'https://example.com/default-icon.png' }} 
                    style={styles.cursoImagen}
                />
            </View>
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
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('Cursos')} style={styles.backButton}>
                    <Icon name="arrow-left" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerText}>{categoriaNombre}</Text>
            </View>
            
            {cursos.length > 0 ? (
                <FlatList
                    contentContainerStyle={styles.cursosList}
                    data={cursos}
                    renderItem={renderCurso}
                    keyExtractor={item => item.id_curso.toString()}
                    numColumns={2}
                    columnWrapperStyle={styles.columnaCurso}
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
        backgroundColor: 'white',
    },
    header: {
        backgroundColor: '#1E3A8A',
        height: "20%",
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
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: 20,
    },
    cursosList: {
        padding: "5%",
    },
    columnaCurso: {
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
        width: 60,
        height: 60,
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
    noData: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
    },
});

export default CursosPorCategoriaScreen;