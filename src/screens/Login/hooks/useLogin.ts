import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { LoginScreenNavigationProp } from "../type/type";
import { useAuth } from "../../../contexts/AuthContext";

export const useLogin = () => {
  const { signIn } = useAuth();
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
  await signIn({ login: user, password });
    } catch (error) {
      alert("Usuário ou senha inválidos");
    }
  };

  return {
    signIn,
    user, setUser,
    password, setPassword,
    navigation,
    handleLogin
  };
};
