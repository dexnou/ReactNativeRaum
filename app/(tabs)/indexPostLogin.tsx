
import { View, Text } from "@/components/Themed";
import { supabase } from "@/lib/supabase";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { useState, useEffect } from "react";
import { FlatList, StyleSheet, ScrollView, Image, TouchableOpacity, Button } from 'react-native';

export default function HomeScreen() {
    const navigation = useNavigation();
    return (
        <View>
            <Text>Hola</Text>
            {/*<Button title='Seguir con el progreso' 
            onPress={() => navigation.navigate('')}/>
            <Button title='Más cursos' 
            onPress={() => navigation.navigate('')}/>
            <Button title='¿Qué hacen mis amigos?' 
            onPress={() => navigation.navigate('')}/>*/}
        </View>
    );
}

