import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { LoginScreenNavigationProp } from "../type/type";
import { useAuth } from "../../../contexts/AuthContext";

export const useLogin = () => {
  const { signIn } = useAuth();
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await signIn({ email, password });
      navigation.navigate("Home");
    } catch (error) {
      alert("Usuário ou senha inválidos");
    }
  };

  return {
    signIn,
    email, setEmail,
    password, setPassword,
    navigation,
    handleLogin
  };
};
