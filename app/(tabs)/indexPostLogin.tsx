import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { StackNavigator }from "./navigation/ScreenNavigator";
import { supabase } from '@/lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchUser } from '@/lib/user'; 

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
                    const storedUserId = route.params?.userId || await AsyncStorage.getItem('userId');
                    console.log('ID de usuario obtenido en useFocusEffect:', storedUserId);
                    
                    if (storedUserId) {
                        const user = await fetchUser(storedUserId);
                        console.log('Datos del usuario obtenidos:', user);
                        if (user) {
                            setUserData(user[0]);
                        } else {
                            console.error('No se encontraron datos del usuario');
                        }
                    } else {
                        console.error('No se encontró el ID del usuario en AsyncStorage');
                        navigation.navigate('Login');
                    }
                } catch (error) {
                    console.error('Error al cargar los datos del usuario:', error);
                } finally {
                    setIsLoading(false);
                }
            };

            loadUserData();
        }, [route.params?.userId, navigation])
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
                    <Text style={styles.capitutoNumber}>N°%</Text>
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
        padding: 50,
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
        backgroundColor: '#B0C4DE',
        width:"100%",
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
    },
    capitutoTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    capitutoSubtitle: {
        fontSize: 16,
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
