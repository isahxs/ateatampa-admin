import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from '@react-native-vector-icons/feather';

import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';

const OPCOES_STATUS = ['Em preparo', 'Entregue', 'Cancelado'];

export default function Pedidos({ route, navigation }) {
  const insets = useSafeAreaInsets();

  const { clienteId, clienteNome, clienteEmail } = route?.params || {};

  const [pedidos, setPedidos] = useState([]);
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);

  useEffect(() => {
    const pedidosRef = collection(db, "pedidos");

    const unsubscribe = onSnapshot(pedidosRef, (snapshot) => {
      const listaTemporaria = [];

      snapshot.forEach((docItem) => {
        const data = docItem.data();

        const pertenceAoCliente =
          !clienteId ||
          data.clienteID === clienteId ||
          (typeof data.clienteID === 'string' && data.clienteID.includes(clienteId));

        if (pertenceAoCliente) {
          listaTemporaria.push({
            id: docItem.id,
            ...data
          });
        }
      });

      setPedidos(listaTemporaria);
    });

    return () => unsubscribe();
  }, [clienteId]);

  const handleSelecionarStatus = async (novoStatus) => {
  if (!pedidoSelecionado) return;

  const { id, statusAtual } = pedidoSelecionado;
  setPedidoSelecionado(null);

  if (novoStatus === statusAtual) return;

  try {
    const pedidoDocRef = doc(db, "pedidos", id);
    await updateDoc(pedidoDocRef, {
      status: novoStatus,
      alteradoEm: new Date().toISOString()
    });
  } catch (error) {
    console.log(error);
    Alert.alert("Erro", "Não foi possível atualizar o status do pedido.");
  }
};

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.scrollContent, { paddingTop: 20 + insets.top, paddingBottom: 40 + insets.bottom }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerTitleContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.pageTitle}>
          Pedidos de {clienteNome || 'João Victor'}
        </Text>
      </View>

      <Text style={styles.contactSubtitle}>
        Contato: {clienteEmail || 'joaovictor@gmail.com'}
      </Text>

      <View style={styles.mainCard}>

        {pedidos.length === 0 ? (
          <Text style={styles.emptyText}>Nenhum pedido encontrado para este cliente.</Text>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.table}>

              <View style={styles.tableHeader}>
                <Text style={[styles.headerCell, styles.colPedido]}>Pedido</Text>
                <Text style={[styles.headerCell, styles.colItens]}>Itens</Text>
                <Text style={[styles.headerCell, styles.colTotal]}>Total</Text>
                <Text style={[styles.headerCell, styles.colStatus]}>Status</Text>
              </View>

              {pedidos.map((item, index) => {
                const statusTexto = typeof item.status === 'boolean'
                  ? (item.status ? 'Entregue' : 'Em preparo')
                  : (item.status || 'Em preparo');

                const textoItem = item.itens?.nome
                  ? `${item.itens.quantidade > 1 ? `${item.itens.quantidade}x ` : ''}${item.itens.nome}`
                  : 'Sem itens';

                return (
                  <View
                    key={item.id}
                    style={[styles.tableRow, index % 2 === 0 ? styles.rowOdd : styles.rowEven]}
                  >
                    <Text style={[styles.cell, styles.colPedido]}>
                      #{item.codigo || `00${index + 1}`}
                    </Text>

                    <Text style={[styles.cell, styles.colItens]} numberOfLines={2}>
                      {textoItem}
                    </Text>

                    <Text style={[styles.cell, styles.colTotal]}>
                      {Number(item.total || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </Text>

                    <View style={[styles.cell, styles.colStatus, styles.statusContainer]}>
                      <TouchableOpacity
                        style={styles.statusPill}
                        onPress={() => 
                          setPedidoSelecionado({
                            id: item.id,
                            codigo: item.codigo || `00${index + 1}`,
                            statusAtual: statusTexto 
                          })
                        }
                      >
                        <Text style={styles.statusText}>{statusTexto}</Text>
                        <Feather name="chevron-down" size={12} color="#555555" />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}

            </View>
          </ScrollView>
        )}

      </View>

      <Modal
        visible={!!pedidoSelecionado}
        transparent
        animationType="fade"
        onRequestClose={() => setPedidoSelecionado(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setPedidoSelecionado(null)}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitulo}>
              Status do pedido #{pedidoSelecionado?.codigo}
            </Text>

            {OPCOES_STATUS.map((opcao) => {
              const ativo = opcao === pedidoSelecionado?.statusAtual;
              return (
                <TouchableOpacity
                  key={opcao}
                  style={[styles.modalOpcao, ativo && styles.modalOpcaoAtiva]}
                  onPress={() => handleSelecionarStatus(opcao)}
                >
                  <Text style={styles.modalOpcaoTexto}>{opcao}</Text>
                  {ativo && <Feather name="check" size={16} color="#161C5C" />}
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#F2F0E4',
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  backButton: {
    marginRight: 10,
  },
  backArrow: {
    fontSize: 26,
    fontFamily: 'StoryScript',
    color: '#222222',
  },
  pageTitle: {
    fontSize: 26,
    fontFamily: 'StoryScript',
    color: '#222222',
  },
  contactSubtitle: {
    fontSize: 14,
    color: '#444444',
    marginBottom: 24,
    marginLeft: 4,
  },
  mainCard: {
    backgroundColor: '#EFEFEF',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#D8D8D8',
    minHeight: 380,
  },
  table: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    minWidth: 380,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#E5E5E5',
    borderBottomWidth: 1,
    borderColor: '#CCCCCC',
  },
  headerCell: {
    paddingVertical: 10,
    paddingHorizontal: 6,
    fontFamily: 'StoryScript',
    fontSize: 16,
    color: '#111111',
    borderRightWidth: 1,
    borderColor: '#CCCCCC',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#CCCCCC',
    alignItems: 'center',
  },
  rowOdd: {
    backgroundColor: '#DCDCDC',
  },
  rowEven: {
    backgroundColor: '#FFFFFF',
  },
  cell: {
    paddingVertical: 10,
    paddingHorizontal: 6,
    fontFamily: 'StoryScript',
    fontSize: 14,
    color: '#111111',
    borderRightWidth: 1,
    borderColor: '#CCCCCC',
    textAlign: 'center',
    justifyContent: 'center',
  },
  colPedido: { width: 75 },
  colItens: { width: 140 },
  colTotal: { width: 85 },
  colStatus: { width: 100, borderRightWidth: 0 },
  statusContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  statusPill: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 14,
    paddingVertical: 3,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontSize: 11,
    color: '#333333',
    fontFamily: 'StoryScript',
  },
  emptyText: {
    textAlign: 'center',
    paddingVertical: 40,
    fontFamily: 'StoryScript',
    color: '#666666',
    fontSize: 16,
  },
  modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.35)',
  justifyContent: 'center',
  alignItems: 'center',
},
  modalCard: {
    width: 260,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D8D8D8',
    paddingVertical: 10,
  },
  modalTitulo: {
    fontFamily: 'StoryScript',
    fontSize: 16,
    color: '#222222',
    textAlign: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#E5E5E5',
  },  
  modalOpcao: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  modalOpcaoAtiva: {
    backgroundColor: '#F2F0E4',
  },
  modalOpcaoTexto: {
    fontFamily: 'StoryScript',
    fontSize: 15,
    color: '#111111',
  },
});

//import React from 'react';
//import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
//import { SafeAreaView } from 'react-native-safe-area-context';
//import { Ionicons } from '@expo/vector-icons';
//import { useNavigation } from '@react-navigation/native';

//export default function Pedidos() {
  //const navigation = useNavigation();

  //return (
    //<SafeAreaView style={styles.safeArea}>
      //<View style={styles.container}>
        
        {/* Título da Tela */}
        //<View style={styles.boxTitle}>
          //<Text style={styles.title}>Pedidos</Text>
        //</View>

        //{/* Bloco Cinza Externo */}
        //<View style={styles.containerBox}>
          //<View style={styles.cardBranco}>
            //<Ionicons name='cart-outline' style={styles.icon} />
            
            //<Text style={styles.text}>Nenhum pedido ainda</Text>
            //<Text style={styles.subText}>Que tal dar uma olhada no nosso menu de bolos?</Text>

            //<TouchableOpacity 
              //style={styles.button}
              //onPress={() => navigation.navigate('Produtos')}
            //>
              //<Text style={styles.buttonText}>Ver o menu</Text>
            //</TouchableOpacity>
          //</View>
        //</View>

      //</View>
    //</SafeAreaView>
  //);
//}

//const styles = StyleSheet.create({
  // safeArea: {
  //   flex: 1,
  //   backgroundColor: '#F7F5EE',
  // },
  // container: {
  //   flex: 1,
  //   paddingHorizontal: 20,
  //   paddingTop: 10,
  // },
  // boxTitle: {
  //   width: '100%',
  //   marginBottom: 20,
  //   paddingHorizontal: 10,
  // },
  // title: {
  //   fontSize: 32,
  //   fontFamily: 'StoryScript',
  //   color: '#333333',
  // },
  // containerBox: {
  //   width: '100%',
  //   alignItems: 'center',
  //   backgroundColor: '#EAE6DD',
  //   borderRadius: 24,
  //   paddingVertical: 30,
  //   paddingHorizontal: 15,
  // },
  // cardBranco: {
  //   width: '90%',
  //   backgroundColor: '#FFFFFF',
  //   borderRadius: 20,
  //   paddingVertical: 35,
  //   paddingHorizontal: 20,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   shadowColor: '#000',
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.1,
  //   shadowRadius: 4,
  //   elevation: 3,
  // },
  // icon: {
  //   color: '#6D76A6',
  //   fontSize: 45,
  //   marginBottom: 12,
  // },
  // text: {
  //   fontFamily: 'StoryScript',
  //   fontSize: 28,
  //   textAlign: 'center',
  //   color: '#333333',
  //   marginBottom: 8,
  // },
  // subText: {
  //   fontSize: 15,
  //   fontFamily: 'StoryScript',
  //   color: '#666666',
  //   textAlign: 'center',
  //   marginBottom: 25,
  // },
  // button: {
  //   borderWidth: 1.5,
  //   borderRadius: 12,
  //   width: 150,
  //   height: 42,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   borderColor: '#6D76A6',
  // },
  // buttonText: {
  //   fontSize: 16,
  //   fontFamily: 'StoryScript',
  //   color: '#6D76A6',
  // },
//});
 
