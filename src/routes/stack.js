import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Header from '../components/Header';

import Login from '../pages/Login';
import Cadastro from '../pages/Cadastro';
import EsqueceuSenha from '../pages/Esqueceusenha';

import Produtos from '../pages/Produtos';
import Dashboard from '../pages/Dashboard';
import AlterarProduto from '../pages/AlterarProduto';
import ProdutoCadastrado from '../pages/ProdutoCadastrado';

import ListaClientes from '../pages/ListaClientes';
import Pedidos from '../pages/Pedidos';

const Stack = createNativeStackNavigator();

export default function StackRoutes() {
    return (
        <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
                header: (props) => (
                    <Header
                        {...props}
                        navigationMode="drawer"
                    />
                ),
            }}
        >
            <Stack.Screen
                name="Login"
                component={Login}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="Cadastro"
                component={Cadastro}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="Esqueceu Senha"
                component={EsqueceuSenha}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="Produtos"
                component={Produtos}
            />

            <Stack.Screen
                name="Dashboard"
                component={Dashboard}
            />

            <Stack.Screen
                name="Alterar Produto"
                component={AlterarProduto}
            />

            <Stack.Screen
                name="Produto Cadastrado"
                component={ProdutoCadastrado}
            />

            <Stack.Screen
                name="Pedidos"
                component={Pedidos}
            />

            <Stack.Screen
                name="Lista de Clientes"
                component={ListaClientes}
            />

        </Stack.Navigator>
    );
}