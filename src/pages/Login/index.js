import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import Feather from '@react-native-vector-icons/feather';
import Logo from '../../components/Logo';

import { LoginAdm } from '../../backend/authService';

export default function Login() {

  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const [loading, setLoading] = useState(false);

  const [pressionadoCadastro, setPressionadoCadastro] = useState(false);
  const [pressionadoEsqueceuSenha, setPressionadoEsqueceuSenha] = useState(false);

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert("Atenção", "Por favor, preencha o e-mail e a senha.");
      return;
    }
    
    setLoading(true);

    //Autenticação do firebase
    const resultado = await LoginAdm({email, senha});

    setLoading(false)

    if (resultado.success) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Dashboard'}],
      });
    } else {
      Alert.alert("Erro ao entrar", resultado.error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        <Logo width={160} height={160} />

        <Text style={styles.titulo}>Faça seu login</Text>

        <View style={styles.form}>

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Insira seu e-mail"
            placeholderTextColor="#888888"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Senha</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputIcon}
              placeholder="Insira sua senha"
              placeholderTextColor="#888888"
              secureTextEntry={!mostrarSenha}
              value={senha}
              onChangeText={setSenha}
            />
            <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
              <Feather name={mostrarSenha ? "eye" : "eye-off"} size={20} color={"#8A436A"} />
            </TouchableOpacity>
          </View>


          <TouchableOpacity
            onPressIn={() => setPressionadoEsqueceuSenha(true)}
            onPressOut={() => setPressionadoEsqueceuSenha(false)}
            onPress={() => navigation.navigate('Esqueceu Senha')}
            style={styles.esqueceuSenhaContainer}
          >
            <Text style={[styles.textoEsqueceuSenha, pressionadoEsqueceuSenha && styles.sublinhadoAtivo]}>
              Esqueceu a senha?
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.botao}
            onPress={handleLogin}
            disabled={loading}
          > 
            { loading
            ? <ActivityIndicator color="#FFF" />
            : <Text style={styles.textoBotao}>Entrar</Text>}
          </TouchableOpacity>

          <View style={styles.cadastroContainer}>
            <Text style={styles.textoCadastro}>Não possui uma conta? </Text>

            <TouchableOpacity
              onPressIn={() => setPressionadoCadastro(true)}
              onPressOut={() => setPressionadoCadastro(false)}
              onPress={() => navigation.navigate('Cadastro')}
            >
              <Text style={[styles.textoCadastroDestaque, pressionadoCadastro && styles.sublinhadoAtivo]}>
                Cadastre-se aqui!
              </Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F0E4'
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 30,
    paddingTop: 60,
    marginTop: 70,
    alignItems: 'center'
  },
  titulo: {
    fontSize: 24,
    color: '#8b1414',
    marginBottom: 30,
    fontFamily: 'StoryScript',
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 5,
    fontStyle: 'italic'
  },
  input: {
    backgroundColor: '#FFFFFF',
    height: 45,
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#13195E',
    fontStyle: 'italic'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    height: 45,
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#13195E',
  },
  inputIcon: {
    flex: 1,
    height: '100%',
    fontStyle: 'italic',
  },
  botao: {
    backgroundColor: '#161C5C',
    height: 45,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  textoBotao: {
    color: '#FFFFFF',
    fontSize: 16,
    fontStyle: "italic"
  },
  textoCadastro: {
    fontSize: 14,
    color: '#666666',
    fontStyle: 'italic'
  },
  cadastroContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoCadastroDestaque: {
    fontSize: 14,
    color: '#8B1A1A',
    fontWeight: 'bold',
    fontStyle: 'italic'
  },
  sublinhadoAtivo: {
    textDecorationLine: 'underline',
  }
});