import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import { RootStackParamList } from '../types/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// Types
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Screens
import { LoginScreen } from '../screens/Login';
import { RegisterScreen } from '../screens/Register';
import HomeScreen from '../screens/Home';
import { RegisterMotosScreen } from '../screens/RegisterMoto';
import DashboardScreen from '../screens/DashBoard';
import DashboardAdminScreen from '../screens/DashBoardAdmin';
import { RegisterPatioScreen } from '../screens/RegisterPatio';
import { EditUsersScreen } from '../screens/EditUsers';
import { AppStackHeader } from '../components/Header';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // Ou um componente de loading
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
          header: (props) => <AppStackHeader {...props} />,
          headerStyle: { 
            backgroundColor: '#000',
          },
          headerTransparent: false,
          contentStyle: {
            backgroundColor: '#1A1A1A',
          },
        }}
      >
        {!user ? (
          // Rotas públicas
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login', headerBackVisible: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Registrar' }} />
          </>
        ) : (
          // Rotas protegidas
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ title: 'Início', headerBackVisible: false }}
            />
            <Stack.Screen
              name="RegisterMoto"
              component={RegisterMotosScreen}
              options={{ title: "Registrar Moto" }}
            />
            <Stack.Screen
              name="Dashboard"
              component={DashboardScreen}
              options={{ title: 'Dashboard', headerBackVisible: false }}
            />
            <Stack.Screen
              name="DashboardAdmin"
              component={DashboardAdminScreen}
              options={{ title: 'Dashboard Admin' }}
            />
            <Stack.Screen
              name="RegisterPatio"
              component={RegisterPatioScreen}
              options={{ title: 'Registrar Pátio' }}
            />
            <Stack.Screen
              name="EditUsers"
              component={EditUsersScreen}
              options={{ title: 'Editar Usuários' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};