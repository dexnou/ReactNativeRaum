import { FlatList, TouchableOpacity, View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import 'react-native-url-polyfill/auto';
import { useState, useEffect, useCallback } from 'react';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { fetchCategorias } from '../../lib/user.ts'; // Asegúrate de que la ruta sea correcta

export default function EventosScreen(){
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
        const loadCategorias = async () => {
            try {
                console.log("Iniciando carga de categorías...");
                const data = await fetchCategorias();
                console.log("Categorías cargadas:", data);
                setCategorias(data);
                setLoading(false);
            } catch (err) {
                console.error("Error al cargar categorías:", err);
                setError(err.message);
                setLoading(false);
            }
        };
        loadCategorias();
    }, []);

    const renderCategoria = ({ item }) => (
        <TouchableOpacity 
            style={styles.categoriaItem}
            onPress={() => {
                console.log("Navegando a eventosCat con:", item.id_categoria, item.nombre);
                navigation.navigate('EventosCat', { categoriaId: item.id_categoria, categoriaNombre: item.nombre });
            }}
        >
        {item.fotoCategoria && (
            <Image 
                source={{ uri: item.fotoCategoria }} 
                style={styles.categoriaImagen} 
            />
        )}
        <Text style={styles.categoriaNombre}>{item.nombre}</Text>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" />
                <Text>Cargando categorías...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text>Error: {error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Eventos</Text>
          </View>
        
            
                <FlatList
                    contentContainerStyle={styles.categoriasList}
                    data={[
                    { id: '2', icon: 'leaf', color: '#90EE90', name: 'Deportes' },
                    { id: '1', icon: 'utensils', color: '#FFD700', name: 'Comida' },
                    { id: '3', icon: 'shopping-cart', color: '#87CEEB', name: 'Compras' },
                    { id: '4', icon: 'heartbeat', color: '#FFA07A', name: 'Salud' },
                    { id: '5', icon: 'users', color: '#DDA0DD', name: 'Social' },
                    { id: '6', icon: 'plane', color: '#20B2AA', name: 'Viajes' },
                    ]}
                    renderItem={({ item }) => (
                    <TouchableOpacity 
                        style={styles.categoriaItem}
                        onPress={() => {
                        navigation.navigate('EventosCat', { categoriaId: item.id, categoriaNombre: item.name });
                        }}
                    >
                        <View style={[styles.categoriaIcon, { backgroundColor: item.color }]}>
                        <Image 
                            source={{ uri: `https://example.com/icons/${item.icon}.png` }} 
                            /*style={styles.categoriaImagen} */
                        />
                        </View>
                    </TouchableOpacity>
                    )}
                    numColumns={2} //cada dos categoria crea nueva columna
                    keyExtractor={item => item.id}
                    columnWrapperStyle={styles.columnaCategoria}
                />
            
        </View>
      );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display:"flex",
        backgroundColor: '#F3F4F6',
    },
    header: {
        backgroundColor: '#1E3A8A',
        paddingVertical: 60,
        paddingHorizontal: 20,
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
    },
    headerText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    categoriasList: {
        margin:0,
        width:"100%",
        height:"100%", 
        padding:"15%",
        display:"flex",
        justifyContent:"space-between",

    },
    columnaCategoria:{
        display:"flex",
        justifyContent:"space-between",

    },
    categoriaItem: {
        display:"flex",
        flexDirection: 'row',
        justifyContent:"space-between",
        width:100,//esto le da el ancho y alto a los circulos
        height:100
    },
    categoriaIcon: {
        width: "100%",
        height: "100%",
        borderRadius: 100,
    },
    
    categoriaNombre: {
        fontSize: 18,
    },
    noData: {
        fontSize: 18,
        textAlign: 'center',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    
});