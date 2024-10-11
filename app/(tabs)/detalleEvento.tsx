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
                console.log("Cargando evento:", eventoId);
                const data = await fetchDetalleEvento(eventoId);
                console.log("Evento cargado:", data);
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
                const desinscripto = await deleteEventoEnrollment(eventoId, 2); // Asegúrate de que el id de usuario sea correcto
                if (desinscripto) {
                    alert("Desinscripción exitosa");
                    setEstaInscripto(false);
                } else {
                    alert("Error al desinscribirse");
                }
            } else {
                const inscripto = await setEventoEnrollment(eventoId, 2); // Asegúrate de que el id de usuario sea correcto
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
            </View>
            <Text style={styles.eventoNombre}>{dataEvento.nombre || 'Evento sin nombre'}</Text>
            <Text style={styles.eventoFecha}>Fecha Evento: {dataEvento.fecha || 'Fecha no disponible'}</Text>
            <Text style={styles.eventoUbicacion}>Ubicación: {dataEvento.locacion || 'Ubicación no disponible'}</Text>
            <Text style={styles.eventoHorario}>Horario: {dataEvento.horario || 'Horario no disponible'}</Text>
            <Text style={styles.eventoDescripcion}>Descripción: {dataEvento.descripcion || 'Descripción no disponible'}</Text>
            <Text style={styles.eventoNombreCat}>Categoría: {dataEvento.nombrecategoria || 'Nombre Categoría no disponible'}</Text>
            
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
    );

}


const styles = StyleSheet.create({
    inscribirseButton: {
        backgroundColor: '#1E3A8A',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginHorizontal: 20,
        marginTop: 20,
    },
    desinscribirseButton: {
        backgroundColor: '#DC2626', // Un color rojo para desinscribirse
    },
    inscribirseButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
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
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    eventoImagen: {
        width: '100%',
        height: 200,
    },
    eventoNombre: {
        fontSize: 24,
        fontWeight: 'bold',
        margin: 10,
    },
    eventoFecha: {
        fontSize: 16,
        marginHorizontal: 10,
    },
    eventoUbicacion: {
        fontSize: 16,
        marginHorizontal: 10,
    },
    eventoDescripcion: {
        fontSize: 16,
        margin: 10,
    },
    eventoHorario: {
        fontSize: 16,
        margin: 10,
    },
    eventoNombreCat: {
        fontSize: 16,
        margin: 10,
    },
});

export default DetalleEvento;
