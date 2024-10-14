import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';

const JuegoCursoScreen = () => {
    const route = useRoute();
    const { cursoId, cursoNombre } = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{cursoNombre}</Text>
            <Text>ID del curso: {cursoId}</Text> 
            {/* Aquí puedes añadir más detalles del curso */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});

export default JuegoCursoScreen;