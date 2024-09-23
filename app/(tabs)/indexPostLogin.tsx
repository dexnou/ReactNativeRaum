import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { supabase } from '@/lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchUser } from '@/lib/user'; 
import ProgressBar from '@/components/ProgressBar';

export default function HomeScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            const loadUserData = async () => {
                try {
                    setIsLoading(true);
                    
                    // Primero, intenta obtener la sesión de Supabase
                    const { data: { session } } = await supabase.auth.getSession();
                    
                    if (session) {
                        // Si hay una sesión activa, usa el ID del usuario de la sesión
                        const user = await fetchUser(session.user.id);
                        if (user && user.length > 0) {
                            setUserData(user[0]);
                            // Actualiza el AsyncStorage con el ID del usuario
                            await AsyncStorage.setItem('userId', session.user.id);
                        } else {
                            console.error('No se encontraron datos del usuario');
                            navigation.navigate('Login');
                        }
                    } else {
                        // Si no hay sesión, intenta obtener el ID del usuario de AsyncStorage
                        const storedUserId = await AsyncStorage.getItem('userId');
                        if (storedUserId) {
                            const user = await fetchUser(storedUserId);
                            if (user && user.length > 0) {
                                setUserData(user[0]);
                            } else {
                                console.error('No se encontraron datos del usuario');
                                navigation.navigate('Login');
                            }
                        } else {
                            console.error('No se encontró sesión ni ID del usuario');
                            navigation.navigate('Login');
                        }
                    }
                } catch (error) {
                    console.error('Error al cargar los datos del usuario:', error);
                    navigation.navigate('Login');
                } finally {
                    setIsLoading(false);
                }
            };

            loadUserData();
        }, [navigation])
    );


    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1e3a8a" />
                <Text style={styles.loadingText}>Cargando...</Text>
            </View>
        );
    }
    
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>
                    ¡Hola {userData?.nombre || 'Usuario'}!
                </Text>
            </View>
            
            <View style={styles.content}>
                <View style={styles.capitulo}>
                    <Text style={styles.capitutoTitle}>Nombre Capítulo</Text>
                    <Text style={styles.capitutoSubtitle}>Nombre hito</Text>
                    <ProgressBar progress={userData?.progress || 80} />{/*aca se completa con la variable de progreso*/}
                    
                </View>
                
                <TouchableOpacity 
                    style={styles.button}
                    onPress={() => navigation.navigate('Cursos')}
                >
                    <Text style={styles.buttonText}>Más escenarios</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={styles.button}
                    onPress={() => navigation.navigate('AmigosProgreso')}
                >
                    <Text style={styles.buttonText}>¿Qué hacen mis Amigos?</Text>
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
        backgroundColor: '#1E3A8A',
        height: "20%",
        display:"flex",
        justifyContent:"center",
        paddingLeft: "10%",
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
    },
    headerText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    content: {
        padding: 20,
        display:"flex",
        width:"100%",
        height:"30%",
        alignContent:"space-between",
    },
    capitulo: {
        backgroundColor: '#565C92',
        width:"100%",
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
    },
    capitutoTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color:"white"
    },
    capitutoSubtitle: {
        fontSize: 16,
        color:"white"
    },
    capitutoNumber: {
        fontSize: 16,
        position: 'absolute',
        right: 15,
        top: 15,
    },
    button: {
        backgroundColor: '#1E3A8A',
        width:"100%",
        display:"flex",
        alignContent:"center",
        justifyContent:"center",
        padding: 10,
        height:"30%",
        borderRadius: 10,
        marginBottom: 15,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: 'white',
        paddingVertical: 10,
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginTop: 5,
    },
});