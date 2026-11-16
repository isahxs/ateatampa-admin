import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Image, Alert, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import Feather from '@react-native-vector-icons/feather';
 
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
 
export default function AlterarProduto({ route, navigation }) {
  const insets = useSafeAreaInsets();
 
  const id = route?.params?.id;
  const { nome: nomeInicial, preco: precoInicial, descricao: descricaoInicial } = route?.params || {};
 
  const [image, setImage] = useState(null);
  const [nome, setNome] = useState(nomeInicial || '');
  const [preco, setPreco] = useState(precoInicial !== undefined && precoInicial !== null ? String(precoInicial) : '');
  const [descricao, setDescricao] = useState(descricaoInicial || '');
 
  const handleUpdate = async () => {
    if (!nome || !preco || !descricao) {
      Alert.alert('Campos incompletos', 'Preencha todos os campos antes de alterar um produto.');
      return;
    }
 
    try {
      const produtoDocRef = doc(db, "produtos", id);
 
      await updateDoc(produtoDocRef, {
        nome: nome,
        preco: Number(String(preco).replace(',', '.')),
        descricao: descricao
      });
 
      Alert.alert(
        'Sucesso!',
        'Produto alterado com sucesso!',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Produto Cadastrado')
          }
        ]
      );
    } catch (error) {
      console.log(error);
      Alert.alert('Erro', 'Não foi possível alterar o produto.');
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
      mediaTypes: ['images'],
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
      contentContainerStyle={[styles.scrollContent, { paddingBottom: 40 + insets.bottom }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.content}>
  
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Alterar produto</Text>
          <Text style={styles.subtitle}>
            Preencha as informações para alterar um bolo do menu
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
            placeholder="Ex: 40.00"
            placeholderTextColor="#A8A8A8"
            keyboardType="decimal-pad"
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
            <Text style={styles.label}>Alterar Imagem</Text>
            <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
              <Feather name="share" size={32} color="#6D76A6" />
              <Text style={styles.imageButtonText}>Clique para selecionar uma foto</Text>
              <Text style={styles.imageButtonP}>PNG, JPG ou WEBP</Text>
            </TouchableOpacity>
 
            {image && (
              <Image source={{ uri: image }} style={styles.imagePreview} />
            )}
          </View>
        </View>
 
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
            <Feather name="trash-2" size={18} color="#000000" />
            <Text style={styles.clearButtonText}>Limpar</Text>
          </TouchableOpacity>
 
          <TouchableOpacity style={styles.registerButton} onPress={handleUpdate}>
            <Feather name="check" size={18} color="#FFFFFF" />
            <Text style={styles.registerButtonText}>Salvar Alterações</Text>
          </TouchableOpacity>
        </View>
 
      </View>
    </ScrollView>
  );
}
 
const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#F2F0E4',
  },
  scrollContent: {
    padding: 16,
  },
  content: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
  },
  titleContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontFamily: 'StoryScript',
    color: '#222222',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'StoryScript',
    color: '#777777',
    marginTop: 4,
  },
  formContainer: {
    backgroundColor: '#white',
    borderRadius: 12,
    padding: 16,
  },
  label: {
    fontSize: 15,
    fontFamily: 'StoryScript',
    fontWeight: '600',
    color: '#black',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    fontFamily: 'StoryScript',
    color: '#222222',
    marginBottom: 16,
  },
  descriptionInput: {
    height: 100,
  },
  imageContainer: {
    marginTop: 8,
  },
  imageButton: {
    height: 100,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#7895B2',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    gap: 4,
  },
  imageButtonText: {
    color: '#626262',
    fontSize: 14,
    fontFamily: 'StoryScript',
  },
  imageButtonP: {
    color: '#A8A8A8',
    fontSize: 12,
    fontFamily: 'StoryScript',
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginTop: 12,
    alignSelf: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 20,
  },
  clearButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#000000',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  clearButtonText: {
    color: '#000000',
    fontSize: 15,
    fontFamily: 'StoryScript',
  },
  registerButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
    backgroundColor: '#494C8C',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'StoryScript',
  },
});