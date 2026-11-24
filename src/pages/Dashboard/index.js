import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Image, Alert, ScrollView } from 'react-native';

import * as ImagePicker from 'expo-image-picker';

import Feather from '@react-native-vector-icons/feather';

import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../../services/firebase';

export default function Dashboard() {

  const navigation = useNavigation();

  const insets = useSafeAreaInsets();

  const [image, setImage] = useState(null);
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [descricao, setDescricao] = useState('');

  const [nomeAdmin, setNomeAdmin] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      try {
        const snap = await getDoc(doc(db, 'adm', user.uid));
        if (snap.exists()) {
          setNomeAdmin(snap.data().nome);
        }
      } catch (error) {
        console.log(error);
      }
    });

    return unsubscribe;
  }, []);

  const handleRegister = async () => {
    if (!nome || !preco || !descricao) {
      Alert.alert(
        'Campos incompletos',
        'Preencha todos os campos antes de cadastrar o produto.'
      );
      return;
    }

    try {
      const produtosRef = collection(db, "produtos");

      await addDoc(produtosRef, {
        nome: nome,
        preco: Number(preco.replace(',', '.')),
        descricao: descricao,
        imagemUrl: "",
        status: "disponível",
        criadoEm: new Date().toISOString()
      });

      Alert.alert('Sucesso!', 'Produto cadastrado com sucesso!');
      handleClear();
      navigation.navigate('Produto Cadastrado');

    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível cadastrar o produto.");
    }
  };


  const handleClear = () => {
    setNome('');
    setPreco('');
    setDescricao('');
    setImage(null);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      ediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,

    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };


  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.container, { paddingBottom: 24 + insets.bottom }]}
    >
      <View style={styles.content}>

        <View style={styles.header}>
          <Text style={styles.welcome}>
            Bem vindo(a), {nomeAdmin}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            Cadastrar novo produto
          </Text>

          <Text style={styles.subtitle}>
            Preencha as informações para adicionar um novo bolo
          </Text>
        </View>


        <View style={styles.formContainer}>
          <Text style={styles.label}>Nome do produto</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Bolo de Chocolate"
            placeholderTextColor="#A8A8A8"
            value={nome}
            onChangeText={setNome}
          />

          <Text style={styles.label}>Preço (R$)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 40,00"
            placeholderTextColor="#A8A8A8"
            value={preco}
            onChangeText={setPreco}
          />

          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={[styles.input, styles.descriptionInput]}
            placeholder="Descreva os ingredientes, camadas ou destaques do produto"
            value={descricao}
            onChangeText={setDescricao}
            multiline
            textAlignVertical="top"
          />

          <View style={styles.imageContainer}>
            <Text style={styles.label}>Imagem do produto</Text>
            <TouchableOpacity
              style={styles.imageButton}
              onPress={pickImage}
            >
              <Feather
                name="share"
                size={35}
                color="#6D76A6"
              />
              <Text style={styles.imageButtonText}>
                Clique para selecionar uma foto
              </Text>
              <Text style={styles.imageButtonP}>
                PNG, JPG ou WEBP
              </Text>
            </TouchableOpacity>
            {image && (
              <Image
                source={{ uri: image }}
                style={styles.imagePreview}
              />
            )}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity

            style={styles.clearButton}
            onPress={handleClear}
          >
            <Feather
              name="trash-2"
              size={20}
              color="#000000"
            />

            <Text style={styles.clearButtonText}>Limpar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
          >
            <Feather
              name="check"
              size={20}
              color="#FFFFFF"
            />

            <Text style={styles.registerButtonText}>Cadastrar produto</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#F2F0E4'
  },

  container: {
    padding: 24,
  },

  content: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  welcome: {
    fontSize: 18,
    fontFamily: 'StoryScript',
    fontWeight: '600',
    color: '#222222'
  },

  divider: {
    height: 1,
    backgroundColor: '#DDDDDD',
    marginVertical: 20,
  },

  titleContainer: {
    marginBottom: 20,
  },

  title: {
    fontSize: 28,
    fontFamily: 'StoryScript',
    color: '#222222',
  },

  subtitle: {
    fontSize: 15,
    fontFamily: 'StoryScript',
    color: '#777777',
    marginTop: 6,
  },

  formContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
  },

  label: {
    fontSize: 16,
    fontFamily: 'StoryScript',
    fontWeight: '600',
    color: 'black',
    marginBottom: 8,
  },

  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    marginBottom: 28,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'StoryScript',
    color: '#222222',
  },

  descriptionInput: {
    height: 120,
  },

  imageContainer: {
    marginTop: 16,
  },

  imageButton: {
    height: 110,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#494C8C',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },

  imageButtonText: {
    color: '#626262',
    fontSize: 16,
    fontFamily: 'StoryScript',
    fontWeight: '600'
  },
  imageButtonP: {
    color: '#A8A8A8',
    fontSize: 13,
    fontFamily: 'StoryScript',
    fontWeight: '600'
  },

  imagePreview: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginTop: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 25,
    marginTop: 24
  },

  clearButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#000000',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },

  clearButtonText: {
    color: '#000000',
    fontSize: 16,
    fontFamily: 'StoryScript',
    fontWeight: '600'
  },

  registerButton: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 15,
    backgroundColor: '#494C8C',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'StoryScript',
    fontWeight: '600'
  },
});
