import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { Alert } from 'react-native';

export interface CategoriaCardapio {
  id: number;
  titulo: string;
  // outros campos se necessário
}

export const useCategoriasCardapio = () => {
  const [categorias, setCategorias] = useState<CategoriaCardapio[]>([]);
  const [loading, setLoading] = useState(false);

  const carregarCategorias = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('modelo_contrato')
      .select('id, titulo')
      .eq('tipo_de_clausula', 'C_C')
      .order('titulo', { ascending: true });

    if (error) {
      console.error('Erro ao carregar categorias de cardápio:', error);
      Alert.alert('Erro', 'Não foi possível carregar as categorias.');
    } else {
      setCategorias(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    carregarCategorias();
  }, []);

  return { categorias, loading, recarregar: carregarCategorias };
};