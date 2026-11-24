import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from '@react-native-vector-icons/feather';

import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../services/firebase';

export default function ListaClientes({ navigation }) {

    const insets = useSafeAreaInsets();

    const [pesquisa, setPesquisa] = useState('');
    const [clientes, setClientes] = useState([]);

    useEffect(() => {

        const clientesRef = collection(db, "usuarios"); 
        //collection 'usuarios' criada pedidos fictícios para visualizar na tela, 
        //no banco a collection foi alterada para o cadastro dos clientes

        const unsubscribe = onSnapshot(clientesRef, (snapshot) => {
            const listaTemporaria = [];
            snapshot.forEach((doc) => {
                listaTemporaria.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            setClientes(listaTemporaria);
        });
        return () => unsubscribe();
    }, []);

    const handleVerPedidos = (cliente) => {
        navigation.navigate('Pedidos', {
            clienteId: cliente.id,
            clienteNome: cliente.nome,
            clienteEmail: cliente.email
        });
    };

    const clientesFiltrados = clientes.filter(c =>
        c.nome?.toLowerCase().includes(pesquisa.toLowerCase()) ||
        c.email?.toLowerCase().includes(pesquisa.toLowerCase())
    );

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={[styles.scrollContent, { paddingBottom: 24 + insets.bottom }]}
        >
            <Text style={styles.pageTitle}>Lista de Clientes</Text>

            <View style={styles.content}>

                <View style={styles.searchContainer}>
                    <Feather name="search" size={20} color='#8A4364' style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Pesquisar clientes"
                        placeholderTextColor="#A8A8A8"
                        value={pesquisa}
                        onChangeText={setPesquisa}
                    />
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.table}>

                        <View style={styles.tableHeader}>
                            <Text style={[styles.headerCell, styles.colCliente]}>Clientes</Text>
                            <Text style={[styles.headerCell, styles.colContato]}>Contato</Text>
                            <Text style={[styles.headerCell, styles.colAcoes]}>Ações</Text>
                        </View>

                        {clientesFiltrados.length === 0 && (
                            <Text style={styles.emptyText}>Nenhum cliente encontrado.</Text>
                        )}

                        {clientesFiltrados.map((item, index) => (
                            <View
                                key={item.id}
                                style={[styles.tableRow, index % 2 === 0 ? styles.rowEven : styles.rowOdd]}
                            >
                                <Text style={[styles.cell, styles.colCliente]} numberOfLines={1}>
                                    {item.nome || 'Sem nome'}
                                </Text>

                                <Text style={[styles.cell, styles.colContato]} numberOfLines={1}>
                                    {item.email || 'Sem e-mail'}
                                </Text>

                                <View style={[styles.cell, styles.colAcoes, styles.actionContainer]}>
                                    <TouchableOpacity
                                        style={styles.btnVerPedidos}
                                        onPress={() => handleVerPedidos(item)}
                                    >
                                        <Feather name="eye" size={14} color="#FFFFFF" />
                                        <Text style={styles.btnVerPedidosText}>Ver pedidos</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </View>
        </ScrollView>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F0E4',
    },
    scrollContent: {
        padding: 16,
    },
    pageTitle: {
        fontSize: 26,
        fontFamily: 'StoryScript',
        color: '#222222',
        marginBottom: 16,
        marginLeft: 8
    },
    content: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        flex: 1,
        borderWidth: 1,
        borderColor: '#CCCCCC',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#8A436A',
        borderRadius: 20,
        paddingHorizontal: 15,
        height: 45,
        marginBottom: 20,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontFamily: 'StoryScript',
        fontSize: 16,
        color: '#333',
    },
    table: {
        borderWidth: 1,
        borderColor: '#CCCCCC',
        borderRadius: 4,
        overflow: 'hidden',
        minWidth: 400,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#EAEAEA',
        borderBottomWidth: 1,
        borderColor: '#CCCCCC',
    },
    headerCell: {
        padding: 'StoryScript',
        fontSize: 16,
        color: '#000',
        borderRightWidth: 1,
        borderColor: '#CCCCCC',
        textAlign: 'center',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: "#CCCCCC"
    },
    rowEven: {
        backgroundColor: '#F5F5F5'
    },
    rowOdd: {
        backgroundColor: '#E6E6E6'
    },
    cell: {
        padding: 12,
        fontFamily: 'StoryScript',
        fontSize: 14,
        color: '#000',
        borderRightWidth: 1,
        borderColor: '#CCCCCC',
        justifyContent: 'center',
        textAlign: 'center',
    },
    colCliente: { width: 120 },
    colContato: { width: 170 },
    colAcoes: { width: 130, borderRightWidth: 0 },
    actionContainer: {
        alignItems: 'center',
        paddingVertical: 8,
    },
    btnVerPedidos: {
        backgroundColor: '#494C8C',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 4,
        gap: 6,
    },
    btnVerPedidosText: {
        color: '#FFFFFF',
        fontFamily: 'StoryScript',
        fontSize: 12,
    },
    emptyText: {
        textAlign: 'center',
        padding: 20,
        fontFamily: 'StoryScript',
        color: '#777',
        fontSize: 15,
    },
});