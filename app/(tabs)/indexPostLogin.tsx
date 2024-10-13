import React, { useState, useCallback } from 'react';
import {  View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, FlatList, SafeAreaView} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { supabase } from '@/lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchProgress, fetchUser } from '@/lib/user'; 
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
                        const user = await fetchProgress(Number(session.user.id));
                        if (user && user.length > 0) {
                            setUserData(user);
                            // Actualiza el AsyncStorage con el ID del usuario
                            await AsyncStorage.setItem('userId', session.user.id);
                        } else {
                            console.error('No se encontraron datos del usuario');
                        }
                    } else {
                        // Si no hay sesión, intenta obtener el ID del usuario de AsyncStorage
                        const storedUserId = await AsyncStorage.getItem('userId');
                        if (storedUserId) {
                            const user = await fetchProgress(Number(storedUserId));
                            if (user && user.length > 0) {
                                setUserData(user);
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

    const renderUserHome = ({ item }) => (
        <>
            <View style={styles.header}>
                <Text style={styles.headerText}>
                    ¡Hola {item.nombreuser || 'Usuario'}!
                </Text>
            </View>
            
            <View style={styles.content}>
                <View key={item.idcurso} style={styles.capitulo}>
                    <Text style={styles.capitutoTitle}>{item.nombrecurso}</Text>
                    <ProgressBar progress={item.cursoprogress || 80} />
                </View>
                
                <View style={styles.buttonContainer}>
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
        </>
    );

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#03175E" />
                <Text style={styles.loadingText}>Cargando...</Text>
            </View>
        );
    }
    
    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={userData}
                keyExtractor={item => item.id ? item.id.toString() : 'default-key'}
                renderItem={renderUserHome}
                style={styles.flatList}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display:"flex",
        backgroundColor: 'transparent',
      },
      header: {
        backgroundColor: '#03175E',
        height: 140,
        paddingTop: '15%',
        paddingBottom: '10%',
        paddingHorizontal: '5%',
        borderBottomRightRadius: 40,
        borderBottomLeftRadius: 40,
      },
      headerText: {
          color: 'white',
          fontSize: 24,
          fontWeight: 'bold',
          marginLeft: 20,
      },
    flatList: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: '5%',
        display:"flex",
        flexDirection:"column"
    },
    capitulo: {
        backgroundColor: '#565C92',
        padding: '5%',
        borderRadius: 10,
        marginBottom: '5%',
    },
    capitutoTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: "white",
        marginBottom: '3%',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: '5%',
    },
    button: {
        backgroundColor: '#1D59CB',
        padding: '4%',
        borderRadius: 10,
        width: '48%',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
    },
    loadingText: {
        marginTop: '3%',
        fontSize: 16,
        color: '#03175E',
    },
});