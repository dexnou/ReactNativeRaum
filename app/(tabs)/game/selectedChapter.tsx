import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { fetchCapitulo } from '../../../lib/user';
import Icon from 'react-native-vector-icons/FontAwesome'; // Ensure this library is installed

const CapituloSeleccionadoScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { cursoId, cursoNombre } = route.params;
    const [capitulos, setCapitulos] = useState([]);

    useEffect(() => {
        const loadCapitulos = async () => {
            if (!cursoId) {
                console.error('cursoId is undefined');
                return;
            }
            try {
                console.log('Fetching Capitulos for cursoId:', cursoId);
                const fetchedCapitulos = await fetchCapitulo(cursoId);
                console.log('Fetched Capitulos:', fetchedCapitulos);
                setCapitulos(fetchedCapitulos);
            } catch (error) {
                console.error('Error fetching capitulos:', error);
            }
        };
        loadCapitulos();
    }, [cursoId]);

    const renderItem = ({ item }) => (
        <TouchableOpacity 
            onPress={() => navigation.navigate('JuegoCurso', { capituloId: item.id_capitulo, capituloNombre: item.nombre})}
        >
            <View style={styles.item}>
                <View style={styles.itemContent}>
                    <Text style={styles.itemText}>{item.nombre}</Text>
                    {item.descripcion && (
                        <Text style={styles.descriptionText}>{item.descripcion}</Text>
                    )}
                </View>
                
            </View>
        </TouchableOpacity>
    );
    return ( 
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-left" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerText}>{cursoNombre}</Text>
            </View>
            <FlatList
                data={capitulos}
                renderItem={renderItem}
                keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
                style={styles.list}
            />
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
    list: {
        padding: 20,
    },
    item: {
        backgroundColor: '#4169E1', // Royal blue color
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemContent: {
        flex: 1,
    },
    itemText: {
        fontSize: 18,
        color: 'white',
        fontWeight: '500',
        marginBottom: 4,
    },
    descriptionText: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 14,
    },
    userCount: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 12,
        paddingVertical: 4,
        paddingHorizontal: 12,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 20,
    },
});

export default CapituloSeleccionadoScreen;
