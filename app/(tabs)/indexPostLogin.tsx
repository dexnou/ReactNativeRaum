import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { StackNavigator }from "./navigation/ScreenNavigator";

export default function HomeScreen({ userId }) {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>¡Hola Emiliano!</Text>
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
                    <Text style={styles.buttonText}>¿Que hacen mis Amigos?</Text>
                </TouchableOpacity>
            </View>
            
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