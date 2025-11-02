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
import ProtectedLayout from '../components/ProtectedLayout';

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
          headerShown: false,
        }}
      >
        {!user ? (
          // Rotas públicas
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          // Rotas protegidas
          <>
            <Stack.Screen
              name="Home"
              component={(props: NativeStackScreenProps<RootStackParamList, 'Home'>) => (
                <ProtectedLayout>
                  <HomeScreen {...props} />
                </ProtectedLayout>
              )}
              options={{ title: 'Início' }}
            />
            <Stack.Screen
              name="RegisterMoto"
              component={RegisterMotosScreen}
              options={{ title: "Registrar Moto" }}
            />
            <Stack.Screen
              name="Dashboard"
              component={(props: NativeStackScreenProps<RootStackParamList, 'Dashboard'>) => (
                <ProtectedLayout>
                  <DashboardScreen {...props} />
                </ProtectedLayout>
              )}
              options={{ title: 'Dashboard' }}
            />
            <Stack.Screen
              name="DashboardAdmin"
              component={(props: NativeStackScreenProps<RootStackParamList, 'DashboardAdmin'>) => (
                <ProtectedLayout>
                  <DashboardAdminScreen {...props} />
                </ProtectedLayout>
              )}
              options={{ title: 'Dashboard Admin' }}
            />
            <Stack.Screen
              name="RegisterPatio"
              component={RegisterPatioScreen}
              options={{ title: 'Registrar Pátio' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};