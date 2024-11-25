import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { fetchPreguntas, fetchInfoPrevia, fetchRespuestas } from '../../../lib/user';
import { useRoute, useNavigation } from '@react-navigation/native';

const JuegoCursoScreen = () => {
    const route = useRoute();
    const { capituloId, capituloNombre } = route.params;
    const navigation = useNavigation();

    const [infoPrevia, setInfoPrevia] = useState([]);
    const [preguntas, setPreguntas] = useState([]);
    const [preguntaSeleccionada, setPreguntaSeleccionada] = useState(null);
    const [respuestas, setRespuestas] = useState([]);
    const [respuestaSeleccionada, setRespuestaSeleccionada] = useState(null);
    const [mostrarPreguntas, setMostrarPreguntas] = useState(false);
    const [mensajeRespuesta, setMensajeRespuesta] = useState('');
    const [cargandoPreguntas, setCargandoPreguntas] = useState(true);
    const [juegoTerminado, setJuegoTerminado] = useState(false);
    const [preguntasCompletadas, setPreguntasCompletadas] = useState(false);

    useEffect(() => {
        const loadInfoPrevia = async () => {
            if (!capituloId) {
                console.error('capituloId is undefined');
                return;
            }
            try {
                const fetchedInfoPrevia = await fetchInfoPrevia(capituloId);
                setInfoPrevia(fetchedInfoPrevia);
            } catch (error) {
                console.error('Error fetching infoPrevia:', error);
            }
        };
        loadInfoPrevia();
    }, [capituloId]);

    useEffect(() => {
        const loadPreguntas = async () => {
            setCargandoPreguntas(true);
            if (!capituloId) {
                console.error('capituloId is undefined');
                setCargandoPreguntas(false);
                return;
            }
            try {
                const fetchedPreguntas = await fetchPreguntas(capituloId);
                setPreguntas(Array.isArray(fetchedPreguntas) ? fetchedPreguntas : []);
                if (fetchedPreguntas.length === 0) {
                    setPreguntasCompletadas(true); // Marcamos como completadas si no hay preguntas.
                }
            } catch (error) {
                console.error('Error fetching preguntas:', error);
                setPreguntas([]);
            } finally {
                setCargandoPreguntas(false);
            }
        };
        loadPreguntas();
    }, [capituloId]);

    useEffect(() => {
        const loadRespuestas = async () => {
            if (!preguntaSeleccionada) return;
            try {
                const fetchedRespuestas = await fetchRespuestas(preguntaSeleccionada.id_pregunta);
                setRespuestas(fetchedRespuestas);
            } catch (error) {
                console.error('Error fetching respuestas:', error);
            }
        };
        loadRespuestas();
    }, [preguntaSeleccionada]);

    const handleAsegurarRespuesta = () => {
        if (!respuestaSeleccionada) {
            setMensajeRespuesta('Debes seleccionar una respuesta antes de continuar.');
            return;
        }

        if (respuestaSeleccionada.correcta) {
            setMensajeRespuesta('¡Correcto! Pasando a la siguiente pregunta...');
            setTimeout(() => {
                setRespuestaSeleccionada(null);
                avanzarPregunta();
            }, 1500);
        } else {
            const respuestaCorrecta = respuestas.find((respuesta) => respuesta.correcta);
            setMensajeRespuesta(
                `Incorrecto. La respuesta correcta era: ${respuestaCorrecta?.info}.`
            );
        }
    };

    const avanzarPregunta = () => {
        const siguientePregunta = preguntas[preguntas.indexOf(preguntaSeleccionada) + 1];
        if (siguientePregunta) {
            setPreguntaSeleccionada(siguientePregunta);
            setMensajeRespuesta('');
        } else {
            setJuegoTerminado(true); // Marcamos el juego como terminado
            setPreguntasCompletadas(true); // Actualizamos estado para indicar que se completaron todas las preguntas
        }
    };

    const reiniciarJuego = () => {
        setPreguntaSeleccionada(null);
        setRespuestaSeleccionada(null);
        setMostrarPreguntas(false);
        setMensajeRespuesta('');
        setJuegoTerminado(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{capituloNombre}</Text>

            {!mostrarPreguntas ? (
                <View>
                    {preguntasCompletadas ? (
                        <Text style={styles.infoPrevia}>
                            Ya has hecho estas preguntas. No puedes volver a jugarlas.
                        </Text>
                    ) : (
                        <>
                            {infoPrevia.length > 0 ? (
                                infoPrevia.map((item) => (
                                    <Text key={item.id_aprendizaje} style={styles.infoPrevia}>
                                        {item.contenido}
                                    </Text>
                                ))
                            ) : (
                                <Text style={styles.infoPrevia}>
                                    Cargando información previa...
                                </Text>
                            )}
                            <TouchableOpacity
                                style={[
                                    styles.siguienteButton,
                                    (cargandoPreguntas || preguntas.length === 0) && styles.buttonDisabled,
                                ]}
                                onPress={() => {
                                    if (preguntas.length > 0) {
                                        setPreguntaSeleccionada(preguntas[0]); // Seleccionar la primera pregunta
                                        setMostrarPreguntas(true);
                                    } else {
                                        Alert.alert('Error', 'No hay preguntas disponibles para este capítulo.');
                                    }
                                }}
                                disabled={cargandoPreguntas || preguntas.length === 0}
                            >
                                <Text style={styles.buttonText}>
                                    {cargandoPreguntas ? 'Cargando...' : 'Empezar'}
                                </Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            ) : (
                <View>
                    {juegoTerminado ? (
                        <>
                            <Text style={styles.mensajeFinal}>
                                Genial! Terminaste todas las preguntas, lo completaste con éxito!
                            </Text>
                            <TouchableOpacity
                                style={[styles.siguienteButton]}
                                onPress={() => navigation.navigate('Home')}
                            >
                                <Text style={styles.buttonText}>
                                    {'Volver a Home'}
                                </Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <Text style={styles.pregunta}>
                                {preguntaSeleccionada?.info || 'Cargando pregunta...'}
                            </Text>

                            {respuestas.map((respuesta) => (
                                <TouchableOpacity
                                    key={respuesta.id_respuesta}
                                    style={[
                                        styles.respuesta,
                                        respuestaSeleccionada === respuesta &&
                                            styles.respuestaSeleccionada,
                                    ]}
                                    onPress={() => setRespuestaSeleccionada(respuesta)}
                                >
                                    <Text>{respuesta.info}</Text>
                                </TouchableOpacity>
                            ))}

                            <TouchableOpacity
                                style={[
                                    styles.asegurarButton,
                                    !respuestaSeleccionada && styles.buttonDisabled,
                                ]}
                                onPress={handleAsegurarRespuesta}
                                disabled={!respuestaSeleccionada}
                            >
                                <Text style={styles.buttonText}>Asegurar</Text>
                            </TouchableOpacity>

                            {mensajeRespuesta ? (
                                <Text style={styles.mensaje}>{mensajeRespuesta}</Text>
                            ) : null}
                        </>
                    )}
                </View>
            )}
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    infoPrevia: {
        fontSize: 16,
        marginBottom: 20,
    },
    siguienteButton: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    pregunta: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    respuesta: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 10,
    },
    respuestaSeleccionada: {
        backgroundColor: '#D3E5FF',
    },
    asegurarButton: {
        backgroundColor: '#28A745',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    buttonDisabled: {
        backgroundColor: '#ccc',
    },
    mensaje: {
        marginTop: 20,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#d9534f',
    },
    mensajeFinal: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#28a745',
        textAlign: 'center',
        marginTop: 20,
    },
    finalContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    reintentarButton: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
    },
});

export default JuegoCursoScreen;