import { StyleSheet, Alert, View, ScrollView, Text, TextInput, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useEffect, useRef } from 'react';

import Feather from '@react-native-vector-icons/feather';

import { theme } from '../../theme';

import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';


export default function ProdutoCadastrado({ route, navigation }) {

    const insets = useSafeAreaInsets();

    const [pesquisa, setPesquisa] = useState('');
    const [produtos, setProdutos] = useState([]);

    const tableScrollRef = useRef(null);
    const bottomBarScrollRef = useRef(null);

    const isScrollingByTable = useRef(false);
    const isScrollingByBar = useRef(false);

    const tableWidth = 370;

    useEffect(() => {
        const produtosRef = collection(db, "produtos");

        const unsubscribe = onSnapshot(produtosRef, (snapshot) => {
            const listaTemporaria = [];

            snapshot.forEach((doc) => {
                listaTemporaria.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            setProdutos(listaTemporaria);
        });

        return () => unsubscribe();
    }, []);


    const handleEditar = (item) => {
        navigation.navigate('Alterar Produto', {
            id: item.id,
            nome: item.nome,
            preco: item.preco,
            descricao: item.descricao
        });
    };

    const handleExcluir = (id, nome) => {
        Alert.alert(
            "Atenção",
            `Tem certeza que deseja excluir o produto: ${nome}?`,
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const produtoDocRef = doc(db, "produtos", id);

                            await deleteDoc(produtoDocRef);

                        } catch (error) {
                            console.log(error);
                            Alert.alert("Erro", "Não foi possível excluir o produto.");
                        }
                    }
                }
            ]
        );
    };

    const produtosFiltrados = produtos.filter(p =>
        p.nome.toLowerCase().includes(pesquisa.toLowerCase())
    );

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={[styles.container, { paddingBottom: 24 + insets.bottom }]}
        >
            <View style={styles.content}>

                <View style={styles.searchContainer}>
                    <Feather
                        style={styles.searchIcon}
                        name="search"
                        size={20}
                        color={theme.colors.dark}
                    />

                    <TextInput
                        style={styles.searchInput}
                        placeholder="Pesquisar produto"
                        placeholderTextColor="#A8A8A8"
                        value={pesquisa}
                        onChangeText={setPesquisa}
                    />
                </View>

                <ScrollView
                    ref={tableScrollRef}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    onScroll={(event) => {
                        if (isScrollingByBar.current) return;
                        isScrollingByTable.current = true;
                        const offsetX = event.nativeEvent.contentOffset.x;
                        bottomBarScrollRef.current?.scrollTo({ x: offsetX, animated: false });
                    }}
                    onScrollEndDrag={() => { isScrollingByTable.current = false; }}
                    onMomentumScrollEnd={() => { isScrollingByTable.current = false; }}
                    scrollEventThrottle={16}
                >
                    <View style={styles.table}>

                        <View style={styles.tableHeader}>
                            <Text style={[styles.headerCell, styles.colProduto]}>Produto</Text>
                            <Text style={[styles.headerCell, styles.colDescricao]}>Descrição</Text>
                            <Text style={[styles.headerCell, styles.colPreco]}>Preço</Text>
                            <View style={[styles.headerCell, styles.colAcoes]} />
                        </View>

                        {produtosFiltrados.length === 0 && (
                            <Text style={styles.emptyText}>
                                Nenhum produto cadastrado
                            </Text>
                        )}

                        {produtosFiltrados.map((item, index) => (
                            <View
                                key={`${item.id}-${index}`}
                                style={[styles.tableRow, index % 2 === 0 ? styles.rowEven : styles.rowOdd]}
                            >
                                <Text style={[styles.cell, styles.colProduto]}>{item.nome}</Text>
                                <Text style={[styles.cell, styles.colDescricao]}>{item.descricao}</Text>
                                <Text style={[styles.cell, styles.colPreco]}>
                                    {Number(item.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </Text>

                                <View style={[styles.cell, styles.colAcoes, styles.actionButtonsContainer]}>
                                    <TouchableOpacity
                                        style={styles.btnEditar}
                                        onPress={() => handleEditar(item)}
                                    >
                                        <Feather
                                            name="edit-2"
                                            size={12}
                                            color={theme.colors.light}
                                        />
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.btnExcluir}
                                        onPress={() => handleExcluir(item.id, item.nome)}
                                    >
                                        <Feather
                                            name="trash-2"
                                            size={12}
                                            color={theme.colors.light}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}

                        <ScrollView
                            ref={bottomBarScrollRef}
                            horizontal
                            showsHorizontalScrollIndicator={true}
                            onScroll={(event) => {
                                if (isScrollingByTable.current) return;
                                isScrollingByBar.current = true;
                                const offsetX = event.nativeEvent.contentOffset.x;
                                tableScrollRef.current?.scrollTo({ x: offsetX, animated: false });
                            }}
                            onScrollEndDrag={() => { isScrollingByBar.current = false; }}
                            onMomentumScrollEnd={() => { isScrollingByBar.current = false; }}
                            scrollEventThrottle={16}
                            style={styles.bottomScrollbarContainer}
                            contentContainerStyle={{ width: tableWidth }}
                        >
                        </ScrollView>

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
        padding: 8,
    },
    content: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 24,
        flex: 1,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#8A436A',
        borderRadius: 20,
        paddingHorizontal: 15,
        height: 40,
        marginBottom: 20,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontFamily: 'StoryScript',
        fontSize: 14,
        color: '#333',
    },
    table: {
        borderWidth: 1,
        borderColor: '#CCCCCC',
        borderRadius: 4,
        overflow: 'hidden',
        minWidth: 370,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#EAEAEA',
        borderBottomWidth: 1,
        borderColor: '#CCCCCC',
    },
    headerCell: {
        padding: 10,
        fontFamily: 'StoryScript',
        fontSize: 16,
        color: '#000',
        borderRightWidth: 1,
        borderColor: '#CCCCCC',
    },
    emptyText: {
        textAlign: 'center',
        padding: 20,
        fontFamily: 'StoryScript',
        color: '#777',
        fontSize: 14,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#CCCCCC',
    },
    rowEven: {
        backgroundColor: '#F5F5F5',
    },
    rowOdd: {
        backgroundColor: '#E6E6E6',
    },
    cell: {
        padding: 10,
        fontFamily: 'StoryScript',
        fontSize: 12,
        color: '#000',
        borderRightWidth: 1,
        borderColor: '#CCCCCC',
        justifyContent: 'center',
    },
    colProduto: { width: 120 },
    colDescricao: { width: 110 },
    colPreco: { width: 80 },
    colAcoes: { width: 60, borderRightWidth: 0, alignItems: 'center' },
    actionButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: 0,
    },
    btnEditar: {
        backgroundColor: '#494C8C',
        padding: 4,
        borderRadius: 4,
    },
    btnExcluir: {
        backgroundColor: '#A93226',
        padding: 4,
        borderRadius: 4,
    },
    bottomScrollbarContainer: {
        backgroundColor: '#FAFAFA',
        height: 18,
        borderTopWidth: 1,
        borderColor: '#CCCCCC',
    },
});