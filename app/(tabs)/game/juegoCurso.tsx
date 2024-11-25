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
            onPress={() => navigation.navigate('JuegoCurso', { capituloId: item.id_capitulo, capituloNombre: item.nombre })}
        >
            <View style={styles.card}>
                <View>
                    <Text style={styles.cardTitle}>{item.nombre}</Text>
                    {item.descripcion && (
                        <Text style={styles.cardSubtitle}>{item.descripcion}</Text>
                    )}
                </View>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.id_capitulo}</Text>
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
    card: {
        backgroundColor: '#4A90E2', // Card background blue
        borderRadius: 8,           // Rounded corners for cards
        padding: 15,
        marginHorizontal: 20,
        marginVertical: 10,
        flexDirection: 'row',      // Aligns items horizontally
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardTitle: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '600',
    },
    cardSubtitle: {
        color: '#ffffff',
        fontSize: 14,
    },
    badge: {
        backgroundColor: '#ffffff', // Badge white background
        width: 30,
        height: 30,
        borderRadius: 15,          // Circular badge
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: '#002B7F',          // Blue badge text color
        fontSize: 14,
        fontWeight: 'bold',
    },
    list: {
        marginTop: 10,
    },
});

export default CapituloSeleccionadoScreen;
