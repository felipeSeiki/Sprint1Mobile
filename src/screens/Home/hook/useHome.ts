import { useEffect, useRef, useState } from "react";
import { Moto } from "../../../types/motos";
import { useAuth } from "../../../contexts/AuthContext";
import { Animated, PanResponder } from "react-native";
import { motoService } from "../../../services/auth";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../types";

export const useHome = () => {
    const [selectedFilter, setSelectedFilter] = useState<string>('Todos');
      const [motos, setMotos] = useState<Moto[]>([]);
      const [selectedMoto, setSelectedMoto] = useState<Moto | null>(null);
      const [showModal, setShowModal] = useState(false);
      const { signOut } = useAuth();
    
      const pan = useRef(new Animated.ValueXY()).current;
      const scale = useRef(new Animated.Value(1)).current;
      const lastScale = useRef(1);
      const initialPanValue = useRef({ x: 0, y: 0 });
    
      useEffect(() => {
        const panListener = pan.addListener(value => {
          initialPanValue.current = value;
        });
    
        return () => {
          pan.removeListener(panListener);
        };
      }, []);
    
      const panResponder = useRef(
        PanResponder.create({
          onStartShouldSetPanResponder: () => true,
          onMoveShouldSetPanResponder: () => true,
    
          onPanResponderGrant: () => {
            pan.extractOffset();
          },
    
          onPanResponderMove: Animated.event(
            [
              null,
              { dx: pan.x, dy: pan.y }
            ],
            { useNativeDriver: false }
          ),
    
          onPanResponderRelease: () => {
            // Simply flatten the offset to keep the view where it was released
            pan.flattenOffset();
          }
        })
      ).current;
    
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
    
    
      const handleLogOut = (navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>) => {
        signOut();
        navigation.navigate('Login')
      };
    
      const getSpotColor = (moto: Moto | undefined) => {
        if (!moto) return '#2A2A2A';
        switch (moto.status) {
          case 'Disponível':
            return '#00CF3A';
          case 'Manutenção':
            return '#FF0000';
          default:
            return '#FFAA00';
        }
      };
    
      return {
        selectedFilter,
        setSelectedFilter,
        motos,
        selectedMoto,
        showModal,
        setShowModal,
        panResponder,
        pan,
        scale,
        lastScale,
        handleMotoPress,
        handleLogOut,
        getSpotColor
      }
}