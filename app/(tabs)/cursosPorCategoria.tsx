import React, { useState, useEffect } from 'react';
import { FlatList, TouchableOpacity, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { fetchCursos } from '../../lib/user';
import Icon from 'react-native-vector-icons/FontAwesome';
import { fetchUsuariosCursos, fetchCapituloCount } from '../../lib/user';

const CursosPorCategoriaScreen = () => {
    const [cursos, setCursos] = useState([]);
    const [usuariosCursos, setUsuariosCursos] = useState([]);
    const [countCapitulos, setCountCapitulos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const route = useRoute();
    const navigation = useNavigation();
    const { categoriaId, categoriaNombre } = route.params;

    useEffect(() => {
        const loadCursos = async () => {
            if (!categoriaId) {
                console.error('categoriaId is undefined');
                return;
            }
            try {
                console.log('Fetching Cursos for categoriaId:', categoriaId);
                const fetchedCursos = await fetchCursos(categoriaId);
                const fetchedUsuariosCursos = await fetchUsuariosCursos(categoriaId);
                const fetchedCapitulosCount = await fetchCapituloCount(categoriaId);
    
                console.log('Fetched Cursos:', fetchedCursos);
    
                // Combina los datos de las tres listas
                const combinedData = fetchedCursos.map((curso, index) => ({
                    ...curso,
                    userCount: fetchedUsuariosCursos[index] || 0, // Usuarios por curso
                    chapterCount: fetchedCapitulosCount[index] || 0, // Capítulos por curso
                }));
    
                setCursos(combinedData); // Actualiza cursos con los datos combinados
                setLoading(false);
            } catch (error) {
                console.error('Error fetching cursos:', error);
                setError(error.message);
                setLoading(false);
            }
        };
        loadCursos();
    }, [categoriaId]);
    


    const renderItem = ({ item }) => (
        <TouchableOpacity 
            onPress={() => navigation.navigate('CapituloSeleccionado', { cursoId: item.id_curso, cursoNombre: item.nombre })}
        >
            <View style={styles.item}>
                <View style={styles.itemContent}>
                    <Text style={styles.itemText}>{item.nombre}</Text>
                </View>
                
            </View>
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
            <FlatList
                data={cursos}
                renderItem={renderItem}
                keyExtractor={(item) => item.id_curso ? item.id_curso.toString() : Math.random().toString()}
                style={styles.list}
            />
        </View> 
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
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
        padding: 10,
        position: 'absolute',
        left: 10,
        top: 10,
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
    item: {
        backgroundColor: '#478EEE',
        borderRadius: 15,
        padding: 25,
        marginBottom: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemContent: {
        flex: 1,
    },
    itemText: {
        fontSize: 20,
        color: 'white',
        fontWeight: '500',
        marginBottom: 4,
    },
    userCount: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 12,
        paddingVertical: 4,
        paddingHorizontal: 12,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
    },
    userCountText: {
        color: 'white',
        fontSize: 16,
        marginLeft: 5,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default CursosPorCategoriaScreen;