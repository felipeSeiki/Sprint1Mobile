import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FormCard, styles } from './styles';
import { useAuth } from '../../contexts/AuthContext';
import { HeaderContainer } from '../../components/Header';
import { useRegister } from './hook/useRegister';
import { FormsDatas } from './components/FormsDatas';

export const RegisterScreen: React.FC = () => {
    const {
        formData,
        handleChange,
        handleSubmit,
        navigation,
    } = useRegister();

    return (
        <SafeAreaView style={styles.container}>
            <HeaderContainer>
                <Image
                    source={require('../../assets/MottuLogo.png')}
                    style={styles.logo}
                />
            </HeaderContainer>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                bounces={true}
                scrollEventThrottle={16}
                decelerationRate="normal"
                keyboardShouldPersistTaps="handled"
            >
                <FormsDatas
                    formData={formData}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    navigation={navigation}
                />
            </ScrollView>
        </SafeAreaView>
    );
};