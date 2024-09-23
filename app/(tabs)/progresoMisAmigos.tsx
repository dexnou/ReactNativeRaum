import React, { useState, useEffect } from 'react';
import { FlatList, Image, Button, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { fetchAmigos, fetchAmigosProgress } from '@/lib/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute, useNavigation } from '@react-navigation/native';

const AmigosProgresoScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const [amigosProg, setAmigosProg] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProfileData();
    }, []);

    const loadProfileData = async () => {
        try {
            const storedUserId = route.params?.userId || await AsyncStorage.getItem('userId');
            console.log('ID de usuario obtenido:', storedUserId);
            if (storedUserId) {
                await fetchData(parseInt(storedUserId));
            } else {
                console.error('No se encontró el ID del usuario en AsyncStorage');
                navigation.navigate("Login");
            }
        } catch (error) {
            console.error('Error al cargar los datos del perfil:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchData = async (userId: number) => {
        try {
            const amigosProgData = await fetchAmigosProgress(userId);
            console.log('FetchAmigosProgress manda: ', amigosProgData);
            setAmigosProg(amigosProgData);
        } catch (error) {
            console.error('Error fetching amigos progress', error);
        }
    };

    const renderAmigo = ({ item }) => (
        <TouchableOpacity key={item.iduser} style={styles.amigoItem}>
            <Image 
                source={{ uri: item.fotouser || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' }}
                style={styles.amigoImage}
            />
            <View style={styles.amigoInfo}>
                <Text style={styles.amigoName}>{`${item.nombreuser || ''}`.trim() || 'Nombre no disponible'}</Text>
                <Text>{`${item.nombrecurso || ''}`.trim() || 'Curso no disponible'}</Text>
                <Text>{`Progreso: ${item.cursoprogress || '0'}%`}</Text>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return <View style={styles.container}><Text>Cargando...</Text></View>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Progreso de mis amigos</Text>
            {amigosProg.length > 0 ? (
                <FlatList
                    data={amigosProg}
                    keyExtractor={(item) => item.iduser.toString()}
                    renderItem={renderAmigo}
                />
            ) : (
                <Text style={styles.noAmigos}>No se han encontrado amigos</Text>
            )}
            <Button title="Buscar Más Amigos" onPress={() => navigation.navigate('Comunidad')} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    amigoItem: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    amigoImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    amigoInfo: {
        marginLeft: 10,
        justifyContent: 'center',
    },
    amigoName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    noAmigos: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
    },
});

export default AmigosProgresoScreen;