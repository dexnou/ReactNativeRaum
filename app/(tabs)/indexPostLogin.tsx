import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { StackNavigator }from "./navigation/ScreenNavigator";
import {fetchUser} from '@/lib/user';

export default function HomeScreen({ userId }) {
    const navigation = useNavigation();
    const [user, setUser] = useState();

    const fetchData = async () => {
        const userData: any = await fetchUser(userId);
      if (userData) {
        if (userData.fotoUsuario === null) {
          userData.fotoUsuario = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
        }
        setUser([userData]);
      } else {
        setUser([]);
      }
    }
    const renderInfoHome = ({item}) => (
        <View style={styles.content}>
                <View style={styles.capitulo}>
                {item.Curso && item.Curso.length > 0 ? (
                    <>
                        <Text style={styles.capitutoTitle}>{'Nombre capitulo'}</Text>
                        <Text style={styles.capitutoSubtitle}>{'Nombre curso'}</Text>
                        <Text style={styles.capitutoNumber}>N°%</Text>
                    </>
                ) : (
                    <Text style={styles.infoUser}>No hay cursos disponibles</Text>
                )}
                    
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
                    <Text style={styles.buttonText}>¿Que hacen mis Amigos?</Text>
                </TouchableOpacity>
            </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>¡Hola Emiliano!</Text>
            </View>
            <FlatList
                data={user}
                keyExtractor={item => item.id ? item.id.toString() : 'default-key'}
                renderItem={renderInfoHome}
            />
            <View style={styles.footer}>
                {/* Add footer icons here */}
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
        padding: 20,
        borderBottomRightRadius: 20,
    },
    headerText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    content: {
        padding: 20,
    },
    capitulo: {
        backgroundColor: '#B0C4DE',
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
        padding: 15,
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
});