import React, { useState, useEffect } from 'react';
import { FlatList, Image, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { fetchAmigosProgress } from '@/lib/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

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
            if (storedUserId) {
                await fetchData(parseInt(storedUserId));
            } else {
                navigation.navigate("Login");
            }
        } catch (error) {
            console.error('Error al cargar los datos del perfil:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchData = async (userId) => {
        try {
            const amigosProgData = await fetchAmigosProgress(userId);
            setAmigosProg(amigosProgData);
        } catch (error) {
            console.error('Error fetching amigos progress', error);
        }
    };

    const renderAmigo = ({ item }) => (
        <View style={styles.amigoItem}>
            <Image 
                source={{ uri: item.fotouser || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' }}
                style={styles.amigoImage}
            />
            <View style={styles.amigoInfo}>
                <Text style={styles.amigoName}>{`${item.nombreuser || ''}`.trim() || 'Nombre no disponible'}</Text>
                <Text style={styles.amigoDetails}>Cursos hechos: {item.cursoscompletados || 0}</Text>
                <Text style={styles.amigoDetails}>Categoría favorita: {item.categoriafavorita || 'No disponible'}</Text>
            </View>
        </View>
    );

    if (loading) {
        return <View style={styles.container}><Text>Cargando...</Text></View>;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-left" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Mis amigos</Text>
            </View>
            {amigosProg.length > 0 ? (
                <FlatList
                    data={amigosProg}
                    keyExtractor={(item) => item.iduser.toString()}
                    renderItem={renderAmigo}
                    contentContainerStyle={styles.listContainer}
                />
            ) : (
                <Text style={styles.noAmigos}>No se han encontrado amigos</Text>
            )}
            <TouchableOpacity onPress={() => navigation.navigate('Comunidad')} style={styles.floatingButton}>
                <Icon name="search" size={24} color="white" />
            </TouchableOpacity>
        </View>
    );
};

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
      backButton: {
        padding: 10,
    },
    headerText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: 20,
    },
    listContainer: {
        padding: 20,
    },
    amigoItem: {
        display:'flex',
        justifyContent:'space-around',
        flexDirection: 'row',
        backgroundColor: '#565C92',
        borderRadius: 100,
        padding: 5,
        marginBottom: "5%",
    },
    amigoImage: {
        width: 60,
        height: 60,
        borderRadius: 100,
        marginRight:'5%'
    },
    amigoInfo: {
        flex: 1,
    },
    amigoName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    amigoDetails: {
        fontSize: 14,
        color: 'white',
    },
    noAmigos: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
    },
    floatingButton: {
        position: 'absolute',
        right: 10,
        bottom: 30,
        backgroundColor: '#1D59CB',
        width: 50,
        height: 50,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default AmigosProgresoScreen;