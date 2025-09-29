import React from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { useLogin } from './hooks/useLogin';
import { HeaderContainer } from '../../components/Header';
import { LoginInputs } from './components/LoginInputs';
import { styles } from './styles';

export const LoginScreen: React.FC = () => {
  const {
    user, setUser,
    password, setPassword,
    navigation,
    handleLogin
  } = useLogin();

  return (
    <SafeAreaView style={styles.container}>
      <HeaderContainer>
        <Image 
          source={require('../../../assets/MottuLogo.png')}
          style={styles.logo}
        />    
      </HeaderContainer>

      <View style={styles.content}>
        <View style={styles.loginContainer}>
          <Text style={styles.title}>LOGIN</Text>
          
          <LoginInputs
            user={user}
            setUser={setUser}
            password={password}
            setPassword={setPassword}
          />

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.buttonText}>{`>`}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.registerLink} 
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.registerText}>Não possui login? Cadastre-se</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};