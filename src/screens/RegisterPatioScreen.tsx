import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { RegisterDataPatio } from '../types/auth';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Container } from '../styles/globalStyles';
import { HeaderContainer } from '../components/Header';

export const RegisterPatioScreen: React.FC = () => {
  const { registerPatio, user } = useAuth();
  const [formData, setFormData] = useState({
    endereco: {
      cep: '',
      logradouro: '',
      numero: '',
      cidade: '',
      estado: '',
      bairro: ''
    },
    imagemPlantaUrl: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      if (!user?.id) {
        Alert.alert('Erro', 'Usuário não encontrado.');
        return;
      }

      const data: RegisterDataPatio = {
        endereco: {
          cep: formData.endereco.cep,
          logradouro: formData.endereco.logradouro,
          numero: Number(formData.endereco.numero),
          cidade: formData.endereco.cidade,
          estado: formData.endereco.estado,
          bairro: formData.endereco.bairro
        },
        imagemPlantaUrl: formData.imagemPlantaUrl
      };

      await registerPatio(data);
      Alert.alert('Sucesso', 'Pátio registrado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Erro ao registrar o pátio. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <HeaderContainer title="Registrar Pátio" />
      <View style={styles.form}>
        <Input
          placeholder="CEP"
          value={formData.endereco.cep}
          onChangeText={(text: string) => setFormData(prev => ({
            ...prev,
            endereco: { ...prev.endereco, cep: text }
          }))}
          keyboardType="numeric"
        />
        <Input
          placeholder="Logradouro"
          value={formData.endereco.logradouro}
          onChangeText={(text: string) => setFormData(prev => ({
            ...prev,
            endereco: { ...prev.endereco, logradouro: text }
          }))}
        />
        <Input
          placeholder="Número"
          value={formData.endereco.numero}
          onChangeText={(text: string) => setFormData(prev => ({
            ...prev,
            endereco: { ...prev.endereco, numero: text }
          }))}
          keyboardType="numeric"
        />
        <Input
          placeholder="Bairro"
          value={formData.endereco.bairro}
          onChangeText={(text: string) => setFormData(prev => ({
            ...prev,
            endereco: { ...prev.endereco, bairro: text }
          }))}
        />
        <Input
          placeholder="Cidade"
          value={formData.endereco.cidade}
          onChangeText={(text: string) => setFormData(prev => ({
            ...prev,
            endereco: { ...prev.endereco, cidade: text }
          }))}
        />
        <Input
          placeholder="Estado"
          value={formData.endereco.estado}
          onChangeText={(text: string) => setFormData(prev => ({
            ...prev,
            endereco: { ...prev.endereco, estado: text }
          }))}
          maxLength={2}
          autoCapitalize="characters"
        />
        <Input
          placeholder="URL da Imagem da Planta"
          value={formData.imagemPlantaUrl}
          onChangeText={(text: string) => setFormData(prev => ({
            ...prev,
            imagemPlantaUrl: text
          }))}
          autoCapitalize="none"
          keyboardType="url"
        />
        <Button 
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Registrando...' : 'Registrar Pátio'}
        </Button>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  form: {
    flex: 1,
    padding: 20,
    gap: 10
  }
});