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
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { styles } from './styles';
import { HeaderContainer } from '../../components/Header';
import { useRegisterMoto } from './hooks/useRegisterMoto';
import { RegisterMotoInputs } from './components/RegisterMotoInputs';

export const RegisterMotosScreen: React.FC = () => {
    const {
        navigation,
        formData,
        handleChange,
        handleSubmit,
        handleLogOut,
        validStatuses,
    } = useRegisterMoto();

    return (
        <SafeAreaView style={styles.container}>
            <HeaderContainer>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Home')}
                    style={{ backgroundColor: 'transparent' }}
                >
                    <Image
                        source={require('../../../assets/MottuLogo.png')}
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

                    <RegisterMotoInputs
                        formData={formData}
                        handleChange={handleChange}
                        validStatuses={validStatuses}
                    />

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
