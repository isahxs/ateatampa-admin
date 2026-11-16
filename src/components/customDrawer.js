import { StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';

import Feather from '@react-native-vector-icons/feather';

import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';

const itens = [
    { label: 'Dashboard', rota: 'Dashboard', icone: 'clipboard' },
    { label: 'Produtos', rota: 'Produtos', icone: 'file-minus' },
    { label: 'Pedidos', rota: 'Pedidos', icone: 'shopping-bag' },
    { label: 'Clientes', rota: 'Lista de Clientes', icone: 'users' },
    { label: 'Sair', rota: 'Login', icone: 'log-out' },
]

export default function CustomDrawer({ navigation }) {

    const handlePressItem = (item) => {
        if (item.rota === 'Login') {
            Alert.alert(
                "Sair da conta?",
                "Tem certeza que deseja encerrar sua sessão?",
                [
                    {
                        text: "Cancelar",
                        style: "cancel"
                    },
                    {
                        text: "Sair",
                        style: "destructive",
                        onPress: async () => {
                            try {
                                await signOut(auth);
                                navigation.navigate('Principal', { screen: 'Login' });
                                navigation.closeDrawer();
                            } catch (error) {
                                console.log("Erro ao sair:", error);
                                Alert.alert("Erro", "Não foi possível encerrar a sessão.");
                            }
                        }
                    }
                ]
            );
        } else {
            navigation.navigate('Principal', { screen: item.rota });
            navigation.closeDrawer()
        }
    }; 

    return (
        <DrawerContentScrollView contentContainerStyle={styles.container}>
            {itens.map((item) => (
                <TouchableOpacity
                    key={item.rota}
                    style={styles.item}
                    onPress={() => handlePressItem(item)}
                >
                    <Feather name={item.icone} size={22} color='#222222' />
                    <Text style={styles.texto}>{item.label}</Text>
                </TouchableOpacity>
            ))}
        </DrawerContentScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.08)',
    },
    texto: {
        fontSize: 16,
        color: '#222222',
    },
});