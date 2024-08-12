//Esto es lo de que hacen mis amigos desde Home

import { supabase } from '@/lib/supabase';
import React, {useState} from 'react';
import { FlatList, Image, Button, ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { fetchAmigosProgress, fetchAmigos } from '@/lib/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useRoute, useNavigation} from '@react-navigation/native';



const AmigosProgresoScreen = () => {
    const route = useRoute()
    const navigation = useNavigation();
    const loadProfileData = async () => {
        const storedUserId: number = route.params?.userId || await AsyncStorage.getItem('userId');
        console.log('ID de usuario obtenido en useFocusEffect:', storedUserId); // Log adicional
        if (storedUserId) {
          await fetchData(storedUserId);
        } else {
          console.error('No se encontró el ID del usuario en AsyncStorage');
          navigation.navigate("Login")
        }
      };
    const [amigosProg, setAmigosProg] = useState([]);
    
    const fetchData = async (storeUserId: number) => {
        try {
            const amigosProg: any = await fetchAmigosProgress(storeUserId);
            console.log('FetchAmigosProgress manda: ', amigosProg);
            setAmigosProg(amigosProg);
        }
        catch (error) {
            console.error('Error fetching amigos progress', error);
        }
    };
    
    const renderAmigosProgreso = ({item}) => (
        <View>
            <ScrollView>
                {item.length > 0 ? (
                item.map((amigo) => (
                    <TouchableOpacity key={amigo.id}>
                    <Image source={{ uri: amigo.fotoUsuario || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' }}/>
                    <Text>{`${amigo.nombre || ''} ${amigo.apellido || ''}`.trim() || 'Nombre no disponible'}</Text>
                    </TouchableOpacity>
                ))
                ) : (
                <Text>No tienes amigos</Text>
                )}
            </ScrollView>
            <Image source={{uri: item}}/>
        </View>
    )

    return (
      <View>
        <Text>Estoy en en el progreso de mis amigos</Text>
        <FlatList
          data={amigosProg}
          keyExtractor={(item) =>
            item.id ? item.id.toString() : "default-key"
          }
          renderItem={renderAmigosProgreso}
        />
        {amigosProg.length > 0 && renderAmigosProgreso({ item: amigosProg })}
        <Button title="Buscar Más Amigos" color="#f6f6f6" />
      </View>
    );

};

export default AmigosProgresoScreen;