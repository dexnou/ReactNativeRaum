import React, { useState, useEffect } from 'react';
import { FlatList, TouchableOpacity, View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { fetchDetalleEvento, fetchEnrollment, setEventoEnrollment, deleteEventoEnrollment } from '../../lib/eventos'; 
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DetalleEvento = () => {
    const [dataEvento, setDataEvento] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [estaInscripto, setEstaInscripto] = useState(false);
    const [userId, setUserId] = useState(null);

    const route = useRoute();
    const navigation = useNavigation();
    const { eventoId } = route.params;

    useEffect(() => {
        const loadUserIdAndEnrollment = async () => {
            try {
                const storedUserId = await AsyncStorage.getItem('userId');
                setUserId(storedUserId);

                if (storedUserId) {
                    const enrollmentStatus = await fetchEnrollment(eventoId, storedUserId);
                    setEstaInscripto(enrollmentStatus);
                }
            } catch (err) {
                console.error('Error loading userId or enrollment:', err);
            }
        };

        loadUserIdAndEnrollment();
    }, [eventoId]);

    useEffect(() => {
        const loadEvento = async () => {
            try {
                const data = await fetchDetalleEvento(eventoId);
                setDataEvento(data[0]);
            } catch (err) {
                console.error('Error al cargar evento:', err);
            } finally {
                setIsLoading(false);
            }
        };

        loadEvento();
    }, [eventoId]);

    const handleInscripcion = async () => {
        try {
            if (estaInscripto) {
                const desinscripto = await deleteEventoEnrollment(eventoId, userId);
                if (desinscripto) {
                    alert('Desinscripción exitosa');
                    setEstaInscripto(false);
                } else {
                    alert('Error al desinscribirse');
                }
            } else {
                const inscripto = await setEventoEnrollment(eventoId, userId);
                if (inscripto) {
                    alert('Inscripción exitosa');
                    setEstaInscripto(true);
                } else {
                    alert('Error al inscribirse');
                }
            }
        } catch (err) {
            console.error('Error al procesar la inscripción:', err);
        }
    };

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" />
                <Text>Cargando evento...</Text>
            </View>
        );
    }

    if (!dataEvento) {
        return (
            <View style={styles.centered}>
                <Text>Error: No se pudo cargar la información del evento</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-left" size={24} color="white" />
                </TouchableOpacity>
                <View style={styles.iconContainer}></View>
            </View>
            <View style={styles.content}>
                <Text style={styles.eventoNombre}>{dataEvento.nombre || 'Evento sin nombre'}</Text>
                <View style={styles.divInfo}>
                    <Text style={styles.infoUserBold}>¿Dónde va a ser?: </Text>
                    <Text style={styles.infoUser}>{dataEvento.locacion || 'Ubicación no disponible'}</Text>
                </View>
                <View style={styles.divInfo}>
                    <Text style={styles.infoUserBold}>¿Cuándo va a ser?: </Text>
                    <Text style={styles.infoUser}>{dataEvento.fecha || 'Fecha no disponible'}</Text>
                </View>
                <View style={styles.divInfo}>
                    <Text style={styles.infoUserBold}>¿Quién lo organiza?: </Text>
                    <Text style={styles.infoUser}>{dataEvento.organizador || 'Organizador no disponible'}</Text>
                </View>
                <View style={styles.divInfo}>
                    <Text style={styles.infoUserBold}>¿Qué se va a hacer en el evento?: </Text>
                    <Text style={styles.infoUser}>{dataEvento.descripcion || 'Descripción no disponible'}</Text>
                </View>
                <View style={styles.divInfo}>
                    <Text style={styles.infoUserBold}>Capacidad del evento: </Text>
                    <Text style={styles.infoUser}>{dataEvento.capacidad || 'Capacidad no disponible'}</Text>
                </View>

                <TouchableOpacity
                    style={[styles.inscribirseButton, estaInscripto && styles.desinscribirseButton]}
                    onPress={handleInscripcion}
                >
                    <Text style={styles.inscribirseButtonText}>
                        {estaInscripto ? 'Desinscribirse' : 'Inscribirse'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        backgroundColor: '#03175E',
        height: 150,
        borderBottomRightRadius: 40,
        borderBottomLeftRadius: 40,
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    iconContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    eventoNombre: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    divInfo: {
        flexDirection: "row",
        
      },
      infoUserBold: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#03175E',
    
      },
      infoUser: {
        fontSize: 16,
      },
    participantesTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 20,
    },
    participante: {
        alignItems: 'center',
        marginHorizontal: 10,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginBottom: 5,
    },
    nombreParticipante: {
        fontSize: 14,
    },
    inscribirseButton: {
        backgroundColor: '#1D59CB',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    desinscribirseButton: {
        backgroundColor: '#DC2626',
    },
    inscribirseButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButton: {
        padding: 10,
        position: 'absolute',
        left: 10,
        top: 10,
    },
});

export default DetalleEvento;
