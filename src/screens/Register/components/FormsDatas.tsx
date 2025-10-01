import { View, Text, TextInput, TouchableOpacity } from "react-native"
import { FormCard, styles } from "../styles"

interface FormsDatasProps {
    formData: {
        user: string;
        password: string;
    };
    handleChange: (name: string, value: string) => void;
    handleSubmit: () => void;
    navigation: any;
}

export const FormsDatas: React.FC<FormsDatasProps> = ({ formData, handleChange, handleSubmit, navigation }) => {
    return (
        <FormCard>
            <Text style={styles.title}>Cadastro</Text>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Usuário:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Digite seu usuário"
                    placeholderTextColor="#999"
                    value={formData.user}
                    onChangeText={(text) => handleChange('user', text)}
                    autoCapitalize="none"
                />
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Senha:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Digite sua senha"
                    placeholderTextColor="#999"
                    secureTextEntry
                    value={formData.password}
                    onChangeText={(text) => handleChange('password', text)}
                    autoCapitalize="none"
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
    )
} 