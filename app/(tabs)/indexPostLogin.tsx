
import { View, Text } from "@/components/Themed";
import { supabase } from "@/lib/supabase";
import { NavigationContainer, useNavigation, useRoute } from "@react-navigation/native";
import { useState, useEffect } from "react";
import { FlatList, StyleSheet, ScrollView, Image, TouchableOpacity, Button } from 'react-native';
import { fetchProgress } from "@/lib/user";

export default function HomeScreen(userId: number) {
    const navigation = useNavigation();

    return (
        <View>
            <Text>Hola, estas en index post login</Text>
            <Button title='Seguir con el progreso' 
            onPress={() => navigation.navigate('')}/>
            <Button title='Más cursos' 
            onPress={() => navigation.navigate('Cursos')}/>
            <Button title='¿Qué hacen mis amigos?' 
            onPress={() => navigation.navigate('AmigosProgreso')}/>
        </View>
    );
}

