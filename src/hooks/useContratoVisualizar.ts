import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { ContratoParaEditar } from '../types/contrato.types';   // ← Tipo correto

export const useContratoVisualizar = (contratoId: string | number) => {
  const [contrato, setContrato] = useState<ContratoParaEditar | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!contratoId) {
      setError("ID do contrato não fornecido");
      setLoading(false);
      return;
    }

    const carregarContrato = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: supabaseError } = await supabase
          .from('contratos')
          .select('*')
          .eq('id', contratoId)
          .single();

        if (supabaseError) throw supabaseError;
        
        setContrato(data);
      } catch (err: any) {
        console.error('Erro ao carregar contrato:', err);
        setError(err.message || 'Erro ao carregar contrato');
      } finally {
        setLoading(false);
      }
    };

    carregarContrato();
  }, [contratoId]);

  return { contrato, loading, error };
};