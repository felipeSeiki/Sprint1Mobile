import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { styles } from './styles';
import { Input, Button } from 'react-native-elements';
import { HeaderContainer } from '../../components/Header';
import { Container } from '../Home/styles';
import { useRegisterPatio } from './hook/useRegisterPatio';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';

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
        // Se não for admin, redireciona para a tela anterior
        if (user?.role !== 'ADMIN') {
            navigation.goBack();
        }
    }, [user]);

    // Se estiver carregando, mostra o indicador de carregamento
    if (loading) {
        return (
            <Container>
                <HeaderContainer title="Registrar Pátio" />
                <View style={[styles.form, { justifyContent: 'center' }]}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            </Container>
        );
    }

    // Se já existe um pátio registrado ou o usuário não é admin, não mostra o formulário
    if (isPatioRegistered || user?.role !== 'ADMIN') {
        return null;
    }

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
