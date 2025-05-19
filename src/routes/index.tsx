import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import { RegisterMotosScreen } from '../screens/RegisterMotoScreen';
import { useAuth } from '../contexts/AuthContext';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppRoutes() {
  const { user } = useAuth();

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
            component={HomeScreen}
            options={{ title: 'Dashboard' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}