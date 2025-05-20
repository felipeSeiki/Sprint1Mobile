import React, { useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Animated, PanResponder, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { StackNavigationProp } from '@react-navigation/stack';
import { HeaderContainer } from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components/native';

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

export const RegisterScreen: React.FC = () => {
  const { signOut } = useAuth();

  const [formData, setFormData] = useState({
    usuario: '',
    senha: '',
    cep: '',
    logradouro: '',
    numero: '',
    cidade: '',
    estado: ''
  });

  const pan = useRef(new Animated.ValueXY()).current;
  const scale = useRef(new Animated.Value(1)).current;

  const navigation = useNavigation<RegisterScreenNavigationProp>();

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const { register } = useAuth();

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: () => {
        pan.extractOffset();
      },

      onPanResponderMove: Animated.event(
        [
          null,
          { dx: pan.x, dy: pan.y }
        ],
        { useNativeDriver: false }
      ),

      onPanResponderRelease: () => {
        // Simply flatten the offset to keep the view where it was released
        pan.flattenOffset();
      }
    })
  ).current;
  
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
  };

  const handleLogOut = () => {
    signOut();
    navigation.navigate('Login')
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderContainer>
      <TouchableOpacity
          style={styles.logOutButton}
          onPress={handleLogOut}
        >
          <Text>Sair</Text>
        </TouchableOpacity>
      </HeaderContainer>
      <CardContainer>
      <AnimatedCardContainer {...panResponder.panHandlers}
          style={{
            transform: [
              { translateY: pan.y },
              { scale: scale }
            ]
          }}>
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
      </AnimatedCardContainer>        
      </CardContainer>
    </SafeAreaView>
  );
};

const AnimatedCardContainer = styled(Animated.View)`
  width: 95%;
  max-width: 500px;
  background-color: #2A2A2A;
  border-radius: 20px;
  border: 2px solid #00CF3A;
  
  @media (min-width: 600px) {
    max-width: 700px;
  }
`;

const CardContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
  height: 60px;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  overflow: hidden;
`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
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