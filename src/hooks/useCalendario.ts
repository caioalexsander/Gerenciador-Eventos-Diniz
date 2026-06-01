import { useState, useEffect, useCallback } from 'react';
import { ContratosService } from '../services/contratos.service'; // reutilizando service existente
import { EventoCalendario } from '../types/calendario.types';

export const useCalendario = () => {
  const [eventosPorDia, setEventosPorDia] = useState<Record<string, EventoCalendario[]>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');

  // Busca todos os contratos e agrupa por data_evento
  const fetchEventosCalendario = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const contratos = await ContratosService.listarTodos(); // reutilizando método existente

      const agrupados: Record<string, EventoCalendario[]> = {};

      contratos.forEach((contrato: any) => {
        if (contrato.data_evento) {
          // Extrai apenas a data (YYYY-MM-DD)
          const data = contrato.data_evento.split('T')[0];

          if (!agrupados[data]) {
            agrupados[data] = [];
          }

          agrupados[data].push({
            id: contrato.id,
            data_evento: data,
            hora_inicio: contrato.hora_inicio,
            hora_fim: contrato.hora_fim,
            tipo_evento: contrato.tipo_evento,
            nome_contratante: contrato.nome_contratante,
          });
        }
      });

      setEventosPorDia(agrupados);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar eventos do calendário');
      console.error('Erro no useCalendario:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Retorna apenas eventos de uma data específica
  const getEventosByDate = useCallback((date: string): EventoCalendario[] => {
    return eventosPorDia[date] || [];
  }, [eventosPorDia]);

  // Eventos futuros (para alarmes)
  const getEventosFuturos = useCallback((): EventoCalendario[] => {
    const hoje = new Date().toISOString().split('T')[0];
    return Object.keys(eventosPorDia)
      .filter(data => data >= hoje)
      .flatMap(data => eventosPorDia[data]);
  }, [eventosPorDia]);

  // Marcação para o calendário (react-native-calendars)
  const getMarkedDates = useCallback(() => {
    const marked: any = {};

    Object.keys(eventosPorDia).forEach(date => {
      marked[date] = {
        marked: true,
        dotColor: '#f59e0b',
      };
    });

    if (selectedDate && eventosPorDia[selectedDate]) {
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
    eventosPorDia,
    loading,
    error,
    selectedDate,
    setSelectedDate,
    fetchEventosCalendario,
    getEventosByDate,
    getEventosFuturos,
    getMarkedDates,
  };
};