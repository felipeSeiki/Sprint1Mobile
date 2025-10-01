import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '../screens/Login';
import { RegisterScreen } from '../screens/Register';
import HomeScreen from '../screens/Home';
import { RegisterMotosScreen } from '../screens/RegisterMoto';
import { useAuth } from '../contexts/AuthContext';
import { RootStackParamList } from '../types/navigation';
import DashboardScreen from '../screens/DashBoard';
import { RegisterPatioScreen } from '../screens/RegisterPatioScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppRoutes() {
  const { user, hasRegisteredPatio } = useAuth();

  return (
    <Stack.Navigator
      screenOptions={{
        animation: 'slide_from_right',
      }}
    >
      {!user ? (
        // Rotas públicas
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : user.role === 'ADMIN' && !hasRegisteredPatio ? (
        // Rota de registro do pátio para admin
        <Stack.Screen 
          name="RegisterPatio" 
          component={RegisterPatioScreen}
          options={{ 
            title: 'Registrar Pátio',
            headerLeft: () => null // Impede voltar
          }} 
        />
      ) : (
        // Rotas protegidas
        <>
          <Stack.Screen 
            name="Home" 
            component={HomeScreen}
            options={{ title: 'Início' }}
          />
          <Stack.Screen 
            name="RegisterMoto" 
            component={RegisterMotosScreen}
            options={{ title: 'Registrar Moto' }}
          />
          <Stack.Screen 
            name="Dashboard" 
            component={DashboardScreen}
            options={{ title: 'Dashboard' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}