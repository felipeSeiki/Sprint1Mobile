import { TextInput, View, Text } from "react-native";
import { styles } from "../styles";
import { Picker } from "@react-native-picker/picker";

interface RegisterMotoInputsProps {
    formData: {
        modelo: string;
        placa: string;
        codigoTag: string;
        status: string;
        posicaoX: string;
        posicaoY: string;
    };
    handleChange: (name: string, value: string) => void;
    validStatuses: string[];
}

export const RegisterMotoInputs: React.FC<RegisterMotoInputsProps> = ({
    formData,
    handleChange,
    validStatuses,
}) => {
    return (
        <>
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
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={formData.status}
                        onValueChange={(value) => handleChange('status', value)}
                        style={styles.picker}
                        dropdownIconColor="#FFFFFF"
                        mode="dropdown"
                    >
                        <Picker.Item label="Selecione um status" value="" enabled={false} color="#999" />
                        {validStatuses.map((status) => (
                            <Picker.Item key={status} label={status} value={status} color="#FFFFFF" />
                        ))}
                    </Picker>
                </View>
            </View>

        </>
    );
}