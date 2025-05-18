import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { StackNavigationProp } from '@react-navigation/stack';

type RegisterMotosScreenNavigationProp = StackNavigationProp<RootStackParamList, 'RegisterMoto'>;

export const RegisterMotosScreen: React.FC = () => {
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
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

          <View style={styles.positionContainer}>
            <Text style={styles.label}>Posição:</Text>
            <View style={styles.positionInputs}>
              <View style={styles.positionInputWrapper}>
                <Text style={styles.positionLabel}>X:</Text>
                <TextInput
                  style={[styles.input, styles.positionInput]}
                  placeholder="X"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  value={formData.posicaoX}
                  onChangeText={(text) => handleChange('posicaoX', text)}
                />
              </View>
              
              <View style={styles.positionInputWrapper}>
                <Text style={styles.positionLabel}>Y:</Text>
                <TextInput
                  style={[styles.input, styles.positionInput]}
                  placeholder="Y"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  value={formData.posicaoY}
                  onChangeText={(text) => handleChange('posicaoY', text)}
                />
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.buttonText}>CADASTRAR MOTO</Text>
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
    paddingTop: 30,
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
    fontWeight: '500',
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
  positionContainer: {
    marginBottom: 25,
  },
  positionInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  positionInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
  },
  positionLabel: {
    marginRight: 10,
    fontSize: 16,
    color: '#333',
    width: 20,
  },
  positionInput: {
    flex: 1,
  },
  submitButton: {
    height: 50,
    backgroundColor: '#FF9500', // Cor laranja para diferenciação
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});