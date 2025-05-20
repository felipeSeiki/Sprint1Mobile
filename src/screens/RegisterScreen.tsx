import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Platform, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { StackNavigationProp } from '@react-navigation/stack';
import { HeaderContainer } from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components/native';

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

  const { register } = useAuth();

  
  const handleSubmit = async () => {
    try {
      await register({
        name: formData.usuario,
        email: formData.usuario,
        password: formData.senha,
        cep: formData.cep,
        logradouro: formData.logradouro,
        numero: formData.numero,
        cidade: formData.cidade,
        estado: formData.estado
      });
      // Registro bem sucedido, a navegação será automática
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      alert('Erro ao realizar cadastro: ' + errorMessage);
    }
  };  return (
    <SafeAreaView style={styles.container}>
      <HeaderContainer>
        <Image 
          source={require('../../assets/MottuLogo.png')}
          style={styles.logo}
        /> 
      </HeaderContainer>      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
        scrollEventThrottle={16}
        decelerationRate="normal"
        keyboardShouldPersistTaps="handled"
      >
        <FormCard>
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
        </FormCard>
      </ScrollView>
    </SafeAreaView>
  );
};

const FormCard = styled.View`
  width: 95%;
  background-color: #2A2A2A;
  border-radius: 20px;
  border: 2px solid #00CF3A;
  margin: 10px auto;
  padding: 20px;
  max-width: 500px;
`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
    minHeight: '100%',
  },
  logo: {
    width: 120,
    height: 40,
    resizeMode: 'contain',
    marginLeft: -25,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00CF3A',
    textAlign: 'center',
    marginBottom: 30,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#f9f9f9',
  },
  submitButton: {
    height: 50,
    backgroundColor: '#2F8028', // Verde do Google
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  logOutButton: {
    height: 30,
    width: 50,
    backgroundColor: '#00CF3A',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  buttonText: {
    color: '#2F8028',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginLink: {
    alignSelf: 'center',
  },
  loginText: {
    color: '#037325',
    fontSize: 14,
  },
});