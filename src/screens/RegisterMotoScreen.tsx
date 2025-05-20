import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Platform,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { StackNavigationProp } from '@react-navigation/stack';
import { HeaderContainer } from '../components/Header';
import { useAuth } from '../contexts/AuthContext';

type RegisterMotosScreenNavigationProp = StackNavigationProp<RootStackParamList, 'RegisterMoto'>;

const { width } = Dimensions.get('window');
const isSmallDevice = width < 375;

export const RegisterMotosScreen: React.FC = () => {
  const { signOut } = useAuth();

  const [formData, setFormData] = useState({
    modelo: '',
    placa: '',
    codigoTag: '',
    status: '',
    posicaoX: '',
    posicaoY: ''
  });

  const navigation = useNavigation<RegisterMotosScreenNavigationProp>();

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    console.log('Dados da moto:', formData);
    // Lógica para cadastrar a moto
  };

  const handleLogOut = () => {
    signOut();
    navigation.navigate('Login')
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderContainer>
        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
          style={{ backgroundColor: 'transparent' }}
        >
          <Image
            source={require('../../assets/MottuLogo.png')}
            style={styles.logo}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.logOutButton}
          onPress={handleLogOut}
        >
          <Text style={styles.logOutText}>Sair</Text>
        </TouchableOpacity>
      </HeaderContainer>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Text style={styles.title}>Motos</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Modelo:</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite o modelo da moto"
              placeholderTextColor="#999"
              value={formData.modelo}
              onChangeText={(text) => handleChange('modelo', text)}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Placa:</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite a placa"
              placeholderTextColor="#999"
              value={formData.placa}
              onChangeText={(text) => handleChange('placa', text)}
              maxLength={7}
              autoCapitalize="characters"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Código-Tag:</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite o código da tag"
              placeholderTextColor="#999"
              value={formData.codigoTag}
              onChangeText={(text) => handleChange('codigoTag', text)}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Status:</Text>
            <TextInput
              style={styles.input}
              placeholder="Status da moto"
              placeholderTextColor="#999"
              value={formData.status}
              onChangeText={(text) => handleChange('status', text)}
            />
          </View>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>CADASTRAR MOTO</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 120,
    height: 40,
    resizeMode: 'contain',
    marginLeft: -25, // Para alinhar melhor o logo
  },
  logOutText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  content: {
    flex: 1,
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    padding: isSmallDevice ? 15 : 25,
    marginHorizontal: isSmallDevice ? 10 : 20,
    borderColor: '#00CF3A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: isSmallDevice ? 22 : 24,
    fontWeight: 'bold',
    color: '#00CF3A',
    textAlign: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  formGroup: {
    marginBottom: isSmallDevice ? 15 : 20,
  },
  label: {
    fontSize: isSmallDevice ? 14 : 16,
    color: '#FFFFFF',
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    height: isSmallDevice ? 45 : 50,
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: isSmallDevice ? 14 : 16,
    color: '#FFFFFF',
    backgroundColor: '#333333',
  },
  positionContainer: {
    marginBottom: isSmallDevice ? 20 : 25,
  },
  positionInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  positionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
  },
  positionLabel: {
    marginRight: 10,
    fontSize: isSmallDevice ? 14 : 16,
    color: '#FFFFFF',
    width: 20,
    fontWeight: '500',
  },
  positionInput: {
    flex: 1,
  },
  submitButton: {
    height: isSmallDevice ? 48 : 52,
    backgroundColor: '#00CF3A',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
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
    color: '#1A1A1A',
    fontSize: isSmallDevice ? 15 : 16,
    fontWeight: 'bold',
  },
});