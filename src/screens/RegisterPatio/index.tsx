import React, { useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { useRegisterPatio } from './hook/useRegisterPatio';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import {
    PageTitle,
    Card,
    CardContent,
    CardButton,
    CardButtonText
} from './styles';
import ProtectedLayout from '../../components/ProtectedLayout';

export const RegisterPatioScreen: React.FC = () => {
    const navigation = useNavigation();
    const { user } = useAuth();
    const {
        formData,
        setFormData,
        loading,
        handleSubmit,
        isPatioRegistered
    } = useRegisterPatio();

    useEffect(() => {
        if (user?.role !== 'MASTER') {
            navigation.goBack();
        }
    }, [user]);

    if (loading) {
        return (
            <ProtectedLayout>
                <Card style={{ justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
                    <ActivityIndicator size="large" color="#4A90E2" />
                </Card>
            </ProtectedLayout>
        );
    }

    if (isPatioRegistered) {
        return null;
    }

    return (
        <ProtectedLayout>
            <PageTitle>Cadastro de Pátio</PageTitle>
            <Card>
                <CardContent>
                    <Input
                        placeholder="CEP"
                        value={formData.endereco.cep}
                        onChangeText={(text: string) => setFormData(prev => ({
                            ...prev,
                            endereco: { ...prev.endereco, cep: text }
                        }))}
                        keyboardType="numeric"
                        inputContainerStyle={{ borderBottomColor: '#00CF3A' }}
                        inputStyle={{ color: '#fff' }}
                        placeholderTextColor="#aaa"
                    />
                    <Input
                        placeholder="Logradouro"
                        value={formData.endereco.logradouro}
                        onChangeText={(text: string) => setFormData(prev => ({
                            ...prev,
                            endereco: { ...prev.endereco, logradouro: text }
                        }))}
                        inputContainerStyle={{ borderBottomColor: '#00CF3A' }}
                        inputStyle={{ color: '#fff' }}
                        placeholderTextColor="#aaa"
                    />
                    <Input
                        placeholder="Número"
                        value={formData.endereco.numero}
                        onChangeText={(text: string) => setFormData(prev => ({
                            ...prev,
                            endereco: { ...prev.endereco, numero: text }
                        }))}
                        keyboardType="numeric"
                        inputContainerStyle={{ borderBottomColor: '#00CF3A' }}
                        inputStyle={{ color: '#fff' }}
                        placeholderTextColor="#aaa"
                    />
                    <Input
                        placeholder="Bairro"
                        value={formData.endereco.bairro}
                        onChangeText={(text: string) => setFormData(prev => ({
                            ...prev,
                            endereco: { ...prev.endereco, bairro: text }
                        }))}
                        inputContainerStyle={{ borderBottomColor: '#00CF3A' }}
                        inputStyle={{ color: '#fff' }}
                        placeholderTextColor="#aaa"
                    />
                    <Input
                        placeholder="Cidade"
                        value={formData.endereco.cidade}
                        onChangeText={(text: string) => setFormData(prev => ({
                            ...prev,
                            endereco: { ...prev.endereco, cidade: text }
                        }))}
                        inputContainerStyle={{ borderBottomColor: '#00CF3A' }}
                        inputStyle={{ color: '#fff' }}
                        placeholderTextColor="#aaa"
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
                        inputContainerStyle={{ borderBottomColor: '#00CF3A' }}
                        inputStyle={{ color: '#fff' }}
                        placeholderTextColor="#aaa"
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
                        inputContainerStyle={{ borderBottomColor: '#00CF3A' }}
                        inputStyle={{ color: '#fff' }}
                        placeholderTextColor="#aaa"
                    />
                    <CardButton
                        onPress={handleSubmit}
                        disabled={loading}
                    >
                        <CardButtonText>
                            {loading ? 'Salvando...' : (formData.endereco.cep ? 'Atualizar Pátio' : 'Registrar Pátio')}
                        </CardButtonText>
                    </CardButton>
                </CardContent>
            </Card>
        </ProtectedLayout>
    );
};
