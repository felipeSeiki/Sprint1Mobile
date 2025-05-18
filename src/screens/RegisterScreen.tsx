import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { StackNavigationProp } from '@react-navigation/stack';

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

export const RegisterScreen: React.FC = () => {
  const [formData, setFormData] = useState({
    usuario: '',
    senha: '',
    cep: '',
    logradouro: '',
    numero: '',
    cidade: '',
    estado: ''
  });

  const navigation = useNavigation<RegisterScreenNavigationProp>();

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {

  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          <Text style={styles.title}>Cadastro</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Usuário:</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu usuário"
              placeholderTextColor="#999"
              value={formData.usuario}
              onChangeText={(text) => handleChange('usuario', text)}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Senha:</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite sua senha"
              placeholderTextColor="#999"
              secureTextEntry
              value={formData.senha}
              onChangeText={(text) => handleChange('senha', text)}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>CEP:</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu CEP"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={formData.cep}
              onChangeText={(text) => handleChange('cep', text)}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Logradouro:</Text>
            <TextInput
              style={styles.input}
              placeholder="Rua/Avenida"
              placeholderTextColor="#999"
              value={formData.logradouro}
              onChangeText={(text) => handleChange('logradouro', text)}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Número:</Text>
            <TextInput
              style={styles.input}
              placeholder="Número"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={formData.numero}
              onChangeText={(text) => handleChange('numero', text)}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Cidade:</Text>
            <TextInput
              style={styles.input}
              placeholder="Sua cidade"
              placeholderTextColor="#999"
              value={formData.cidade}
              onChangeText={(text) => handleChange('cidade', text)}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Estado:</Text>
            <TextInput
              style={styles.input}
              placeholder="UF"
              placeholderTextColor="#999"
              value={formData.estado}
              onChangeText={(text) => handleChange('estado', text)}
              maxLength={2}
            />
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.buttonText}>CADASTRAR</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.loginLink} 
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginText}>Já possui conta? Faça login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  submitButton: {
    height: 50,
    backgroundColor: '#34A853', // Verde do Google
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginLink: {
    alignSelf: 'center',
  },
  loginText: {
    color: '#007AFF',
    fontSize: 14,
  },
});