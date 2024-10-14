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
        if (!item) return null;
        
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
                <View style={styles.eventoInfo}>
                    <Text style={styles.eventoNombre}>{item.nombre || 'Evento sin nombre'}</Text>
                    <Text style={styles.eventoUbicacion}>{item.locacion || 'Ubicación no disponible'}</Text>
                </View>

                <Image 
                    source={{ uri: item.fotoCategoria || 'https://img.freepik.com/vector-premium/no-hay-foto-disponible-icono-vector-simbolo-imagen-predeterminado-imagen-proximamente-sitio-web-o-aplicacion-movil_87543-10615.jpg' }} 
                    style={styles.eventoImagen}
                />
            </TouchableOpacity>
            
        );
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#03175E" />
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
        backgroundColor: '#fff',
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
    backButton: {
        padding: 10,
        position: 'absolute',
        left: 10,
        top: 10,
    },
    eventosList: {
        padding: 20,
    },
    eventoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#478EEE',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
    },
    eventoInfo: {
        flex: 1,
    },
    eventoNombre: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
    },
    eventoUbicacion: {
        fontSize: 14,
        color: '#fff',
    },
    eventoImagen: {
        padding:30,
        borderRadius:100
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