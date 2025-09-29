import { View, Text, TextInput } from "react-native";
import { styles } from "../styles";

interface LoginInputsProps {
  user: string;
  setUser: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
}

export const LoginInputs: React.FC<LoginInputsProps> = ({ user, setUser, password, setPassword}) => {
  return (
    <>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Usuário:</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu usuário"
          placeholderTextColor="#999"
          value={user}
          onChangeText={setUser}
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Senha:</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite sua senha"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>
    </>
  );
};
