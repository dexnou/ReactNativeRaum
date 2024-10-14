import React, { useState, useEffect } from 'react';
import { FlatList, TouchableOpacity, View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { fetchDetalleEvento } from '../../lib/eventos'; // Asegúrate de que la ruta sea correcta
import Icon from 'react-native-vector-icons/FontAwesome';
import { setEventoEnrollment } from '../../lib/eventos';
import { deleteEventoEnrollment } from '../../lib/eventos';

const DetalleEvento = () => {
    const [dataEvento, setDataEvento] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [inscripto, setInscripto] = useState(false);
    const [estaInscripto, setEstaInscripto] = useState(false);

    const route = useRoute();
    const navigation = useNavigation();
    const { eventoId } = route.params;
    
    useEffect(() => {
        const loadEvento = async () => {
            try {
                const data = await fetchDetalleEvento(eventoId);
                setDataEvento(data[0]);
            } catch (err) {
                console.error("Error al cargar evento:", err);
            } finally {
                setIsLoading(false);
            }
        };
        loadEvento();
    }, [eventoId]);
    
    const handleInscripcion = async () => {
        setInscripto(true);
        try {
            if (estaInscripto) {
                const desinscripto = await deleteEventoEnrollment(eventoId, 2);
                if (desinscripto) {
                    alert("Desinscripción exitosa");
                    setEstaInscripto(false);
                } else {
                    alert("Error al desinscribirse");
                }
            } else {
                const inscripto = await setEventoEnrollment(eventoId, 2);
                if (inscripto) {
                    alert("Inscripción exitosa");
                    setEstaInscripto(true);
                } else {
                    alert("Error al inscribirse");
                }
            }
        } catch (err) {
            console.error("Error al procesar la inscripción:", err);
        } finally {
            setInscripto(false);
        }
    }

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
                <View style={styles.iconContainer}>
                    {/*<Icon name="book" size={80} color="white" />*/}
                </View>
            </View>
            <View style={styles.content}>
                <Text style={styles.eventoNombre}>{dataEvento.nombre || 'Evento sin nombre'}</Text>
                <View style={styles.divInfo}>
                    <Text style={styles.infoUserBold}>¿Dónde va a ser?: </Text>
                    <Text style={styles.infoUser}> {dataEvento.locacion || 'Ubicación no disponible'}</Text>
                </View>
                <View style={styles.divInfo}>
                    <Text style={styles.infoUserBold}>¿Cuándo va a ser?:  </Text>
                    <Text style={styles.infoUser}>{dataEvento.fecha || 'Fecha no disponible'}</Text>
                </View>
                {/*<View style={styles.divInfo}>
                    <Text style={styles.infoUserBold}>Categoría:  </Text>
                    <Text style={styles.infoUser}>{dataEvento.nombrecategoria || 'Categoría no disponible'}</Text>
                </View>*/}
                <View style={styles.divInfo}>
                    <Text style={styles.infoUserBold}>¿Quién lo organiza?:  </Text>
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

                {/*<Text style={styles.participantesTitle}>Participantes:</Text>
                <FlatList
                    data={dataEvento.participantes || []}
                    horizontal
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.participante}>
                            <Image source={{ uri: item.avatar }} style={styles.avatar} />
                            <Text style={styles.nombreParticipante}>{item.nombre}</Text>
                        </View>
                    )}
                />*/}

                <TouchableOpacity 
                    style={[styles.inscribirseButton, estaInscripto && styles.desinscribirseButton]}
                    onPress={handleInscripcion}
                    disabled={inscripto}
                >
                    <Text style={styles.inscribirseButtonText}>
                        {inscripto ? 'Procesando...' : (estaInscripto ? 'Desinscribirse' : 'Inscribirse')}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

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
