import { useAuth } from "../../../contexts/AuthContext";
import { Moto } from "../../../types/motos";

export const useDashBoard = () => {
    const { signOut } = useAuth();
      const [selectedFilter, setSelectedFilter] = useState<string>('Todas');
      const [showModal, setShowModal] = useState(false);
      const [selectedMoto, setSelectedMoto] = useState<Moto | null>(null);
      const [motos, setMotos] = useState<Moto[]>([]);
    
      useEffect(() => {
        let unsubscribe: (() => void) | undefined;
    
        const loadMotos = async () => {
          const allMotos = await motoService.getAllMotos();
          setMotos(allMotos);
        };
    
        unsubscribe = motoService.subscribe((newMotos) => {
          setMotos(newMotos);
        });
    
        loadMotos();
    
        return () => {
          if (unsubscribe) unsubscribe();
        };
      }, []);
    
      const handleMotoPress = (moto: Moto) => {
        setSelectedMoto(moto);
        setShowModal(true);
      };
    
      const handleLogOut = () => {
        signOut();
        navigation.navigate('Login');
      };

}