import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
} from 'react-native';
import { styles } from './styles';
import { useRegisterMoto } from './hooks/useRegisterMoto';
import { RegisterMotoInputs } from './components/RegisterMotoInputs';

export const RegisterMotosScreen: React.FC = () => {
    const {
        formData,
        handleChange,
        handleSubmit,
        validStatuses,
    } = useRegisterMoto();

    return (
        <SafeAreaView style={styles.container}>
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
