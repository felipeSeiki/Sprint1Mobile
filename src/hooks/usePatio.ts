import { useState, useCallback } from 'react';
import { patioService } from '../services/patioService';
import { RegisterDataPatio, Patio } from '../types/auth';
import { useAuth } from '../contexts/AuthContext';

export const usePatio = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setPatio, setHasRegisteredPatio } = useAuth();

  const registerPatio = useCallback(async (data: RegisterDataPatio) => {
    setLoading(true);
    setError(null);
    
    try {
      // Verifica se já existe um pátio
      const exists = await patioService.checkPatioExists();
      if (exists) {
        throw new Error('Já existe um pátio registrado no sistema');
      }

      // Registra o novo pátio
      const newPatio = await patioService.createPatio(data);
      
      // Atualiza o contexto
      setPatio(newPatio);
      setHasRegisteredPatio(true);

      return newPatio;
    } catch (err: any) {
      setError(err.message || 'Erro ao registrar pátio');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setPatio, setHasRegisteredPatio]);

  const updatePatio = useCallback(async (id: number, data: Partial<RegisterDataPatio>) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedPatio = await patioService.updatePatio(id, data);
      setPatio(updatedPatio);
      return updatedPatio;
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar pátio');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setPatio]);

  const getPatio = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const patio = await patioService.getPatio();
      if (patio) {
        setPatio(patio);
        setHasRegisteredPatio(true);
      }
      return patio;
    } catch (err: any) {
      setError(err.message || 'Erro ao obter pátio');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setPatio, setHasRegisteredPatio]);

  const checkPatioExists = useCallback(async () => {
    try {
      return await patioService.checkPatioExists();
    } catch (err: any) {
      setError(err.message || 'Erro ao verificar existência do pátio');
      return false;
    }
  }, []);

  return {
    loading,
    error,
    registerPatio,
    updatePatio,
    getPatio,
    checkPatioExists
  };
};