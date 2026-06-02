import { useState, useEffect, useCallback } from 'react';
import { ContratosService } from '../services/contratos.service';
import { EventoCalendario } from '../types/calendario.types';

export const useCalendario = () => {
  const [eventosPorDia, setEventosPorDia] = useState<Record<string, EventoCalendario[]>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');

  const fetchEventosCalendario = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const contratos = await ContratosService.listarContratos();
      console.log(`📅 Carregados ${contratos.length} contratos`);

      const agrupados: Record<string, EventoCalendario[]> = {};

      contratos.forEach((contrato: any) => {
        let dataOriginal = contrato.data_evento;

        if (dataOriginal) {
          let dataFormatada = '';

          if (dataOriginal.includes('T')) {
            dataFormatada = dataOriginal.split('T')[0];           // YYYY-MM-DD
          } else if (dataOriginal.includes('/')) {
            // Converte DD/MM/YYYY → YYYY-MM-DD
            const [dia, mes, ano] = dataOriginal.split('/');
            dataFormatada = `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
          } else {
            dataFormatada = dataOriginal;
          }

          if (dataFormatada.length === 10) {
            if (!agrupados[dataFormatada]) agrupados[dataFormatada] = [];

            agrupados[dataFormatada].push({
              id: contrato.id,
              data_evento: dataFormatada,
              hora_inicio: contrato.hora_inicio,
              hora_fim: contrato.hora_fim,
              tipo_evento: contrato.tipo_evento || 'Evento',
              nome_contratante: contrato.nome_contratante,
            });
          }
        }
      });

      console.log('📍 Datas normalizadas (YYYY-MM-DD):', Object.keys(agrupados));
      setEventosPorDia(agrupados);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar calendário');
      console.error('Erro no useCalendario:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getEventosByDate = useCallback((date: string): EventoCalendario[] => {
    return eventosPorDia[date] || [];
  }, [eventosPorDia]);

  const getEventosFuturos = useCallback((): EventoCalendario[] => {
    const hoje = new Date().toISOString().split('T')[0];
    return Object.keys(eventosPorDia)
      .filter(data => data >= hoje)
      .flatMap(data => eventosPorDia[data]);
  }, [eventosPorDia]);

  const getMarkedDates = useCallback(() => {
    const marked: any = {};

    Object.keys(eventosPorDia).forEach(date => {
      marked[date] = { 
        marked: true, 
        dotColor: '#f59e0b' 
      };
    });

    if (selectedDate) {
      marked[selectedDate] = {
        ...marked[selectedDate],
        selected: true,
        selectedColor: '#3b82f6',
      };
    }

    return marked;
  }, [eventosPorDia, selectedDate]);

  useEffect(() => {
    fetchEventosCalendario();
  }, [fetchEventosCalendario]);

  return {
    loading,
    error,
    selectedDate,
    setSelectedDate,
    fetchEventosCalendario,
    getEventosByDate,
    getEventosFuturos,
    getMarkedDates,
    eventosPorDia,
  };
};