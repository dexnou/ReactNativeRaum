import { FlatList, StyleSheet, ScrollView, Image, TouchableOpacity, Button, Alert } from 'react-native';
import 'react-native-url-polyfill/auto';
import { Text, View } from '@/components/Themed';
import { useState, useEffect, useCallback } from 'react';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';

export default function EventosScreen(){
    return(
        <View><h1>Holis estas en eventos</h1></View>
    );
}