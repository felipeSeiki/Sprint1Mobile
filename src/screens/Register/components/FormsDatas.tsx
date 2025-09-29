import { View, Text, TextInput, TouchableOpacity } from "react-native"
import { FormCard, styles } from "../styles"

interface FormsDatasProps {
    formData: {
        user: string;
        password: string;
        cep: string;
        logradouro: string;
        numero: string;
        cidade: string;
        estado: string;
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
        </FormCard>
    )
} 