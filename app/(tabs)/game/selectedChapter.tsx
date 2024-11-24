/*o deberpiamos hacer un IF para saber si es práctico o teórico, 
ya que la actividad puede no tener multiple choice, y que sea sólo informativa*/
/*acá te debería llevar akl seleccionar un curso, se muestra la breve descripcion 
y hay un botón para arrancar a jugar y ese te lleva a el juego en sí*/

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import {fetchCapitulo} from '../../../lib/user';
import Icon from 'react-native-vector-icons/FontAwesome'; // Asegúrate de tener instalada esta librería


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
        <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('JuegoCurso', { capituloId: item.id_capitulo, capituloNombre: item.nombre})}>
            <View style={styles.item}>
                <Text style={styles.itemText}>{item.nombre}</Text>
                <Text>{item.descripcion}</Text>
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
      backButton: {
        padding:10,
        position: 'absolute',
        left: 10,
        top:10,
    },
    headerText: {
        color: 'white',
        fontSize: 30,
        fontWeight: 'bold',
        marginLeft: 20,
    },
      list: {
        padding: 20,
      },
      columnWrapper: {
        justifyContent: 'space-between',
      },
      cursoItem: {
        alignItems: 'center',
        marginBottom: 20,
        width: '45%',
      },
      cursoIcon: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
      },
      cursoImagen: {
        width: '100%',
        height: '100%',
        borderRadius: 50,
      },
      cursoNombre: {
        fontSize: 16,
        textAlign: 'center',
      },
      centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    item: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    itemText: {
        fontSize: 18,
    },
});

export default CapituloSeleccionadoScreen;