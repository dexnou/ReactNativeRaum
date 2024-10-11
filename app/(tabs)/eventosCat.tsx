import React, { useState, useEffect } from 'react';
import { FlatList, TouchableOpacity, View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { fetchEventosFiltered } from '../../lib/eventos'; // Asegúrate de que la ruta sea correcta
import Icon from 'react-native-vector-icons/FontAwesome';

const EventosCat = () => {
    const [eventos, setEventos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const route = useRoute();
    const navigation = useNavigation();
    const { categoriaId, categoriaNombre } = route.params;

    useEffect(() => {
        const loadEventos = async () => {
            try {
                console.log("Cargando eventos para la categoría:", categoriaId);
                const data = await fetchEventosFiltered(categoriaId);
                console.log("Eventos cargados:", data);
                setEventos(data);
            } catch (err) {
                console.error("Error al cargar cursos:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        loadEventos();
    }, [categoriaId]);

    const renderEvento = ({ item }) => {
        if (!item) return null; // Si el item es undefined o null, no renderizamos nada
        
        return (
            <TouchableOpacity 
                style={styles.eventoItem}
                onPress={() => {
                    console.log("Navegando a DetalleEvento con:", item.idevento, item.nombre);
                    navigation.navigate('DetalleEvento', { 
                        eventoId: item.idevento, 
                        eventoNombre: item.nombre 
                    });
                }}
            >
                <Image 
                    source={{ uri: item.foto || 'https://via.placeholder.com/150' }} 
                    style={styles.eventoImagen}
                />
                <View style={styles.eventoInfo}>
                    <Text style={styles.eventoNombre}>{item.nombre || 'Evento sin nombre'}</Text>
                    <Text style={styles.eventoUbicacion}>{item.locacion || 'Ubicación no disponible'}</Text>
                </View>
            </TouchableOpacity>
        );
    };


    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" />
                <Text>Cargando eventos...</Text>
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
                    <Icon name="arrow-left" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Eventos {categoriaNombre}</Text>
            </View>
            
            {eventos && eventos.length > 0 ? (
                <FlatList
                    data={eventos}
                    renderItem={renderEvento}
                    keyExtractor={(item) => item && item.idevento ? item.idevento.toString() : Math.random().toString()}
                    contentContainerStyle={styles.eventosList}
                />
            ) : (
                <Text style={styles.noData}>No hay eventos disponibles en esta categoría.</Text>
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
        width:"100%",
        height: "100%",
    },
    cursoNombre: {
        fontSize: 16,
        textAlign: 'center',
    },
    eventosList: {
        padding: 15,
    },
    eventoItem: {
        flexDirection: 'row',
        marginBottom: 20,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        overflow: 'hidden',
    },
    eventoImagen: {
        width: 100,
        height: 100,
    },
    eventoInfo: {
        flex: 1,
        padding: 10,
    },
    eventoNombre: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    eventoFecha: {
        fontSize: 14,
        color: '#666',
        marginBottom: 3,
    },
    eventoUbicacion: {
        fontSize: 14,
        color: '#666',
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

export default EventosCat;