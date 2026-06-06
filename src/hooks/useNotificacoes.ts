import * as Notifications from 'expo-notifications';
import { SchedulableTriggerInputTypes } from 'expo-notifications';
import { useCallback } from 'react';

export const useNotificacoes = () => {

  const agendarAlarmeEvento = async (evento: any) => {
    if (!evento.data_evento) return;

    try {
      const dataEvento = new Date(evento.data_evento + 'T' + (evento.hora_inicio || '09:00'));

      // Alarme 2 dias antes às 09:00
      const doisDiasAntes = new Date(dataEvento);
      doisDiasAntes.setDate(doisDiasAntes.getDate() - 2);
      doisDiasAntes.setHours(9, 0, 0, 0);

      // Verifica se a data do alarme ainda é futura
      if (doisDiasAntes <= new Date()) return;

      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: `📅 Lembrete: ${evento.tipo_evento}`,
          body: `${evento.nome_contratante}\n${evento.hora_inicio || ''} - ${evento.hora_fim || ''}`,
          data: { eventoId: evento.id },
        },
        trigger: {
          type: SchedulableTriggerInputTypes.DATE,
          date: doisDiasAntes,
        },
      });

      console.log(`✅ Alarme agendado para ${evento.tipo_evento} - ID: ${identifier}`);
      return identifier;
    } catch (error) {
      console.error('Erro ao agendar alarme:', error);
    }
  };

  // ✅ Nova função: Agendar todos os eventos futuros automaticamente
  const agendarTodosAlarmes = useCallback(async (eventos: any[]) => {
    let agendados = 0;

    for (const evento of eventos) {
      if (evento.status?.toLowerCase() === 'finalizado') continue;

      const identifier = await agendarAlarmeEvento(evento);
      if (identifier) agendados++;
    }

    if (agendados > 0) {
      console.log(`📢 ${agendados} alarmes agendados automaticamente!`);
    }
  }, []);

  return { 
    agendarAlarmeEvento, 
    agendarTodosAlarmes 
  };
};